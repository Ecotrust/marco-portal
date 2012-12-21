from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from madrona.features.models import Feature


class Bookmark(Feature):
    url_hash = models.CharField(max_length=2050) 
    