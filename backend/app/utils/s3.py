import boto3
import os
from uuid import uuid4
from django.conf import settings
from botocore.exceptions import BotoCoreError, ClientError
import logging

logger = logging.getLogger(__name__)

s3 = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
)

def subir_a_s3(file_stream, key):
    s3.upload_fileobj(
        file_stream,
        settings.AWS_STORAGE_BUCKET_NAME,
        key
    )

def generar_url_descarga(s3_key, expires=3600):
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": s3_key
        },
        ExpiresIn=expires
    )

def eliminar_de_s3(self):
    try:
        s3.delete_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=self.s3_key
        )
        logger.info(f"Archivo eliminado de S3: {self.s3_key}")

    except (BotoCoreError, ClientError) as e:
        logger.error(
            "❌ Error eliminando archivo de S3",
            exc_info=e
        )
        raise RuntimeError("No se pudo eliminar el archivo de S3")

