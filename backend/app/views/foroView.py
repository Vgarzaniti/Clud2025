from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Foro, ForoArchivo
from ..serializers.foro_serializer import ForoSerializer

class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all().order_by('-fecha_creacion')
    serializer_class = ForoSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        archivos = request.FILES.getlist('archivos')  # 👈 clave para múltiples archivos

        serializer = ForoSerializer(data=data)
        if serializer.is_valid():
            foro = serializer.save()

            # 🔹 Guardar cada archivo en Cloudinary y crear registros
            for archivo in archivos:
                ForoArchivo.objects.create(foro=foro, archivo=archivo)

            return Response(ForoSerializer(foro).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
