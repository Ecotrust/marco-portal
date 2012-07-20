from django.contrib import admin
from models import * 

class ThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    pass

class LayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer_type', 'url')

class DataNeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Theme, ThemeAdmin)
admin.site.register(Layer, LayerAdmin)
admin.site.register(DataNeed, DataNeedAdmin)

