# Create your views here.
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
import settings
from data_manager.models import *

def show_planner(request, template='planner.html'):
    context = {'MEDIA_URL': settings.MEDIA_URL, 'SOCKET_URL': settings.SOCKET_URL, 'login': 'true'}
    return render_to_response(template, RequestContext(request, context)) 