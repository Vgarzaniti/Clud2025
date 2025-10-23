from rest_framework import serializers
from app.models import Foro, ForoArchivo

class ForoArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForoArchivo
        fields = ('id', 'archivo')

class ForoSerializer(serializers.ModelSerializer):
    archivos = ForoArchivoSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Foro
        fields = ('idForo', 'usuario', 'materia', 'pregunta', 'fecha_creacion', 'fecha_actualizacion', 'archivos', 'uploaded_files')

    def create(self, validated_data):
        files = validated_data.pop('uploaded_files', [])
        foro = Foro.objects.create(**validated_data)
        for f in files:
            ForoArchivo.objects.create(foro=foro, archivo=f)
        return foro

    def update(self, instance, validated_data):
        files = validated_data.pop('uploaded_files', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        for f in files:
            ForoArchivo.objects.create(foro=instance, archivo=f)
        return instance