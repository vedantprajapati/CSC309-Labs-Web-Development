from django.contrib import admin
from studios.models import Studio, Amenity, StudioImage


class AmenityInline(admin.TabularInline):
    model = Amenity

class StudioImageInline(admin.TabularInline):
    model = StudioImage

class StudioAdmin(admin.ModelAdmin):
    inlines = [AmenityInline, StudioImageInline]
    list_display = ['__str__']

class AmenityAdmin(admin.ModelAdmin):
    list_display = ['__str__']

admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenity, AmenityAdmin)