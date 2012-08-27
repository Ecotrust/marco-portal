from django.db import models
from utils import get_domain
#from sorl.thumbnail import ImageField

class Theme(models.Model):
    display_name = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    header_image = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    thumbnail = models.URLField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def learn_link(self):
        if self.name in ['security', 'fishing', 'maritime-industries', 'energy']:
            domain = get_domain()
            return '%s/portal/learn/%s' %(domain, self.name)
        return None
        
    @property
    def toDict(self):
        layers = [layer.id for layer in self.layer_set.filter(is_sublayer=False).exclude(layer_type='placeholder')]
        themes_dict = {
            'id': self.id,
            'display_name': self.display_name,
            'learn_link': self.learn_link,
            'layers': layers,
            'description': self.description
        }
        return themes_dict

class Layer(models.Model):
    TYPE_CHOICES = (
        ('XYZ', 'XYZ'),
        ('WMS', 'WMS'),
        ('ArcRest', 'ArcRest'),
        ('radio', 'radio'),
        ('Vector', 'Vector'),
        ('placeholder', 'placeholder'),
    )
    name = models.CharField(max_length=100)
    layer_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    url = models.CharField(max_length=255, blank=True, null=True)
    arcgis_layers = models.CharField(max_length=255, blank=True, null=True)
    sublayers = models.ManyToManyField('self', blank=True, null=True)
    themes = models.ManyToManyField("Theme", blank=True, null=True)
    is_sublayer = models.BooleanField(default=False)
    legend = models.CharField(max_length=255, blank=True, null=True)
    legend_title = models.CharField(max_length=255, blank=True, null=True)
    utfurl = models.CharField(max_length=255, blank=True, null=True)
    
    #tooltip
    description = models.TextField(blank=True, null=True)
    
    #data description (updated fact sheet) page -- MIGHT REMOVE THESE -- USING WORDPRESS DB INSTEAD
    data_overview = models.TextField(blank=True, null=True)
    data_status = models.CharField(max_length=255, blank=True, null=True)
    data_source = models.CharField(max_length=255, blank=True, null=True)
    data_notes = models.TextField(blank=True, null=True)
    
    #data catalog links    
    bookmark = models.CharField(max_length=755, blank=True, null=True)
    map_tiles = models.CharField(max_length=255, blank=True, null=True)
    kml = models.CharField(max_length=255, blank=True, null=True)
    data_download = models.CharField(max_length=255, blank=True, null=True)
    metadata = models.CharField(max_length=255, blank=True, null=True)
    fact_sheet = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.URLField(max_length=255, blank=True, null=True)
    
    #geojson javascript attribution
    EVENT_CHOICES = (
        ('click', 'click'),
        ('mouseover', 'mouseover')
    )
    attribute_title = models.CharField(max_length=255, blank=True, null=True)
    attribute_fields = models.ManyToManyField('AttributeInfo', blank=True, null=True)
    attribute_event = models.CharField(max_length=35, choices=EVENT_CHOICES, default='click')
    lookup_field = models.CharField(max_length=255, blank=True, null=True)
    lookup_table = models.ManyToManyField('LookupInfo', blank=True, null=True)
    vector_color = models.CharField(max_length=7, blank=True, null=True)
    vector_fill = models.FloatField(blank=True, null=True)
    
    def __unicode__(self):
        return unicode('%s' % (self.name))

    @property
    def is_parent(self):
        return self.sublayers.all().count() > 0 and not self.is_sublayer
    
    @property
    def parent(self):
        if self.is_sublayer:
            return self.sublayers.all()[0]
        return self
    
    @property
    def learn_link(self):
        theme = self.themes.all()[0]
        return theme.learn_link
        
    @property
    def tooltip(self):
        if self.description and self.description.strip() != '':
            return self.description
        elif self.parent.description and self.parent.description.strip() != '':
            return self.parent.description
        else:
            return None
            
    @property
    def serialize_attributes(self):
        return {'title': self.attribute_title, 
                'event': self.attribute_event,
                'attributes': [{'display': attr.display_name, 'field': attr.field_name} for attr in self.attribute_fields.all().order_by('order')]}
    
    @property
    def serialize_lookups(self):
        return {'field': self.lookup_field, 
                'pairs': [{'value': lookup.value, 'color': lookup.color} for lookup in self.lookup_table.all()]}
    
    @property
    def toDict(self):
        sublayers = [
            {
                'id': layer.id,
                'name': layer.name,
                'type': layer.layer_type,
                'url': layer.url,
                'arcgis_layers': layer.arcgis_layers,
                'utfurl': layer.utfurl,
                'parent': self.id,
                'legend': layer.legend,
                'legend_title': layer.legend_title,
                'description': layer.description,
                'learn_link': layer.learn_link,
                'attributes': self.serialize_attributes,
                'lookups': self.serialize_lookups,
                'color': self.vector_color,
                'fill_opacity': self.vector_fill
            } 
            for layer in self.sublayers.all()
        ]
        layers_dict = {
            'id': self.id,
            'name': self.name,
            'type': self.layer_type,
            'url': self.url,
            'arcgis_layers': self.arcgis_layers,
            'utfurl': self.utfurl,
            'subLayers': sublayers,
            'legend': self.legend,
            'legend_title': self.legend_title,
            'description': self.description,
            'learn_link': self.learn_link,
            'attributes': self.serialize_attributes,
            'lookups': self.serialize_lookups,
            'color': self.vector_color,
            'fill_opacity': self.vector_fill
        }
        return layers_dict

class AttributeInfo(models.Model):
    display_name = models.CharField(max_length=255, blank=True, null=True)
    field_name = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(default=1)
    
    def __unicode__(self):
        return unicode('%s' % (self.field_name)) 
    
class LookupInfo(models.Model):
    value = models.CharField(max_length=255, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    
    def __unicode__(self):
        return unicode('%s' % (self.value)) 
    
        
class DataNeed(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    contact = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.CharField(max_length=255, blank=True, null=True)
    expected_date = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    themes = models.ManyToManyField("Theme", blank=True, null=True)

    @property
    def html_name(self):
        return self.name.lower().replace(' ', '-')
    
    def __unicode__(self):
        return unicode('%s' % (self.name))
