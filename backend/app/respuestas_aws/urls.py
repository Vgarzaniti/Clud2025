from django.urls import path
from respuestas_aws.views_admin import LimpiezaRespuestasView

urlpatterns = [
    path(
        "admin/limpieza-respuestas/",
        LimpiezaRespuestasView.as_view(),
        name="limpieza-respuestas"
    ),
]
