from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'cacei.org.mx',
    'www.cacei.org.mx',
    '.cacei.org.mx',
    '.cacei.org.mx.',
    'debian1.cacei.org',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': { 
            'read_default_file': os.path.join(BASE_DIR, 'conf', 'mysql', 'my.cnf'),
            'init_command': 'SET storage_engine=MyISAM',
        },
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False
DEFAULT_FROM_EMAIL = 'CACEI Encuestas <encuestas@cacei.org.mx>'

LANGUAGE_CODE = 'es'

STATIC_ROOT = os.path.join(BASE_DIR, 'conf', 'server', 'static')

MEDIA_ROOT = os.path.join(BASE_DIR, 'conf', 'server', "media")

SITE_ID = 1
