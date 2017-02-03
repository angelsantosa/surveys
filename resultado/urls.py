from django.conf.urls import include, url
from django.views.generic import RedirectView
from django.core.urlresolvers import reverse_lazy

from .views import ResultadoView, AnalisisComentariosView
from .views import ListadoEncuestasView, PresentacionView, CuestionarioView

urlpatterns = [
    url(r'^encuesta/resultado/(?P<questionnaire_id>[0-9]+)/(?P<questionset_id>[0-9]+)/$',
        ResultadoView.as_view(), name='resultado'),

    url(r'^encuesta/resultado/(?P<questionnaire_id>[0-9]+)/$',
        RedirectView.as_view(url=reverse_lazy('listado'), permanent=True), name='resultado_short'),

    url(r'^encuesta/resultado/$',
        RedirectView.as_view(url=reverse_lazy('listado'), permanent=True)),

    url(r'^encuesta/analisis-comentarios/(?P<questionnaire_id>[0-9]+)/(?P<questionset_id>[0-9]+)/$',
        AnalisisComentariosView.as_view(), name='analisis_comentarios'),

    url(r'^encuesta/analisis-comentarios/(?P<questionnaire_id>[0-9]+)/$',
        RedirectView.as_view(url=reverse_lazy('listado'), permanent=True), name='analisis_comentarios_short'),

    url(r'^encuesta/analisis-comentarios/$',
        RedirectView.as_view(url=reverse_lazy('listado'), permanent=True)),

    url(r'^encuesta/listado/$',
        ListadoEncuestasView.as_view(), name='listado'),

    url(r'^taller/(?P<questionnaire_id>[0-9]+)/$',
        PresentacionView.as_view(), name='presentacion'),

    url(r'^encuesta/(?P<questionnaire_id>[0-9]+)/$',
        CuestionarioView.as_view(), name='cuestionario'),
]
