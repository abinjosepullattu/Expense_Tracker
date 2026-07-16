import os
from django.core.wsgi import get_wsgi_application

# If running on Render, default to production settings
if os.environ.get('RENDER'):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.production')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')
application = get_wsgi_application()
