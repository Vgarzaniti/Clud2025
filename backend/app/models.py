from django.db import models
from cloudinary.models import CloudinaryField
# Create your models here.




class Carrera(models.Model):
    idCarrera = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    cantidadAno = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Carrera'
        verbose_name_plural = 'Carreras'


class Usuario(models.Model):
    idUsuario = models.AutoField(primary_key=True)
    nombreYapellido = models.CharField(max_length=200, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    password = models.CharField(max_length=100, null=False, blank=False)
    userName = models.CharField(max_length=100, unique=True, null=False, blank=False)

    def __str__(self):
        return self.userName

    class Meta:
        db_table = 'Usuario'
        verbose_name_plural = 'Usuarios'


class Materia(models.Model):
    idMateria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    carrera = models.ForeignKey(
        Carrera,
        on_delete=models.CASCADE,
        related_name='materias',
        null=False,
        blank=False
    )

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Materia'
        verbose_name_plural = 'Materias'


class Foro(models.Model):
    idForo = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='foros',
        null=False,
        blank=False
    )
    materia = models.ForeignKey(
        Materia,
        on_delete=models.CASCADE,
        related_name='foros',
        null=False,
        blank=False
    )
    pregunta = models.TextField(null=False, blank=False)
    archivo = models.CharField(max_length=250, null=True, blank=True)  # opcional

    def __str__(self):
        return f"Foro de {self.usuario.userName} - {self.materia.nombre}"

    class Meta:
        db_table = 'Foro'
        verbose_name_plural = 'Foros'


class Respuesta(models.Model):
    idRespuesta = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='respuestas',
        null=False,
        blank=False
    )
    foro = models.ForeignKey(
        Foro,
        on_delete=models.CASCADE,
        related_name='respuestas',
        null=False,
        blank=False
    )
    materia = models.ForeignKey(
        Materia,
        on_delete=models.CASCADE,
        related_name='respuestas',
        null=False,
        blank=False
    )
    puntaje = models.IntegerField(default=0, null=False, blank=False)

    def __str__(self):
        return f"Respuesta {self.idRespuesta} - {self.usuario.userName}"

    class Meta:
        db_table = 'Respuesta'
        verbose_name_plural = 'Respuestas'


class RespuestaDetalle(models.Model):
    idRespuestaDetalle = models.AutoField(primary_key=True)
    respuesta = models.ForeignKey(
        Respuesta,
        on_delete=models.CASCADE,
        related_name='detalles',
        null=False,
        blank=False
    )
    respuesta_texto = models.TextField(null=False, blank=False)
    archivo = CloudinaryField('archivo', null=True, blank=True)  # archivo opcional en Cloudinary

    def __str__(self):
        return f"Detalle de Respuesta {self.respuesta.idRespuesta}"

    class Meta:
        db_table = 'RespuestaDetalle'
        verbose_name_plural = 'Detalles de Respuestas'
