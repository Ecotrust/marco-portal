from django.db import models
from madrona.features import register
from madrona.features.models import PolygonFeature

@register
class AOI(PolygonFeature):
    class Options:
        verbose_name = 'Area of Interest'
        icon_url = 'marco/img/aoi.png'
        manipulators = []
        optional_manipulators = ['clipping.manipulators.ClipToShoreManipulator']
        form = 'sites.forms.AOIForm'
        show_template = 'aoi/show.html'

@register
class WindEnergySite(PolygonFeature):
    class Options:
        verbose_name = 'Wind Energy Site'
        icon_url = 'marco/img/wind.png'
        form = 'sites.forms.WindEnergySiteForm'
        show_template = 'wind/show.html'
