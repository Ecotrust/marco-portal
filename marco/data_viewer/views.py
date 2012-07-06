# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
import madrona.layer_manager as layer_manager

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
