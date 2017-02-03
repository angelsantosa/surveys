"""cacei_cuestionario URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

from account.views import LoginView, LogoutView

# ... the rest of your URLconf goes here ...
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    # Custom URL Account
    # url(r"^account/", include('account.urls')),
    url(r"^cuenta/inicio/$", LoginView.as_view(), name="account_login"),
    url(r"^cuenta/salir/$", LogoutView.as_view(), name="account_logout"),

    # URLs directas del proyecto
    url('', include('formulario.urls')),
    url('', include('resultado.urls')),
    url(r'^$', TemplateView.as_view(template_name='homepage.html'), name='home'),
    # questionnaire urls
    url(r'q/', include('questionnaire.urls')),

    url(r'^take/(?P<questionnaire_id>[0-9]+)/$', 'questionnaire.views.generate_run', name='questionnaire.run'),
    url(r'^(?P<lang>..)/(?P<page_to_trans>.*)\.html$', 'questionnaire.page.views.langpage'),
    url(r'^(?P<page_to_render>.*)\.html$', 'questionnaire.page.views.page'),
    url(r'^setlang/$', 'questionnaire.views.set_language'),
]
