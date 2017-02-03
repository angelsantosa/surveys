# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import models
from questionnaire.models import Questionnaire


# Create your models here.
class NivelTaller(models.Model):
    name = models.CharField(max_length=250)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Nivel Taller"
        verbose_name_plural = "Nivel de Talleres"


class TipoTaller(models.Model):
    name = models.CharField(max_length=250)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    plantilla = models.ForeignKey(Questionnaire)

    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Tipo Taller"
        verbose_name_plural = "Tipo de Talleres"


class Sede(models.Model):
    name = models.CharField(max_length=1000)
    institucion = models.CharField(max_length=1000)
    direccion = models.TextField()
    enlace = models.ForeignKey('Enlace')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Sede"
        verbose_name_plural = "Sedes"


class Persona(models.Model):
    name = models.CharField(max_length=1000)
    email = models.CharField(max_length=1000, blank=True, null=True)
    telefono = models.CharField(max_length=1000, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Instructor(Persona):
    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Instructor"
        verbose_name_plural = "Instructores"


class ApoyoInstructor(Persona):
    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Apoyo a Instructor"
        verbose_name_plural = "Apoyo a Instructores"


class Contacto(Persona):
    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Contacto"
        verbose_name_plural = "Contactos"


class Responsable(Persona):
    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Responsable"
        verbose_name_plural = "Responsables"


class Enlace(Persona):
    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Enlace en Sede"
        verbose_name_plural = "Enlaces en Sede"


class Formulario(models.Model):
    # Definición de opciones del estado del formulario
    ABIERTO = 'AB'
    CERRADO = 'CE'
    ESTADO_CHOICES = (
        (ABIERTO, 'Abierta'),
        (CERRADO, 'Cerrada'),
    )

    nivel_taller = models.ForeignKey(NivelTaller)
    tipo_taller = models.ForeignKey(TipoTaller)
    fecha_taller = models.DateTimeField(default=datetime.datetime.now())
    sede = models.ForeignKey(Sede)
    instructor = models.ForeignKey(Instructor)
    apoyo = models.ForeignKey(ApoyoInstructor)
    contacto = models.ForeignKey(Contacto)
    clave = models.CharField(max_length=25, null=True, blank=True)
    estado = models.CharField(max_length=2, choices=ESTADO_CHOICES, default=ABIERTO)
    cuestionario = models.ForeignKey(Questionnaire, default=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def esta_abierta(self):
        return self.estado == self.ABIERTO

    def get_reverse_action(self):
        if self.esta_abierta():
            return self.CERRADO
        return self.ABIERTO

    def __unicode__(self):
        return "%s %s %s" % (self.tipo_taller, self.sede, self.created)

    class Meta:
        verbose_name = "Encuesta"
        verbose_name_plural = "Encuestas"


class Unidad(models.Model):
    name = models.CharField(max_length=250)
    responsable = models.ForeignKey(Responsable)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "%s" % self.name

    class Meta:
        verbose_name = "Unidad"
        verbose_name_plural = "Unidades"
