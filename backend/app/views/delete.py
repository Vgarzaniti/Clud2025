from django.db.models.signals import post_delete
from django.dispatch import receiver
from ..models import RespuestaArchivo, ForoArchivo
from cloudinary.uploader import destroy


@receiver(post_delete, sender=RespuestaArchivo)
def eliminar_archivo_cloudinary(sender, instance, **kwargs):
    try:
        public_id = instance.archivo.split('/upload/')[-1].rsplit('.', 1)[0]
        destroy(public_id)
    except Exception:
        pass  
    
@receiver(post_delete, sender=ForoArchivo)
def eliminar_archivo_foros(sender, instance, **kwargs):
    try:
        public_id = instance.archivo.split('/upload/')[-1].rsplit('.', 1)[0]
        destroy(public_id)
    except Exception:
        pass
