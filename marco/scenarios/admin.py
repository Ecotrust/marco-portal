from django.contrib import admin

from django.contrib.auth.models import Permission
admin.site.register(Permission)

from models import *

class ScenarioAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'user', 'date_created', 'date_modified')
    list_filter = ['date_modified', 'date_created']
    search_fields = ('name', 'user__username', 'id')
    fields = ['name', 'description', 'user']#, 'input_objectives', 'support_file'] 
    #NOTE:  can't do 'input_parameters' because it manually specifies a 'through' model ('ScenarioParameters')
admin.site.register(Scenario, ScenarioAdmin)

class ObjectiveAdmin(admin.ModelAdmin):
    list_display = ('name', 'pk')
    fields = ['name', 'color']
admin.site.register(Objective, ObjectiveAdmin)

class ParameterAdmin(admin.ModelAdmin):
    list_display = ('name', 'ordering_id', 'shortname', 'id')
    ordering = ('ordering_id',)
    fields = ['ordering_id', 'name', 'shortname', 'objectives']
admin.site.register(Parameter, ParameterAdmin)

class SubstrateAdmin(admin.ModelAdmin):
    list_display = ('substrate_name', 'substrate_shortname', 'substrate_id')
    fields = ['substrate_id', 'substrate_name', 'substrate_shortname']
admin.site.register(Substrate, SubstrateAdmin)


