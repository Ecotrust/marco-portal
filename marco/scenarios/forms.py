from madrona.features.forms import FeatureForm, SpatialFeatureForm
from django import forms
from django.forms import ModelMultipleChoiceField
from django.forms.widgets import *
from django.utils.safestring import mark_safe
from django.contrib.gis.geos import fromstr
from os.path import splitext, split
from madrona.analysistools.widgets import SliderWidget, DualSliderWidget
from models import *

class AdminFileWidget(forms.FileInput):
    """
    A FileField Widget that shows its current value if it has one.
    """
    def __init__(self, attrs={}):
        super(AdminFileWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        output = ['<p>']
        if value and hasattr(value, "name"):
            filename = split(value.name)[-1]
            output.append('Current File: <a href="%s" target="_blank">%s</a> : <input style="top:0px;margin-bottom:0px" type="checkbox" name="clear_%s" /> Remove </p>' % (value._get_url(), filename, name))
            output.append('<p> Change:') 
        output.append(super(AdminFileWidget, self).render(name, value, attrs))
        output.append("</p>")
        return mark_safe(u''.join(output))

# http://www.neverfriday.com/sweetfriday/2008/09/-a-long-time-ago.html
class FileValidationError(forms.ValidationError):
    def __init__(self):
        super(FileValidationError, self).__init__('Document types accepted: ' + ', '.join(ValidFileField.valid_file_extensions))
        
class ValidFileField(forms.FileField):
    """A validating document upload field"""
    valid_file_extensions = ['odt', 'pdf', 'doc', 'xls', 'txt', 'csv', 'kml', 'kmz', 'jpeg', 'jpg', 'png', 'gif', 'zip']

    def __init__(self, *args, **kwargs):
        super(ValidFileField, self).__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        f = super(ValidFileField, self).clean(data, initial)
        if f:
            ext = splitext(f.name)[1][1:].lower()
            if ext in ValidFileField.valid_file_extensions: 
                # check data['content-type'] ?
                return f
            raise FileValidationError()

class ScenarioForm(FeatureForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 30, 'rows': 3}), required=False)
    #file = forms.FileField(widget=forms.ClearableFileInput(attrs={'style': 'top:0px;margin-bottom:0px'), max_length=70, required=False) #using ClearableFileInput produces poorly formatted edit form
    support_file = ValidFileField(widget=AdminFileWidget,required=False,label="Support File")
    #could optionally add a param similar to the following:  help_text="(e.g. a pdf or text document that explains this scenario)"
    #input_objectives = forms.ModelMultipleChoiceField(  queryset=Objective.objects.all().order_by('id'), 
    #                                                    widget=forms.CheckboxSelectMultiple(attrs={'class': 'objectives'}),
    #                                                    required=False, 
    #                                                    label="")
    input_parameters = forms.ModelMultipleChoiceField(  queryset=Parameter.objects.all().order_by('ordering_id'),
                                                        widget=forms.CheckboxSelectMultiple(attrs={'class': 'parameters'}),
                                                        required=False, 
                                                        #initial = Parameter.objects.all(),
                                                        label="")
    input_min_dist_shore = forms.FloatField(initial=3, widget=forms.TextInput(attrs={'class':'slidervalue'}))
    input_max_dist_shore = forms.FloatField(initial=10, widget=forms.TextInput(attrs={'class':'slidervalue'}))
    input_dist_shore = forms.FloatField(min_value=0, max_value=50, initial=0,
                                        widget=DualSliderWidget('input_min_dist_shore', 'input_max_dist_shore', 
                                                                min=0,max=50,step=1),
                                        label="Distance to Shore (miles)")
    input_min_depth = forms.FloatField(initial=50, widget=forms.TextInput(attrs={'class':'slidervalue'}))
    input_max_depth = forms.FloatField(initial=500, widget=forms.TextInput(attrs={'class':'slidervalue'}))
    # Dummy field to set both of the above
    input_depth = forms.FloatField( min_value=0, max_value=1000, initial=0,
                                    widget=DualSliderWidget('input_min_depth','input_max_depth',
                                                            min=0,max=1000,step=10),
                                    label="Depth Range (feet)")
    input_avg_wind_speed = forms.FloatField(min_value=10, max_value=23, initial=15.7,
                                            widget=SliderWidget( min=10,max=23,step=.1 ),
                                            required=False)
    input_substrate = ModelMultipleChoiceField( queryset=Substrate.objects.all().order_by('substrate_id'), 
                                                widget=forms.CheckboxSelectMultiple(attrs={'class':'substrate_checkboxes'}),
                                                label="Include areas with the following Substrate Types", required=False) 
    #lease_blocks = ModelMultipleChoiceField( queryset=LeaseBlock.objects.all().order_by('id'), required=False)
    
    def save(self, commit=True):
        inst = super(FeatureForm, self).save(commit=False)
        if self.data.get('clear_support_file'):
            inst.support_file = None
        if commit:
            inst.save()
        return inst
    
    class Meta(FeatureForm.Meta):
        model = Scenario
        exclude = list(FeatureForm.Meta.exclude)
        for f in model.output_fields():
            exclude.append(f.attname)

