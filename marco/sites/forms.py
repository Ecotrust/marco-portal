from madrona.features.forms import FeatureForm, SpatialFeatureForm
from sites.models import AOI

class AOIForm(SpatialFeatureForm):
    class Meta(SpatialFeatureForm.Meta):
        model = AOI
