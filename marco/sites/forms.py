from madrona.features.forms import FeatureForm, SpatialFeatureForm
from sites.models import AOI, WindEnergySite

class AOIForm(SpatialFeatureForm):
    class Meta(SpatialFeatureForm.Meta):
        model = AOI

class WindEnergySiteForm(SpatialFeatureForm):
    class Meta(SpatialFeatureForm.Meta):
        model = WindEnergySite
