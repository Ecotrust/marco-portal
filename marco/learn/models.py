from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from django.template.defaultfilters import slugify
from data_manager.models import Layer
from utils import get_domain
#from sorl.thumbnail import ImageField

class Topic(models.Model):
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    #views = models.ManyToManyField("MapView", blank=True, null=True)
    layers = models.ManyToManyField(Layer, blank=True, null=True)

    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def viewsDict(self):
        views = [view.name for view in self.views.all().order_by('ordering','name')]
        topic_dict = {
            'views': views
        }
        return topic_dict
    
class MapView(models.Model):
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    topic = models.ForeignKey('Topic', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    url_hash = models.CharField(max_length=2050, blank=True, null=True)   
    ordering = models.IntegerField(null=True, blank=True)
    
    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def link_to_planner(self):
        return 'http://portal.midatlanticocean.org/planner/#' + url_hash
        
    
    