# -*- coding: utf-8 -*-

from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django import forms
from django.forms import ModelForm
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404

from questionnaire.models import Questionnaire

from .models import Formulario, TipoTaller, Sede, Enlace


class FormularioSede(ModelForm):
    EXISTENTE = 'EX'
    NUEVO = 'NU'
    ENLACE_TYPE_CHOICES = (
        (EXISTENTE, 'Existente'),
        (NUEVO, 'Nuevo'),
    )
    enlace_type = forms.ChoiceField(choices=ENLACE_TYPE_CHOICES,
                                    label="Tipo de enlace",
                                    widget=forms.RadioSelect,
                                    initial=EXISTENTE)
    enlace_name = forms.CharField(label="Nombre",)
    enlace_email = forms.EmailField(label="Correo", required=False)
    enlace_telefono = forms.CharField(label=u"Teléfono", required=False)

    class Meta:
        model = Sede
        exclude = [
            'modified',
            'created',
        ]

    def is_valid(self):
        if self.data['enlace_type'] == self.EXISTENTE:
            try:
                del self.errors['enlace_name']
            except KeyError:
                pass

        if self.data['enlace_type'] == self.NUEVO:
            try:
                del self.errors['enlace']
            except KeyError:
                pass

        # Si persisten los errores, de un tiro a la cabeza!
        if self.errors:
            return False
        return True

    def save(self, commit=True):
        datos = self.data
        # Primer paso crear el objeto Sede
        sede = super(FormularioSede, self).save(commit=False)

        if datos['enlace_type'] == self.NUEVO:
            enlace = Enlace(name=datos['enlace_name'],
                            email=datos['enlace_email'],
                            telefono=datos['enlace_telefono'])
            enlace.save()
            sede.enlace = enlace

        if commit:
            sede.save()

        print "Llegaste a la meta"


class FormularioEstado(ModelForm):
    formulario = forms.CharField()

    class Meta:
        model = Formulario
        fields = [
            'estado',
        ]

    @staticmethod
    def update_estado(cleaned_data):
        # print cleaned_data
        formulario = get_object_or_404(Formulario, pk=cleaned_data['formulario'])
        formulario.estado = cleaned_data['estado']
        formulario.save()


class FormularioForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super(FormularioForm, self).__init__(*args, **kwargs)
        self.fields['clave'].label = 'Clave - Formato'

    class Meta:
        model = Formulario
        fields = [
            'nivel_taller',
            'tipo_taller',
            'fecha_taller',
            'sede',
            'instructor',
            'apoyo',
            'contacto',
            'clave',
        ]

    @staticmethod
    def send_email(cleaned_data, host, url_id):
        """
        Terminado: mandar correo

        :param cleaned_data:
        :param host:
        :param url_id:
        """
        context_data = cleaned_data
        context_data['url'] = 'http://%s%s' % (host, reverse('presentacion', args=[url_id]))

        # Correo de salida
        email_from = settings.DEFAULT_FROM_EMAIL

        mail_list = {}
        # Instructor
        if cleaned_data['instructor'].email:
            mail_list[cleaned_data['instructor'].name] = cleaned_data['instructor'].email

        # Apoyo
        if cleaned_data['apoyo'].email:
            mail_list[cleaned_data['apoyo'].name] = cleaned_data['apoyo'].email

        # Contacto
        if cleaned_data['contacto'].email:
            mail_list[cleaned_data['contacto'].name] = cleaned_data['contacto'].email

        for name, email in mail_list.iteritems():
            context_data['usuario'] = name

            msg_plain = render_to_string('email/encuesta.txt', context_data)
            msg_html = render_to_string('email/encuesta.html', context_data)

            send_mail(
                'Creación de encuesta',
                msg_plain,
                email_from,
                [email],
                html_message=msg_html,
                fail_silently=False,
            )

    def clone_questionnaire(self, cleaned_data):
        """
        print "Clonando Cuestionario"
        # Obtener el valor seleccionado
        print(cleaned_data['nivel_taller'])
        # Obtener el identificador asociado
        print(cleaned_data['nivel_taller'].id)
        """
        encuesta = u"%s - %s" % (cleaned_data['nivel_taller'], cleaned_data['fecha_taller'])
        # Pasos para clonar el cuestionario
        # 1. Obtener el identificador del cuestionario de acuerdo al tipo de talle
        # 2. Clonar el cuestionario, renombrando "plantilla" con "fecha"
        # 3. Clonar el question set, renombrando "plantilla" con "fecha"
        # 4. Clonar questions, renombrando "plantilla" con "fecha"
        tipo_taller_id = cleaned_data['tipo_taller'].id
        plantilla_id = TipoTaller.objects.get(id=tipo_taller_id).plantilla.id
        questionnaire = Questionnaire.objects.get(id=plantilla_id)
        questionnaire.name = questionnaire.name.replace("plantilla", encuesta)
        print (questionnaire)
        questionsets = questionnaire.questionsets()
        questionnaire.pk = None
        questionnaire.save()

        # Clonar las secciones del cuestionario
        for questionset in questionsets:
            questions = questionset.questions()
            # print (questions)
            questionset.questionnaire = questionnaire
            questionset.pk = None
            questionset.save()

            # Clonar las preguntas del cuestionario
            for question in questions:
                choices = question.choices()
                question.questionset = questionset
                question.pk = None
                question.save()

                # Clonar las opciones del cuestionario
                for choice in choices:
                    choice.question = question
                    choice.pk = None
                    choice.save()

        # Guardar el nuevo valor de cuestionario en la encuesta
        form = Formulario.objects.get(id=self.instance.id)
        form.cuestionario = questionnaire
        form.save()

        return questionnaire.pk
