import boto3
from uuid import uuid4
from django.conf import settings
from botocore.exceptions import BotoCoreError, ClientError

s3 = boto3.client("s3")

def subir_a_s3(file_obj, hash_archivo):
    try:
        key = f"archivos/{hash_archivo}_{uuid4()}_{file_obj.name}"

        s3.upload_fileobj(
            Fileobj=file_obj,
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=key,
            ExtraArgs={"ContentType": file_obj.content_type}
        )

        return key

    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Error subiendo archivo a S3: {str(e)}")

def get_url(self, obj):
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": obj.s3_key
        },
        ExpiresIn=3600
    )