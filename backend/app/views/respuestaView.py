from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle
from ..serializers.respuesta_serializer import RespuestaArchivoSerializer,RespuestaDetalleSerializer, RespuestaCompletaSerializer,RespuestaSerializer
from django.db import transaction

class RespuestaArchivoViewSet(viewsets.ModelViewSet):
    queryset = RespuestaArchivo.objects.all()
    serializer_class = RespuestaArchivoSerializer

class RespuestaDetalleViewSet(viewsets.ModelViewSet):
    queryset = RespuestaDetalle.objects.all()
    serializer_class = RespuestaDetalleSerializer
    
class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all().order_by('-fecha_creacion')
    serializer_class = RespuestaCompletaSerializer  # devolvemos todo anidado

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        is_form = hasattr(request.data, "getlist")

        archivos = request.FILES.getlist("archivos") if is_form else []
        detalles_texto = (
            request.data.getlist("respuesta_texto") if is_form else request.data.get("respuesta_texto", [])
        )

        if isinstance(detalles_texto, str):
            detalles_texto = [detalles_texto]

        # 1️⃣ Crear respuesta principal
        serializer = RespuestaSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        # 2️⃣ Crear detalles
        for texto in detalles_texto:
            if texto.strip():
                RespuestaDetalle.objects.create(respuesta=respuesta, respuesta_texto=texto.strip())

        # 3️⃣ Crear archivos
        for archivo in archivos:
            RespuestaArchivo.objects.create(respuesta=respuesta, archivo=archivo)

        # 4️⃣ Devolver respuesta completa
        respuesta.refresh_from_db()
        return Response(RespuestaCompletaSerializer(respuesta).data, status=status.HTTP_201_CREATED)