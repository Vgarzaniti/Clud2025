from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from app.models import Foro
from app.serializers.foro_serializer import ForoSerializer

class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all().order_by('-fecha_creacion')
    serializer_class = ForoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx.update({'request': self.request})
        return ctx