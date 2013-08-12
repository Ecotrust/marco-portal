from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from views import *

urlpatterns = patterns('',
    (r'^catalog', data_catalog),
    (r'^noaa_catalog', direct_to_template, {'template': 'noaa_catalog.html'}),
    (r'^needs', data_needs),
    (r'^resources', external_resources),
    (r'^map_tile_example/([\w-]*)', map_tile_example),
    (r'^map_tile_esri_example/([\w-]*)', map_tile_esri_example),
    (r'^map_tile_leaflet_example/([\w-]*)', map_tile_leaflet_example),
    (r'^arcrest_example/([\w-]*)', arcrest_example),
    (r'^([\w-]*)', tiles_page)
)
