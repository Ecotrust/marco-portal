from madrona.features.forms import FeatureForm, SpatialFeatureForm
from portal.models import AOI, Folder

class AOIForm(SpatialFeatureForm):
    class Meta(SpatialFeatureForm.Meta):
        model = AOI

class FolderForm(FeatureForm):
    class Meta(FeatureForm.Meta):
        model = Folder
