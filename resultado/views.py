# -*- coding: utf-8 -*-

import json

from django.views.generic import TemplateView, FormView
from django.db.models import Count
from django.shortcuts import render, redirect
from django.contrib import messages

from questionnaire.models import QuestionSet, Question, Answer

from formulario.models import Unidad, Formulario
from formulario.forms import FormularioEstado

from .forms import AnswerUnidadesForm


def get_count_answers_formulario(questionnaire_id):
    last_question_id = Question.objects.filter(questionset__questionnaire=questionnaire_id,
                                               type='choice').last().id
    answers_count = Answer.objects.filter(question_id=last_question_id).count()
    return answers_count


class ResultadoView(TemplateView):
    template_name = "resultado.html"

    @staticmethod
    def get_questionset_data(questionset_id):
        # Obtener listado de preguntas y respuestas
        # A modo de ejemplo obtengo la lista de preguntas del questionset id = 1
        questions = Question.objects.filter(questionset=questionset_id)
        # Obtener el nombre de la seccion
        question_set_name = QuestionSet.objects.get(id=questionset_id).text
        questions_id = []
        open_questions = []

        # Recorro las preguntas para obtener sus respuestas
        for q in questions:
            if q.type == 'choice':
                # Obtengo las respuestas del questionSet id = q
                answers = Answer.objects.filter(question_id=q.id).values('answer').annotate(Count('answer'))
                choices = q.choices().values('value')
                choice_exist = {}
                for choice in choices:
                    choice_exist[choice['value']] = False

                # Construir una cadena JSON con los resultados de respuestas
                data = []
                answer_total_count = 0
                for answer in answers:
                    key = json.loads(answer['answer'])[0]
                    data.append({'name': key, 'y': answer['answer__count']})
                    answer_total_count += answer['answer__count']

                    # Indicar las claves que han sido localizadas
                    choice_exist[key] = True

                q.count = answer_total_count

                # Rellenar los Choices que no fueron elegidos con 0
                for key in choice_exist:
                    if not choice_exist[key]:
                        data.append({'name': key, 'y': 0})

                # Reodenar de acuerdo a Choices originales
                # Generamos un indice de claves, de la lista con el ordenamiento esperado
                order_dict = {label: index for index, label in enumerate(choice_exist.keys())}
                # Ordenamos la lista de diccionarios, de acuerdo a el indice generado
                data.sort(key=lambda x: order_dict[x['name']])

                # Generar la cadena de respuestas en JSON
                jsonstr = json.dumps(data)
                q.jsonstr = jsonstr

                questions_id.append(q.id)
            elif q.type == 'open-textfield':
                open_answers = []
                na_oa = 0
                o_answers = Answer.objects.filter(question_id=q.id)
                for answer in o_answers:
                    pre = json.loads(answer.answer)
                    if pre:
                        clean_answer = pre[0]
                        open_answers.append(clean_answer)
                    else:
                       na_oa += 1

                total_count_oa= len(o_answers) - na_oa

                open_questions.append({'question': q.text, 'answer': open_answers, 'count': total_count_oa, 'count_na': na_oa })

        questionset_data = {
            'question_set_name': question_set_name,
            'questions': questions,
            'open_questions': open_questions
        }

        return questionset_data

    def get_context_data(self, questionnaire_id, questionset_id, **kwargs):
        context = super(ResultadoView, self).get_context_data(**kwargs)
        # Obtener id de cuestionario
        questionnaire_id = questionnaire_id
        # Obtener id de questionset
        questionset_id = questionset_id
        # Obtener listado de questionSets para el select list
        question_set = QuestionSet.objects.filter(questionnaire=questionnaire_id)

        data = []
        # Obtener todas las secciones del cuestionario si es mostrar todas
        if questionset_id == '0':
            for qset in question_set:
                print (qset)
                data.append(self.get_questionset_data(questionset_id=qset.id))
        else:
            # Presentar solo la sección solicitada
            data.append(self.get_questionset_data(questionset_id=questionset_id))

        # Agregar al contexto los valores obtenidos
        context['question_set'] = question_set
        context['data'] = data
        context['questionnaire_id'] = questionnaire_id
        context['questionset_id'] = questionset_id
        return context


