from django.contrib import admin
from classes.models import Class, ClassSession

class ClassAdmin(admin.ModelAdmin):
    list_display=['__str__']

class ClassSessionAdmin(admin.ModelAdmin):
    list_display=['__str__']
    
admin.site.register(Class, ClassAdmin)
admin.site.register(ClassSession, ClassSessionAdmin)

