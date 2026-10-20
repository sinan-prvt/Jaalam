"""
Django settings for config project.
"""
from pathlib import Path
import os
import sys
from django.core.exceptions import ImproperlyConfigured
import dj_database_url
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings configured for Render & Local
# Debug defaults to on for local `manage.py` commands and off for servers (gunicorn on Render).
# Production should still set DEBUG=False explicitly (render.yaml does).
DEBUG = config('DEBUG', default=Path(sys.argv[0]).name == 'manage.py', cast=bool)
SECRET_KEY = config('SECRET_KEY', default='')
if not SECRET_KEY:
    if not DEBUG:
        raise ImproperlyConfigured('Set the SECRET_KEY environment variable (required when DEBUG is off).')
    SECRET_KEY = 'django-insecure-local-development-only'
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'websites',
    'customers',
    'billing',
    'marketing',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database uses dj_database_url for PostgreSQL on Render, falls back to local SQLite
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=0
    )

}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
# Times are stored in UTC; this is the zone for "today", invoice dates (and so the financial
# year), reminder runs and times written into emails. Customers are in India.
TIME_ZONE = config('TIME_ZONE', default='Asia/Kolkata')
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

# Browser origins allowed to call the API with the user's login cookie. The production
# frontend proxies /api through its own domain (frontend/vercel.json), so it is same-origin
# and needs no entry here. Add an origin only if a frontend calls the backend directly
# (e.g. VITE_API_URL=https://...onrender.com): FRONTEND_ORIGINS=https://jaalam.app,https://www.jaalam.app
LOCAL_ORIGINS = [f'http://{host}:{port}' for host in ('localhost', '127.0.0.1') for port in (5173, 5174, 4173)]
FRONTEND_ORIGINS = [o.strip() for o in config('FRONTEND_ORIGINS', default='').split(',') if o.strip()]
CORS_ALLOWED_ORIGINS = LOCAL_ORIGINS + FRONTEND_ORIGINS
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = LOCAL_ORIGINS + ['https://*.vercel.app', 'https://*.onrender.com'] + FRONTEND_ORIGINS

# The frontend proxies /api to this backend (Vercel -> Render). Trust the original host and
# scheme those proxies forward, so Django's CSRF origin check sees the frontend's own domain
# (e.g. a custom domain) and same-site requests pass without listing every domain here.
USE_X_FORWARDED_HOST = True

# Public address of the frontend, used in emailed links (password reset...). Links are never
# built from request headers in production, which an attacker could forge.
FRONTEND_URL = config('FRONTEND_URL', default='').rstrip('/')
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # CSRF-checked session auth (the frontend sends the X-CSRFToken header, see main.tsx)
        'rest_framework.authentication.SessionAuthentication',
    ],
    # Used by the scoped throttles on login and password reset (see users/views.py).
    'DEFAULT_THROTTLE_RATES': {
        'login': '10/min',
        'password_reset': '5/hour',
        'public_form': '20/hour',  # contact forms and RSVPs, per visitor IP
    },
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Uploaded photos and music. Render's disk is wiped on every deploy, so production should use
# S3-compatible object storage (Cloudflare R2, AWS S3, Backblaze B2, DigitalOcean Spaces...).
# Set AWS_STORAGE_BUCKET_NAME to switch it on; without it uploads stay on local disk.
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default='')
if AWS_STORAGE_BUCKET_NAME:
    AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default='')
    AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default='')
    AWS_S3_ENDPOINT_URL = config('AWS_S3_ENDPOINT_URL', default='') or None  # R2: https://<account-id>.r2.cloudflarestorage.com
    AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='auto')
    AWS_S3_CUSTOM_DOMAIN = config('AWS_S3_CUSTOM_DOMAIN', default='') or None  # public host, e.g. media.jaalam.app or pub-xxxx.r2.dev
    AWS_QUERYSTRING_AUTH = False  # public, permanent URLs (they are stored in site content)
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'public, max-age=31536000, immutable'}
    STORAGES = {
        'default': {'BACKEND': 'storages.backends.s3.S3Storage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }

# Razorpay settings
# Set these in the environment (or backend/.env locally); never commit real keys.
RAZORPAY_KEY_ID = config('RAZORPAY_KEY_ID', default='')
RAZORPAY_KEY_SECRET = config('RAZORPAY_KEY_SECRET', default='')
RAZORPAY_WEBHOOK_SECRET = config('RAZORPAY_WEBHOOK_SECRET', default='')

# Email settings
# Emails print to the console unless an SMTP server is configured (e.g. Gmail, Brevo, SES).
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend' if EMAIL_HOST else 'django.core.mail.backends.console.EmailBackend')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Jaalam <no-reply@jaalam.app>')

# ── Custom domains ────────────────────────────────────────────────────────────
# DNS targets customers point their domain at. Defaults are Vercel's (the frontend host);
# change them if the frontend moves.
CUSTOM_DOMAIN_A_RECORD = config('CUSTOM_DOMAIN_A_RECORD', default='76.76.21.21')
CUSTOM_DOMAIN_CNAME = config('CUSTOM_DOMAIN_CNAME', default='cname.vercel-dns.com')
# Optional: when set, verified domains are added to the Vercel frontend project automatically
# so Vercel routes them and issues SSL. Without these, add verified domains in Vercel by hand.
VERCEL_TOKEN = config('VERCEL_TOKEN', default='')
VERCEL_PROJECT_ID = config('VERCEL_PROJECT_ID', default='')
VERCEL_TEAM_ID = config('VERCEL_TEAM_ID', default='')
