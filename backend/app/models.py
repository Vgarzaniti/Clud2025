from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

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
        related_name='archivos',
        null=False,
        blank=False
    )
    archivo = CloudinaryField('archivo', null=False, blank=False)

    def __str__(self):
        return f"Archivo del Foro {self.foro.idForo}"

    class Meta:
        db_table = 'ForoArchivo'
        verbose_name_plural = 'Archivos de Foros'


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
    archivo = CloudinaryField('archivo', null=False, blank=False)

    def __str__(self):
        return f"Archivo de Respuesta {self.respuesta.idRespuesta}"

    class Meta:
        db_table = 'RespuestaArchivo'
        verbose_name_plural = 'Archivos de Respuestas'




        

class Puntaje(models.Model):
    respuesta = models.ForeignKey(
        Respuesta,
        on_delete=models.CASCADE,
        related_name='puntajes',
        null=False,
        blank=False
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='puntajes',
        null=False,
        blank=False
    )
    valor = models.IntegerField(default=0, null=False, blank=False)
    fecha_creacion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Puntaje {self.valor} - {self.usuario.username} para Respuesta {self.respuesta.idRespuesta}"

    class Meta:
        db_table = 'Puntaje'
        verbose_name_plural = 'Puntajes'