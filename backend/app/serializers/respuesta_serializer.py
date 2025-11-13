from rest_framework import serializers
from ..models import Respuesta, RespuestaArchivo, RespuestaDetalle, Puntaje


class PuntajeRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puntaje
        fields = ['id', 'usuario', 'respuesta', 'valor']


# 🔹 Serializador para los archivos
class RespuestaArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = RespuestaArchivo
        fields = ['id', 'archivo', 'archivo_url']

    def get_archivo_url(self, obj):
        return obj.archivo.url if obj.archivo else None



# 🔹 Serializador principal de la Respuesta (permite crear detalles y archivos)
class RespuestaSerializer(serializers.ModelSerializer):
    archivos = RespuestaArchivoSerializer(many=True, required=False)
    puntajes = PuntajeRespuestaSerializer(many=True, read_only=True)

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
            'puntajes'
        ]

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        archivos_data = validated_data.pop('archivos', [])

        respuesta = Respuesta.objects.create(**validated_data)

        # Crear detalles
        for detalle_data in detalles_data:
            RespuestaDetalle.objects.create(respuesta=respuesta, **detalle_data)

        # Crear archivos
        for archivo_data in archivos_data:
            RespuestaArchivo.objects.create(respuesta=respuesta, **archivo_data)

        return respuesta
