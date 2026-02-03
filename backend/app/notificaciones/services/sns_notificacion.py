import boto3
from django.conf import settings

sns_client = boto3.client(
    "sns",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def enviar_aviso_respuesta(respuesta):
    mensaje = f"""
Hola {respuesta.usuario.nombreYapellido},

Tu respuesta publicada en el foro "{respuesta.foro.titulo}"
no ha tenido actividad reciente.

Si no realizás cambios, será eliminada en los próximos días.

Saludos,
Foro Estudiantil
"""

    sns_client.publish(
        TopicArn=settings.AWS_SNS_TOPIC_ARN,
        Message=mensaje,
        Subject="Aviso de respuesta inactiva en foro"
    )

# notificaciones/services/sns_publicador.py
def notificar_nueva_respuesta(foro, respuesta):
    sns_client.publish(
        TopicArn=settings.AWS_SNS_TOPIC_ARN,
        Subject="Nueva respuesta en el foro",
        Message=f"""
        Se publicó una nueva respuesta en el foro "{foro.pregunta}"

        Autor: {respuesta.usuario.email}
        """
    )

