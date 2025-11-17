from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Avg, Count
from ..models import Respuesta, RespuestaArchivo, Foro, Puntaje
from ..serializers.respuesta_serializer import RespuestaSerializer, PuntajeRespuestaSerializer
from rest_framework.views import APIView
from cloudinary.uploader import upload, destroy
from cloudinary.exceptions import Error as CloudinaryError
from .hash import file_hash  # tu función MD5

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

        # Guardar archivos evitando duplicados por hash
        for archivo in archivos:
            hash_archivo = file_hash(archivo)
            if not RespuestaArchivo.objects.filter(respuesta=respuesta, hash=hash_archivo).exists():
                try:
                    result = upload(archivo)
                    url = result['secure_url']
                    RespuestaArchivo.objects.create(respuesta=respuesta, archivo=url, hash=hash_archivo)
                except CloudinaryError:
                    continue

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = data.get("archivos_a_eliminar", [])

        # Convertir string a lista si es necesario
        if archivos_a_eliminar and isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [int(x) for x in archivos_a_eliminar.split(',')]

        # Actualizar campos de Respuesta
        serializer = RespuestaSerializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        respuesta = serializer.save()

        # ELIMINAR ARCHIVOS
        for archivo_id in archivos_a_eliminar:
            try:
                archivo_obj = RespuestaArchivo.objects.get(id=archivo_id, respuesta=respuesta)
                try:
                    public_id = archivo_obj.archivo.split('/upload/')[-1].rsplit('.', 1)[0]
                    destroy(public_id)
                except CloudinaryError:
                    pass
                archivo_obj.delete()
            except RespuestaArchivo.DoesNotExist:
                pass

        # AGREGAR ARCHIVOS NUEVOS EVITANDO DUPLICADOS POR HASH
        for archivo in archivos_nuevos:
            hash_archivo = file_hash(archivo)
            if not RespuestaArchivo.objects.filter(respuesta=respuesta, hash=hash_archivo).exists():
                try:
                    result = upload(archivo)
                    url = result['secure_url']
                    RespuestaArchivo.objects.create(respuesta=respuesta, archivo=url, hash=hash_archivo)
                except CloudinaryError:
                    continue

        respuesta.refresh_from_db()
        return Response(RespuestaSerializer(respuesta).data)

class RespuestaPuntajeView(APIView):

    def post(self, request):
        serializer = PuntajeRespuestaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        respuesta = serializer.validated_data['respuesta']
        usuario = serializer.validated_data['usuario']
        nuevo_valor = serializer.validated_data['valor']  # 1 = like, -1 = dislike

        # Buscar voto anterior (si existe)
        puntaje_existente = Puntaje.objects.filter(
            respuesta=respuesta,
            usuario=usuario
        ).first()

        if puntaje_existente:
            # Si repite mismo voto → se borra (NONE / 0)
            if puntaje_existente.valor == nuevo_valor:
                puntaje_existente.valor = Puntaje.NONE
            else:
                puntaje_existente.valor = nuevo_valor

            puntaje_existente.save()
            puntaje = puntaje_existente
            creado = False

        else:
            # Crear nuevo voto
            puntaje = Puntaje.objects.create(
                respuesta=respuesta,
                usuario=usuario,
                valor=nuevo_valor
            )
            creado = True

        # 🔥 Recalcular siempre los totales de la respuesta
        respuesta.total_likes = respuesta.puntajes.filter(valor=Puntaje.LIKE).count()
        respuesta.total_dislikes = respuesta.puntajes.filter(valor=Puntaje.DISLIKE).count()
        respuesta.total_votos = respuesta.puntajes.exclude(valor=Puntaje.NONE).count()
        respuesta.puntaje_neto = respuesta.total_likes - respuesta.total_dislikes
        respuesta.save()

        mensaje = "Puntaje creado." if creado else "Puntaje actualizado."
        return Response(
            {
                "mensaje": mensaje,
                "valor": puntaje.valor,
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

        return Response({
            "respuesta_id": respuesta.idRespuesta,
            "total_likes": respuesta.total_likes,
            "total_dislikes": respuesta.total_dislikes,
            "total_votos": respuesta.total_votos,
            "puntaje_neto": respuesta.puntaje_neto
        })