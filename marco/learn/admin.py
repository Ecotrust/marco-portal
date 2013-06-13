from django.contrib import admin
from models import * 

class TopicAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name')
    search_fields = ['display_name', 'name']
    ordering = ('display_name',)

class MapViewAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'topic', 'ordering', 'name', 'url_hash')
    search_fields = ['display_name', 'name', 'topic']
    ordering = ('topic', 'ordering', 'display_name')

admin.site.register(Topic, TopicAdmin)
admin.site.register(MapView, MapViewAdmin)