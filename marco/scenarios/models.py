import os
import time
from picklefield import PickledObjectField
from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from django.utils.html import escape
from madrona.common.utils import asKml
from madrona.features import register
from madrona.analysistools.models import Analysis
from general.utils import miles_to_meters, feet_to_meters, meters_to_feet, mph_to_mps, mps_to_mph


class KMLCache(models.Model):
    key = models.CharField(max_length=150) 
    val = PickledObjectField()
    date_modified = models.DateTimeField(auto_now=True)   
    
from scenarios.kml_caching import cache_kml, remove_kml_cache #has to follow KMLCache to prevent circular imports
@register
class Scenario(Analysis):
    #Input Parameters
    #input_objectives = models.ManyToManyField("Objective")
    input_parameters = models.ManyToManyField("Parameter")
    
    input_min_dist_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    input_max_dist_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    #input_dist_shore = models.FloatField(verbose_name='Distance from Shoreline')
    #input_dist_port = models.FloatField(verbose_name='Distance to Port')
    input_min_depth = models.FloatField(verbose_name='Minimum Depth', null=True, blank=True)
    input_max_depth = models.FloatField(verbose_name='Maximum Depth', null=True, blank=True)
    input_avg_wind_speed = models.FloatField(verbose_name='Average Wind Speed', null=True, blank=True)
    input_substrate = models.ManyToManyField('Substrate', null=True, blank=True)
    
    #Descriptors (name field is inherited from Analysis)
    description = models.TextField(null=True, blank=True)
    #support_file = models.FileField(upload_to='scenarios/files/', null=True, blank=True)
            
    lease_blocks = models.TextField(verbose_name='Lease Block IDs', null=True, blank=True)  
    
    def run(self):
        input_params = [p.id for p in self.input_parameters.all()]
        result = 0
        
        result = LeaseBlock.objects.all()
        if 2 in input_params:
            input_min_depth = feet_to_meters(-self.input_min_depth)
            input_max_depth = feet_to_meters(-self.input_max_depth)
            result = result.filter(min_depth__lte=input_min_depth, max_depth__gte=input_max_depth)
        if 3 in input_params:
            input_wind_speed = mph_to_mps(self.input_avg_wind_speed)
            result = result.filter(avg_wind_speed__gte=input_wind_speed)
        if 4 in input_params:
            input_substrate = [s.id for s in self.input_substrate.all()]
            result = result.filter(majority_substrate__in=input_substrate)
        
        leaseblock_ids = [r.id for r in result.all()]
        self.lease_blocks = ','.join(map(str, leaseblock_ids))
            
        return True        
    
    def save(self, rerun=None, *args, **kwargs):
        if rerun is None and self.pk is not None: #if editing a scenario and no value for rerun is given
            rerun = False
            if not rerun:
                orig = Scenario.objects.get(pk=self.pk)
                for f in Scenario.input_fields():
                    # Is original value different from form value?
                    if getattr(orig, f.name) != getattr(self, f.name):
                        remove_kml_cache(self)
                        rerun = True
                        break                                                                                                                   
                if not rerun:
                    '''
                        the substrates need to be grabbed, then saved, then grabbed again because 
                        both getattr calls (orig and self) return the same original list until the model has been saved 
                        (perhaps because form.save_m2m has to be called), after which calls to getattr will 
                        return the same list (regardless of whether we use orig or self)
                    '''
                    orig_substrates = set(getattr(self, 'input_substrate').all())                    
                    super(Scenario, self).save(rerun=False, *args, **kwargs)                    
                    new_substrates = set(getattr(self, 'input_substrate').all())
                    if orig_substrates != new_substrates :
                        remove_kml_cache(self) 
                        rerun = True    
            super(Scenario, self).save(rerun=rerun, *args, **kwargs)
        else: #editing a scenario and rerun is provided 
            super(Scenario, self).save(rerun=rerun, *args, **kwargs)
    
    def __unicode__(self):
        return u'%s' % self.name
        
    def support_filename(self):
        return os.path.basename(self.support_file.name)
        
    @classmethod
    def mapnik_geomfield(self):
        return "output_geom"

    @classmethod
    def mapnik_style(self):
        import mapnik
        polygon_style = mapnik.Style()
        
        ps = mapnik.PolygonSymbolizer(mapnik.Color('#ffffff'))
        ps.fill_opacity = 0.5
        
        ls = mapnik.LineSymbolizer(mapnik.Color('#555555'),0.75)
        ls.stroke_opacity = 0.5
        
        r = mapnik.Rule()
        r.symbols.append(ps)
        r.symbols.append(ls)
        polygon_style.rules.append(r)
        return polygon_style     

    @property
    def color(self):
        try:
            return Objective.objects.get(pk=self.input_objectives.values_list()[0][0]).color
        except:
            return '778B1A55'

    @property 
    def kml_working(self):
        return """
        <Placemark id="%s">
            <visibility>0</visibility>
            <name>%s (WORKING)</name>
        </Placemark>
        """ % (self.uid, escape(self.name))

    @property 
    @cache_kml
    def kml(self):  
        from general.utils import format 
        from profilehooks import profile
        import time
        '''
        combined_kml = '<Folder id="%s"><name>%s</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name)
        combined_kml += '<LookAt><longitude>-74</longitude><latitude>39</latitude><heading>0</heading><range>600000</range></LookAt>'
        combined_kml += '<styleUrl>#%s-default</styleUrl>' % (self.model_uid())
        combined_kml += '%s' % self.leaseblock_style()
        leaseblock_ids = [int(id) for id in self.lease_blocks.split(',')]
        print 'Generating KML for %s Lease Blocks' % len(leaseblock_ids)
        start_time = time.time()
        model_uid = self.model_uid()
        name = self.name
        user = self.user
        date_modified = self.date_modified.replace(microsecond=0)
        leaseblocks = LeaseBlock.objects.filter(pk__in=leaseblock_ids)
        for leaseblock in leaseblocks:
            min_depth = format(meters_to_feet(leaseblock.min_depth),0)
            kml =   """
                <Placemark>
                    <visibility>1</visibility>
                    <styleUrl>#%s-leaseblock</styleUrl>
                    <ExtendedData>
                        <Data name="header"><value>%s</value></Data>
                        <Data name="block_number"><value>%s</value></Data>
                        <Data name="min_depth"><value>%s</value></Data>
                        <Data name="max_depth"><value>%s</value></Data>
                        <Data name="substrate"><value>%s</value></Data>
                        <Data name="wind_speed"><value>%s</value></Data>
                        <Data name="user"><value>%s</value></Data>
                        <Data name="modified"><value>%s</value></Data>
                    </ExtendedData>
                    %s
                </Placemark>
                """ % ( model_uid, name, leaseblock.block_number,                             
                        min_depth, format(meters_to_feet(leaseblock.max_depth),0), 
                        leaseblock.substrate, format(mps_to_mph(leaseblock.avg_wind_speed),1),
                        user, date_modified, 
                        #asKml(leaseblock.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
                        asKml(leaseblock.geometry_client)
                      ) 
            combined_kml += kml 
        combined_kml += "</Folder>"
        elapsed_time = time.time() - start_time
        print 'Finished generating KML (with str concatenation) for %s Lease Blocks in %s seconds' % (len(leaseblock_ids), elapsed_time)
        '''
        
        combined_kml_list = []
        combined_kml_list.append('<Folder id="%s"><name>%s</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name))
        combined_kml_list.append('<LookAt><longitude>-74</longitude><latitude>39</latitude><heading>0</heading><range>600000</range></LookAt>')
        combined_kml_list.append('<styleUrl>#%s-default</styleUrl>' % (self.model_uid()))
        combined_kml_list.append('%s' % self.leaseblock_style())
        leaseblock_ids = [int(id) for id in self.lease_blocks.split(',')]
        print 'Generating KML for %s Lease Blocks' % len(leaseblock_ids)
        start_time = time.time()
        leaseblocks = LeaseBlock.objects.filter(pk__in=leaseblock_ids)
        for leaseblock in leaseblocks:
            kml =   """
                <Placemark>
                    <visibility>1</visibility>
                    <styleUrl>#%s-leaseblock</styleUrl>
                    <ExtendedData>
                        <Data name="header"><value>%s</value></Data>
                        <Data name="block_number"><value>%s</value></Data>
                        <Data name="min_depth"><value>%s</value></Data>
                        <Data name="max_depth"><value>%s</value></Data>
                        <Data name="substrate"><value>%s</value></Data>
                        <Data name="wind_speed"><value>%s</value></Data>
                        <Data name="user"><value>%s</value></Data>
                        <Data name="modified"><value>%s</value></Data>
                    </ExtendedData>
                    %s
                </Placemark>
                """ % ( self.model_uid(), self.name, leaseblock.block_number,                             
                        format(meters_to_feet(leaseblock.min_depth),0), format(meters_to_feet(leaseblock.max_depth),0), 
                        leaseblock.substrate, format(mps_to_mph(leaseblock.avg_wind_speed),1),
                        self.user, self.date_modified.replace(microsecond=0), 
                        #asKml(leaseblock.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
                        asKml(leaseblock.geometry_client)
                      ) 
            combined_kml_list.append(kml )
        combined_kml_list.append("</Folder>")
        combined_kml = ''.join(combined_kml_list)
        elapsed_time = time.time() - start_time
        print 'Finished generating KML (with a list) for %s Lease Blocks in %s seconds' % (len(leaseblock_ids), elapsed_time)
        '''
        from cStringIO import StringIO
        combined_kml_str = StringIO()
        combined_kml_str.write('<Folder id="%s"><name>%s</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name))
        combined_kml_str.write('<LookAt><longitude>-74</longitude><latitude>39</latitude><heading>0</heading><range>600000</range></LookAt>')
        combined_kml_str.write('<styleUrl>#%s-default</styleUrl>' % (self.model_uid()))
        combined_kml_str.write('%s' % self.leaseblock_style())
        leaseblock_ids = [int(id) for id in self.lease_blocks.split(',')]
        print 'Generating KML for %s Lease Blocks' % len(leaseblock_ids)
        start_time = time.time()
        leaseblocks = LeaseBlock.objects.filter(pk__in=leaseblock_ids)
        for leaseblock in leaseblocks:
            kml =   """
                <Placemark>
                    <visibility>1</visibility>
                    <styleUrl>#%s-leaseblock</styleUrl>
                    <ExtendedData>
                        <Data name="header"><value>%s</value></Data>
                        <Data name="block_number"><value>%s</value></Data>
                        <Data name="min_depth"><value>%s</value></Data>
                        <Data name="max_depth"><value>%s</value></Data>
                        <Data name="substrate"><value>%s</value></Data>
                        <Data name="wind_speed"><value>%s</value></Data>
                        <Data name="user"><value>%s</value></Data>
                        <Data name="modified"><value>%s</value></Data>
                    </ExtendedData>
                    %s
                </Placemark>
                """ % ( self.model_uid(), self.name, leaseblock.block_number,                             
                        format(meters_to_feet(leaseblock.min_depth),0), format(meters_to_feet(leaseblock.max_depth),0), 
                        leaseblock.substrate, format(mps_to_mph(leaseblock.avg_wind_speed),1),
                        self.user, self.date_modified.replace(microsecond=0), 
                        #asKml(leaseblock.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
                        asKml(leaseblock.geometry_client)
                      ) 
            combined_kml_str.write(kml )
        combined_kml_str.write("</Folder>")
        combined_kml = combined_kml_str.getvalue()
        elapsed_time = time.time() - start_time
        print 'Finished generating KML (with cStringIO) for %s Lease Blocks in %s seconds' % (len(leaseblock_ids), elapsed_time)
        '''
        return combined_kml
    
    def leaseblock_style(self):
        return  """
                <Style id="%s-leaseblock">
                    <BalloonStyle>
                        <bgColor>ffeeeeee</bgColor>
                        <text> <![CDATA[
                            <font color="#1A3752">
                                SDC for Wind Energy: <strong>$[header]</strong>
                                <p>Lease Block Number: $[block_number]</p>
                                <p>Min Depth: $[min_depth] feet</p>
                                <p>Max Depth: $[max_depth] feet</p>
                                <p>Majority Substrate: $[substrate]</p>
                                <p>Avg Wind Speed: $[wind_speed] mph</p>
                            </font>  
                            <font size=1>created by $[user] on $[modified]</font>
                        ]]> </text>
                    </BalloonStyle>
                    <PolyStyle>
                        <color>778B1A55</color>
                    </PolyStyle>
                </Style>
            """ % (self.model_uid())
        
    @property
    def kml_style(self):
        return """
        <Style id="%s-default">
            <ListStyle>
                <listItemType>checkHideChildren</listItemType>
            </ListStyle>
        </Style>
        """ % (self.model_uid())
        
    @property
    def get_input_parameters(self):
        input_params = [p.id for p in self.input_parameters.all()]
        return input_params
        
    @property
    def get_id(self):
        return self.id
    
    class Options:
        verbose_name = 'SDC for Wind Energy'
        icon_url = 'marco/img/multi.png'
        form = 'scenarios.forms.ScenarioForm'
        form_template = 'scenario/form.html'
        show_template = 'scenario/show.html'

class Objective(models.Model):
    name = models.CharField(max_length=35)
    color = models.CharField(max_length=8, default='778B1A55')
    
    def __unicode__(self):
        return u'%s' % self.name        

class Parameter(models.Model):
    ordering_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=35, null=True, blank=True)
    shortname = models.CharField(max_length=35, null=True, blank=True)
    objectives = models.ManyToManyField("Objective", null=True, blank=True)
    
    def __unicode__(self):
        return u'%s' % self.name
        
