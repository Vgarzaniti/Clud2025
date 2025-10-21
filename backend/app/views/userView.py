from rest_framework import generics, permissions
from ..serializers.usuario_serializer import UsuarioSerializer
from ..models import Usuario


class UsuarioView(generics.CreateAPIView):
    """
    Endpoint único para registro o login con email.
    Devuelve el JWT (access y refresh) directamente.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]
