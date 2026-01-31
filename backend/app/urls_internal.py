from views.internal_archivos import ArchivosPendientesMigracion, MarcarArchivoMigrado
from django.urls import path

urlpatterns = [
    path("archivos/pendientes-migracion/", ArchivosPendientesMigracion.as_view()),
    path("archivos/<int:archivo_id>/marcar-migrado/", MarcarArchivoMigrado.as_view()),
]

    