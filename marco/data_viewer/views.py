# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from models import *


def getJson(request):
    json = {
        "state": { "activeLayers": [] },
        "layers": [layer.toDict for layer in Layer.objects.filter(is_sublayer=False)],
        "themes": [theme.toDict for theme in Theme.objects.all()],
        "success": True
    }
    return HttpResponse(simplejson.dumps(json))


def create_layer(request):
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    
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
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
        
    try: 
        layer = Layer.objects.get(id=layer_id)
    except Exception, e:
        return HttpResponse("Layer object with id '%s' not found" %layer_id, status=404)

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
