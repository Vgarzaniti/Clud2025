from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Foro, ForoArchivo
from ..serializers.foro_serializer import ForoSerializer


class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all().order_by('-fecha_creacion')
    serializer_class = ForoSerializer

    # 🔹 función reutilizable para manejar subida de archivos
    def _subir_archivos(self, foro, archivos):
        """
        Crea los registros ForoArchivo para los archivos recibidos.
        """
        if not archivos:
            return  # nada que hacer

        for archivo in archivos:
            ForoArchivo.objects.create(foro=foro, archivo=archivo)

        # 🔹 Refresca relaciones para que el serializer los vea
        foro.refresh_from_db()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        archivos = request.FILES.getlist('archivos')  # 👈 recibe los archivos

        serializer = ForoSerializer(data=data)
        if serializer.is_valid():
            foro = serializer.save()

            # 🔹 solo si hay archivos, llama a la función auxiliar
            if archivos:
                self._subir_archivos(foro, archivos)

            return Response(ForoSerializer(foro).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
