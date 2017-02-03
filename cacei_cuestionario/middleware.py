# -*- coding: utf-8 -*-

import re

from django.http import HttpResponseRedirect
from django.conf import settings


class EnforceLoginMiddleware(object):
    """
    Middlware class which requires the user to be authenticated for all urls except 
    those defined in PUBLIC_URLS in settings.py. PUBLIC_URLS should be a tuple of regular 
    expresssions for the urls you want anonymous users to have access to. If PUBLIC_URLS 
    is not defined, it falls back to LOGIN_URL or failing that '/accounts/login/'.  
    Requests for urls not matching PUBLIC_URLS get redirected to LOGIN_URL with next set 
    to original path of the unauthenticted request. 
    Any urls statically served by django are excluded from this check. To enforce the same
    validation on these set SERVE_STATIC_TO_PUBLIC to False.
    """

    def __init__(self):
        self.login_url = getattr(settings, 'LOGIN_URL', '/accounts/login/')
        # Permite el acceso a todas las url's en login_url base
        public_urls = [(re.compile("^%s$" % (self.login_url[1:])))]
        # Permite el acceso solo a las url's públicas
        jail_urls = [(re.compile("^%s$" % self.login_url))]
        if hasattr(settings, 'PUBLIC_URLS'):
            public_urls += [re.compile(url) for url in settings.PUBLIC_URLS]
            jail_urls += [re.compile(url) for url in settings.PUBLIC_URLS]
        if hasattr(settings, 'ADMIN_URLS'):
            # Denegar el acceso a las url's de administración si no es superusuario
            admin_urls = [re.compile(url) for url in settings.ADMIN_URLS]
        self.public_urls = tuple(public_urls)
        self.jail_urls = tuple(jail_urls)
        self.admin_urls = tuple(admin_urls)

    def process_request(self, request):
        """
        Redirect anonymous users to login_url from non public urls
        """

        # No need to process URLs if is root path
        if request.path == "/":
            return None

        assert hasattr(request, 'user'), "The Login Required middleware\
            requires authentication middleware to be installed. Edit your\
            MIDDLEWARE_CLASSES setting to insert\
            'django.contrib.auth.middleware.AuthenticationMiddleware'. If that doesn't\
            work, ensure your TEMPLATE_CONTEXT_PROCESSORS setting includes\
            'django.core.context_processors.auth'."

        # No need to process URLs if user already logged in
        if request.user.is_authenticated():
            """
            El superusuario tiene acceso directo a todas las opciones
            """
            if request.user.is_superuser:
                return None

            """
            Condiciones de acceso a dashborad que se deben de cumplir
            No permitir acceso a usuarios que no han verificado su correo
            No permitir acceso a usuarios que no tienen contraseña
            No permitir acceso a usuarios que no han aceptado el aviso de privacidad
            """
            if not any(m.match(request.path) for m in self.jail_urls):
                if settings.AUTH_WORKFLOW_ENABLED:
                    if not request.user.emailaddress_set.get(email=request.user.email).verified \
                            or not request.user.profile.has_password \
                            or not request.user.profile.privacy_accept:
                        return HttpResponseRedirect("/")

            return None

        """
        Restringir el acceso a urls de administración
        """
        if any(m.match(request.path) for m in self.admin_urls):
            return HttpResponseRedirect("/")

        """
        El usuario anónimo solo puede acceder a las url's públicas,
        en caso contrario se envía al inicio
        """
        if not any(m.match(request.path) for m in self.public_urls):
            return HttpResponseRedirect("/")
