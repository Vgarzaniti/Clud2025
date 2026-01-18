from backend.app.serializers.usuario_serializer import UsuarioForoSerializer
from rest_framework import serializers
from ..models import Foro, ForoArchivo
from django.contrib.auth.models import User


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

    class Meta:
        model = Foro
        # 🔥 IMPORTANTE: usuario NO está en fields para entrada
        # Se agrega SOLO en to_representation() para salida
        fields = [
            'idForo',
            'materia',
            'pregunta',
            'fecha_creacion',
            'fecha_actualizacion',
            'archivos'
        ]
        read_only_fields = ['idForo', 'fecha_creacion', 'fecha_actualizacion', 'archivos']
    
    def to_representation(self, instance):
        """
        🔥 SOLO en salida (response) agregamos usuario
        """
        data = super().to_representation(instance)
        data['usuario'] = instance.usuario.id
        return data
    
    def create(self, validated_data):
        """
        🔥 El usuario se obtiene del contexto, NO de validated_data
        """
        user = self.context['request'].user
        return Foro.objects.create(
            usuario=user,
            **validated_data
        )

