from django.conf import settings
from notificaciones.services.sns_service import publicar_mensaje

def enviar_aviso_respuesta(respuesta):
    """
    Envía aviso al autor de la respuesta indicando
    que será eliminada por inactividad.
    """

    payload = {
        "tipo": "RESPUESTA_INACTIVA",
        "email": respuesta.usuario.email,
        "respuesta_id": respuesta.idRespuesta,
        "foro_id": respuesta.foro_id,
        "dias_gracia": settings.DIAS_GRACIA_RESPUESTA,
    }

    publicar_mensaje(
        settings.SNS_TOPIC_RESPUESTA_INACTIVA,
        payload
    )
