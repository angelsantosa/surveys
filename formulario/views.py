# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.contrib import messages
from django.views.generic.edit import FormView
from django.views.generic import TemplateView, FormView

from formtools.preview import FormPreview

from .forms import FormularioForm, FormularioSede

# Create your views here.


class FormularioSedeCreateView(FormView):
    form_class = FormularioSede
    template_name = "formulario_sede_load.html"

    def get_success_url(self):
        return reverse('sede',)

    def form_valid(self, form):
        form.save(commit=True)

        messages.add_message(self.request,
                             messages.SUCCESS,
                             'Se ha creado la sede satisfactoriamente',
                             extra_tags='terminado')

        return super(FormularioSedeCreateView, self).form_valid(form)


class FormularioView(FormView):
    template_name = 'formulario_wizz.html'
    form_class = FormularioForm

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, '¡Encuesta Guardada!')
        return reverse('complete',)

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        form.send_email()
        form.save(commit=True)
        return super(FormularioView, self).form_valid(form)


class FormularioPreview(FormPreview):
    template_name = 'formulario_wizz.html'
    form_class = FormularioForm
    form_template = 'formulario_wizz.html'
    preview_template = 'formulario_preview.html'

    def get_success_url(self):
        messages.add_message(self.request, messages.SUCCESS, '¡Encuesta Guardada!')
        return reverse('complete',)

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        form.send_email()
        form.save(commit=True)
        return super(FormularioPreview, self).form_valid(form)

    def process_preview(self, request, form, context):
        # Almacenar el ordenamiento de los campos en el formulario
        preview_form_order = []
        for field in form:
            preview_form_order.append(field.label)

        # Almacenar los datos label y value del formulario
        preview_data = []
        for key, value in form.cleaned_data.iteritems():
            data = {}
            label = form.fields[key].label
            data['label'] = label
            data['value'] = value
            preview_data.append(data)

        # Generamos un indice de claves, de la lista con el ordenamiento esperado
        order_dict = {label: index for index, label in enumerate(preview_form_order)}
        # Ordenamos la lista de diccionarios, de acuerdo a el indice generado
        preview_data.sort(key=lambda x: order_dict[x['label']])

        context['preview_data'] = preview_data

    def done(self, request, cleaned_data):
        # Do something with the cleaned_data, then redirect
        # to a "success" page.
        f = self.form(request.POST)
        f.save(commit=True)
        url_id = f.clone_questionnaire(cleaned_data=cleaned_data)
        f.send_email(cleaned_data=cleaned_data, host=request.get_host(), url_id=url_id)

        messages.add_message(request,
                             messages.SUCCESS,
                             'Se ha creado el acceso al cuestionario %s satisfactoriamente' % url_id,
                             extra_tags='terminado')
        return render(request, 'formulario_complete.html', {'url_id': url_id})


class FormularioCompleteView(TemplateView):
    template_name = 'formulario_complete.html'


class EncuestaFinView(TemplateView):
    template_name = 'encuesta_fin.html'
