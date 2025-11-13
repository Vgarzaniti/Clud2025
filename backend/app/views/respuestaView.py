from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Avg, Count
from ..models import Respuesta, RespuestaArchivo, Foro, Puntaje
from ..serializers.respuesta_serializer import RespuestaSerializer, PuntajeRespuestaSerializer
from rest_framework.views import APIView


class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all().order_by('-fecha_creacion')
    serializer_class = RespuestaSerializer

    def create(self, request, *args, **kwargs):
    data = request.data.copy()

    archivos = request.FILES.getlist("archivos")
    respuesta_texto = data.get("respuesta_texto")

    if not respuesta_texto:
        return Response({"error": "La respuesta no puede estar vacía."}, status=400)

    # Recuperar foro
    foro_id = data.get("foro")
    try:
        foro = Foro.objects.get(pk=foro_id)
    except Foro.DoesNotExist:
        return Response({"error": "No existe el foro indicado."}, status=400)

    # ← ASIGNAR MATERIA AUTOMÁTICAMENTE
    data["materia"] = foro.materia.idMateria

    serializer = RespuestaSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    respuesta = serializer.save()

    # Archivos
    for archivo in archivos:
        RespuestaArchivo.objects.create(respuesta=respuesta, archivo=archivo)

    # Detalle
    if respuesta_texto:
        RespuestaDetalle.objects.create(
            respuesta=respuesta,
            respuesta_texto=respuesta_texto
        )

    respuesta.refresh_from_db()
    return Response(RespuestaSerializer(respuesta).data, status=201)


class RespuestaPuntajeView(APIView):
    def post(self, request):
        serializer = PuntajeRespuestaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        respuesta_id = serializer.validated_data['respuesta'].idRespuesta
        usuario = serializer.validated_data['usuario']
        valor = serializer.validated_data['valor']

        if valor < 0 or valor > 5:
            return Response(
                {"error": "El valor del puntaje debe estar entre 0 y 5."},
                status=status.HTTP_400_BAD_REQUEST
            )

        puntaje, creado = Puntaje.objects.update_or_create(
            respuesta_id=respuesta_id,
            usuario=usuario,
            defaults={'valor': valor}
        )

        mensaje = "Puntaje creado correctamente." if creado else "Puntaje actualizado correctamente."
        return Response(
            {"mensaje": mensaje, "valor": puntaje.valor},
            status=status.HTTP_200_OK
        )

    def get(self, request, respuesta_id):
        try:
            respuesta = Respuesta.objects.get(pk=respuesta_id)
        except Respuesta.DoesNotExist:
            return Response(
                {"error": "La respuesta no existe."},
                status=status.HTTP_404_NOT_FOUND
            )

        stats = respuesta.puntajes.aggregate(
            promedio=Avg('valor'),
            total=Count('id')
        )

        return Response({
            "respuesta_id": respuesta.idRespuesta,
            "puntaje_promedio": round(stats['promedio'] or 0, 2),
            "total_votos": stats['total']
        })
