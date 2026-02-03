from rest_framework.decorators import api_view
from rest_framework.response import Response
from cloudinary import api as cloud_api
import boto3
from django.conf import settings
import requests

@api_view(['GET'])
def archivos_pendientes(request):
    resources = cloud_api.resources(max_results=500)['resources']
    cloud_files = [f"{r['public_id']}.{r['format']}" for r in resources]

    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    s3_objects = s3.list_objects_v2(Bucket=settings.AWS_BUCKET)
    s3_files = [obj['Key'] for obj in s3_objects.get('Contents', [])] if 'Contents' in s3_objects else []

    pendientes = [f for f in cloud_files if f not in s3_files]

    return Response({"pendientes": pendientes})


@api_view(['POST'])
def marcar_migrado(request, id):
    nombre_archivo = request.data.get("archivo")
    if not nombre_archivo:
        return Response({"error": "Archivo requerido"}, status=400)

    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    url = f"https://res.cloudinary.com/{settings.CLOUD_NAME}/image/upload/{nombre_archivo}"
    response = requests.get(url)
    s3.put_object(Bucket=settings.AWS_BUCKET, Key=nombre_archivo, Body=response.content)

    return Response({"mensaje": f"{nombre_archivo} migrado a S3"})
