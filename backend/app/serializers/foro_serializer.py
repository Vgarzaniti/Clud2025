from rest_framework import serializers
from ..models import Foro, ForoArchivo

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
    usuario = serializers.SerializerMethodField()

    class Meta:
        model = Foro
        fields = [
            'idForo',
            'usuario',
            'materia',
            'pregunta',
            'fecha_creacion',
            'fecha_actualizacion',
            'archivos'
        ]
    def get_usuario(self, obj):
        return {
            "idUsuario": obj.usuario.idUsuario,
            "nombreYapellido": obj.usuario.nombreYapellido,
            "email": obj.usuario.email,
            "username": obj.usuario.username
        }

