from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, Puntaje, Archivo
from ..utils.s3_utils import generar_url, eliminar_de_s3
from django.utils.timezone import now


class PuntajeRespuestaSerializer(serializers.ModelSerializer):
    usuario = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    
    class Meta:
        model = Puntaje
        fields = ['respuesta', 'valor', 'usuario']

# 🔹 Serializador para los archivos
class RespuestaArchivoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Archivo
        fields = ["id", "s3_key", "nombre_original", "url", "tamaño", "content_type"]

    def get_url(self, obj):
        return generar_url(obj)

    def eliminar_archivo(archivo):
        eliminar_de_s3(archivo.s3_key)
        archivo.delete()

class RespuestaCreateSerializer(serializers.ModelSerializer):
    archivos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Respuesta
        fields = [
            'foro',
            'respuesta_texto',
            'archivos'
        ]

# 🔹 Serializador principal de la Respuesta
class RespuestaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(
        source="usuario.username",
        read_only=True
    )

    archivos = RespuestaArchivoSerializer(
        many=True,
        read_only=True
    )

    estado = serializers.SerializerMethodField()
    dias_inactiva = serializers.SerializerMethodField()
    voto_usuario = serializers.SerializerMethodField()

    class Meta:
        model = Respuesta
        fields = [
            'idRespuesta',
            'foro',
            'usuario',
            'usuario_nombre',
            'materia',
            'respuesta_texto',
            'fecha_creacion',
            'fecha_actualizacion',
            'estado',
            'dias_inactiva',
            'total_likes',
            'total_dislikes',
            'total_votos',
            'puntaje_neto',
            'voto_usuario',
            'archivos'
        ]
        
        read_only_fields = [
            'usuario',
            'estado',
            'dias_inactiva',
            'total_likes',
            'total_dislikes',
            'total_votos',
            'puntaje_neto'
        ]

    def get_estado(self, obj):
        if obj.eliminada:
            return "eliminada"
        if obj.ultimo_aviso:
            return "en_riesgo"
        return "activa"
    
    def get_dias_inactiva(self, obj):
        return (now() - obj.fecha_actualizacion).days
    
    def get_voto_usuario(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0

        puntaje = obj.puntajes.filter(usuario=request.user).first()
        return puntaje.valor if puntaje else 0
    