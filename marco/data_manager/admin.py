from django.contrib import admin
from models import * 

class ThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    pass


class LayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer_type', 'url')

admin.site.register(Theme, ThemeAdmin)
admin.site.register(Layer, LayerAdmin)

