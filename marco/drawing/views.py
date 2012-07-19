from django.shortcuts import get_object_or_404
from models import *

'''
'''
def aoi_analysis(request, aoi_id):
    from aoi_analysis import display_aoi_analysis
    aoi_obj = get_object_or_404(AOI, pk=aoi_id)
    #check permissions
    viewable, response = aoi_obj.is_viewable(request.user)
    if not viewable:
        return response
    return display_aoi_analysis(request, aoi_obj)
    # Create your views here.

'''
'''
def wind_analysis(request, wind_id):
    from wind_analysis import display_wind_analysis
    wind_obj = get_object_or_404(WindEnergySite, pk=wind_id)
    #check permissions
    viewable, response = wind_obj.is_viewable(request.user)
    if not viewable:
        return response
    return display_wind_analysis(request, wind_obj)
    # Create your views here.
