from rest_framework import status
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.shortcuts import get_object_or_404
from datetime import timedelta

from ..models import Archivo
from ..permissions import IsInternalLambda
from ..serializers.archivo_migracion_serializer import ArchivoMigracionSerializer

# Funciones para dar la informacion necesaria para lambda

class ArchivosPendientesMigracion(APIView):
    permission_classes = [IsInternalLambda]  

    def get(self, request):
        archivos = Archivo.objects.filter(
            migrado_s3=False,
            archivo__isnull=False
        ).exclude(
            s3_key__isnull=True
        )

        serializer = ArchivoMigracionSerializer(archivos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ArchivosParaMigrarView(APIView):
    permission_classes = [IsInternalLambda]

    DIAS_MINIMOS = 30

    def get(self, request):
        limite = now() - timedelta(days=self.DIAS_MINIMOS)

        archivos = Archivo.objects.filter(
            migrado_s3=False,
            fecha_creacion__lte=limite
        ).values(
            "id",
            "cloudinary_url",
            "hash"
        )[:100]

        return Response(list(archivos))

class MarcarArchivoMigrado(APIView):
    permission_classes = [IsInternalLambda]

    def patch(self, request, id):

        archivo = get_object_or_404(Archivo,id=id)

        if archivo.migrado:
            return Response(
                {"detail": "Archivo ya migrado"},
                status=status.HTTP_200_OK
            )

        archivo.migrado = True
        archivo.save(
            update_fields=["migrado"]
        )

        return Response(
            {"detail": "Archivo marcado como migrado"},
            status=status.HTTP_200_OK
        )