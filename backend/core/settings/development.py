"""
Development settings — uses SQLite, DEBUG=True, CORS open.
Start server: python manage.py runserver
"""
from .base import *  # noqa

DEBUG         = True
ALLOWED_HOSTS = ['*']

# SQLite — zero setup for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':   BASE_DIR / 'db.sqlite3',
    }
}

# Allow all origins in development (React dev server on :3000)
CORS_ALLOW_ALL_ORIGINS = True

# Print emails to console (no SMTP needed in dev)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
