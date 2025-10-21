from django.urls import path
from .views.userView import UsuarioView

urlpatterns = [
    path('login/', UsuarioView.as_view(), name='auth_usuario'),
]
