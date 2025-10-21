from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer unificado para:
    - Registro de usuario (si no existe)
    - Login con email (si ya existe)
    Retorna los tokens JWT (access y refresh)
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Usuario
        fields = ['idUsuario', 'nombreYapellido', 'email', 'password', 'token']
        read_only_fields = ['idUsuario', 'token']

    def get_token(self, obj):
        """Genera y devuelve los JWT tokens del usuario."""
        refresh = RefreshToken.for_user(obj)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, validated_data):
        """
        Si el usuario no existe → lo registra.
        Si ya existe → valida credenciales y devuelve tokens.
        """
        email = validated_data.get('email')
        password = validated_data.get('password')
        nombreYapellido = validated_data.get('nombreYapellido', '')

        try:
            # Si existe el usuario, intentamos autenticar
            user = Usuario.objects.get(email__iexact=email)
            user_auth = authenticate(username=user.username, password=password)

            if user_auth is None:
                raise serializers.ValidationError("Contraseña incorrecta.")

            return user_auth

        except Usuario.DoesNotExist:
            # Si no existe → lo registramos
            username_auto = email.split('@')[0]  # generar username simple
            user = Usuario.objects.create(
                username=username_auto,
                email=email,
                nombreYapellido=nombreYapellido,
                password=make_password(password)
            )
            return user
