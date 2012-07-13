# Create your views here.
from django.shortcuts import get_object_or_404, render_to_response
from data_viewer.models import *


def data_catalog(request, template='catalog.html'):
    if request.POST:
        themes = Theme.objects.all()
        layers = Layer.objects.all()
        context = {'themes': themes, 'layers': layers}
        return render_to_response(template, RequestContext(request, context)) 

