"""
Django settings for backend project.
Optimizado para despliegue: Frontend (AWS S3) -> Backend (Render)
"""

import os
import cloudinary
from pathlib import Path
from datetime import timedelta
from decouple import config
from dotenv import load_dotenv
import dj_database_url

# Cargar variables del .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

ENV = os.getenv("ENV", "development")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-t+a8ge1)-9o6=b)#8kik8_7l7il!df1n8bx-)i2p#59h166g=-')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'clud2025.onrender.com',
    'localhost',
    '127.0.0.1',
]

AUTH_USER_MODEL = 'app.Usuario'

# Application definition
INSTALLED_APPS = [
    'app',
    'cloudinary',
    'drf_spectacular',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Debe ir arriba de todo
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ✅ CONFIGURACIÓN CORS (Para que S3 pueda leer la API)
CORS_ALLOWED_ORIGINS = [
    "https://clud2025.vercel.app",
    "http://localhost:5173",
    "http://cloud2025-frontend-utn.s3-website-us-east-1.amazonaws.com", # Tu S3
]

CORS_ALLOW_CREDENTIALS = True  # Vital para permitir cookies de sesión

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "x-requested-with",
    "accept",
    "origin",
]

# ✅ CONFIGURACIÓN CSRF (Para que S3 pueda enviar datos POST/PUT)
CSRF_TRUSTED_ORIGINS = [
    "https://clud2025.onrender.com",
    "http://cloud2025-frontend-utn.s3-website-us-east-1.amazonaws.com",
]

# Ajustes de seguridad de cookies para compatibilidad HTTP (S3) -> HTTPS (Render)
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = False  # Cambiar a True si configuras HTTPS en S3 con CloudFront

# ✅ CONFIGURACIÓN JWT (SimpleJWT)
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=120),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "USER_ID_FIELD": "idUsuario",
    "USER_ID_CLAIM": "user_id",
    "AUTH_COOKIE": "access_token",
    "AUTH_COOKIE_REFRESH": "refresh_token",
    "AUTH_COOKIE_SECURE": False,      # False porque el frontend S3 es HTTP
    "AUTH_COOKIE_HTTP_ONLY": True,    # Protege contra ataques XSS
    "AUTH_COOKIE_SAMESITE": "Lax",    # Necesario para que el navegador acepte la cookie desde S3
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Cloudinary
cloudinary.config(
    cloud_name=config('CLOUD_NAME'),
    api_key=config('API_KEY'),
    api_secret=config('API_SECRET'),
    secure=True
)

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Spectacular Docs
SPECTACULAR_SETTINGS = {
    'TITLE': 'API Foro Universitario',
    'DESCRIPTION': 'Documentación de los endpoints del backend de foros, respuestas y archivos.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}