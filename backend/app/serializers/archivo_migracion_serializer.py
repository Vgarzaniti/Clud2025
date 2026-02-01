from rest_framework import serializers
from ..models import Archivo

#Serializer para el uso de lambda

class ArchivoMigracionSerializer(serializers.ModelSerializer):
    cloudinary_url = serializers.CharField(source="archivo.url")
    s3_key = serializers.SerializerMethodField()

    class Meta:
        model = Archivo
        fields = ["id", "cloudinary_url", "s3_key"]

    def get_cloudinary_url(self, obj):
        return obj.archivo.url

    def get_s3_key(self, obj):
        return f"{obj.hash}"

class ArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = Archivo
        fields = ["id", "archivo_url"]

    def get_archivo_url(self, obj):
        return obj.url_activa()