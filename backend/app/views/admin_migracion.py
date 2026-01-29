from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from archivos.models import Archivo

@api_view(["POST"])
@permission_classes([IsAdminUser])
def obtener_archivos_a_migrar(request):
    """
    Devuelve los archivos activos que ya pueden migrarse a S3
    (por ejemplo, más antiguos que X días).
    """

    dias = int(request.data.get("dias", 30))

    fecha_limite = timezone.now() - timedelta(days=dias)

    archivos = Archivo.objects.filter(
        fecha_creacion__lte=fecha_limite
    )

    data = []
    for archivo in archivos:
        data.append({
            "id": archivo.id,
            "cloudinary_url": archivo.cloudinary_url,
            "cloudinary_public_id": archivo.cloudinary_public_id,
        })

    return Response(
        {
            "cantidad": len(data),
            "archivos": data
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAdminUser])
def confirmar_migracion_archivo(request):
    """
    Confirma que un archivo fue migrado correctamente a S3.
    """

    archivo_id = request.data.get("id")
    s3_key = request.data.get("s3_key")

    if not archivo_id or not s3_key:
        return Response(
            {"error": "id y s3_key son obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        archivo = Archivo.objects.get(id=archivo_id)
    except Archivo.DoesNotExist:
        return Response(
            {"error": "Archivo no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    archivo.s3_key = s3_key
    archivo.fecha_migracion = timezone.now()
    archivo.save()

    return Response(
        {
            "mensaje": "Archivo migrado correctamente",
            "archivo_id": archivo.id,
            "s3_key": archivo.s3_key
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsAdminUser])
def registrar_error_migracion(request):
    """
    Registra un fallo ocurrido durante la migración en Lambda.
    """

    archivo_id = request.data.get("id")
    error = request.data.get("error", "Error desconocido")

    if not archivo_id:
        return Response(
            {"error": "id es obligatorio"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        archivo = Archivo.objects.get(id=archivo_id)
    except Archivo.DoesNotExist:
        return Response(
            {"error": "Archivo no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    archivo.save()

    return Response(
        {
            "mensaje": "Error registrado",
            "archivo_id": archivo.id,
            "detalle": error
        },
        status=status.HTTP_200_OK
    )