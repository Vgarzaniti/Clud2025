from rest_framework import serializers
from ..models import Carrera, Materia


# -------------------- SERIALIZER DE CARRERA --------------------
class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = '__all__' 


# -------------------- SERIALIZER DE MATERIA --------------------
class MateriaSerializer(serializers.ModelSerializer):

    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)

    class Meta:
        model = Materia
        fields = [
            'idMateria',
            'nombre',
            'carrera',
            'ano',
            'carrera_nombre',
        ]