class AnalisisComentariosView(TemplateView, FormView):
    template_name = "analisis_comentarios.html"
    form_class = AnswerUnidadesForm

    def get_context_data(self, **kwargs):
        context = super(AnalisisComentariosView, self).get_context_data(**kwargs)
        # Obtener id de cuestionario
        questionnaire_id = kwargs['questionnaire_id']
        # Obtener id de questionset
        questionset_id = kwargs['questionset_id']
        # Obtener listado de questionSets para el select list
        # Filtro, para seleccionar solo los que tienen preguntas abiertas
        question_set = QuestionSet.objects.filter(questionnaire=questionnaire_id,
                                                  question__type='open-textfield').distinct()
        # Obtener listado de preguntas y respuestas
        # A modo de ejemplo obtengo la lista de preguntas del questionset id = 2
        questions = Question.objects.filter(questionset=questionset_id)
        open_questions = []
        answer_unidades_estado = []

        # Recorro las preguntas para obtener sus respuestas
        for q in questions:
            if q.type == 'open-textfield':
                open_answers = []
                o_answers = Answer.objects.filter(question_id=q.id)
                na_oa = 0
                for answer in o_answers:
                    pre = json.loads(answer.answer)
                    if pre:
                        clean_answer = pre[0]
                        open_answers.append({'answer': clean_answer, 'answer_id': answer.id})
                        # TODO: Buscar Respuestas por unidad
                        answer_unidades = AnswerUnidadesForm.get_answer_unidades(answer_id=answer.id)
                        for answer_unidad in answer_unidades:
                            answer_unidades_estado.append({'answer_unidades_id': '%s_%s' % (answer_unidad.answer.id,
                                                                                            answer_unidad.unidad.id),
                                                           'answer_unidades_estado': answer_unidad.status})
                    else:
                        na_oa += 1

                total_count_oa = len(o_answers) - na_oa

                # print (answer_unidades_estado)

                open_questions.append({'question_id': q.id,
                                       'question': q.text,
                                       'answers': open_answers,
                                       'answers_estado': answer_unidades_estado,
                                       'count': total_count_oa,
                                       'count_na': na_oa})

        # Recuperar unidades
        unidades = Unidad.objects.all()

        # Agregar al contexto los valores obtenidos
        context['question_set'] = question_set
        context['open_questions'] = open_questions
        context['unidades'] = unidades
        context['questionnaire_id'] = questionnaire_id
        context['questionset_id'] = questionset_id
        return context

    def post(self, request, *args, **kwargs):
        form = self.get_form()

        # Procesar el formulario
        if form.is_valid():
            json_data = json.loads(form.cleaned_data['analisis_answer_unidades'])
            form.update_or_create(json_data)

        if form.cleaned_data['metodo'] == 'send':
            # "Generar archivos XLSX"
            resultados = form.generate_file(json_data)

            messages.add_message(request,
                                 messages.SUCCESS,
                                 'Se han enviado las notificaciones satisfactoriamente',
                                 extra_tags='terminado')

            return render(request, 'analisis_comentarios_envio.html',
                          {'status': 'Terminado',
                           'resultados': resultados})

        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


class ListadoEncuestasView(TemplateView):
    template_name = "listado_encuestas.html"

    def get_context_data(self, **kwargs):
        context = super(ListadoEncuestasView, self).get_context_data(**kwargs)

        # Obtener listado de encuestas
        formularios = Formulario.objects.all()

        for formulario in formularios:
            # Obtener primer questionset id de cada cuestionario
            first_questionset = QuestionSet.objects.filter(questionnaire=formulario.cuestionario.id)[0].id
            first_questionset_open = QuestionSet.objects.filter(questionnaire=formulario.cuestionario.id,
                                                                question__type='open-textfield').distinct()[0].id

            # Guradar ids en el queryset
            formulario.first_questionset = first_questionset
            formulario.first_questionset_open = first_questionset_open

            # Obtener conteo de encuestas recibidas
            formulario.received_count = get_count_answers_formulario(formulario.cuestionario.id)

        # Obtener datos de formulario si existe
        form = FormularioEstado(self.request.POST or None)

        # Agregar al contexto los valores obtenidos
        context['formularios'] = formularios
        context['form'] = form
        return context

    def post(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        # Recuperar el formulario
        form = context['form']
        if form.is_valid():
            # Guardar cambio de estado en la encuesta
            form.update_estado(cleaned_data=form.cleaned_data)
            # Actualizar el contexto
            context = self.get_context_data(**kwargs)
        return super(ListadoEncuestasView, self).render_to_response(context)


class PresentacionView(TemplateView):
    template_name = 'presentacion_cuestionario.html'
    
    def get_context_data(self, **kwargs):
        context = super(PresentacionView, self).get_context_data(**kwargs)

        questionnaire_id = kwargs['questionnaire_id']

        formulario = Formulario.objects.get(cuestionario__id=questionnaire_id)

        # Obtener conteo de encuestas recibidas
        formulario.received_count = get_count_answers_formulario(formulario.cuestionario.id)

        if not formulario.esta_abierta():
            messages.add_message(self.request,
                                 messages.SUCCESS,
                                 '¡La encuesta esta cerrada!',
                                 extra_tags='cerrada')

        # Agregar al contexto los valores obtenidos
        context['formulario'] = formulario
        return context


class CuestionarioView(TemplateView):
    template_name = "encuesta_cerrada.html"

    def get(self, request, questionnaire_id, *args, **kwargs):
        formulario = Formulario.objects.get(cuestionario__id=questionnaire_id)

        if formulario.esta_abierta():
            return redirect('questionnaire.run', questionnaire_id=questionnaire_id)

        return render(request, template_name=self.template_name)
