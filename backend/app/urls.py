from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views.foroView import ForoViewSet
from .views.userView import UsuarioView, CambiarPasswordView
from .views.carreraMateriaView import (
     CarreraListCreateView, CarreraRetrieveUpdateDestroyView,
    MateriaListCreateView, MateriaRetrieveUpdateDestroyView
)
from .views.respuestaView import RespuestaViewSet
from .views.foroView import ForoViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'foros', ForoViewSet, basename='foro')
router.register(r'respuestas', RespuestaViewSet, basename='respuesta')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UsuarioView.as_view(), name='auth_usuario'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('cambiar-password/', CambiarPasswordView.as_view(), name='cambiar_password'),
    path('carreras/', CarreraListCreateView.as_view(), name='carrera-list'),
    path('carreras/<int:idCarrera>/', CarreraRetrieveUpdateDestroyView.as_view(), name='carrera-detail'),
    path('materias/', MateriaListCreateView.as_view(), name='materia-list'),
    path('materias/<int:idMateria>/', MateriaRetrieveUpdateDestroyView.as_view(), name='materia-detail'),
]
