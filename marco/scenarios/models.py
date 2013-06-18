import os
import time
import json
from picklefield import PickledObjectField
from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from django.utils.html import escape
from madrona.common.utils import asKml
from madrona.common.jsonutils import get_properties_json, get_feature_json
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
    
    #GeoPhysical
    
    input_parameter_depth = models.BooleanField(verbose_name='Depth Parameter')
    input_min_depth = models.FloatField(verbose_name='Minimum Depth', null=True, blank=True)
    input_max_depth = models.FloatField(verbose_name='Maximum Depth', null=True, blank=True)
    
    input_parameter_distance_to_shore = models.BooleanField(verbose_name='Distance to Shore')
    input_min_distance_to_shore = models.FloatField(verbose_name='Minimum Distance to Shore', null=True, blank=True)
    input_max_distance_to_shore = models.FloatField(verbose_name='Maximum Distance to Shore', null=True, blank=True)
    
    input_parameter_substrate = models.BooleanField(verbose_name='Substrate Parameter')
    input_substrate = models.ManyToManyField('Substrate', null=True, blank=True)
    
    input_parameter_sediment = models.BooleanField(verbose_name='Sediment Parameter')
    input_sediment = models.ManyToManyField('Sediment', null=True, blank=True)
    
    #Wind Energy 
    
    input_parameter_wind_speed = models.BooleanField(verbose_name='Wind Speed Parameter')
    input_avg_wind_speed = models.FloatField(verbose_name='Average Wind Speed', null=True, blank=True)
    
    input_parameter_distance_to_awc = models.BooleanField(verbose_name='Distance to AWC Station')
    input_distance_to_awc = models.FloatField(verbose_name='Maximum Distance to AWC Station', null=True, blank=True)
    
    input_parameter_distance_to_substation = models.BooleanField(verbose_name='Distance to Coastal Substation')
    input_distance_to_substation = models.FloatField(verbose_name='Maximum Distance to Coastal Substation', null=True, blank=True)
    
    input_parameter_wea = models.BooleanField(verbose_name='WEA Parameter')
    input_wea = models.ManyToManyField('WEA', null=True, blank=True)
    
    #Shipping
    
    input_filter_ais_density = models.BooleanField(verbose_name='Excluding Areas with AIS Density >= 1')
    #input_ais_density = models.FloatField(verbose_name='Mean AIS Density', null=True, blank=True)    
    
    input_filter_distance_to_shipping = models.BooleanField(verbose_name='Distance to Shipping Lanes (Traffic Separation Zones)')
    input_distance_to_shipping = models.FloatField(verbose_name='Minimum Distance to Shipping Lanes (Traffic Separation Zones)', null=True, blank=True)
    
    #Security
    
    input_filter_uxo = models.BooleanField(verbose_name='Excluding Areas with UXO')
    
    #Descriptors (name field is inherited from Analysis)
    
    description = models.TextField(null=True, blank=True)
    satisfied = models.BooleanField(default=True)
    #support_file = models.FileField(upload_to='scenarios/files/', null=True, blank=True)
    active = models.BooleanField(default=True)
            
    #I'm finding myself wishing lease_blocks was spelled without the underscore...            
    lease_blocks = models.TextField(verbose_name='Lease Block IDs', null=True, blank=True)  
    geometry_final_area = models.FloatField(verbose_name='Total Area', null=True, blank=True)
    geometry_dissolved = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Scenario result dissolved")
                
    @property
    def serialize_attributes(self):
        from general.utils import format
        attributes = []
        if self.input_parameter_wind_speed:
            wind_speed = '%s m/s' %format(self.input_avg_wind_speed, 1)
            attributes.append({'title': 'Minimum Average Wind Speed', 'data': wind_speed})
        if self.input_parameter_distance_to_shore:
            distance_to_shore = '%s - %s miles' %(format(self.input_min_distance_to_shore, 0), format(self.input_max_distance_to_shore, 0))
            attributes.append({'title': 'Distance to Shore', 'data': distance_to_shore})
        if self.input_parameter_depth:
            depth_range = '%s - %s meters' %(format(self.input_min_depth, 0), format(self.input_max_depth, 0))
            attributes.append({'title': 'Depth Range', 'data': depth_range})
        if self.input_parameter_distance_to_awc:
            distance_to_awc = '%s miles' %format(self.input_distance_to_awc, 0)
            attributes.append({'title': 'Max Distance to Proposed AWC Hub', 'data': distance_to_awc})
        if self.input_parameter_distance_to_substation:
            distance_to_substation = '%s miles' %format(self.input_distance_to_substation, 0)
            attributes.append({'title': 'Max Distance to Coastal Substation', 'data': distance_to_substation})
        if self.input_filter_distance_to_shipping:
            miles_to_shipping = format(self.input_distance_to_shipping, 0)
            if miles_to_shipping == 1:
                distance_to_shipping = '%s mile' %miles_to_shipping
            else:
                distance_to_shipping = '%s miles' %miles_to_shipping
            attributes.append({'title': 'Minimum Distance to Shipping Lanes', 'data': distance_to_shipping})
        if self.input_filter_ais_density:
            attributes.append({'title': 'Excluding Areas with High Ship Traffic', 'data': ''})
        if self.input_filter_uxo:
            attributes.append({'title': 'Excluding Areas with Unexploded Ordnances', 'data': ''})
        attributes.append({'title': 'Number of Leaseblocks', 'data': self.lease_blocks.count(',')+1})
        return { 'event': 'click', 'attributes': attributes }
    
    
    def geojson(self, srid):
        props = get_properties_json(self)
        props['absolute_url'] = self.get_absolute_url()
        json_geom = self.geometry_dissolved.transform(srid, clone=True).json
        return get_feature_json(json_geom, json.dumps(props))
    
    def run(self):
    
        result = LeaseBlock.objects.all()
        
        #import pdb
        #pdb.set_trace()
        #GeoPhysical
        if self.input_parameter_distance_to_shore:
            #why isn't this max_distance >= input.min_distance && min_distance <= input.max_distance ???
            result = result.filter(avg_distance__gte=self.input_min_distance_to_shore, avg_distance__lte=self.input_max_distance_to_shore)
        if self.input_parameter_depth:
            #note:  converting input to negative values and converted to meters (to match db)
            input_min_depth = -self.input_min_depth
            input_max_depth = -self.input_max_depth
            #result = result.filter(min_depth__lte=input_min_depth, max_depth__gte=input_max_depth)
            result = result.filter(avg_depth__lte=input_min_depth, avg_depth__gte=input_max_depth)
            result = result.filter(avg_depth__lt=0) #not sure this is doing anything, but do want to ensure 'no data' values are not included
        '''
        if self.input_parameter_substrate:
            input_substrate = [s.substrate_name for s in self.input_substrate.all()]
            result = result.filter(majority_seabed__in=input_substrate)
        if self.input_parameter_sediment:
            input_sediment = [s.sediment_name for s in self.input_sediment.all()]
            result = result.filter(majority_sediment__in=input_sediment)
        '''
        #Wind Energy
        if self.input_parameter_wind_speed:
            #input_wind_speed = mph_to_mps(self.input_avg_wind_speed)
            result = result.filter(min_wind_speed_rev__gte=self.input_avg_wind_speed)
        if self.input_parameter_wea:
            input_wea = [wea.wea_id for wea in self.input_wea.all()]
            result = result.filter(wea_number__in=input_wea)
        if self.input_parameter_distance_to_awc:
            result = result.filter(awc_min_distance__lte=self.input_distance_to_awc)
        if self.input_parameter_distance_to_substation:
            result = result.filter(substation_min_distance__lte=self.input_distance_to_substation)
        #Shipping
        if self.input_filter_ais_density:
            result = result.filter(ais_mean_density__lte=1)
        if self.input_filter_distance_to_shipping:
            result = result.filter(tsz_min_distance__gte=self.input_distance_to_shipping)
        #Security
        if self.input_filter_uxo:
            result = result.filter(uxo=0)
            
        dissolved_geom = result[0].geometry
        for lb in result:
            try:
                dissolved_geom = dissolved_geom.union(lb.geometry)
            except:
                pass
        
        from django.contrib.gis.geos import MultiPolygon
        if type(dissolved_geom) == MultiPolygon:
            self.geometry_dissolved = dissolved_geom
        else:
            self.geometry_dissolved = MultiPolygon(dissolved_geom, srid=dissolved_geom.srid)
        self.active = True
        
        
        self.geometry_final_area = sum([lb.geometry.area for lb in result.all()])
        leaseblock_ids = [lb.id for lb in result.all()]
        self.lease_blocks = ','.join(map(str, leaseblock_ids))
        
        #pdb.set_trace()
        
        
        if self.lease_blocks == '':
            self.satisfied = False
        else:
            self.satisfied = True
        return True        
    
    def save(self, rerun=None, *args, **kwargs):
        if rerun is None and self.pk is None:
            rerun = True
        if rerun is None and self.pk is not None: #if editing a scenario and no value for rerun is given
            rerun = False
            if not rerun:
                orig = Scenario.objects.get(pk=self.pk)
                #TODO: keeping this in here til I figure out why self.lease_blocks and self.geometry_final_area are emptied when run() is not called
                remove_kml_cache(self)
                rerun = True
                #if getattr(orig, 'name') != getattr(self, 'name'):
                #    #print 'name has changed'
                #    remove_kml_cache(self) 
                #    rerun = True
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
                    orig_weas = set(getattr(self, 'input_wea').all())   
                    orig_substrates = set(getattr(self, 'input_substrate').all())  
                    orig_sediments = set(getattr(self, 'input_sediment').all())                    
                    super(Scenario, self).save(rerun=False, *args, **kwargs)  
                    new_weas = set(getattr(self, 'input_wea').all())                   
                    new_substrates = set(getattr(self, 'input_substrate').all()) 
                    new_sediments = set(getattr(self, 'input_sediment').all())   
                    if orig_substrates != new_substrates or orig_sediments != new_sediments or orig_weas != new_weas:
                        remove_kml_cache(self) 
                        rerun = True    
            super(Scenario, self).save(rerun=rerun, *args, **kwargs)
        else: #editing a scenario and rerun is provided 
            super(Scenario, self).save(rerun=rerun, *args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """
        Remove KML cache before removing scenario 
        """
        from kml_caching import remove_kml_cache
        remove_kml_cache(self)
        super(Scenario, self).delete(*args, **kwargs)    
    
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
    
    @classmethod
    def input_parameter_fields(klass):
        return [f for f in klass._meta.fields if f.attname.startswith('input_parameter_')]

    @classmethod
    def input_filter_fields(klass):
        return [f for f in klass._meta.fields if f.attname.startswith('input_filter_')]

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
        if self.lease_blocks == '':
            return 0
        return len(self.lease_blocks.split(','))
    
    @property
    def geometry_is_empty(self):
        return len(self.lease_blocks) == 0
    
    @property
    def input_wea_names(self):
        return [wea.wea_name for wea in self.input_wea.all()]
        
    @property
    def input_substrate_names(self):
        return [substrate.substrate_name for substrate in self.input_substrate.all()]
        
    @property
    def input_sediment_names(self):
        return [sediment.sediment_name for sediment in self.input_sediment.all()]
    
    #TODO: is this being used...?  Yes, see show.html
    @property
    def has_wind_energy_criteria(self):
        wind_parameters = Scenario.input_parameter_fields()
        for wp in wind_parameters:
            if getattr(self, wp.name):
                return True
        return False
        
    @property
    def has_shipping_filters(self):
        shipping_filters = Scenario.input_filter_fields()
        for sf in shipping_filters:
            if getattr(self, sf.name):
                return True
        return False 
        
    @property
    def has_military_filters(self):
        return False
    
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
            combined_kml_list.append('<Folder id="%s"><name>%s -- 0 Leaseblocks</name><visibility>0</visibility><open>0</open>' %(self.uid, self.name))
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
                            <Data name="wea_label"><value>%s</value></Data>
                            <Data name="wea_state_name"><value>%s</value></Data>
                            <Data name="distance_to_shore"><value>%s</value></Data>
                            <Data name="distance_to_awc"><value>%s</value></Data>
                            <Data name="wind_speed_output"><value>%s</value></Data>
                            <Data name="ais_density"><value>%s</value></Data>
                            <Data name="user"><value>%s</value></Data>
                            <Data name="modified"><value>%s</value></Data>
                        </ExtendedData>
                        %s
                    </Placemark>
                    """ % ( self.model_uid(), self.name, leaseblock.prot_numb,                             
                            leaseblock.depth_range_output, 
                            leaseblock.majority_seabed, #LeaseBlock Update: might change back to leaseblock.substrate
                            leaseblock.majority_sediment, #TODO: might change sediment to a more user friendly output
                            leaseblock.wea_label,
                            leaseblock.wea_state_name,
                            format(leaseblock.avg_distance,0), format(leaseblock.awc_min_distance,0),
                            #LeaseBlock Update: added the following two entries (min and max) to replace avg wind speed for now
                            leaseblock.wind_speed_output,
                            leaseblock.ais_density,
                            self.user, self.date_modified.replace(microsecond=0), 
                            #asKml(leaseblock.geometry.transform( settings.GEOMETRY_CLIENT_SRID, clone=True ))
                            asKml(leaseblock.geometry_client)
                          ) 
            except: 
                #this is in place to handle (at least one - "NJ18-05_6420") instance in which null value was used in float field max_distance
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
                                Spatial Design for Wind Energy: <strong>$[header]</strong>
                                <p>
                                <table width="250">
                                    <tr><td> Lease Block Number: <b>$[prot_number]</b> </td></tr>
                                </table>
                                <table width="250">
                                    <tr><td> $[wea_label] <b>$[wea_state_name]</b> </td></tr>
                                    <tr><td> Avg Wind Speed: <b>$[wind_speed_output]</b> </td></tr>
                                    <tr><td> Distance to AWC Station: <b>$[distance_to_awc] miles</b> </td></tr>
                                </table>
                                <table width="250">
                                    <tr><td> Distance to Shore: <b>$[distance_to_shore] miles</b> </td></tr>
                                    <tr><td> Depth: <b>$[depth_range_output]</b> </td></tr>
                                    <tr><td> Majority Seabed Form: <b>$[substrate]</b> </td></tr>
                                    <tr><td> Majority Sediment: <b>$[sediment]</b> </td></tr>
                                </table>
                                <table width="250">
                                    <tr><td> Shipping Density: <b>$[ais_density]</b> </td></tr>
                                </table>
                            </font>  
                            <font size=1>created by $[user] on $[modified]</font>
                        ]]> </text>
                    </BalloonStyle>
                    <LineStyle>
                        <color>ff8B1A55</color>
                    </LineStyle>
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
        verbose_name = 'Spatial Design for Wind Energy'
        icon_url = 'marco/img/multi.png'
        form = 'scenarios.forms.ScenarioForm'
        form_template = 'scenario/form.html'
        show_template = 'scenario/show.html'

#no longer needed?
class Objective(models.Model):
    name = models.CharField(max_length=35)
    color = models.CharField(max_length=8, default='778B1A55')
    
    def __unicode__(self):
        return u'%s' % self.name        

#no longer needed?
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
    majority_seabed = models.CharField(max_length=35, null=True, blank=True) #LeaseBlock Update: might change back to IntegerField 
    variety_seabed = models.IntegerField(null=True, blank=True)
    min_distance = models.FloatField(null=True, blank=True)
    max_distance = models.FloatField(null=True, blank=True)
    avg_distance = models.FloatField(null=True, blank=True)
    awc_min_distance = models.FloatField(null=True, blank=True)
    awc_max_distance = models.FloatField(null=True, blank=True)
    awc_avg_distance = models.FloatField(null=True, blank=True)
    wea_number = models.IntegerField(null=True, blank=True)
    wea_name = models.CharField(max_length=10, null=True, blank=True)
    ais_min_density = models.FloatField(null=True, blank=True)
    ais_max_density = models.FloatField(null=True, blank=True)
    ais_mean_density = models.FloatField(null=True, blank=True)
    min_wind_speed_rev = models.FloatField(null=True, blank=True)
    max_wind_speed_rev = models.FloatField(null=True, blank=True)
    tsz_min_distance = models.FloatField(null=True, blank=True)
    tsz_max_distance = models.FloatField(null=True, blank=True)
    tsz_mean_distance = models.FloatField(null=True, blank=True)
    lace_coral_count = models.IntegerField(null=True, blank=True)
    lace_coral_name = models.CharField(max_length=50, null=True, blank=True)
    black_coral_count = models.IntegerField(null=True, blank=True)
    black_coral_name = models.CharField(max_length=50, null=True, blank=True)
    soft_coral_count = models.IntegerField(null=True, blank=True)
    soft_coral_name = models.CharField(max_length=50, null=True, blank=True)
    gorgo_coral_count = models.IntegerField(null=True, blank=True)
    gorgo_coral_name = models.CharField(max_length=50, null=True, blank=True)
    sea_pen_count = models.IntegerField(null=True, blank=True)
    sea_pen_name = models.CharField(max_length=50, null=True, blank=True)
    hard_coral_count = models.IntegerField(null=True, blank=True)
    hard_coral_name = models.CharField(max_length=50, null=True, blank=True)
    seabed_depression = models.FloatField(null=True, blank=True)
    seabed_low_slope = models.FloatField(null=True, blank=True)
    seabed_steep = models.FloatField(null=True, blank=True)
    seabed_mid_flat = models.FloatField(null=True, blank=True)
    seabed_side_slow = models.FloatField(null=True, blank=True)
    seabed_high_flat = models.FloatField(null=True, blank=True)
    seabed_high_slope = models.FloatField(null=True, blank=True)
    seabed_total = models.FloatField(null=True, blank=True)
    discharge_min_distance = models.FloatField(null=True, blank=True)
    discharge_max_distance = models.FloatField(null=True, blank=True)
    discharge_mean_distance = models.FloatField(null=True, blank=True)
    discharge_flow_min_distance = models.FloatField(null=True, blank=True)
    discharge_flow_max_distance = models.FloatField(null=True, blank=True)
    discharge_flow_mean_distance = models.FloatField(null=True, blank=True)
    dredge_site = models.IntegerField(null=True, blank=True)
    wpa = models.IntegerField(null=True, blank=True)
    wpa_name = models.CharField(max_length=75, null=True, blank=True)
    shipwreck_density = models.IntegerField(null=True, blank=True)
    uxo = models.IntegerField(null=True, blank=True)
    substation_min_distance = models.FloatField(null=True, blank=True)
    substation_max_distance = models.FloatField(null=True, blank=True)
    substation_mean_distance = models.FloatField(null=True, blank=True)
    marco_region = models.IntegerField(null=True, blank=True)
    geometry = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Lease Block Geometry")
    #geometry_client = models.MultiPolygonField(srid=settings.GEOMETRY_CLIENT_SRID, null=True, blank=True, verbose_name="Lease Block Client Geometry")
    objects = models.GeoManager()   

    @property
    def substrate(self):
        try:
            return Substrate.objects.get(substrate_id=self.majority_seabed).substrate_name
        except:
            return 'Unknown'
        
    @property
    def sediment(self):
        try:
            return Sediment.objects.get(sediment_name=self.majority_sediment).sediment_output
        except:
            return 'Unknown'
        
    @property
    def wea_label(self):
        if self.wea_name is None:
            return ""
        else:
            return "Wind Energy Area: "
        
    @property
    def wea_state_name(self):
        if self.wea_name is None:
            return ""
        else:
            return self.wea_name
        
    @property
    def wind_speed_output(self):
        if self.min_wind_speed == self.max_wind_speed:
            return "%s mph" %format(mps_to_mph(self.min_wind_speed),1)
        else:
            return "%s - %s mph" %( format(mps_to_mph(self.min_wind_speed),1), format(mps_to_mph(self.max_wind_speed),1) )
     
    @property
    def ais_density(self):
        if self.ais_mean_density <= 1:
            return 'Low'
        else:
            return 'High'
     
    @property
    def depth_range_output(self):
        if self.min_depth == self.max_depth:
            return "%s meters" %format(-self.min_depth,0)
        else:
            return "%s - %s meters" %( format(-self.min_depth,0), format(-self.max_depth,0) )     
        
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
       
#still needed?
class Substrate(models.Model):
    substrate_id = models.IntegerField()
    substrate_name = models.CharField(max_length=35)
    substrate_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.substrate_name
#still needed?     
class Sediment(models.Model):
    sediment_id = models.IntegerField()
    sediment_name = models.CharField(max_length=35)
    sediment_output = models.CharField(max_length=55)
    sediment_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.sediment_output
#still needed?     
class WEA(models.Model):
    wea_id = models.IntegerField()
    wea_name = models.CharField(max_length=35)
    wea_shortname = models.CharField(max_length=35)
    
    def __unicode__(self):
        return u'%s' % self.wea_name

@register
class LeaseBlockSelection(Analysis):
    #input_a = models.IntegerField()
    #input_b = models.IntegerField()
    #output_sum = models.IntegerField(blank=True, null=True)
    leaseblock_ids = models.TextField()
    description = models.TextField(null=True, blank=True)
    #leaseblocks = models.ManyToManyField("LeaseBlock", null=True, blank=True)
    geometry_actual = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, verbose_name="Lease Block Selection Geometry")
    
    @property
    def serialize_attributes(self):
        from general.utils import format
        attributes = []
        report_values = {}
        leaseblocks = LeaseBlock.objects.filter(prot_numb__in=self.leaseblock_ids.split(','))
        if (len(leaseblocks) > 0): 
            #get wind speed range
            try:
                min_wind_speed = format(self.get_min_wind_speed(leaseblocks),3)
                max_wind_speed = format(self.get_max_wind_speed(leaseblocks),3)
                wind_speed_range = '%s to %s m/s' %(min_wind_speed, max_wind_speed)
            except:
                min_wind_speed = 'Unknown'
                max_wind_speed = 'Unknown'
                wind_speed_range = 'Unknown'
            attributes.append({'title': 'Average Wind Speed Range', 'data': wind_speed_range})
            try:
                avg_wind_speed = format(self.get_avg_wind_speed(leaseblocks),3)
                avg_wind_speed_output = '%s m/s' %avg_wind_speed
            except:
                avg_wind_speed = 'Unknown'
                avg_wind_speed_output = 'Unknown'
            attributes.append({'title': 'Average Wind Speed', 'data': avg_wind_speed_output})
            report_values['wind-speed'] = {'min': min_wind_speed, 'max': max_wind_speed, 'avg': avg_wind_speed, 'selection_id': self.uid}
            
            #get distance to coastal substation
            min_distance_to_substation = format(self.get_min_distance_to_substation(leaseblocks), 0)
            max_distance_to_substation = format(self.get_max_distance_to_substation(leaseblocks), 0)
            distance_to_substation_range = '%s to %s miles' %(min_distance_to_substation, max_distance_to_substation)
            attributes.append({'title': 'Distance to Coastal Substation', 'data': distance_to_substation_range})
            avg_distance_to_substation = format(self.get_avg_distance_to_substation(leaseblocks), 1)
            avg_distance_to_substation_output = '%s miles' %avg_distance_to_substation
            attributes.append({'title': 'Average Distance to Coastal Substation', 'data': avg_distance_to_substation_output})
            report_values['distance-to-substation'] = {'min': min_distance_to_substation, 'max': max_distance_to_substation, 'avg': avg_distance_to_substation, 'selection_id': self.uid}
                        
            #get distance to awc range
            min_distance_to_awc = format(self.get_min_distance_to_awc(leaseblocks), 0)
            max_distance_to_awc = format(self.get_max_distance_to_awc(leaseblocks), 0)
            distance_to_awc_range = '%s to %s miles' %(min_distance_to_awc, max_distance_to_awc)
            attributes.append({'title': 'Distance to Proposed AWC Hub', 'data': distance_to_awc_range})
            avg_distance_to_awc = format(self.get_avg_distance_to_awc(leaseblocks), 1)
            avg_distance_to_awc_output = '%s miles' %avg_distance_to_awc
            attributes.append({'title': 'Average Distance to Proposed AWC Hub', 'data': avg_distance_to_awc_output})
            report_values['distance-to-awc'] = {'min': min_distance_to_awc, 'max': max_distance_to_awc, 'avg': avg_distance_to_awc, 'selection_id': self.uid}
            
            #get distance to shipping lanes
            min_distance_to_shipping = format(self.get_min_distance_to_shipping(leaseblocks), 0)
            max_distance_to_shipping = format(self.get_max_distance_to_shipping(leaseblocks), 0)
            miles_to_shipping = '%s to %s miles' %(min_distance_to_shipping, max_distance_to_shipping)
            attributes.append({'title': 'Distance to Shipping Lanes', 'data': miles_to_shipping})
            avg_distance_to_shipping = format(self.get_avg_distance_to_shipping(leaseblocks),1)
            avg_distance_to_shipping_output = '%s miles' %avg_distance_to_shipping
            attributes.append({'title': 'Average Distance to Shipping Lanes', 'data': avg_distance_to_shipping_output})
            report_values['distance-to-shipping'] = {'min': min_distance_to_shipping, 'max': max_distance_to_shipping, 'avg': avg_distance_to_shipping, 'selection_id': self.uid}
            
            #get distance to shore range
            min_distance = format(self.get_min_distance(leaseblocks), 0)
            max_distance = format(self.get_max_distance(leaseblocks), 0)
            distance_to_shore = '%s to %s miles' %(min_distance, max_distance)
            attributes.append({'title': 'Distance to Shore', 'data': distance_to_shore})
            avg_distance = format(self.get_avg_distance(leaseblocks),1)
            avg_distance_output = '%s miles' %avg_distance
            attributes.append({'title': 'Average Distance to Shore', 'data': avg_distance_output})
            report_values['distance-to-shore'] = {'min': min_distance, 'max': max_distance, 'avg': avg_distance, 'selection_id': self.uid}
            
            #get depth range
            min_depth = format(self.get_min_depth(leaseblocks), 0)
            max_depth = format(self.get_max_depth(leaseblocks), 0)
            depth_range = '%s to %s meters' %(min_depth, max_depth)
            if min_depth == 0 or max_depth == 0:
                depth_range = 'Unknown'
            attributes.append({'title': 'Depth', 'data': depth_range})
            avg_depth = format(self.get_avg_depth(leaseblocks), 0)
            avg_depth_output = '%s meters' %avg_depth
            if avg_depth == 0:
                avg_depth_output = 'Unknown'
            attributes.append({'title': 'Average Depth', 'data': avg_depth_output})
            report_values['depth'] = {'min': min_depth, 'max': max_depth, 'avg': avg_depth, 'selection_id': self.uid}
            '''
            if self.input_filter_ais_density:
                attributes.append({'title': 'Excluding Areas with High Ship Traffic', 'data': ''})
            '''    
                
            attributes.append({'title': 'Number of Leaseblocks', 'data': self.leaseblock_ids.count(',')+1})
        else:
            attributes.append({'title': 'Number of Leaseblocks', 'data': 0})
        return { 'event': 'click', 'attributes': attributes, 'report_values': report_values }
    
    def get_min_wind_speed(self, leaseblocks):
        min_wind_speed = leaseblocks[0].min_wind_speed_rev
        for lb in leaseblocks:
            if lb.min_wind_speed_rev < min_wind_speed:
                min_wind_speed = lb.min_wind_speed_rev
        return min_wind_speed - .125
                
    def get_max_wind_speed(self, leaseblocks):
        max_wind_speed = leaseblocks[0].max_wind_speed_rev
        for lb in leaseblocks:
            if lb.max_wind_speed_rev > max_wind_speed:
                max_wind_speed = lb.max_wind_speed_rev
        return max_wind_speed + .125
          
    def get_avg_wind_speed(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.min_wind_speed_rev
            total += lb.max_wind_speed_rev
        if total > 0:
            return total / (len(leaseblocks) * 2)
        else:
            return 0
    
    def get_min_distance(self, leaseblocks): 
        min_distance = leaseblocks[0].min_distance
        for lb in leaseblocks:
            if lb.min_distance < min_distance:
                min_distance = lb.min_distance
        return min_distance 
    
    def get_max_distance(self, leaseblocks):
        max_distance = leaseblocks[0].max_distance
        for lb in leaseblocks:
            if lb.max_distance > max_distance:
                max_distance = lb.max_distance
        return max_distance 
          
    def get_avg_distance(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.avg_distance
        if total > 0:
            return total / (len(leaseblocks))
        else:
            return 0
    
    # note: accounting for the issue in which min_depth is actually a greater depth than max_depth 
    def get_max_depth(self, leaseblocks): 
        min_depth = leaseblocks[0].min_depth
        for lb in leaseblocks:
            if lb.min_depth < min_depth:
                min_depth = lb.min_depth
        return -min_depth
    
    # note: accounting for the issue in which max_depth is actually a lesser depth than min_depth
    def get_min_depth(self, leaseblocks):
        max_depth = leaseblocks[0].max_depth
        for lb in leaseblocks:
            if lb.max_depth > max_depth:
                max_depth = lb.max_depth
        return -max_depth
          
    def get_avg_depth(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.avg_depth
        if total != 0:
            avg = -total / (len(leaseblocks))
            return avg
        else:
            return 0
    
    def get_min_distance_to_substation(self, leaseblocks): 
        substation_min_distance = leaseblocks[0].substation_min_distance
        for lb in leaseblocks:
            if lb.substation_min_distance < substation_min_distance:
                substation_min_distance = lb.substation_min_distance
        return substation_min_distance
    
    def get_max_distance_to_substation(self, leaseblocks):
        substation_max_distance = leaseblocks[0].substation_max_distance
        for lb in leaseblocks:
            if lb.substation_max_distance > substation_max_distance:
                substation_max_distance = lb.substation_max_distance
        return substation_max_distance
          
    def get_avg_distance_to_substation(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.substation_mean_distance
        if total != 0:
            avg = total / len(leaseblocks)
            return avg
        else:
            return 0
    
    def get_min_distance_to_awc(self, leaseblocks): 
        awc_min_distance = leaseblocks[0].awc_min_distance
        for lb in leaseblocks:
            if lb.awc_min_distance < awc_min_distance:
                awc_min_distance = lb.awc_min_distance
        return awc_min_distance
    
    def get_max_distance_to_awc(self, leaseblocks):
        awc_max_distance = leaseblocks[0].awc_max_distance
        for lb in leaseblocks:
            if lb.awc_max_distance > awc_max_distance:
                awc_max_distance = lb.awc_max_distance
        return awc_max_distance
          
    def get_avg_distance_to_awc(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.awc_avg_distance
        if total != 0:
            avg = total / len(leaseblocks)
            return avg
        else:
            return 0
    
    def get_min_distance_to_shipping(self, leaseblocks): 
        tsz_min_distance = leaseblocks[0].tsz_min_distance
        for lb in leaseblocks:
            if lb.tsz_min_distance < tsz_min_distance:
                tsz_min_distance = lb.tsz_min_distance
        return tsz_min_distance
    
    def get_max_distance_to_shipping(self, leaseblocks):
        tsz_max_distance = leaseblocks[0].tsz_max_distance
        for lb in leaseblocks:
            if lb.tsz_max_distance > tsz_max_distance:
                tsz_max_distance = lb.tsz_max_distance
        return tsz_max_distance
          
    def get_avg_distance_to_shipping(self, leaseblocks):
        total = 0
        for lb in leaseblocks:
            total += lb.tsz_mean_distance
        if total != 0:
            return total / len(leaseblocks)
        else:
            return 0
    
    
    def run(self):
        leaseblocks = LeaseBlock.objects.filter(prot_numb__in=self.leaseblock_ids.split(','))
        leaseblock_geoms = [lb.geometry for lb in leaseblocks]
        
        from django.contrib.gis.geos import MultiPolygon
        dissolved_geom = leaseblock_geoms[0]
        for geom in leaseblock_geoms:
            try:
                dissolved_geom = dissolved_geom.union(geom)
            except:
                pass
        
        if type(dissolved_geom) == MultiPolygon:
            self.geometry_actual = dissolved_geom
        else:
            self.geometry_actual = MultiPolygon(dissolved_geom, srid=dissolved_geom.srid)
        return True  
    
    def geojson(self, srid):
        props = get_properties_json(self)
        props['absolute_url'] = self.get_absolute_url()
        json_geom = self.geometry_actual.transform(srid, clone=True).json
        return get_feature_json(json_geom, json.dumps(props))
    
    class Options:
        verbose_name = 'Lease Block Selection'
        form = 'scenarios.forms.LeaseBlockSelectionForm'
        form_template = 'selection/form.html'
        #show_template = 'scenario/show.html'
