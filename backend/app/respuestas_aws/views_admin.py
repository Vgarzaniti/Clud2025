from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings

from respuestas_aws.services.limpieza_respuestas import (
    obtener_respuestas_inactivas,
    obtener_respuestas_para_aviso,
    marcar_aviso_enviado,
    eliminar_respuesta
)


class LimpiezaRespuestasView(APIView):
    """
    Endpoint llamado exclusivamente por AWS Lambda
    """

    permission_classes = [AllowAny]

    def post(self, request):
        token = request.headers.get("X-LAMBDA-TOKEN")

        if token != settings.LAMBDA_SECRET_TOKEN:
            return Response({"error": "No autorizado"}, status=401)

        avisadas = 0
        eliminadas = 0

        # Avisos
        for respuesta in obtener_respuestas_para_aviso():
            # SNS vendrá acá
            marcar_aviso_enviado(respuesta)
            avisadas += 1

        # Eliminación
        for respuesta in obtener_respuestas_inactivas():
            eliminar_respuesta(respuesta)
            eliminadas += 1

        return Response({
            "avisadas": avisadas,
            "eliminadas": eliminadas
        })
