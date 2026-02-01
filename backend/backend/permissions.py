from rest_framework.permissions import BasePermission
from django.conf import settings

class IsInternalLambda(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get("X-INTERNAL-TOKEN")
        return token and token == settings.INTERNAL_LAMBDA_TOKEN
