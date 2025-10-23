from rest_framework import generics, permissions,status
from ..serializers.usuario_serializer import UsuarioSerializer, CambiarPasswordSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.response import Response
from ..models import Usuario

class UsuarioView(generics.CreateAPIView):
    """
    Endpoint único para registro o login con email.
    Devuelve el JWT (access y refresh) directamente.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

class CambiarPasswordView(generics.UpdateAPIView):
    serializer_class = CambiarPasswordSerializer
    permission_classes = [permissions.IsAuthenticated]   # 🔐 Requiere token
    authentication_classes = [JWTAuthentication]          # ✅ Usa SimpleJWT

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        usuario = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if not check_password(data['password_actual'], usuario.password):
            return Response({"error": "La contraseña actual es incorrecta."},
                            status=status.HTTP_400_BAD_REQUEST)

        usuario.password = make_password(data['password_nueva'])
        usuario.save()
        return Response({"mensaje": "Contraseña actualizada correctamente."},
                        status=status.HTTP_200_OK)