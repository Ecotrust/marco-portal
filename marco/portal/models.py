from django.db import models
from madrona.features import register

from madrona.features.models import PolygonFeature, FeatureCollection

@register
class AOI(PolygonFeature):
    class Options:
        form = 'portal.forms.AOIForm'

@register
class Folder(FeatureCollection):
    class Options:
        form = 'portal.forms.FolderForm'
        valid_children = (
            'portal.models.AOI',
            'portal.models.Folder',
        )
