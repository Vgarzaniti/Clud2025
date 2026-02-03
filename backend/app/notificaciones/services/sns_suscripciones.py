import boto3
from django.conf import settings

sns_client = boto3.client(
    "sns",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def suscribir_usuario_a_sns(email):
    """
    Suscribe el email del usuario al topic SNS
    (AWS enviará un mail de confirmación)
    """
    sns_client.subscribe(
        TopicArn=settings.AWS_SNS_TOPIC_ARN,
        Protocol="email",
        Endpoint=email
    )