class LeaseBlock(models.Model):
    prot_number = models.CharField(max_length=7)
    prot_aprv = models.CharField(max_length=11)
    block_number = models.CharField(max_length=6)
    shape_length = models.FloatField()
    shape_area = models.FloatField()
    mybc = models.IntegerField()
    min_depth = models.FloatField()
    max_depth = models.FloatField()
    avg_wind_speed = models.FloatField()
    variety = models.IntegerField()
    majority_substrate = models.IntegerField()
    minority = models.IntegerField()
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Lease Block Geometry")
    geometry_client = models.MultiPolygonField(srid=settings.GEOMETRY_CLIENT_SRID, null=True, blank=True, verbose_name="Lease Block Client Geometry")
    objects = models.GeoManager()   

    @property
    def substrate(self):
        try:
            return Substrate.objects.get(substrate_id=self.majority_substrate).substrate_name
        except:
            return 'Unknown'
        
    @property 
    def kml_done(self):
        return """
        <Placemark id="%s">
            <visibility>1</visibility>
            <styleUrl>#%s-default</styleUrl>
            %s
        </Placemark>
        """ % ( self.uid, self.model_uid(),
                asKml(self.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
              )        
        
class Substrate(models.Model):
    substrate_id = models.IntegerField()
    substrate_name = models.CharField(max_length=35)
    substrate_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.substrate_name
     