from django.contrib import admin
from import_export import resources
from import_export.admin import ExportMixin
from models import * 

class ThemeAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name', 'id')
    pass

class LayerResource(resources.ModelResource):
    class Meta:
        model = Layer

class LayerAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LayerResource
    list_display = ('name', 'layer_type', 'url')
    search_fields = ['name', 'layer_type']
    ordering = ('name',)
    exclude = ('slug_name',)
    
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == 'attribute_fields':
            kwargs['queryset'] = AttributeInfo.objects.order_by('field_name')
        if db_field.name == 'sublayers':
            kwargs['queryset'] = Layer.objects.order_by('name')
        if db_field.name == 'themes':
            kwargs['queryset'] = Theme.objects.order_by('name')
        if db_field.name == 'lookup_table':
            kwargs['queryset'] = LookupInfo.objects.order_by('value')
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

