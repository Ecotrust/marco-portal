from django import forms
from madrona.features.forms import FeatureForm, SpatialFeatureForm
from models import AOI, WindEnergySite

class AOIForm(SpatialFeatureForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 30, 'rows': 3}), required=False)
    
    class Meta(SpatialFeatureForm.Meta):
        model = AOI

class WindEnergySiteForm(SpatialFeatureForm):
    class Meta(SpatialFeatureForm.Meta):
        model = WindEnergySite
