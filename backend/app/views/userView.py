from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from ..models import Usuario
from rest_framework.generics import RetrieveAPIView
from .authentication import CookieJWTAuthentication
from ..serializers.usuario_serializer import (
    UsuarioSerializer,
    LoginSerializer,
    CambiarDatosSerializer
)

# ------------------------
# 🔹 Registro / Login con JWT en cookies
# ------------------------
class UsuarioView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def post(self, request, *args, **kwargs):
        # Detectar si es login o registro
        if 'login' in request.data:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            usuario = serializer.validated_data
        else:
            serializer = UsuarioSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            usuario = serializer.save()

        # Generar tokens JWT personalizados
        refresh = RefreshToken.for_user(usuario)
        refresh['idUsuario'] = usuario.idUsuario
        refresh['email'] = usuario.email
        refresh['username'] = usuario.username

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Crear respuesta
        response = Response({
            "mensaje": "Login/Registro exitoso",
            "access": access_token,
            "refresh": refresh_token,
            "usuario": {
                "idUsuario": usuario.idUsuario,
                "nombreYapellido": usuario.nombreYapellido,
                "email": usuario.email,
                "username": usuario.username
            }
        }, status=status.HTTP_200_OK)

        # Guardar tokens en cookies seguras
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None'
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None'
        )

        return response

# ------------------------
# 🔹 Cambiar contraseña o username
# ------------------------
class CambiarDatosView(generics.UpdateAPIView):
    serializer_class = CambiarDatosSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        usuario = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if 'password_nueva' in data:
            usuario.password = make_password(data['password_nueva'])
        if 'nuevo_username' in data:
            usuario.username = data['nuevo_username']

        usuario.save()
        return Response({"mensaje": "Datos actualizados correctamente."}, status=status.HTTP_200_OK)

# ------------------------
# 🔹 Logout (eliminar cookies)
# ------------------------

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response(
            {"mensaje": "Logout exitoso"},
            status=status.HTTP_200_OK
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    
# ------------------------
# 🔹 Datos de Usuario
# ------------------------
class UsuarioMeView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get_object(self):
        return self.request.user

class UsuarioDetailView(RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]
    
    lookup_field = 'idUsuario'
    lookup_url_kwarg = 'idUsuario'
