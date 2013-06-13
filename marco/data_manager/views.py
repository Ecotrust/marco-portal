# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.views.decorators.cache import cache_page
from models import *


#@cache_page(60 * 60 * 24, key_prefix="data_manager_get_json")
def get_json(request):
    json = {
        "state": { "activeLayers": [] },
        "layers": [layer.toDict for layer in Layer.objects.filter(is_sublayer=False).exclude(layer_type='placeholder').order_by('name')],
        "themes": [theme.toDict for theme in Theme.objects.all().order_by('display_name')],
        "success": True
    }
    return HttpResponse(simplejson.dumps(json))


def create_layer(request):
    if request.POST:
        try:
            url, name, type, themes = get_layer_components(request.POST)
            layer = Layer(
                url = url,
                name = name,
                layer_type = type
            )
            layer.save()
            
            for theme_id in themes:
                theme = Theme.objects.get(id=theme_id)
                layer.themes.add(theme)
            layer.save()
            
        except Exception, e:
            return HttpResponse(e.message, status=500)

        result = layer_result(layer, message="Saved Successfully")            
        return HttpResponse(simplejson.dumps(result))

    
def update_layer(request, layer_id):
    if request.POST:
        layer = get_object_or_404(Layer, id=layer_id)
        
        try:
            url, name, type, themes = get_layer_components(request.POST)
            layer.url = url
            layer.name = name        
            layer.save()
            
            for theme in layer.themes.all():
                layer.themes.remove(theme)
            for theme_id in themes:
                theme = Theme.objects.get(id=theme_id)
                layer.themes.add(theme)            
            layer.save()  
            
        except Exception, e:
            return HttpResponse(e.message, status=500)

        result = layer_result(layer, message="Edited Successfully")
        return HttpResponse(simplejson.dumps(result))
    
    
def get_layer_components(request_dict, url='', name='', type='XYZ', themes=[]):
    if 'url' in request_dict:
        url = request_dict['url']
    if 'name' in request_dict:
        name = request_dict['name']
    if 'type' in request_dict:
        type = request_dict['type']
    if 'themes' in request_dict:
        themes = request_dict.getlist('themes') 
    return url, name, type, themes
    
    
def layer_result(layer, status_code=1, success=True, message="Success"):
    result = {
        "status_code":status_code,  
        "success":success, 
        "message":message,
        "layer": layer.toDict,
        "themes": [theme.id for theme in layer.themes.all()]
    }
    return result
