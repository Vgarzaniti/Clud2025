from django.conf import settings
from rest_framework.permissions import BasePermission

class IsLambdaAuthorized(BasePermission):
    def has_permission(self, request, view):
        return (
            request.headers.get("X-Lambda-Secret")
            == settings.LAMBDA_SECRET_TOKEN
        )
