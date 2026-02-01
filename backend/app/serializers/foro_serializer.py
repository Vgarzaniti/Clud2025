from .usuario_serializer import UsuarioSerializer
from rest_framework import serializers
from ..models import Foro, ForoArchivo, Usuario

class ForoArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.CharField(
        source='archivo.archivo.url',
        read_only=True
    )

    class Meta:
        model = ForoArchivo
        fields = ['id', 'archivo_url']


class ForoSerializer(serializers.ModelSerializer):
    archivos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    usuario = UsuarioSerializer(read_only=True)
    totalRespuestas = serializers.SerializerMethodField()

    usuario_id = serializers.PrimaryKeyRelatedField(
        source="usuario",
        queryset = Usuario.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Foro
        fields = [
            'idForo',
            'usuario',
            "usuario_id",
            'materia',
            'pregunta',
            'totalRespuestas',
            'fecha_creacion',
            'fecha_actualizacion',
            'archivos'
        ]
    
    def get_totalRespuestas(self, obj):
        return obj.respuestas.count()
