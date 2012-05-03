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
from general.utils import miles_to_meters, feet_to_meters, meters_to_feet, mph_to_mps, mps_to_mph, format


class KMLCache(models.Model):
    key = models.CharField(max_length=150) 
    val = PickledObjectField()
    date_modified = models.DateTimeField(auto_now=True)   
    
from scenarios.kml_caching import cache_kml, remove_kml_cache #has to follow KMLCache to prevent circular imports
@register
class Scenario(Analysis):
    #Input Parameters
    #input_objectives = models.ManyToManyField("Objective")
    #input_parameters = models.ManyToManyField("Parameter")
    
    #input_parameter_dist_shore = models.BooleanField(verbose_name='Distance to Shore Parameter')
    #input_min_dist_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    #input_max_dist_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    #input_dist_shore = models.FloatField(verbose_name='Distance from Shoreline')
    #input_dist_port = models.FloatField(verbose_name='Distance to Port')
    
    input_parameter_depth = models.BooleanField(verbose_name='Depth Parameter')
    input_min_depth = models.FloatField(verbose_name='Minimum Depth', null=True, blank=True)
    input_max_depth = models.FloatField(verbose_name='Maximum Depth', null=True, blank=True)
    
    input_parameter_wind_speed = models.BooleanField(verbose_name='Wind Speed Parameter')
    input_avg_wind_speed = models.FloatField(verbose_name='Average Wind Speed', null=True, blank=True)
    
    input_parameter_distance_to_shore = models.BooleanField(verbose_name='Distance to Shore')
    input_min_distance_to_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    input_max_distance_to_shore = models.FloatField(verbose_name='Maximum Distance to Shore', null=True, blank=True)
    
    input_parameter_substrate = models.BooleanField(verbose_name='Substrate Parameter')
    input_substrate = models.ManyToManyField('Substrate', null=True, blank=True)
    
    input_parameter_sediment = models.BooleanField(verbose_name='Sediment Parameter')
    input_sediment = models.ManyToManyField('Sediment', null=True, blank=True)
    
    #Descriptors (name field is inherited from Analysis)
    description = models.TextField(null=True, blank=True)
    #support_file = models.FileField(upload_to='scenarios/files/', null=True, blank=True)
            
    #I'm finding myself wishing lease_blocks was spelled without the underscore...            
    lease_blocks = models.TextField(verbose_name='Lease Block IDs', null=True, blank=True)  
    geometry_final_area = models.FloatField(verbose_name='Total Area', null=True, blank=True)
    
    def run(self):
    
        result = LeaseBlock.objects.all()
        
        if self.input_parameter_wind_speed:
            input_wind_speed = mph_to_mps(self.input_avg_wind_speed)
            result = result.filter(min_wind_speed__gte=input_wind_speed)
        if self.input_parameter_distance_to_shore:
            result = result.filter(max_distance__gte=self.input_min_distance_to_shore, max_distance__lte=self.input_max_distance_to_shore)
        if self.input_parameter_depth:
            input_min_depth = feet_to_meters(-self.input_min_depth)
            input_max_depth = feet_to_meters(-self.input_max_depth)
            result = result.filter(min_depth__lte=input_min_depth, max_depth__gte=input_max_depth)
        if self.input_parameter_substrate:
            input_substrate = [s.substrate_name for s in self.input_substrate.all()]
            result = result.filter(majority_substrate__in=input_substrate)
        if self.input_parameter_sediment:
            input_sediment = [s.sediment_name for s in self.input_sediment.all()]
            result = result.filter(majority_sediment__in=input_sediment)
        
        self.geometry_final_area = sum([r.geometry.area for r in result.all()])
        leaseblock_ids = [r.id for r in result.all()]
        self.lease_blocks = ','.join(map(str, leaseblock_ids))
        return True        
    
    def save(self, rerun=None, *args, **kwargs):
        if rerun is None and self.pk is None:
            rerun = True
        if rerun is None and self.pk is not None: #if editing a scenario and no value for rerun is given
            rerun = False
            if not rerun:
                orig = Scenario.objects.get(pk=self.pk)
                #keeping this in here for now while I figure out why self.lease_blocks is emptied whenever the user edits their sdc
                if getattr(orig, 'name') != getattr(self, 'name'):
                    #print 'name has changed'
                    remove_kml_cache(self) 
                    rerun = True
                if not rerun:
                    for f in Scenario.input_fields():
                        # Is original value different from form value?
                        if getattr(orig, f.name) != getattr(self, f.name):
                            #print 'input_field, %s, has changed' %f.name
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
                    orig_sediments = set(getattr(self, 'input_sediment').all())                    
                    super(Scenario, self).save(rerun=False, *args, **kwargs)                    
                    new_substrates = set(getattr(self, 'input_substrate').all()) 
                    new_sediments = set(getattr(self, 'input_sediment').all())   
                    if orig_substrates != new_substrates or orig_sediments != new_sediments:
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
    def lease_blocks_set(self):
        if len(self.lease_blocks) == 0:  #empty result
            leaseblock_ids = []
        else:
            leaseblock_ids = [int(id) for id in self.lease_blocks.split(',')]
        leaseblocks = LeaseBlock.objects.filter(pk__in=leaseblock_ids)
        return leaseblocks
    
    @property
    def num_lease_blocks(self):
        return len(self.lease_blocks.split(','))
    
    @property
    def geometry_is_empty(self):
        return len(self.lease_blocks) == 0
    
    @property
    def input_substrate_names(self):
        return [substrate.substrate_name for substrate in self.input_substrate.all()]
        
    @property
    def input_sediment_names(self):
        return [sediment.sediment_name for sediment in self.input_sediment.all()]
        
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
        #from general.utils import format 
        import time

        #the following list appendation strategy was a good 10% faster than string concatenation
        #(biggest improvement however came by adding/populating a geometry_client column in leaseblock table)
        combined_kml_list = []
        if len(self.lease_blocks) == 0:  #empty result
            leaseblock_ids = []
            combined_kml_list.append('<Folder id="%s"><name>%s (EMPTY RESULT)</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name))
        else:
            leaseblock_ids = [int(id) for id in self.lease_blocks.split(',')]
            combined_kml_list.append('<Folder id="%s"><name>%s</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name))
        combined_kml_list.append('<LookAt><longitude>-73.5</longitude><latitude>39</latitude><heading>0</heading><range>600000</range></LookAt>')
        combined_kml_list.append('<styleUrl>#%s-default</styleUrl>' % (self.model_uid()))
        combined_kml_list.append('%s' % self.leaseblock_style())
        print 'Generating KML for %s Lease Blocks' % len(leaseblock_ids)
        start_time = time.time()
        leaseblocks = LeaseBlock.objects.filter(pk__in=leaseblock_ids)
        for leaseblock in leaseblocks:
            try:
                kml =   """
                    <Placemark>
                        <visibility>1</visibility>
                        <styleUrl>#%s-leaseblock</styleUrl>
                        <ExtendedData>
                            <Data name="header"><value>%s</value></Data>
                            <Data name="prot_number"><value>%s</value></Data>
                            <Data name="depth_range_output"><value>%s</value></Data>
                            <Data name="substrate"><value>%s</value></Data>
                            <Data name="sediment"><value>%s</value></Data>
                            <Data name="distance_to_shore"><value>%s</value></Data>
                            <Data name="wind_speed_output"><value>%s</value></Data>
                            <Data name="user"><value>%s</value></Data>
                            <Data name="modified"><value>%s</value></Data>
                        </ExtendedData>
                        %s
                    </Placemark>
                    """ % ( self.model_uid(), self.name, leaseblock.prot_numb,                             
                            leaseblock.depth_range_output, 
                            leaseblock.majority_substrate, #LeaseBlock Update: might change back to leaseblock.substrate
                            leaseblock.majority_sediment, format(leaseblock.max_distance,0),
                            #LeaseBlock Update: added the following two entries (min and max) to replace avg wind speed for now
                            leaseblock.wind_speed_output,
                            self.user, self.date_modified.replace(microsecond=0), 
                            #asKml(leaseblock.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
                            asKml(leaseblock.geometry_client)
                          ) 
            except: 
                #this is in place to handle (at least one - "NJ18-05_6420") instance in which null value was used in float field max_distance
                import pdb
                pdb.set_trace()
                print "The following leaseblock threw an error while generating KML:  %s" %leaseblock.prot_numb
                continue
            combined_kml_list.append(kml )
        combined_kml_list.append("</Folder>")
        combined_kml = ''.join(combined_kml_list)
        elapsed_time = time.time() - start_time
        print 'Finished generating KML (with a list) for %s Lease Blocks in %s seconds' % (len(leaseblock_ids), elapsed_time)
        
        return combined_kml
    
    def leaseblock_style(self):
        #LeaseBlock Update:  changed the following from <p>Avg Wind Speed: $[wind_speed] 
        return  """
                <Style id="%s-leaseblock">
                    <BalloonStyle>
                        <bgColor>ffeeeeee</bgColor>
                        <text> <![CDATA[
                            <font color="#1A3752">
                                SDC for Wind Energy: <strong>$[header]</strong>
                                <p>
                                <table width="250">
                                <tr><td> Lease Block Number: $[prot_number]</td></tr>
                                <tr><td> Avg Wind Speed: $[wind_speed_output]</td></tr>
                                <tr><td> Distance to Shore: $[distance_to_shore] miles</td></tr>
                                <tr><td> Depth: $[depth_range_output] </td></tr>
                                <tr><td> Majority Seabed Form: $[substrate]</td></tr>
                                <tr><td> Majority Sediment: $[sediment]</td></tr>
                                </table>
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
    prot_number = models.CharField(max_length=7, null=True, blank=True)
    prot_aprv = models.CharField(max_length=11, null=True, blank=True)
    block_number = models.CharField(max_length=6, null=True, blank=True)
    prot_numb = models.CharField(max_length=15, null=True, blank=True)
    min_depth = models.FloatField()
    max_depth = models.FloatField()
    avg_depth = models.FloatField()
    min_wind_speed = models.FloatField()
    max_wind_speed = models.FloatField()
    majority_sediment = models.CharField(max_length=35, null=True, blank=True)  #LeaseBlock Update: might change back to IntegerField 
    variety_sediment = models.IntegerField()
    majority_substrate = models.CharField(max_length=35, null=True, blank=True) #LeaseBlock Update: might change back to IntegerField 
    variety_substrate = models.IntegerField()
    min_distance = models.FloatField(null=True, blank=True)
    max_distance = models.FloatField(null=True, blank=True)
    avg_distance = models.FloatField(null=True, blank=True)
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
    def sediment(self):
        try:
            return Sediment.objects.get(sediment_name=self.majority_sediment).sediment_output
        except:
            return 'Unknown'
        
    @property
    def wind_speed_output(self):
        if self.min_wind_speed == self.max_wind_speed:
            return "%s mph" %format(mps_to_mph(self.min_wind_speed),1)
        else:
            return "%s - %s mph" %( format(mps_to_mph(self.min_wind_speed),1), format(mps_to_mph(self.max_wind_speed),1) )
     
    @property
    def depth_range_output(self):
        if self.min_depth == self.max_depth:
            return "%s feet" %format(meters_to_feet(-self.min_depth),0)
        else:
            return "%s - %s feet" %( format(meters_to_feet(-self.min_depth),0), format(meters_to_feet(-self.max_depth),0) )     
        
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
       
'''
class LeaseBlockAlt(models.Model):
    objectid = models.IntegerField()
    blkclip_field = models.FloatField()
    blkclip_id = models.FloatField()
    mms_region = models.CharField(max_length=1)
    mms_plan_a = models.CharField(max_length=3)
    prot_numbe = models.CharField(max_length=7)
    prot_aprv_field = models.CharField(max_length=11)
    block_numb = models.CharField(max_length=6)
    blk_fed_ap = models.CharField(max_length=11)
    block_lab = models.CharField(max_length=6)
    ac_lab = models.CharField(max_length=8)
    globalid = models.CharField(max_length=38)
    prot_numb = models.CharField(max_length=12)
    depthm_min = models.FloatField()
    depthm_max = models.FloatField()
    depth_mean = models.FloatField()
    bensed_var = models.IntegerField()
    bensed_maj = models.CharField(max_length=24)
    bdform_var = models.IntegerField()
    bdform_maj = models.CharField(max_length=14)
    wnd90m_min = models.FloatField()
    wind90m_ma = models.FloatField()
    mi_min = models.FloatField()
    mi_max = models.FloatField()
    mi_mean = models.FloatField()
    mi_min50 = models.FloatField()
    mi_max50 = models.FloatField()
    mi_mean50 = models.FloatField()
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Lease Block Geometry")
    objects = models.GeoManager()   
'''       
       
class Substrate(models.Model):
    substrate_id = models.IntegerField()
    substrate_name = models.CharField(max_length=35)
    substrate_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.substrate_name
     
class Sediment(models.Model):
    sediment_id = models.IntegerField()
    sediment_name = models.CharField(max_length=35)
    sediment_output = models.CharField(max_length=55)
    sediment_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.sediment_output
     