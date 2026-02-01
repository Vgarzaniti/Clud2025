from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, Puntaje


class PuntajeRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puntaje
        fields = ['id', 'usuario', 'valor', 'respuesta']


# 🔹 Serializador para los archivos
class RespuestaArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.CharField(
        source='archivo.archivo.url',
        read_only=True
    )

    class Meta:
        model = RespuestaArchivo
        fields = ['id', 'archivo_url']


# 🔹 Serializador principal de la Respuesta
class RespuestaSerializer(serializers.ModelSerializer):
    archivos = RespuestaArchivoSerializer(many=True, read_only=True)
    puntajes = PuntajeRespuestaSerializer(many=True, read_only=True)

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
            'puntajes',
            'total_likes',
            'total_dislikes',
            'total_votos',
            'puntaje_neto'
        ]
