from rest_framework import generics
from ..models import Carrera, Materia
from ..serializers.carreraMateria_serializer import CarreraSerializer, MateriaSerializer

# -------------------- CARRERA --------------------
class CarreraListCreateView(generics.ListCreateAPIView):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer


class CarreraRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    lookup_field = 'idCarrera'


# -------------------- MATERIA --------------------
class MateriaListCreateView(generics.ListCreateAPIView):
    queryset = Materia.objects.select_related('carrera').all()
    serializer_class = MateriaSerializer


class MateriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Materia.objects.select_related('carrera').all()
    serializer_class = MateriaSerializer
    lookup_field = 'idMateria'
