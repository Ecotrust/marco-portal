from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from madrona.features import get_feature_by_uid
from general.utils import meters_to_feet
from models import *
from simplejson import dumps


'''
'''
def sdc_analysis(request, sdc_id):
    from sdc_analysis import display_sdc_analysis
    sdc_obj = get_object_or_404(Scenario, pk=sdc_id)
    #check permissions
    viewable, response = sdc_obj.is_viewable(request.user)
    if not viewable:
        return response
    return display_sdc_analysis(request, sdc_obj)
    
'''
'''
def delete_scenario(request, uid):
    try:
        scenario_obj = get_feature_by_uid(uid)
    except Scenario.DoesNotExist:
        raise Http404
    
    #check permissions
    viewable, response = scenario_obj.is_viewable(request.user)
    if not viewable:
        return response
        
    scenario_obj.active = False
    scenario_obj.save(rerun=False)
    
    return HttpResponse("", status=200)

def get_scenarios(request):
    json = []
    scenarios = Scenario.objects.filter(user=request.user, active=True).order_by('date_created')
    for scenario in scenarios:
        json.append({
            'id': scenario.id,
            'uid': scenario.uid,
            'name': scenario.name,
            'attributes': scenario.serialize_attributes
        })

    return HttpResponse(dumps(json))

def get_attributes(request, uid):
    try:
        scenario_obj = get_feature_by_uid(uid)
    except Scenario.DoesNotExist:
        raise Http404
    
    #check permissions
    viewable, response = scenario_obj.is_viewable(request.user)
    if not viewable:
        return response
    
    return HttpResponse(dumps(scenario_obj.serialize_attributes))
    
def get_leaseblocks(request):
    json = []
    leaseblocks = LeaseBlock.objects.filter(avg_depth__lt=0.0)
    for ocs_block in leaseblocks:
        json.append({
            'id': ocs_block.id,
            'ais_density': ocs_block.ais_density,
            'ais_min_density': ocs_block.ais_min_density,
            'ais_max_density': ocs_block.ais_max_density,
            'ais_mean_density': ocs_block.ais_mean_density,
            'min_distance': ocs_block.min_distance,
            'max_distance': ocs_block.max_distance,
            'avg_distance': ocs_block.avg_distance,
            'awc_min_distance': ocs_block.awc_min_distance,
            'awc_max_distance': ocs_block.awc_max_distance,
            'awc_avg_distance': ocs_block.awc_avg_distance,
            'avg_depth': meters_to_feet(-ocs_block.avg_depth, 1),
            'min_depth': meters_to_feet(-ocs_block.min_depth, 1),
            'max_depth': meters_to_feet(-ocs_block.max_depth, 1),
            'min_wind_speed': ocs_block.min_wind_speed_rev,
            'max_wind_speed': ocs_block.max_wind_speed_rev,
            'tsz_min_distance': ocs_block.tsz_min_distance,
            'tsz_max_distance': ocs_block.tsz_max_distance,
            'tsz_mean_distance': ocs_block.tsz_mean_distance,
            'wea_name': ocs_block.wea_name,
            'wea_number': ocs_block.wea_number,
            'wea_state_name': ocs_block.wea_state_name            
        })

    return HttpResponse(dumps(json))
