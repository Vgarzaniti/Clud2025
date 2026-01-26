import json
import boto3
from django.conf import settings

sns = boto3.client(
    "sns",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
)

def publicar_mensaje(topic_arn, payload: dict):
    """
    Publica un mensaje JSON en un topic SNS
    """
    sns.publish(
        TopicArn=topic_arn,
        Message=json.dumps(payload)
    )

