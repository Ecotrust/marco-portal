# Create your views here.
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from data_manager.models import *
from utils import get_domain
import settings


def data_catalog(request, template='catalog.html'):
    themes = Theme.objects.all().order_by('display_name')
    themes_with_links = add_learn_links(themes)
    add_ordered_layers_lists(themes_with_links)
    context = {'themes': themes_with_links}
    return render_to_response(template, RequestContext(request, context)) 

def data_needs(request, template='needs.html'):
    themes = Theme.objects.all().order_by('display_name')
    theme_dict = add_ordered_needs_lists(themes)
    #needs = DataNeed.objects.all().order_by('name')
    context = {'themes': themes, 'theme_dict': theme_dict}
    return render_to_response(template, RequestContext(request, context)) 
    
def add_ordered_needs_lists(themes_list):
    theme_dict = {}
    for theme in themes_list:
        needs = theme.dataneed_set.all().order_by('name')
        theme_dict[theme] = needs
    return theme_dict
    
def add_ordered_layers_lists(themes_list): 
    for theme_dict in themes_list:
        layers = theme_dict['theme'].layer_set.all().exclude(layer_type='placeholder').order_by('name')
        theme_dict['layers'] = layers
    
def add_learn_links(themes):
    context = []
    domain = get_domain()
    for theme in themes:
        link = '%s/portal/learn/%s' %(domain, linkify(theme.name))
        #print link
        context.append({'theme': theme, 'learn_link': link})
    return context
    
def linkify(text):
    return text.lower().replace(' ', '-')
    
