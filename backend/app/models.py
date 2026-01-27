from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import boto3
from django.conf import settings
from .utils.s3 import eliminar_de_s3

class Archivo(models.Model):
    s3_key = models.CharField(
        max_length=255,
        unique=True
    )
    hash = models.CharField(
        max_length=32,
        unique=True,
        db_index=True
    )
    tamaño = models.BigIntegerField()
    content_type = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    nombre_original = models.CharField(max_length=255)

    def __str__(self):
        return self.s3_key
    
    def eliminar(self):
        eliminar_de_s3(self.s3_key)
        self.delete()
    
# -------------------- CARRERA --------------------
class Carrera(models.Model):
    idCarrera = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=False, blank=False)
    cantidadAno = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Carrera'
        verbose_name_plural = 'Carreras'


# -------------------- USUARIO --------------------
class Usuario(AbstractUser):
    idUsuario = models.AutoField(primary_key=True)
    nombreYapellido = models.CharField(max_length=200, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    username = models.CharField(max_length=150, unique=True, null=False, blank=False)
    is_staff = models.BooleanField(default=False)
    is_activate = models.BooleanField(default=True)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'Usuario'
        verbose_name_plural = 'Usuarios'


# -------------------- MATERIA --------------------
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
    ano = models.IntegerField(null=False, blank=False)
    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Materia'
        verbose_name_plural = 'Materias'


# -------------------- FORO --------------------
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
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Foro de {self.usuario.username} - {self.materia.nombre}"

    class Meta:
        db_table = 'Foro'
        verbose_name_plural = 'Foros'


# 🔹 NUEVO: archivos múltiples por foro
class ForoArchivo(models.Model):
    foro = models.ForeignKey(
        Foro,
        on_delete=models.CASCADE,
        related_name='archivos'
    )
    archivo = models.ForeignKey(
        Archivo,
        on_delete=models.CASCADE,
        related_name='foros'
    )

    class Meta:
        unique_together = ('foro', 'archivo')




# -------------------- RESPUESTA --------------------
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
    respuesta_texto = models.TextField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_ultima_revision = models.DateTimeField(null=True, blank=True)
    ultimo_cambio_puntaje = models.DateTimeField(null=True, blank=True)
    foro = models.ForeignKey(Foro, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ultimo_aviso = models.DateTimeField(null=True, blank=True)
    eliminada = models.BooleanField(default=False)
    total_likes = models.IntegerField(default=0)
    total_dislikes = models.IntegerField(default=0)
    total_votos = models.IntegerField(default=0)
    puntaje_neto = models.IntegerField(default=0)

    def __str__(self):
        return f"Respuesta {self.idRespuesta} - {self.usuario.username}"

    class Meta:
        db_table = 'Respuesta'
        verbose_name_plural = 'Respuestas'


# 🔹 NUEVO: archivos múltiples por respuesta
class RespuestaArchivo(models.Model):
    respuesta = models.ForeignKey(
        Respuesta,
        on_delete=models.CASCADE,
        related_name='archivos',
        null=False,
        blank=False
    )
    archivo = models.ForeignKey(
        Archivo,
        on_delete=models.CASCADE,
        related_name='respuesta'
    )

    class Meta:
        unique_together = ('respuesta', 'archivo')

class Puntaje(models.Model):
    LIKE = 1
    DISLIKE = -1
    NONE = 0

    OPCIONES = (
        (LIKE, "like"),
        (DISLIKE, "dislike"),
        (NONE, "none"),
    )

    respuesta = models.ForeignKey(
        Respuesta,
        on_delete=models.CASCADE,
        related_name="puntajes",
        null=False,
        blank=False
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="puntajes",
        null=False,
        blank=False
    )
    valor = models.SmallIntegerField(choices=OPCIONES, default=NONE)
    fecha_creacion = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "Puntaje"
        verbose_name_plural = "Puntajes"
        unique_together = ("usuario", "respuesta")  # un voto por usuario
        
