# -*- coding: utf-8 -*-

import os
import json
import xlsxwriter

from tempfile import NamedTemporaryFile

from django import forms
from django.forms import Form
from django.conf import settings
from django.core import mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from questionnaire.models import Answer, Question, QuestionSet

from .models import AnalisisComentario, Unidad
from formulario.models import Formulario


class AnswerUnidadesForm(Form):
    """
    Datos de formulario para procesar comentarios de unidades
    """
    analisis_answer_unidades = forms.CharField(widget=forms.Textarea)
    metodo = forms.CharField()

    @staticmethod
    def get_answer_unidades(answer_id):
        answer_object = Answer.objects.get(id=answer_id)
        return AnalisisComentario.objects.filter(answer=answer_object)

    @staticmethod
    def update_or_create(json_data):
        for data in json_data:
            # question_id = data['question_id']
            
            for answer in data['answer']:
                answer_id = answer['answer_id']
                
                for estado in answer['estados']:
                    unidad_id = estado['unidad_id']
                    has_estado = estado['estado']
                    
                    # Obtener las instancias existentes de respuestas y unidades
                    answer_object = Answer.objects.get(id=answer_id)
                    unidad_object = Unidad.objects.get(id=unidad_id)
                    
                    # Actualizar o crear las relaciones en la base de datos
                    analisis, created = AnalisisComentario.objects.get_or_create(answer=answer_object,
                                                                                 unidad=unidad_object,
                                                                                 defaults={'status':has_estado})

                    if not created:  # update
                        analisis.status = has_estado
                        analisis.save()

    def generate_file(self, json_data):
        resultados = []
        columns = {}
        for data in json_data:
            question_id = data['question_id']
            questionnaire = Question.objects.get(id=question_id).questionnaire()

            # Obtener listado de questionSets para el select list
            # Filtro, para seleccionar solo los que tienen preguntas abiertas
            question_set = QuestionSet.objects.filter(questionnaire=questionnaire,
                                                      question__type='open-textfield').distinct()

            # Listado de unidades disponibles
            unidades = Unidad.objects.all()

            # Obtener datos de la encuesta
            encuesta = Formulario.objects.get(cuestionario=questionnaire)

            # Generar los correos electrónicos para envío masivo
            emails = list()

            # Obtener resultados por unidades
            for unidad in unidades:
                destination = None
                email = None

                tipo_taller = encuesta.tipo_taller.name
                fecha_taller = encuesta.fecha_taller
                sede = encuesta.sede.name

                resultados.append(unidad.name)
                if unidad.name in ("Instructor", "Apoyo"):
                    if unidad.name == "Instructor":
                        destination = encuesta.instructor.name
                        email = encuesta.instructor.email
                    elif unidad.name == "Apoyo":
                        destination = encuesta.apoyo.name
                        email = encuesta.apoyo.email
                else:
                    destination = unidad.responsable.name
                    email = unidad.responsable.email

                if not email:
                    # print "No puede enviarse correo a: %s %s" % (unidad.name, destination)
                    continue

                # Obtener las secciones del cuestionario
                for qset in question_set:
                    resultados.append("")
                    resultados.append(qset.text)

                    question = Question.objects.filter(questionset=qset, type='open-textfield')

                    for q in question:
                        resultados.append("")
                        resultados.append(q.text)

                        columns[q.text] = []

                        answer = AnalisisComentario.objects.filter(answer__question=q, unidad=unidad, status=True)

                        if answer:
                            for a in answer:
                                resultados.append("")
                                resultados.append(json.loads(a.answer.answer)[0])

                                columns[q.text].append(json.loads(a.answer.answer)[0])
                        else:
                            resultados.append("")
                            resultados.append("No hay respuestas")

                            columns[q.text].append("No hay respuestas")

                # Generar archivo documento respuestas
                filename = self.create_xlsx(content=columns)
                context_data = {'usuario': destination,
                                'email': email,
                                'unidad': unidad.name,
                                'filename': filename,
                                'tipo_taller': tipo_taller,
                                'fecha_taller': fecha_taller,
                                'sede': sede}
                emails.append(self.prepare_email(context_data))

            # Realizar el envío masivo de los correos generados
            self.send_bulk_email(emails)

        return resultados

    @staticmethod
    def create_xlsx(content):
        # Create a workbook and add a worksheet.
        extension = '.xlsx'
        # Borrar al envíar el correo electrónico
        with NamedTemporaryFile(suffix=extension, delete=False) as filename:
            workbook = xlsxwriter.Workbook(filename)
            worksheet = workbook.add_worksheet(u'Evaluación')
            worksheet.set_column(0, 10, 20)

            # Add a bold format to use wrap the cell text.
            bold_wrap = workbook.add_format({'bold': True, 'text_wrap': True})

            # Start from the first cell. Rows and columns are zero indexed.
            row = 0
            col = 0

            # Write some wrapped text.
            for question, answers in content.iteritems():
                worksheet.write(row, col, question, bold_wrap)

                for answer in answers:
                    row += 1
                    worksheet.write(row, col, answer)

                row = 0
                col += 1

            workbook.close()

            return filename.name

    @staticmethod
    def prepare_email(context_data):
        # Correo de salida
        email_from = settings.DEFAULT_FROM_EMAIL

        msg_plain = render_to_string('email/analisis_comenatios.txt', context_data)
        msg_html = render_to_string('email/analisis_comenatios.html', context_data)

        email = EmailMultiAlternatives(
                    subject=u'Análisis de comentarios %s' % context_data['unidad'],
                    body=msg_plain,
                    from_email=email_from,
                    to=[context_data['email']],
                )
        email.attach_alternative(msg_html, "text/html")

        # Open XLSX file
        attachment = open(context_data['filename'], 'rb')
        email.attach(filename='analisis_comentario.xlsx',
                     content=attachment.read(),
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        attachment.close()

        if os.path.isfile(attachment.name):
            os.remove(attachment.name)

        return email

    @staticmethod
    def send_bulk_email(emails):
        if not emails:
            pass

        connection = mail.get_connection()

        # Manually open the connection
        connection.open()

        # Send the emails in a single call
        connection.send_messages(emails)

        # The connection was already open so send_messages() doesn't close it.
        # We need to manually close the connection.
        connection.close()
