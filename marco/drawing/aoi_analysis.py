from django.shortcuts import render_to_response
from django.template import RequestContext
#from madrona.raster_stats.models import RasterDataset, zonal_stats
from settings import *
from general.utils import default_value, sq_meters_to_sq_miles
from models import *

'''
'''
def display_aoi_analysis(request, aoi, template='aoi/reports/aoi_report.html'):
    context = get_wind_analysis(aoi)
    return render_to_response(template, RequestContext(request, context)) 

'''
Run the analysis, create the cache, and return the results as a context dictionary so they may be rendered with template
'''    
def get_wind_analysis(aoi): 
    #compile context
    area = sq_meters_to_sq_miles(aoi.geometry_final.area)
    context = { 'aoi': aoi, 'default_value': default_value, 'area': area }
    return context
