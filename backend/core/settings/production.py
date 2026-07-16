"""
Production settings — uses Neon/Supabase PostgreSQL, DEBUG=False.
All secrets come from Render environment variables.
"""
from .base import *  # noqa
import dj_database_url
from decouple import config

DEBUG         = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# ─── Free PostgreSQL (Neon or Supabase) ──────────────────────────────────────
DATABASES = {
    'default': dj_database_url.parse(
        config('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ─── CORS ────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS   = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = True

# ─── Security Headers ────────────────────────────────────────────────────────
SECURE_BROWSER_XSS_FILTER   = True
X_FRAME_OPTIONS              = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF  = True
