from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from madrona.features.models import Feature
from madrona.features import get_feature_by_uid
from models import *
from simplejson import dumps


'''
'''
def get_drawings(request):
    json = []
    
    drawings = AOI.objects.filter(user=request.user).order_by('date_created')
    for drawing in drawings:
        sharing_groups = [group.name for group in drawing.sharing_groups.all()]
        json.append({
            'id': drawing.id,
            'uid': drawing.uid,
            'name': drawing.name,
            'description': drawing.description,
            'attributes': drawing.serialize_attributes,
            'sharing_groups': sharing_groups
        })
        
    shared_drawings = AOI.objects.shared_with_user(request.user)
    for drawing in shared_drawings:
        if drawing.active and drawing not in drawings:
            username = drawing.user.username
            actual_name = drawing.user.first_name + ' ' + drawing.user.last_name
            json.append({
                'id': drawing.id,
                'uid': drawing.uid,
                'name': drawing.name,
                'description': drawing.description,
                'attributes': drawing.serialize_attributes,
                'shared': True,
                'shared_by_username': username,
                'shared_by_name': actual_name
            })
        
    return HttpResponse(dumps(json))

'''
'''
def delete_drawing(request, uid):
    try:
        drawing_obj = get_feature_by_uid(uid)
    except Feature.DoesNotExist:
        raise Http404
    
    #check permissions
    viewable, response = drawing_obj.is_viewable(request.user)
    if not viewable:
        return response
        
    drawing_obj.delete()
    
    return HttpResponse("", status=200)

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
