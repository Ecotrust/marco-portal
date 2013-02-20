from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from madrona.features import register
from madrona.features.models import Feature


@register
class Bookmark(Feature):
    url_hash = models.CharField(max_length=2050) 
    
    class Options:
        verbose_name = 'MARCO Bookmark'
        form = 'visualize.forms.BookmarkForm'