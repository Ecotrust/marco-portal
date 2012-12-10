from django.http import HttpResponse
from django.shortcuts import get_object_or_404
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
def delete_scenario(request, scenario_id):
    scenario_obj = get_object_or_404(Scenario, id=scenario_id)
    
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
