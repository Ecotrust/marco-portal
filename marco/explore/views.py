# Create your views here.
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from data_manager.models import *


def data_catalog(request, template='catalog.html'):
    themes = Theme.objects.all().order_by('name')
    themes_with_links = add_learn_links(themes)
    context = {'themes': themes_with_links}
    return render_to_response(template, RequestContext(request, context)) 

def data_needs(request, template='needs.html'):
    needs = DataNeed.objects.all().order_by('name')
    context = {'layers': needs}
    return render_to_response(template, RequestContext(request, context)) 
    
def add_learn_links(themes):
    context = []
    domain = get_domain()
    for theme in themes:
        link = '%s/portal/learn/%s' %(domain, linkify(theme.name))
        print link
        context.append({'theme': theme, 'learn_link': link})
    return context
    
def linkify(text):
    return text.lower().replace(' ', '-')
    
def get_domain():
    from django.contrib.sites.models import Site
    try:
        domain = Site.objects.all()[0].domain
        if 'localhost' in domain:
            domain = 'http://localhost:8010'
    except:
        domain = '..'   
    return domain