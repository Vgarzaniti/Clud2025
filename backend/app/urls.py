from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views.foroView import ForoViewSet
from .views.userView import UsuarioView, CambiarDatosView
from .views.carreraMateriaView import (
     CarreraListCreateView, CarreraRetrieveUpdateDestroyView,
    MateriaListCreateView, MateriaRetrieveUpdateDestroyView
)
from .views.respuestaView import RespuestaViewSet
from .views.foroView import ForoViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views.respuestaView import RespuestaViewSet, RespuestaPuntajeView


router = DefaultRouter()
router.register(r'foros', ForoViewSet, basename='foro')
router.register(r'respuestas', RespuestaViewSet, basename='respuesta')

urlpatterns = [
    path('', include(router.urls)),
    path('respuestas/puntaje/<int:respuesta_id>/', RespuestaPuntajeView.as_view(), name='respuesta-puntaje-detail'),
    path('puntaje/', RespuestaPuntajeView.as_view(), name='respuesta-puntaje'),
    path('login/', UsuarioView.as_view(), name='usuario'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuario/cambiar_datos/', CambiarDatosView.as_view(), name='cambiar_datos'),
    path('carreras/', CarreraListCreateView.as_view(), name='carrera-list'),
    path('carreras/<int:idCarrera>/', CarreraRetrieveUpdateDestroyView.as_view(), name='carrera-detail'),
    path('materias/', MateriaListCreateView.as_view(), name='materia-list'),
    path('materias/<int:idMateria>/', MateriaRetrieveUpdateDestroyView.as_view(), name='materia-detail'),
]
