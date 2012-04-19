from django.shortcuts import render_to_response
from django.template import RequestContext
#from madrona.raster_stats.models import RasterDataset, zonal_stats
from settings import *
from general.utils import default_value, sq_meters_to_sq_miles
from models import *

'''
'''
def display_sdc_analysis(request, sdc, template='scenario/reports/sdc_report.html'):
    context = get_sdc_analysis(sdc)
    return render_to_response(template, RequestContext(request, context)) 

'''
Run the analysis, create the cache, and return the results as a context dictionary so they may be rendered with template
'''    
def get_sdc_analysis(sdc): 
    #compile context
    area = sq_meters_to_sq_miles(sdc.geometry_final_area)
    num_lease_blocks = sdc.num_lease_blocks
    context = { 'sdc': sdc, 'default_value': default_value, 'area': area, 'num_lease_blocks': num_lease_blocks }
    return context
