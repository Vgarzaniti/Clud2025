from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import (
    Respuesta,
    RespuestaArchivo,
    Foro,
    Puntaje,
    Archivo
)
from ..serializers.respuesta_serializer import (
    RespuestaSerializer,
    PuntajeRespuestaSerializer
)
from .hash import file_hash


class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.prefetch_related(
        'archivos__archivo'
    ).order_by('-fecha_creacion')

    serializer_class = RespuestaSerializer

    parser_classes = (MultiPartParser, FormParser)
    
    def respuestas_por_foro(self, request, foro_id=None):
        """
        GET /api/respuestas/por-foro/<foro_id>/
        Devuelve todas las respuestas de un foro, con usuario_username agregado.
        """
        if not foro_id:
            return Response({"error": "Debes enviar foro_id"}, status=400)

        respuestas = self.get_queryset().filter(foro_id=foro_id).select_related('usuario')
        serializer = RespuestaSerializer(respuestas, many=True)
        data = serializer.data

        for i, respuesta in enumerate(respuestas):
            data[i]['usuario_username'] = respuesta.usuario.username if respuesta.usuario else None

        return Response(data, status=200)

    # ===============================
    # 🔹 PROCESAR UN ARCHIVO
    # ===============================
    @staticmethod
    def _procesar_archivo(archivo_file, respuesta):
        try:
            hash_archivo = file_hash(archivo_file)

            archivo_global = Archivo.objects.filter(
                hash=hash_archivo
            ).first()

            if not archivo_global:
                archivo_global = Archivo.objects.create(
                    archivo=archivo_file,
                    hash=hash_archivo
                )

            RespuestaArchivo.objects.get_or_create(
                respuesta=respuesta,
                archivo=archivo_global
            )

        except Exception as e:
            print("❌ Error procesando archivo de respuesta:", e)

    # ===============================
    # 🔹 PROCESAR MULTIPLES ARCHIVOS
    # ===============================
    def _subir_archivos(self, respuesta, archivos):
        if not archivos:
            return

        for archivo in archivos:
            self._procesar_archivo(archivo, respuesta)

        respuesta.refresh_from_db()
    
    # ===============================
    # 🔹 RETRIEVE (GET individual)
    # ===============================
    def retrieve(self, request, pk=None):
        respuesta = self.get_object()  # obtiene la instancia
        data = RespuestaSerializer(respuesta).data  # serializa como siempre
        data['usuario_username'] = respuesta.usuario.username if respuesta.usuario else None
        return Response(data, status=status.HTTP_200_OK)


    # ===============================
    # 🔹 CREATE (CORREGIDO)
    # ===============================
    def create(self, request, *args, **kwargs):
        archivos = request.FILES.getlist("archivos")

        data = request.data.copy()

        if not data.get("respuesta_texto"):
            return Response(
                {"error": "La respuesta no puede estar vacía."},
                status=status.HTTP_400_BAD_REQUEST
            )

        foro_id = data.get("foro")
        try:
            foro = Foro.objects.get(pk=foro_id)
        except Foro.DoesNotExist:
            return Response(
                {"error": "No existe el foro indicado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RespuestaSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        respuesta = serializer.save(
            materia=foro.materia
        )

        self._subir_archivos(respuesta, archivos)

        respuesta.refresh_from_db()

        return Response(
            RespuestaSerializer(respuesta).data,
            status=status.HTTP_201_CREATED
        )

    # ===============================
    # 🔹 UPDATE
    # ===============================
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = request.data.get("archivos_a_eliminar", [])

        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [
                int(x) for x in archivos_a_eliminar.split(',')
            ]

        serializer = RespuestaSerializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        for archivo_id in archivos_a_eliminar:
            try:
                relacion = RespuestaArchivo.objects.get(
                    id=archivo_id,
                    respuesta=respuesta
                )
                relacion.delete()
            except RespuestaArchivo.DoesNotExist:
                pass

        self._subir_archivos(respuesta, archivos_nuevos)

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data)


class RespuestaPuntajeView(APIView):
    """
    POST / PUT / PATCH
    Crea o actualiza un puntaje para una respuesta.
    """
    def post(self, request):
        return self._procesar_puntaje(request)

    def put(self, request):
        return self._procesar_puntaje(request)

    def patch(self, request):
        return self._procesar_puntaje(request)

    def _procesar_puntaje(self, request):

        respuesta = request.data.get("respuesta")
        usuario = request.data.get("usuario")
        nuevo_valor = request.data.get("valor")

        if not all([respuesta, usuario, nuevo_valor is not None]):
            return Response({"error": "Debe enviar 'respuesta', 'usuario' y 'valor'"}, status=400)


        puntaje_existente = Puntaje.objects.filter(respuesta_id=respuesta, usuario_id=usuario).first()

        if puntaje_existente:
            # Si existe, actualizar solo valor
            serializer = PuntajeRespuestaSerializer(puntaje_existente, data={"valor": nuevo_valor}, partial=True)
        else:
            # Si no existe, crear uno nuevo
            serializer = PuntajeRespuestaSerializer(data={"respuesta": respuesta, "usuario": usuario, "valor": nuevo_valor})

        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Actualizar totales de la respuesta
        respuesta_obj = serializer.instance.respuesta
        respuesta_obj.total_likes = respuesta_obj.puntajes.filter(valor=Puntaje.LIKE).count()
        respuesta_obj.total_dislikes = respuesta_obj.puntajes.filter(valor=Puntaje.DISLIKE).count()
        respuesta_obj.total_votos = respuesta_obj.puntajes.exclude(valor=Puntaje.NONE).count()
        respuesta_obj.puntaje_neto = respuesta_obj.total_likes - respuesta_obj.total_dislikes
        respuesta_obj.save()

        return Response(
            {
                "total_likes": respuesta_obj.total_likes,
                "total_dislikes": respuesta_obj.total_dislikes,
                "total_votos": respuesta_obj.total_votos,
                "puntaje_neto": respuesta_obj.puntaje_neto,
            },
            status=200
        )
