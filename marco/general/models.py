from django.db import models
from madrona.features import register

from madrona.features.models import FeatureCollection

@register
class Folder(FeatureCollection):
    class Options:
        form = 'general.forms.FolderForm'
        valid_children = (
            'sites.models.AOI',
            'general.models.Folder',
        )
