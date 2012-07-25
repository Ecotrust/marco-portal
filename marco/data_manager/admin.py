from django.contrib import admin
from models import * 

class ThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    pass

class LayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer_type', 'url')

class AttributeInfoAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'field_name', 'order')

class DataNeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Theme, ThemeAdmin)
admin.site.register(Layer, LayerAdmin)
admin.site.register(AttributeInfo, AttributeInfoAdmin)
admin.site.register(DataNeed, DataNeedAdmin)

