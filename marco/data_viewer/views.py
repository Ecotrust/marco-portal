# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from models import *


def getJson(request):
    json = {
        "state": {
        "activeLayers": []
    },
    "layers": [layer.toDict for layer in Layer.objects.filter(is_sublayer=False)],
    "themes": [theme.toDict for theme in Theme.objects.all()],
    "success": True
    }
    return HttpResponse(simplejson.dumps(json))



def create_layer(request):
    if request.method != 'POST':
	return httpResponse('Action not permitted', status=403)
    try:
	url = request.POST['url']
	name = request.POST['name']
	themes = request.POST.getlist('themes')
	layer = Layer(
	    url = url,
	    name = name,
	    layer_type = 'XYZ'
	)
	layer.save()
	theme_list = []
	for theme_id in themes:
	    theme = Theme.objects.get(id=theme_id)
	    theme_list.append(theme)
	layer.theme = theme_list
	layer.save()
    except Exception, e:
        return HttpResponse(result + e.message, status=500)

    result = {
        "status_code":1,  
        "success":True, 
        "message":"Saved successfully",
        "layer": layer.toDict
    }              
    return HttpResponse(simplejson.dumps(result))

def update_layer(request, layer_id):
    if request.method != 'POST':
	return httpResponse('Action not permitted', status=403)
    import pdb
    pdb.set_trace()
