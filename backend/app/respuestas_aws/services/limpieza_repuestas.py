from datetime import timedelta
from django.utils import timezone
from models import Respuesta
from notificaciones.services.sns_notificacion import enviar_aviso_respuesta
from app.permissions.lambda_permissions import IsLambdaAuthorized

# Configurable
DIAS_INACTIVIDAD = 30
DIAS_AVISO = 7

permission_classes = [IsLambdaAuthorized]

def obtener_respuestas_inactivas():
    limite = timezone.now() - timedelta(days=DIAS_INACTIVIDAD)
    return Respuesta.objects.filter(
        fecha_actualizacion__lt=limite,
        eliminada=False
    )

def obtener_respuestas_para_aviso():
    limite = timezone.now() - timedelta(days=DIAS_INACTIVIDAD - DIAS_AVISO)
    
    return Respuesta.objects.filter(
        fecha_actualizacion__lt=limite,
        ultimo_aviso__isnull=True,
        eliminada=False
    )

def marcar_aviso_enviado(respuesta):
    respuesta.ultimo_aviso = timezone.now()
    respuesta.save(update_fields=["ultimo_aviso"])

# Enviar avisos
for respuesta in obtener_respuestas_para_aviso():
    enviar_aviso_respuesta(respuesta)
    marcar_aviso_enviado(respuesta)

def eliminar_respuesta(respuesta):
    respuesta.eliminada = True
    respuesta.save(update_fields=["eliminada"])
