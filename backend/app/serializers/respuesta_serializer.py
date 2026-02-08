from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, Puntaje, Usuario


class PuntajeRespuestaSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    respuesta = serializers.PrimaryKeyRelatedField(queryset=Respuesta.objects.all())

    class Meta:
        model = Puntaje
        fields = ['id', 'usuario', 'respuesta', 'valor']
        extra_kwargs = {
            'usuario': {'required': True},
            'respuesta': {'required': True},
            'valor': {'required': True},
        }

    def validate(self, attrs):
        """
        ⚡ No validar unique_together aquí, lo hacemos en la vista.
        """
        return attrs


# Serializador para los archivos
class RespuestaArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.CharField(
        source='archivo.archivo.url',
        read_only=True
    )

    class Meta:
        model = RespuestaArchivo
        fields = ['id', 'archivo_url']


#Serializador principal de la Respuesta
class RespuestaSerializer(serializers.ModelSerializer):
    archivos = RespuestaArchivoSerializer(many=True, read_only=True)
    puntajes = PuntajeRespuestaSerializer(many=True, read_only=True)

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
            'puntajes',
            'total_likes',
            'total_dislikes',
            'total_votos',
            'puntaje_neto'
        ]