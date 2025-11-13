from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Avg, Count
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle, Foro, Puntaje
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

        # Asignar materia automáticamente desde el foro
        data["materia"] = foro.materia.idMateria

        # Crear la respuesta
        serializer = RespuestaSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        # Guardar archivos adjuntos
        for archivo in archivos:
            RespuestaArchivo.objects.create(respuesta=respuesta, archivo=archivo)

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data, status=201)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RespuestaPuntajeView(APIView):
    """
    Vista para registrar o actualizar el puntaje de una respuesta
    y obtener el promedio de puntajes.
    """

    def post(self, request):
        """
        Crea o actualiza el puntaje de un usuario para una respuesta.
        """
        serializer = PuntajeRespuestaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        respuesta_id = serializer.validated_data['respuesta'].idRespuesta
        usuario = serializer.validated_data['usuario']
        valor = serializer.validated_data['valor']

        # Validar rango de valor (0 a 5)
        if valor < 0 or valor > 5:
            return Response(
                {"error": "El valor del puntaje debe estar entre 0 y 5."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear o actualizar puntaje
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
        """
        Devuelve el promedio y cantidad total de puntajes de una respuesta.
        """
        try:
            respuesta = Respuesta.objects.get(pk=respuesta_id)
        except Respuesta.DoesNotExist:
            return Response(
                {"error": "La respuesta no existe."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calcular promedio y cantidad
        stats = respuesta.puntajes.aggregate(
            promedio=Avg('valor'),
            total=Count('id')
        )

        return Response({
            "respuesta_id": respuesta.idRespuesta,
            "puntaje_promedio": round(stats['promedio'] or 0, 2),
            "total_votos": stats['total']
        })