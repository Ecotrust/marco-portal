from django.db import models
from madrona.features import register

from madrona.features.models import PolygonFeature

@register
class AOI(PolygonFeature):
    class Options:
        form = 'sites.forms.AOIForm'
