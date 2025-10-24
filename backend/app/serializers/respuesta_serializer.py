from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle

class RespuestaArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = RespuestaArchivo
        fields = ['id', 'archivo', 'archivo_url']

    def get_archivo_url(self, obj):
        return obj.archivo.url if obj.archivo else None
    
class RespuestaDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaDetalle
        fields = ['idRespuestaDetalle', 'respuesta_texto', 'respuesta']

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = [
            'idRespuesta',
            'usuario',
            'foro',
            'materia',
            'puntaje',
            'fecha_creacion',
            'fecha_actualizacion'
        ]

class RespuestaCompletaSerializer(serializers.ModelSerializer):
    archivos = RespuestaArchivoSerializer(many=True, read_only=True)
    detalles = RespuestaDetalleSerializer(many=True, read_only=True)

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