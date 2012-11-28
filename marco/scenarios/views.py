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
def sdc_delete(request, sdc_id):
    sdc_obj = get_object_or_404(Scenario, pk=sdc_id)
    #check permissions
    viewable, response = sdc_obj.is_viewable(request.user)
    if not viewable:
        return response
    sdc_obj.delete()
    return HttpResponse("", status=200)


def get_scenarios(request):
    json = []
    scenarios = Scenario.objects.filter(user=request.user)
    for scenario in scenarios:
        json.append({
            'id': scenario.id,
            'name': scenario.name\
            })

    return HttpResponse(dumps(json))
