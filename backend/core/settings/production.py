"""
Production settings — uses Neon/Supabase PostgreSQL, DEBUG=False.
All secrets come from Render environment variables.
"""
from .base import *  # noqa
import dj_database_url
from decouple import config

DEBUG         = False
ALLOWED_HOSTS = [h for h in config('ALLOWED_HOSTS', default='').split(',') if h]

# Automatically append the Render external hostname
render_host = config('RENDER_EXTERNAL_HOSTNAME', default=None)
if render_host:
    ALLOWED_HOSTS.append(render_host)
else:
    # Fallback to allow tests
    ALLOWED_HOSTS.extend(['localhost', '127.0.0.1'])

# ─── Free PostgreSQL (Neon or Supabase) ──────────────────────────────────────
DATABASES = {
    'default': dj_database_url.parse(
        config('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ─── CORS ────────────────────────────────────────────────────────────────────
CORS_ALLOW_CREDENTIALS = True
origins = [o for o in config('CORS_ALLOWED_ORIGINS', default='').split(',') if o]
if not origins or '*' in origins:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGINS = []
else:
    CORS_ALLOWED_ORIGINS = origins

# ─── Security Headers ────────────────────────────────────────────────────────
SECURE_BROWSER_XSS_FILTER   = True
X_FRAME_OPTIONS              = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF  = True
