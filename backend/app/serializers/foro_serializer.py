from backend.app.serializers.usuario_serializer import UsuarioForoSerializer
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

        # Cloudinary
        if hasattr(archivo, 'cloudinary_url') and archivo.cloudinary_url:
            return archivo.cloudinary_url

        # FileField normal
        if hasattr(archivo, 'archivo') and archivo.archivo:
            return archivo.archivo.url

        return None

class ForoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foro
        fields = (
            "materia",
            "pregunta",
        )

class ForoReadSerializer(serializers.ModelSerializer):
    usuario = UsuarioForoSerializer(read_only=True)
    usuario_nombre = serializers.CharField(
        source="usuario.username",
        read_only=True
    )
    nombreCompleto = serializers.CharField(
        source="usuario.nombreYapellido",
        read_only=True
    )
    materia_nombre = serializers.CharField(
        source="materia.nombre",
        read_only=True
    )
    carrera_nombre = serializers.CharField(
        source="materia.carrera.nombre",
        read_only=True
    )
    archivos = ForoArchivoSerializer(many=True, read_only=True)

    class Meta:
        model = Foro
        fields = (
            "idForo",
            "usuario",
            "usuario_nombre",
            "nombreCompleto",
            "materia",
            "materia_nombre",
            "carrera_nombre",
            "pregunta",
            "fecha_creacion",
            "fecha_actualizacion",
            "archivos",
        )


