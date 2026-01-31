import stat
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.timezone import now
from datetime import timedelta
from django.conf import settings
from ..models import Archivo
from ..serializers.archivo_migracion_serializer import ArchivoMigracionSerializer
from ....backend.backend.permissions import IsInternalLambda

class ArchivosPendientesMigracion(APIView):
    permission_classes = [IsInternalLambda]  # protegido por token manual

    def get(self, request):
        archivos = Archivo.objects.filter(
            migrado_s3=False,
            archivo__isnull=False
        ).exclude(
            s3_key__isnull=True
        )

        serializer = ArchivoMigracionSerializer(archivos, many=True)
        return Response(serializer.data, status=stat.HTTP_200_OK)

class MarcarArchivoMigrado(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, archivo_id):
        token = request.headers.get("X-INTERNAL-TOKEN")
        if token != settings.INTERNAL_LAMBDA_TOKEN:
            return Response(status=401)

        Archivo.objects.filter(id=archivo_id).update(migrado=True)
        return Response({"ok": True})