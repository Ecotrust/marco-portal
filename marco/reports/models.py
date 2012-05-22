from django.db import models
from django.contrib.gis.db import models
from django.conf import settings
from drawing.models import AOI, WindEnergySite
from scenarios.models import Scenario

#  REPORTS DATA

#   Administrative 

class WindEnergyArea(models.Model):
    state = models.CharField(max_length=50)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Wind Energy Area")
    objects = models.GeoManager()
    
class OCSBlock(models.Model):
    prot_num = models.CharField(max_length=7)
    block_num = models.CharField(max_length=6)
    globalid = models.CharField(max_length=38)
    prot_block_num = models.CharField(max_length=12)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="OCS LeaseBlock")
    objects = models.GeoManager()

#   Biological 

class ArtificialReef(models.Model):
    name = models.CharField(max_length=25)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Artificial Reef")
    objects = models.GeoManager()
    
class WaterbirdSurvey(models.Model):
    effort_km = models.FloatField()
    records = models.IntegerField()
    animals = models.IntegerField()
    density_km2 = models.FloatField()
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Waterbird Survey")
    objects = models.GeoManager()


#   Geophysical

class Bathymetry(models.Model):
    gridcode = models.IntegerField()
    depth = models.CharField(max_length=15)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Bathymetry")
    objects = models.GeoManager()    
    
class BenthicSediment(models.Model):
    gridcode = models.IntegerField()
    sediment = models.CharField(max_length=254)
    grpsed = models.CharField(max_length=16)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Benthic Sediment")
    objects = models.GeoManager()   

class CoastalSLR(models.Model):
    cvivalue = models.FloatField()
    cvirisk = models.IntegerField()
    tide = models.CharField(max_length=16)
    waves = models.CharField(max_length=16)
    erosion = models.CharField(max_length=16)
    sealevel = models.CharField(max_length=16)
    geomorphology = models.CharField(max_length=16)
    slope = models.CharField(max_length=16)
    cvi = models.CharField(max_length=16)
    geometry = models.MultiLineStringField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Coastal Sea Level Rise Risk Assessment")
    objects = models.GeoManager()
    
class SeabedForm(models.Model):
    objectid = models.IntegerField()
    gridcode = models.IntegerField()
    seabedform = models.CharField(max_length=50)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Seabed Form")
    objects = models.GeoManager()
    
class WindSpeed(models.Model):
    speed = models.FloatField()
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Wind Speed 90m")
    objects = models.GeoManager()

#   Human Use

class AWCHub(models.Model):
    block_number = models.CharField(max_length=6)
    prot_number = models.CharField(max_length=7)
    state = models.CharField(max_length=50)
    x_dd = models.FloatField()
    y_dd = models.FloatField()
    pnt_id = models.IntegerField()
    geometry = models.PointField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="AWC Hub")
    objects = models.GeoManager()
    
class TrafficSeparationZone(models.Model):
    sordat = models.CharField(max_length=254)
    sorind = models.CharField(max_length=254)
    dsnm = models.CharField(max_length=12)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Traffic Separation Zone")
    objects = models.GeoManager()
