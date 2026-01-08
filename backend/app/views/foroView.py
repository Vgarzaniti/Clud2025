from rest_framework import viewsets, status
from rest_framework.response import Response

from ..models import Foro, ForoArchivo, Archivo
from ..serializers.foro_serializer import ForoSerializer
from .hash import file_hash


class ForoViewSet(viewsets.ModelViewSet):
    # 🔥 CLAVE: prefetch de la relación intermedia
    queryset = Foro.objects.prefetch_related(
        'archivos__archivo'
    ).order_by('-fecha_creacion')

    serializer_class = ForoSerializer

    # 🔹 Procesar UN archivo (deduplicación GLOBAL)
   @staticmethod
    def _procesar_archivo(archivo_file, foro):
        try:
            hash_archivo = file_hash(archivo_file)

            archivo_global = Archivo.objects.filter(hash=hash_archivo).first()

            if not archivo_global:
                archivo_global = Archivo.objects.create(
                    archivo=archivo_file,
                    hash=hash_archivo
                )

            # 🔥 SIEMPRE crear la relación, aunque el archivo exista
            ForoArchivo.objects.get_or_create(
                foro=foro,
                archivo=archivo_global
            )

        except Exception as e:
            print("❌ Error procesando archivo:", e)


    # 🔹 Procesar múltiples archivos (SECUENCIAL)
    def _subir_archivos(self, foro, archivos):
        if not archivos:
            return

        for archivo in archivos:
            self._procesar_archivo(archivo, foro)

        # 🔥 importante, pero ya lo tenías bien
        foro.refresh_from_db()

    # 🔹 Retrieve (USAR queryset del ViewSet)
    def retrieve(self, request, pk=None):
        foro = self.get_object()
        serializer = ForoSerializer(foro)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 🔹 Create
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        archivos = request.FILES.getlist('archivos')

        serializer = ForoSerializer(data=data)
        if serializer.is_valid():
            foro = serializer.save()

            self._subir_archivos(foro, archivos)

            # 🔥 ASEGURA que el serializer vea la relación
            foro.refresh_from_db()

            return Response(
                ForoSerializer(foro).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 Update
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = data.get("archivos_a_eliminar", [])

        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [
                int(x) for x in archivos_a_eliminar.split(',')
            ]

        serializer = ForoSerializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        foro = serializer.save()

        # 🔹 Eliminar relación foro ↔ archivo (NO borra Cloudinary)
        for archivo_id in archivos_a_eliminar:
            try:
                foro_archivo = ForoArchivo.objects.get(
                    id=archivo_id,
                    foro=foro
                )
                foro_archivo.delete()
            except ForoArchivo.DoesNotExist:
                pass

        # 🔹 Subir / reutilizar archivos nuevos
        self._subir_archivos(foro, archivos_nuevos)

        foro.refresh_from_db()
        return Response(ForoSerializer(foro).data)
