from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

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
    # 🔥 CLAVE: traer relaciones
    queryset = Respuesta.objects.prefetch_related(
        'archivos__archivo'
    ).order_by('-fecha_creacion')

    serializer_class = RespuestaSerializer

    # ===============================
    # 🔹 PROCESAR UN ARCHIVO
    # ===============================
    @staticmethod
    def _procesar_archivo(archivo_file, respuesta):
        try:
            hash_archivo = file_hash(archivo_file)

            archivo_global = Archivo.objects.filter(hash=hash_archivo).first()

            if not archivo_global:
                archivo_global = Archivo.objects.create(
                    archivo=archivo_file,
                    hash=hash_archivo
                )

            # 🔥 ACÁ SE CREA RespuestaArchivo
            RespuestaArchivo.objects.get_or_create(
                respuesta=respuesta,
                archivo=archivo_global
            )

        except Exception as e:
            print("Error procesando archivo de respuesta:", e)

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
    # 🔹 CREATE
    # ===============================
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        archivos = request.FILES.getlist("archivos")

        respuesta_texto = data.get("respuesta_texto")
        if not respuesta_texto:
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

        # 🔥 FIX REAL Y DEFINITIVO
        data["materia"] = foro.materia  # NO usar .idMateria

        serializer = RespuestaSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        # 🔹 Subir archivos
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
        data = request.data.copy()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = data.get("archivos_a_eliminar", [])

        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [
                int(x) for x in archivos_a_eliminar.split(',')
            ]

        serializer = RespuestaSerializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        # 🔹 Eliminar SOLO la relación (NO el archivo global)
        for archivo_id in archivos_a_eliminar:
            try:
                relacion = RespuestaArchivo.objects.get(
                    id=archivo_id,
                    respuesta=respuesta
                )
                relacion.delete()
            except RespuestaArchivo.DoesNotExist:
                pass

        # 🔹 Subir archivos nuevos
        self._subir_archivos(respuesta, archivos_nuevos)

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data)


# =====================================================
# 🔹 PUNTAJES (NO SE TOCAN)
# =====================================================
class RespuestaPuntajeView(APIView):

    def post(self, request):
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
            if puntaje_existente.valor == nuevo_valor:
                puntaje_existente.valor = Puntaje.NONE
            else:
                puntaje_existente.valor = nuevo_valor
            puntaje_existente.save()
            creado = False
        else:
            Puntaje.objects.create(
                respuesta=respuesta,
                usuario=usuario,
                valor=nuevo_valor
            )
            creado = True

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
                "mensaje": "Puntaje creado." if creado else "Puntaje actualizado.",
                "total_likes": respuesta.total_likes,
                "total_dislikes": respuesta.total_dislikes,
                "total_votos": respuesta.total_votos,
                "puntaje_neto": respuesta.puntaje_neto,
            },
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

        return Response(
            {
                "respuesta_id": respuesta.idRespuesta,
                "total_likes": respuesta.total_likes,
                "total_dislikes": respuesta.total_dislikes,
                "total_votos": respuesta.total_votos,
                "puntaje_neto": respuesta.puntaje_neto,
            }
        )
