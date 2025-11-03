from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle

class PuntajeRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'usuario', 'respuesta', 'valor']

# 🔹 Serializador para los archivos
class RespuestaArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = RespuestaArchivo
        fields = ['id', 'archivo', 'archivo_url']

    def get_archivo_url(self, obj):
        return obj.archivo.url if obj.archivo else None


# 🔹 Serializador para los detalles de texto
class RespuestaDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaDetalle
        fields = ['idRespuestaDetalle', 'respuesta_texto']


# 🔹 Serializador principal de la Respuesta
class RespuestaSerializer(serializers.ModelSerializer):
    archivos = RespuestaArchivoSerializer(many=True, read_only=True)
    detalles = RespuestaDetalleSerializer(many=True, read_only=True)
    puntaje = PuntajeRespuestaSerializer(many=True, read_only=True)
    class Meta:
        model = Respuesta
        fields = [
            'idRespuesta',
            'usuario',
            'foro',
            'materia',
            'puntaje',
            'fecha_creacion',
            'fecha_actualizacion',
            'archivos',
            'detalles'
        ]
