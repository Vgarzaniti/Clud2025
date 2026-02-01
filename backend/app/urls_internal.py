from views.internal_archivos import ArchivosPendientesMigracion, MarcarArchivoMigrado
from django.urls import path

# URLs que solamente se utilizaran para la conexion con lambda

urlpatterns = [
    path("archivos/pendientes-migracion/", ArchivosPendientesMigracion.as_view()),
    path("archivos/<int:id>/marcar-migrado/", MarcarArchivoMigrado.as_view()),
]

    