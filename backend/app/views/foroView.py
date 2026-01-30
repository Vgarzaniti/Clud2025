import hashlib
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from ..models import Foro, ForoArchivo, Archivo
from rest_framework.exceptions import ValidationError
from ..serializers.foro_serializer import ForoCreateSerializer, ForoReadSerializer
from .hash import file_hash
from django.db import transaction
from django.core.files.base import ContentFile

import logging

logger = logging.getLogger(__name__)

class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ForoCreateSerializer
        return ForoReadSerializer
    
    permission_classes = [IsAuthenticated]

    # 🔥 CLAVE: permite multipart/form-data
    parser_classes = (MultiPartParser, FormParser)

    # 🔥 CLAVE: optimiza carga de archivos
    def get_queryset(self):
        return Foro.objects.select_related(
            "usuario", "materia"
        ).prefetch_related(
            "archivos__archivo"
        ).order_by("-fecha_creacion")

    # 🔹 Procesar UN archivo (deduplicación GLOBAL)
    @staticmethod
    def _procesar_archivo(archivo_file, foro):
        try:
            logger.error("Procesando archivo: %s", archivo_file.name)

            archivo_bytes = archivo_file.read()
            logger.error("Bytes leídos: %s", len(archivo_bytes))

            hash_archivo = hashlib.md5(archivo_bytes).hexdigest()
            logger.error("Hash generado: %s", hash_archivo)

            archivo_global = Archivo.objects.filter(hash=hash_archivo).first()
            logger.error("Archivo existente: %s", archivo_global)

            if not archivo_global:
                archivo_global = Archivo.objects.create(
                    archivo=ContentFile(archivo_bytes, name=archivo_file.name),
                    hash=hash_archivo
                )
                logger.error("Archivo creado ID: %s", archivo_global.id)

            ForoArchivo.objects.get_or_create(
                foro=foro,
                archivo=archivo_global
            )

        except Exception:
            logger.exception("🔥 ERROR SUBIENDO ARCHIVO")
            raise


    # 🔹 Procesar múltiples archivos
    def _subir_archivos(self, foro, archivos):
        if not archivos:
            return

        for archivo in archivos:
            self._procesar_archivo(archivo, foro)

        foro.refresh_from_db()

    # 🔹 Retrieve
    def retrieve(self, request, pk=None):
        foro = self.get_object()
        serializer = ForoReadSerializer(foro, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 🔹 Create
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        logger.error("DATA RECIBIDA: %s", request.data)
        logger.error("FILES RECIBIDOS: %s", request.FILES)

        data = request.data.copy()
        data.pop('archivos', None)
        archivos = request.FILES.getlist('archivos')

        serializer = ForoCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        foro = serializer.save(usuario=request.user)

        self._subir_archivos(foro, archivos)
        foro.refresh_from_db()

        return Response(
            ForoReadSerializer(foro, context={"request": request}).data,
            status=status.HTTP_201_CREATED
        )


    # 🔹 Update
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        #partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        archivos_nuevos = request.FILES.getlist("archivos")
        archivos_a_eliminar = data.get("archivos_a_eliminar", [])

        if isinstance(archivos_a_eliminar, str):
            archivos_a_eliminar = [int(x) for x in archivos_a_eliminar.split(",")]

        serializer = ForoCreateSerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        foro = serializer.save(usuario=request.user)

        # 🔹 Eliminar relación foro ↔ archivo (NO borra Cloudinary)
        for archivo_id in archivos_a_eliminar:
            ForoArchivo.objects.filter(id=archivo_id, foro=foro).delete()

        self._subir_archivos(foro, archivos_nuevos)
        foro.refresh_from_db()

        return Response(
            ForoReadSerializer(foro, context={"request": request}).data,
            status=status.HTTP_200_OK
        )