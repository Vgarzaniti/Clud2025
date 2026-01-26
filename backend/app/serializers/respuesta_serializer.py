from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, Puntaje, Archivo
from ..utils.s3_utils import generar_url, eliminar_de_s3


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


# 🔹 Serializador principal de la Respuesta
class RespuestaSerializer(serializers.ModelSerializer):
    archivos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    puntajes = PuntajeRespuestaSerializer(many=True, read_only=True)
    voto_usuario = serializers.SerializerMethodField()
    
    # 🔥 FIX DEFINITIVO
    materia = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Respuesta
        fields = [
            'idRespuesta',
            'usuario',
            'foro',
            'materia',
            'fecha_creacion',
            'respuesta_texto',
            'fecha_actualizacion',
            'archivos',
            'total_likes',
            'total_dislikes',
            'total_votos',
            'puntaje_neto',
            'voto_usuario'
        ]
    def get_voto_usuario(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0

        puntaje = obj.puntajes.filter(usuario=request.user).first()
        return puntaje.valor if puntaje else 0
