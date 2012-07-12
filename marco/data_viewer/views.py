# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
import madrona.layer_manager as layer_manager
from django.utils import simplejson
from models import *

def test(request):

    json =  layer_manager.views.test(0).content
    #import pdb
    #pdb.set_trace()
    #json = 'hi'
    params = {
        'layers': json
    }
    #return render_to_response('../media/marco-proto/layers.html', RequestContext(request, params))
    return HttpResponseRedirect('/media/marco-proto/index.html')

def create_layer(request):
    if request.method != 'POST':
	return httpResponse('Action not permitted', status=403)
    try:
	url = request.POST['url']
	name = request.POST['name']
	themes = request.POST.getlist('themes')
	layer = layer_manager.models.Layer(
	    url = url,
	    name = name,
	    layer_type = 'XYZ'
	)
	layer.save()
	theme_list = []
	for theme_id in themes:
	    theme = layer_manager.models.Theme.objects.get(id=theme_id)
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
