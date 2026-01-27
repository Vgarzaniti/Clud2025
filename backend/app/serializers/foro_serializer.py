from backend.app.serializers.usuario_serializer import UsuarioForoSerializer
from rest_framework import serializers
from ..models import Foro, ForoArchivo, Usuario, Archivo
from ..utils.s3_utils import generar_url, eliminar_de_s3

class ForoArchivoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Archivo
        fields = ["id", "s3_key", "nombre_original", "url", "tamaño", "content_type"]

    def get_url(self, obj):
        return generar_url(obj)

    def eliminar_archivo(archivo):
        eliminar_de_s3(archivo.s3_key)
        archivo.delete()


class ForoSerializer(serializers.ModelSerializer):
    archivos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    usuario = UsuarioForoSerializer(read_only=True)
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
