from django.forms import ValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from notificaciones.services.sns_suscripciones import suscribir_usuario_a_sns, notificar_nueva_respuesta
from django.db import transaction
from django.conf import settings
import logging

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

logger = logging.getLogger(__name__)

class RespuestaViewSet(viewsets.ModelViewSet):
    queryset = Respuesta.objects.all()
    serializer_class = RespuestaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Respuesta.objects.prefetch_related(
            'archivos__archivo'
        ).order_by('-fecha_creacion')

    # 🔥 FIX CRÍTICO PARA ARCHIVOS
    parser_classes = (MultiPartParser, FormParser)

    # ===============================
    # 🔹 PROCESAR UN ARCHIVO
    # ===============================
    @staticmethod
    def _procesar_archivo(archivo_file, respuesta):
        try:
            hash_archivo = file_hash(archivo_file)
            archivo_file.seek(0)

            archivo_global = Archivo.objects.filter(
                #hash=hash_archivo
            ).first()

            if not archivo_global:

                archivo_global = Archivo.objects.create(
                    archivo=archivo_file,
                    #hash=hash_archivo,
                )

            RespuestaArchivo.objects.get_or_create(
                respuesta=respuesta,
                archivo=archivo_global
            )

        except Exception as e:
            logger.error("Error subiendo archivo", exc_info=e)
            raise ValidationError("Error al subir archivo")
        
    # ===============================
    # 🔹 PROCESAR MULTIPLES ARCHIVOS
    # ===============================
    def _subir_archivos(self, respuesta, archivos):
        if not archivos:
            return

        for archivo in archivos:
            self._procesar_archivo(archivo, respuesta)
            if archivo.size > settings.MAX_UPLOAD_SIZE:
                raise ValidationError("Archivo demasiado grande")

        respuesta.refresh_from_db()
    
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
        try:
            self._subir_archivos(respuesta, archivos)
        except RuntimeError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 🔥 SUSCRIPCION A NOTIFICACIONES
        suscribir_usuario_a_sns(respuesta.usuario.email)

        # 🔥 NOTIFICAR A CREADOR DEL FORO LA NUEVA RESPUESTA
        notificar_nueva_respuesta(foro, respuesta)

        Puntaje.objects.create(
            respuesta=respuesta,
            usuario=respuesta.usuario,
            valor=0
        )

        respuesta.refresh_from_db()

        return Response(
            RespuestaSerializer(respuesta).data,
            status=status.HTTP_201_CREATED
        )

    # ===============================
    # 🔹 UPDATE
    # ===============================
    def update(self, request, *args, **kwargs):
        #partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = request.data.get("archivos_a_eliminar", [])

        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [
                int(x) for x in archivos_a_eliminar.split(',')
            ]

        serializer = RespuestaSerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save(usuario=request.user)

        for archivo_id in archivos_a_eliminar:
            try:
                relacion = RespuestaArchivo.objects.get(
                    id=archivo_id,
                    respuesta=respuesta
                )
                relacion.delete()
            except RespuestaArchivo.DoesNotExist:
                pass

        try:
            self._subir_archivos(respuesta, archivos_nuevos)
        except RuntimeError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data)
    
    def get_serializer_context(self):
            context = super().get_serializer_context()
            context['request'] = self.request
            return context

# =====================================================
# 🔹 PUNTAJES (SIN CAMBIOS)
# =====================================================
class RespuestaPuntajeView(APIView):

    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PuntajeRespuestaSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        respuesta = serializer.validated_data['respuesta']
        nuevo_valor = serializer.validated_data['valor']

        usuario = request.user

        puntaje_existente = Puntaje.objects.filter(
            respuesta=respuesta,
            usuario=usuario
        ).first()

        if puntaje_existente:
            puntaje_existente.valor = (
                Puntaje.NONE
                if puntaje_existente.valor == nuevo_valor
                else nuevo_valor
            )
            puntaje_existente.save()
            voto_final = puntaje_existente.valor
        else:
            puntaje_existente = Puntaje.objects.create(
                respuesta=respuesta,
                usuario=usuario,
                valor=nuevo_valor
            )
            voto_final = nuevo_valor

        respuesta.total_likes = respuesta.puntajes.filter(
            valor=Puntaje.LIKE
        ).count()
        respuesta.total_dislikes = respuesta.puntajes.filter(
            valor=Puntaje.DISLIKE
        ).count()
        respuesta.total_votos = respuesta.puntajes.exclude(
            valor=Puntaje.NONE
        ).count()
        respuesta.puntaje_neto = (
            respuesta.total_likes - respuesta.total_dislikes
        )
        respuesta.save()

        return Response(
            {
                "puntaje_neto": respuesta.puntaje_neto,
                "voto_usuario": voto_final
            },
            status=status.HTTP_200_OK
        )

