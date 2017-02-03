from django.contrib import admin
from . import models

admin.site.register(models.Formulario, list_display=['tipo_taller', 'sede', 'instructor', 'created'], 
                    ordering=['tipo_taller', 'sede', ],)

admin.site.register(models.NivelTaller, list_display=['name', ])
admin.site.register(models.TipoTaller, list_display=['name', ])
admin.site.register(models.Enlace, list_display=['name', ])
admin.site.register(models.Sede, list_display=['name', 'institucion', ])
admin.site.register(models.Instructor, list_display=['name', ])
admin.site.register(models.ApoyoInstructor, list_display=['name', ])
admin.site.register(models.Contacto, list_display=['name', ])
admin.site.register(models.Responsable, list_display=['name', ])
admin.site.register(models.Unidad, list_display=['name', ])
