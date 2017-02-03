from django.db import models

from questionnaire.models import Answer

from formulario.models import Unidad


# Create your models here.
class AnalisisComentario(models.Model):
    status = models.BooleanField(default=True)
    answer = models.ForeignKey(Answer)
    unidad = models.ForeignKey(Unidad)

    def __unicode__(self):
        return u'%s %s %s %s' % (self.answer.question, self.unidad, self.answer.answer, self.status)

    class Meta:
        unique_together = (("answer", "unidad"),)
