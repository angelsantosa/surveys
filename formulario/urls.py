from django.conf.urls import include, url

from .views import FormularioPreview, FormularioCompleteView, EncuestaFinView, FormularioSedeCreateView
from .forms import FormularioForm

urlpatterns = [
    url(r'^crear/encuesta/$', FormularioPreview(FormularioForm), name='formulario'),
    url(r'^crear/sede/$', FormularioSedeCreateView.as_view(), name='sede'),
    url(r'^crear/encuesta/finalizada/$', FormularioCompleteView.as_view(), name='complete'),
    url(r'^encuesta/finalizada/$', EncuestaFinView.as_view(), name='encuesta_fin'),
]
