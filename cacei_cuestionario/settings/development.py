from .base import *

INSTALLED_APPS += [
    # Debug Toolbar
    'debug_toolbar',
]

MIDDLEWARE_CLASSES += [
    # Debug Toolbar Middleware
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

TEMPLATES[0]['OPTIONS']['debug'] = DEBUG

TEMPLATES[0]['OPTIONS']['context_processors'] += [
    # Debug Toolbar Context Processors
    'django.core.context_processors.debug',
    'django.template.context_processors.debug',
]

TEMPLATES[0]['OPTIONS']['string_if_invalid'] = 'Invalid: "%s"'

# Debug Toolbar Options
DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
]
