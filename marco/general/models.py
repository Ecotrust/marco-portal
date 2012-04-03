from django.db import models
from madrona.features import register
from madrona.features.models import FeatureCollection
from sites.models import AOI
from scenarios.models import Scenario

@register
class Folder(FeatureCollection):
    
    @property
    def aoi_set(self):
        aois = []
        features = self.feature_set()
        for feature in features:
            if feature.__class__ == AOI:
                aois.append(feature)
        return aois
    
    @property
    def scenario_set(self):
        scenarios = []
        features = self.feature_set()
        for feature in features:
            if feature.__class__ == Scenario:
                scenarios.append(feature)
        return scenarios
    
    @property
    def num_aois(self):
        count = 0
        for object in self.feature_set():
            if object.__class__ == AOI:
                count += 1
        return count

    @property
    def num_scenarios(self):
        count = 0
        for object in self.feature_set():
            if object.__class__ == Scenario:
                count += 1
        return count

    class Options:
        verbose_name = 'Folder'
        icon_url = 'marco/img/folder.png'
        form = 'general.forms.FolderForm'
        show_template = 'folder/show.html'
        valid_children = (
            'sites.models.AOI',
            'scenarios.models.Scenario',
            'general.models.Folder',
        )
