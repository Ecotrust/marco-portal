from django.db import models
#from sorl.thumbnail import ImageField

class Theme(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    thumbnail = models.URLField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def toDict(self):
        layers = [layer.id for layer in self.layer_set.filter(is_sublayer=False).exclude(layer_type='placeholder')]
        themes_dict = {
            'id': self.id,
            'name': self.name,
            'layers': layers,
            'description': self.description
        }
        return themes_dict

class Layer(models.Model):
    TYPE_CHOICES = (
        ('XYZ', 'XYZ'),
        ('WMS', 'WMS'),
        ('radio', 'radio'),
        ('Vector', 'Vector'),
        ('placeholder', 'placeholder'),
    )
    name = models.CharField(max_length=100)
    layer_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    url = models.CharField(max_length=255, blank=True, null=True)
    sublayers = models.ManyToManyField('self', blank=True, null=True)
    themes = models.ManyToManyField("Theme", blank=True, null=True)
    is_sublayer = models.BooleanField(default=False)
    legend = models.CharField(max_length=255, blank=True, null=True)
    utfurl = models.CharField(max_length=255, blank=True, null=True)
    
    #data catalog links
    description = models.TextField(blank=True, null=True)
    bookmark = models.CharField(max_length=755, blank=True, null=True)
    map_tiles = models.CharField(max_length=255, blank=True, null=True)
    kml = models.CharField(max_length=255, blank=True, null=True)
    data_download = models.CharField(max_length=255, blank=True, null=True)
    metadata = models.CharField(max_length=255, blank=True, null=True)
    fact_sheet = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.URLField(max_length=255, blank=True, null=True)
    
    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def is_parent(self):
        return self.sublayers.all().count() > 0 and not self.is_sublayer
    
    @property
    def toDict(self):
        sublayers = [
            {
                'id': layer.id,
                'name': layer.name,
                'type': layer.layer_type,
                'url': layer.url,
                'utfurl': layer.utfurl,
                'parent': self.id,
                'legend': layer.legend,
                'description': layer.description
            } 
            for layer in self.sublayers.all()
        ]
        layers_dict = {
            'id': self.id,
            'name': self.name,
            'type': self.layer_type,
            'url': self.url,
            'utfurl': self.utfurl,
            'subLayers': sublayers,
            'legend': self.legend,
            'description': self.description
        }
        return layers_dict

class DataNeed(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    contact = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.CharField(max_length=255, blank=True, null=True)
    expected_date = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return unicode('%s' % (self.name))
