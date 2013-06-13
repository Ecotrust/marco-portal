from django.contrib import admin
from models import * 

class ThemeAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name', 'id')
    pass

class LayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer_type', 'url')
    search_fields = ['name', 'layer_type']
    ordering = ('name',)
    exclude = ('slug_name',)
    
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == 'attribute_fields':
            kwargs['queryset'] = AttributeInfo.objects.order_by('field_name')
        return super(LayerAdmin, self).formfield_for_manytomany(db_field, request, **kwargs)

class AttributeInfoAdmin(admin.ModelAdmin):
    list_display = ('field_name', 'display_name', 'precision', 'order')
    
class LookupInfoAdmin(admin.ModelAdmin):
    list_display = ('value', 'color', 'dashstyle', 'fill', 'graphic')

class DataNeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Theme, ThemeAdmin)
admin.site.register(Layer, LayerAdmin)
admin.site.register(AttributeInfo, AttributeInfoAdmin)
admin.site.register(LookupInfo, LookupInfoAdmin)
admin.site.register(DataNeed, DataNeedAdmin)

