from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle, Foro
from ..serializers.respuesta_serializer import RespuestaSerializer


class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all().order_by('-fecha_creacion')
    serializer_class = RespuestaSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        archivos = request.FILES.getlist('archivos')
        respuesta_texto = data.get('respuesta_texto')

        # 🔹 Recuperar el foro
        foro_id = data.get('foro')
        try:
            foro = Foro.objects.get(pk=foro_id)
        except Foro.DoesNotExist:
            return Response(
                {"error": f"No existe foro con id {foro_id}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔹 Asignar la materia del foro automáticamente
        data['materia'] = foro.materia.idMateria

        serializer = RespuestaSerializer(data=data)
        if serializer.is_valid():
            respuesta = serializer.save()

            # 🔹 Crear detalle de texto
            if respuesta_texto:
                RespuestaDetalle.objects.create(
                    respuesta=respuesta,
                    respuesta_texto=respuesta_texto
                )

            # 🔹 Guardar archivos asociados
            for archivo in archivos:
                RespuestaArchivo.objects.create(respuesta=respuesta, archivo=archivo)

            # 🔹 Refrescar relaciones para incluir archivos y detalles en la respuesta
            respuesta.refresh_from_db()

            return Response(RespuestaSerializer(respuesta).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
