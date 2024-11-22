"""
Django settings for the petpal project.

Generated by 'django-admin startproject' using Django 5.1.2.

For more information on this file, see:
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from configparser import ConfigParser
import os

# ========== Paths ========== #
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ========== Configuration ========== #
CONFIG = ConfigParser()
CONFIG.read(BASE_DIR / "config.ini")

# ========== Security ========== #
SECRET_KEY = CONFIG.get("Django", "Secret")
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# ========== Applications ========== #
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "api",
    "corsheaders",
    "social_django",
]

# ========== Middleware ========== #
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ========== CORS Configuration ========== #
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

# ========== URL Configuration ========== #
ROOT_URLCONF = "petpal.urls"

# ========== Templates ========== #
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ========== WSGI Application ========== #
WSGI_APPLICATION = "petpal.wsgi.application"

# ========== Database Configuration ========== #
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ========== Password Validation ========== #
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ========== Internationalization ========== #
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ========== Static and Media Files ========== #
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, STATIC_URL)

# ========== Default Primary Key ========== #
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ========== Authentication Backends ========== #
GOOGLE_OAUTH2_BACKEND = 'social_core.backends.google.GoogleOAuth2'
AUTHENTICATION_BACKENDS = (
    GOOGLE_OAUTH2_BACKEND,
    "django.contrib.auth.backends.ModelBackend",
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = CONFIG.get("GoogleOAuth2", "client_id")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = CONFIG.get("GoogleOAuth2", "client_secret")
SOCIAL_AUTH_GOOGLE_OAUTH2_AUTH_EXTRA_ARGUMENTS = {"prompt": "select_account"}
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ["fullname", "picture", "email"]

# ========== Login/Redirect Configuration ========== #
LOGIN_URL = f"{CORS_ALLOWED_ORIGINS[0]}/Register"
SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = "http://localhost:8000/auth/complete/google-oauth2/"
LOGIN_REDIRECT_URL = "http://localhost:3000/"

# ========== Allowed Path Suffixes ========== #
ALLOWED_PATH_SUFFIXES = [
    "",
    "ProfileSignUp",
    "Matching",
    "Dashboard",
    "Profile",
]

# ========== Environment Variables ========== #
env_path = BASE_DIR.parent / ".env"
try:
    with open(env_path, "w") as f:
        f.write(f"REACT_APP_GOOGLE_CLIENT_ID={SOCIAL_AUTH_GOOGLE_OAUTH2_KEY}\n")
        f.write(f"REACT_APP_BACKEND=http://localhost:8000\n")
    print(f".env file generated successfully at {env_path} with client_id.")
except KeyError:
    print("Error: 'client_id' not found in config.ini under [GoogleOAuth2] section.")

# ========== API Keys ========== #
GOOGLE_MAPS_API_KEY = CONFIG.get("GoogleMaps", "API_KEY")
OPENAI_API_KEY = CONFIG.get("OpenAI", "API_KEY")

# ========== CORS Policy for Development ========== #
CORS_ALLOW_ALL_ORIGINS = True
