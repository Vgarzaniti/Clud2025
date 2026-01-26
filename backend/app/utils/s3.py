import boto3
from uuid import uuid4
from django.conf import settings
from models import Archivo
from botocore.exceptions import BotoCoreError, ClientError

s3 = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
)

def subir_a_s3(file_obj, hash_archivo):
    try:
        key = f"archivos/{hash_archivo}_{uuid4()}_{file_obj.name}"

        s3.upload_fileobj(
            Fileobj=file_obj,
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=key,
            ExtraArgs={"ContentType": file_obj.content_type}
        )

        return {
            "s3_key": key,
            "nombre_original": file_obj.name
        }


    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Error subiendo archivo a S3: {str(e)}")

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
    s3 = boto3.client("s3")
    s3.delete_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=self.s3_key
    )
