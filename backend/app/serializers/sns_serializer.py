import json
import boto3

sns = boto3.client("sns")

def enviar_email(topic_arn, mensaje):
    sns.publish(
        TopicArn=topic_arn,
        Message=json.dumps(mensaje)
    )

