import os
import time
from django.db import models
from django.conf import settings
from django.contrib.gis.db import models
from django.utils.html import escape
from madrona.common.utils import asKml
from madrona.features import register
from madrona.analysistools.models import Analysis
from general.utils import miles_to_meters, feet_to_meters


@register
class Scenario(Analysis):
    #Input Parameters
    input_objectives = models.ManyToManyField("Objective")
    input_parameters = models.ManyToManyField("Parameter")
    
    input_dist_shore = models.FloatField(verbose_name='Distance from Shoreline')
    input_dist_port = models.FloatField(verbose_name='Distance to Port')
    input_min_depth = models.FloatField(verbose_name='Minimum Depth')
    input_max_depth = models.FloatField(verbose_name='Maximum Depth')
    
    #Descriptors (name field is inherited from Analysis)
    description = models.TextField(null=True, blank=True)
    #support_file = models.FileField(upload_to='scenarios/files/', null=True, blank=True)
    
    # All output fields should be allowed to be Null/Blank
    output_geom = models.MultiPolygonField( srid=settings.GEOMETRY_DB_SRID, null=True, blank=True, 
                                            verbose_name="Scenario Geometry")
    output_mapcalc = models.CharField(max_length=360, null=True, blank=True)
    output_area = models.FloatField(null=True, blank=True, verbose_name="Total Area (sq km)")
    
    geometry_final = models.MultiPolygonField(srid=settings.GEOMETRY_DB_SRID,
            null=True, blank=True, verbose_name="Final Scenario Geometry")
    
    def run(self):
        from madrona.analysistools.grass import Grass

        g = Grass('marco', 
                gisbase=settings.GISBASE, 
                gisdbase=settings.GISDBASE,  
                autoclean=True)
        g.verbose = True
        
        #g.run('g.region rast=bathymetry')
        #g.run('g.region nsres=195 ewres=195')
        g.run('g.region nsres=390 ewres=390')
        rasts = g.list()['rast']

        outdir = settings.GRASS_TMP #'/tmp'
        outbase = 'marco_%s' % str(time.time()).split('.')[0]
        output = os.path.join(outdir,outbase+'.json')
        if os.path.exists(output):
            raise Exception(output + " already exists")
        
        input_params = [p.id for p in self.input_parameters.all()]
        result = 0
        if 1 in input_params:
            g.run('r.buffer input=shoreline_raster output=shoreline_rast_buffer distances=%s' % (miles_to_meters(self.input_dist_shore)) )
            shoreline_buffer = 'if(shoreline_rast_buffer==2)'
        else:
            shoreline_buffer = 1
            
        if 2 in input_params:
            depth = 'if(bathymetry > %s && bathymetry < %s)' % (feet_to_meters(-self.input_max_depth), feet_to_meters(-self.input_min_depth))
        else:
            depth = 1        
        
        if 3 in input_params:
            g.run('v.buffer input=ports output=port_buffer distance=%s' % (miles_to_meters(self.input_dist_port)) )
            g.run('v.to.rast input=port_buffer output=port_buffer_rast use=cat')
            port_buffer = 'if(port_buffer_rast)'
        else:
            port_buffer = 1
        
        mapcalc = """r.mapcalc "rresult = if((%s + %s + %s)==3,1,null())" """ % (shoreline_buffer, depth, port_buffer)
        g.run(mapcalc)
        self.output_mapcalc = mapcalc
        
        #g.run('r.mapcalc "oceanic_rresult = if(rresult==1, studyregion, null())"') #but studyregion is still vector...
        g.run('r.to.vect input=rresult output=rresult_vect feature=area')

        g.run('v.out.ogr -c input=rresult_vect type=area format=GeoJSON dsn=%s' % output)

        from django.contrib.gis.gdal import DataSource
        from django.contrib.gis.geos import MultiPolygon
        try:
            ds = DataSource(output)
            layer = ds[0]
            geom = MultiPolygon([g.geos for g in layer.get_geoms()])
        except:
            # Grass had no geometries to give - empty output
            geom = MultiPolygon([])

        geom.srid = settings.GEOMETRY_DB_SRID
        self.output_geom = geom
        self.output_area = geom.area / 1000000.0 # sq m to sq km
        
        self.geometry_final = geom

        #cleanup
        os.remove(output)
        del g

        return True
        
    def save(self, rerun=True, *args, **kwargs):
        # only rerun the analysis if any of the input_ fields have changed
        # ie if name and description change no need to rerun the full analysis
        if self.pk is not None:
            rerun = False
            orig = Scenario.objects.get(pk=self.pk)
            for f in Scenario.input_fields():
                # Is original value different from form value?
                #if orig._get_FIELD_display(f) != getattr(self,f.name):
                if getattr(orig, f.name) != getattr(self, f.name):
                    rerun = True
                    break
            if not rerun:
                #the substrates need to be grabbed, then saved, then grabbed again because (regardless of whether we use orig or self) 
                #both getattr calls return the same original list until the model has been saved 
                #(I assume this means the form.save_m2m actually has to be called), after which calls to getattr 
                #will return the same list (regardless of whether we use orig or self)
                #orig_substrates = set(getattr(orig, 'input_substrate').all())
                super(Scenario, self).save(rerun=False, *args, **kwargs)
                #new_substrates = set(getattr(self, 'input_substrate').all())
                #if orig_substrates != new_substrates:
                #    rerun = True
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
    def kml_done(self):
        return """
        %s
        <Placemark id="%s">
            <visibility>1</visibility>
            <name>%s</name>
            <styleUrl>#%s-default</styleUrl>
            <ExtendedData>
                <Data name="name"><value>%s</value></Data>
                <Data name="user"><value>%s</value></Data>
                <Data name="desc"><value>%s</value></Data>
                <Data name="type"><value>%s</value></Data>
                <Data name="modified"><value>%s</value></Data>
            </ExtendedData>
            <MultiGeometry>
            %s
            </MultiGeometry>
        </Placemark>
        """ % (self.kml_style, self.uid, escape(self.name), self.model_uid(),
            escape(self.name), self.user, escape(self.description), self.Options.verbose_name, self.date_modified.replace(microsecond=0), 
            asKml(self.output_geom.transform( settings.GEOMETRY_CLIENT_SRID, clone=True))
            )
        
    @property
    def kml_style(self):
        return """
        <Style id="%s-default">
            <BalloonStyle>
                <bgColor>ffeeeeee</bgColor>
                <text> <![CDATA[
                    <font color="#1A3752"><strong>$[name]</strong></font><br />
                    <p>$[desc]</p>
                    <font size=1>$[type] created by $[user] on $[modified]</font>
                ]]> </text>
            </BalloonStyle>
            <IconStyle>
                <color>ffffffff</color>
                <colorMode>normal</colorMode>
                <scale>0.9</scale> 
                <Icon> <href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href> </Icon>
            </IconStyle>
            <LabelStyle>
                <color>ffffffff</color>
                <scale>0.8</scale>
            </LabelStyle>
            <PolyStyle>
                <color>%s</color>
            </PolyStyle>
        </Style>
        """ % (self.model_uid(),self.color)
        
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
    name = models.CharField(max_length=70)
    color = models.CharField(max_length=8, default='778B1A55')
    
    def __unicode__(self):
        return u'%s' % self.name        

class Parameter(models.Model):
    name = models.CharField(max_length=70)
    objectives = models.ManyToManyField("Objective", null=True, blank=True)
    
    def __unicode__(self):
        return u'%s' % self.name
        