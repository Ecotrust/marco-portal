# Create your views here.
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from viewer.models import *


def data_catalog(request, template='catalog.html'):
    themes = Theme.objects.all()
    context = {'themes': themes}
    return render_to_response(template, RequestContext(request, context)) 

def data_needs(request):
    pass