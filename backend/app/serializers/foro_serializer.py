from backend.app.serializers.usuario_serializer import UsuarioForoSerializer
from rest_framework import serializers
from ..models import Foro, ForoArchivo, Usuario, Archivo, Materia


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
    usuario_nombre = serializers.SerializerMethodField()
    nombreCompleto = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source="materia.nombre", read_only=True)
    carrera_nombre = serializers.CharField(source="materia.carrera.nombre", read_only=True)

    class Meta:
        model = Foro
        fields = "__all__"

    def get_usuario_nombre(self, obj):
        return obj.usuario.username if obj.usuario else "Usuario desconocido"

    def get_nombreCompleto(self, obj):
        if not obj.usuario:
            return None
        nombre = f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
        return nombre or None
