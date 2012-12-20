from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from madrona.features.models import Feature


class Bookmark(Feature):
    name = models.CharField(max_length=150) 
    state = models.CharField(max_length=2050) 
    