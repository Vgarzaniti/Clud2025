import threading
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Foro, ForoArchivo
from ..serializers.foro_serializer import ForoSerializer
from .hash import file_hash
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError


class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all().order_by('-fecha_creacion')
    serializer_class = ForoSerializer

    # 🔹 Función reusable para subir un archivo (thread-safe)
    @staticmethod
    def _subir_archivo_thread(archivo, foro):
        """
        Sube un archivo a Cloudinary y crea el registro en la BD.
        Se usa dentro de un thread para subir en paralelo.
        """
        try:
            hash_archivo = file_hash(archivo)
            if ForoArchivo.objects.filter(foro=foro, hash=hash_archivo).exists():
                return  # Evita duplicados

            result = upload(archivo)
            url = result['secure_url']
            ForoArchivo.objects.create(foro=foro, archivo=url, hash=hash_archivo)

        except CloudinaryError:
            pass  # ignora si falla Cloudinary

    # 🔹 Función que sube múltiples archivos en paralelo
    def _subir_archivos(self, foro, archivos):
        if not archivos:
            return

        threads = []
        for archivo in archivos:
            t = threading.Thread(target=self._subir_archivo_thread, args=(archivo, foro))
            t.start()
            threads.append(t)

        # Esperar que todos terminen antes de refrescar la BD
        for t in threads:
            t.join()

        foro.refresh_from_db()

    # 🔹 Retrieve
    def retrieve(self, request, pk=None):
        try:
            foro = Foro.objects.get(pk=pk)
        except Foro.DoesNotExist:
            return Response({"detail": "El foro no existe."}, status=status.HTTP_404_NOT_FOUND)

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
            return Response(ForoSerializer(foro).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 Update
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = data.get("archivos_a_eliminar", [])

        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [int(x) for x in archivos_a_eliminar.split(',')]

        # Actualizar campos del foro
        serializer = ForoSerializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        foro = serializer.save()

        # 🔹 Eliminar archivos existentes
        for archivo_id in archivos_a_eliminar:
            try:
                archivo_obj = ForoArchivo.objects.get(id=archivo_id, foro=foro)
                archivo_obj.delete()  # el signal borra de Cloudinary
            except ForoArchivo.DoesNotExist:
                pass

        # 🔹 Subir archivos nuevos evitando duplicados
        self._subir_archivos(foro, archivos_nuevos)

        foro.refresh_from_db()
        return Response(ForoSerializer(foro).data)
