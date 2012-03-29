from madrona.features.forms import FeatureForm
from general.models import Folder

class FolderForm(FeatureForm):
    class Meta(FeatureForm.Meta):
        model = Folder
