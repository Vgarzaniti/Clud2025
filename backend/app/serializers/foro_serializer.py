from backend.app.serializers.usuario_serializer import UsuarioForoSerializer
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
    archivos = ForoArchivoSerializer(many=True, read_only=True)
    usuario = UsuarioForoSerializer(read_only=True)

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
            'fecha_creacion',
            'fecha_actualizacion',
            'archivos'
        ]
