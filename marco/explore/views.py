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
    context = {'themes': themes_with_links, 'domain': get_domain(8000), 'domain8010': get_domain()}
    return render_to_response(template, RequestContext(request, context)) 

def data_needs(request, template='needs.html'):
    themes = Theme.objects.all().order_by('display_name')
    theme_dict = add_ordered_needs_lists(themes)
    #needs = DataNeed.objects.all().order_by('name')
    context = {'themes': themes, 'theme_dict': theme_dict, 'domain': get_domain(8000), 'domain8010': get_domain()}
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
    for theme in themes:
        context.append({'theme': theme, 'learn_link': theme.learn_link})
    return context
    
def tiles_page(request, slug=None, template='tiles_page.html'):
    layer = get_object_or_404(Layer, slug_name=slug)
    orig_url = layer.url
    arctile_url = orig_url.replace('{z}', '{level}').replace('{x}', '{col}').replace('{y}', '{row}')
    arcrest_url = orig_url.replace('/export', '')
    context = {'layer': layer, 'arctile_url': arctile_url, 'arcrest_url': arcrest_url, 'domain': get_domain(8000)}
    return render_to_response(template, RequestContext(request, context)) 

def map_tile_example(request, slug=None, template='map_tile_example.html'):
    layer = get_object_or_404(Layer, slug_name=slug)
    context = {'layer': layer}
    return render_to_response(template, RequestContext(request, context)) 

def map_tile_esri_example(request, slug=None, template='map_tile_esri_example.html'):
    layer = get_object_or_404(Layer, slug_name=slug)
    orig_url = layer.url
    arctile_url = orig_url.replace('{z}', '{level}').replace('{x}', '{col}').replace('{y}', '{row}')
    context = {'layer': layer, 'arctile_url': arctile_url}
    return render_to_response(template, RequestContext(request, context)) 

def arcrest_example(request, slug=None, template='arcrest_example.html'):
    layer = get_object_or_404(Layer, slug_name=slug)
    context = {'layer': layer}
    return render_to_response(template, RequestContext(request, context)) 

def linkify(text):
    return text.lower().replace(' ', '-')
    
