from django.urls import path
from .views.userView import UsuarioView, CambiarPasswordView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('login/', UsuarioView.as_view(), name='auth_usuario'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('cambiar-password/', CambiarPasswordView.as_view(), name='cambiar_password'),
]
