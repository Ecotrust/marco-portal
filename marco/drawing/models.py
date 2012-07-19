from django.db import models
from django.utils.html import escape
from madrona.features import register
from madrona.features.models import PolygonFeature
from general.utils import sq_meters_to_sq_miles

@register
class AOI(PolygonFeature):
    description = models.TextField(null=True,blank=True)
    
    @property
    def area_in_sq_miles(self):
        return sq_meters_to_sq_miles(self.geometry_final.area)
        
    @property
    def formatted_area(self):
        return int((self.area_in_sq_miles * 10) +.5) / 10.
     
    @property
    def kml(self):
        return """
        <Placemark id="%s">
            <visibility>1</visibility>
            <name>%s</name>
            <styleUrl>#%s-default</styleUrl>
            <ExtendedData>
                <Data name="name"><value>%s</value></Data>
                <Data name="area"><value>%s</value></Data>
                <Data name="user"><value>%s</value></Data>
                <Data name="desc"><value>%s</value></Data>
                <Data name="type"><value>%s</value></Data>
                <Data name="modified"><value>%s</value></Data>
            </ExtendedData>
            %s 
        </Placemark>
        """ % (self.uid, escape(self.name), self.model_uid(), 
               escape(self.name), self.formatted_area, self.user, escape(self.description), 
               self.Options.verbose_name, self.date_modified.replace(microsecond=0), 
               self.geom_kml)

    @property
    def kml_style(self):
        return """
        <Style id="%s-default">
            <BalloonStyle>
                <bgColor>ffeeeeee</bgColor>
                <text> <![CDATA[
                    <font color="#1A3752"><strong>$[name]</strong></font>
                    <p>Area: $[area] sq miles</p>
                    <p>$[desc]</p>
                    <font size=1>$[type] created by $[user] on $[modified]</font>
                ]]> </text>
            </BalloonStyle>
            <PolyStyle>
                <color>%s</color>
            </PolyStyle>
            <LineStyle>
                <color>%s</color>
            </LineStyle>
        </Style>
        """ % (self.model_uid(), self.fill_color(), self.outline_color())

    @classmethod
    def fill_color(self):
        return '776BAEFD'      
    
    @classmethod
    def outline_color(self):
        return '776BAEFD'          
    
    class Options:
        verbose_name = 'Area of Interest'
        icon_url = 'marco/img/aoi.png'
        export_png = False
        manipulators = []
        optional_manipulators = ['clipping.manipulators.ClipToShoreManipulator']
        form = 'drawing.forms.AOIForm'
        form_template = 'aoi/form.html'
        show_template = 'aoi/show.html'

@register
class WindEnergySite(PolygonFeature):
    description = models.TextField(null=True,blank=True)
    
    @property
    def area_in_sq_miles(self):
        return sq_meters_to_sq_miles(self.geometry_final.area)
        
    @property
    def formatted_area(self):
        return int((self.area_in_sq_miles * 10) +.5) / 10.
     
    @property
    def kml(self):
        return """
        <Placemark id="%s">
            <visibility>1</visibility>
            <name>%s</name>
            <styleUrl>#%s-default</styleUrl>
            <ExtendedData>
                <Data name="name"><value>%s</value></Data>
                <Data name="area"><value>%s</value></Data>
                <Data name="user"><value>%s</value></Data>
                <Data name="desc"><value>%s</value></Data>
                <Data name="type"><value>%s</value></Data>
                <Data name="modified"><value>%s</value></Data>
            </ExtendedData>
            %s 
        </Placemark>
        """ % (self.uid, escape(self.name), self.model_uid(), 
               escape(self.name), self.formatted_area, self.user, escape(self.description), 
               self.Options.verbose_name, self.date_modified.replace(microsecond=0), 
               self.geom_kml)

    @property
    def kml_style(self):
        return """
        <Style id="%s-default">
            <BalloonStyle>
                <bgColor>ffeeeeee</bgColor>
                <text> <![CDATA[
                    <font color="#1A3752"><strong>$[name]</strong></font>
                    <p>Area: $[area] sq miles</p>
                    <p>$[desc]</p>
                    <font size=1>$[type] created by $[user] on $[modified]</font>
                ]]> </text>
            </BalloonStyle>
            <PolyStyle>
                <color>%s</color>
            </PolyStyle>
            <LineStyle>
                <color>%s</color>
            </LineStyle>
        </Style>
        """ % (self.model_uid(), self.fill_color(), self.outline_color())

    @classmethod
    def fill_color(self):
        return '7776B9DE'      
    
    @classmethod
    def outline_color(self):
        return '7776B9DE'                
    
    class Options:
        verbose_name = 'Wind Energy Site'
        icon_url = 'marco/img/wind.png'
        export_png = False
        form = 'drawing.forms.WindEnergySiteForm'
        form_template = 'wind/form.html'
        show_template = 'wind/show.html'
