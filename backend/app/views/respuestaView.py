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

    # 🔥 FIX CRÍTICO PARA ARCHIVOS
    parser_classes = (MultiPartParser, FormParser)
    
     # 🔹 NUEVO MÉTODO para respuestas de un foro por URL
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

        # agregar username
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

        # 🔥 LA MATERIA SE ASIGNA ACÁ (NO EN data)
        respuesta = serializer.save(
            materia=foro.materia
        )

        # 🔥 SUBIDA REAL DE ARCHIVOS
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


# =====================================================
# 🔹 PUNTAJES (SIN CAMBIOS)
# =====================================================
class RespuestaPuntajeView(APIView):
    """
    POST / PUT / PATCH
    Modifica o crea un puntaje para una respuesta.
    """
    def post(self, request):
        return self._procesar_puntaje(request)

    def put(self, request):
        return self._procesar_puntaje(request)

    def patch(self, request):
        return self._procesar_puntaje(request)

    def _procesar_puntaje(self, request):
        serializer = PuntajeRespuestaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        respuesta = serializer.validated_data['respuesta']
        usuario = serializer.validated_data['usuario']
        nuevo_valor = serializer.validated_data['valor']

        puntaje_existente = Puntaje.objects.filter(
            respuesta=respuesta,
            usuario=usuario
        ).first()

        if puntaje_existente:
            # 🔹 Si es el mismo valor, lo pone en NONE, si no, actualiza
            puntaje_existente.valor = (
                Puntaje.NONE if puntaje_existente.valor == nuevo_valor else nuevo_valor
            )
            puntaje_existente.save()
        else:
            Puntaje.objects.create(
                respuesta=respuesta,
                usuario=usuario,
                valor=nuevo_valor
            )

        # 🔹 Actualizar totales de la respuesta
        respuesta.total_likes = respuesta.puntajes.filter(valor=Puntaje.LIKE).count()
        respuesta.total_dislikes = respuesta.puntajes.filter(valor=Puntaje.DISLIKE).count()
        respuesta.total_votos = respuesta.puntajes.exclude(valor=Puntaje.NONE).count()
        respuesta.puntaje_neto = respuesta.total_likes - respuesta.total_dislikes
        respuesta.save()

        return Response(
            {
                "total_likes": respuesta.total_likes,
                "total_dislikes": respuesta.total_dislikes,
                "total_votos": respuesta.total_votos,
                "puntaje_neto": respuesta.puntaje_neto,
            },
            status=status.HTTP_200_OK
        )