from rest_framework import serializers
from ..models import Foro, ForoArchivo


class ForoArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = ForoArchivo
        fields = ['id', 'archivo_url']

    def get_archivo_url(self, obj):
        archivo = obj.archivo
        if not archivo:
            return None


class ForoSerializer(serializers.ModelSerializer):
    archivos = ForoArchivoSerializer(many=True, read_only=True)

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

