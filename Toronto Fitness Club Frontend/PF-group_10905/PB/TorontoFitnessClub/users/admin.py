from django.contrib import admin
from users.models import Coach

class CoachAdmin(admin.ModelAdmin):
    list_display = ['__str__']

admin.site.register(Coach, CoachAdmin)