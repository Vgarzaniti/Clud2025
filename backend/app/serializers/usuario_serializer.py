from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from ..models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['idUsuario', 'nombreYapellido', 'email', 'username', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def get_nombreYapellido(self, obj):
        # Ajustá esto según tu modelo
        return f"{obj.first_name} {obj.last_name}".strip()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        usuario = Usuario.objects.filter(email=email).first()
        if usuario and usuario.check_password(password):
            return usuario
        raise serializers.ValidationError("Credenciales inválidas.")


class CambiarDatosSerializer(serializers.Serializer):
    password_actual = serializers.CharField(write_only=True, required=False)
    password_nueva = serializers.CharField(write_only=True, required=False)
    nuevo_username = serializers.CharField(required=False)

    def validate(self, data):
        usuario = self.context['request'].user

        # Si quiere cambiar la contraseña
        if data.get("password_nueva"):
            if not data.get("password_actual"):
                raise serializers.ValidationError({
                    "password_actual": "Debes ingresar la contraseña actual."
                })

            if not usuario.check_password(data["password_actual"]):
                raise serializers.ValidationError({
                    "password_actual": "La contraseña actual es incorrecta."
                })

        # Si no manda nada
        if not data.get("nuevo_username") and not data.get("password_nueva"):
            raise serializers.ValidationError(
                "Debes enviar al menos un dato para actualizar."
            )

        return data
