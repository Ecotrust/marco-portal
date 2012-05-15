from django.db import models
from madrona.features import register
from madrona.features.models import FeatureCollection
from drawing.models import AOI, WindEnergySite
from scenarios.models import Scenario

@register
class Folder(FeatureCollection):
    
    @property
    def aoi_set(self):
        return self.get_feature_set(AOI)
    
    @property
    def wind_site_set(self):
        return self.get_feature_set(WindEnergySite)
        
    @property
    def scenario_set(self):
        return self.get_feature_set(Scenario)
    
    @property
    def num_aois(self):
        return self.num_features(AOI)

    @property
    def num_wind_sites(self):
        return self.num_features(WindEnergySite)

    @property
    def num_scenarios(self):
        return self.num_features(Scenario)

    def get_feature_set(self, model_class):
        sites = []
        features = self.feature_set()
        for feature in features:
            if feature.__class__ == model_class:
                sites.append(feature)
        return sites
    
    @property
    def num_features(self, model_class=None):
        if model_class is None:
            return len(self.feature_set())
        count = 0
        for object in self.feature_set():
            if object.__class__ == model_class:
                count += 1
        return count
    
    class Options:
        verbose_name = 'Folder'
        icon_url = 'marco/img/folder.png'
        export_png = False
        form = 'general.forms.FolderForm'
        form_template = 'folder/form.html'
        show_template = 'folder/show.html'
        valid_children = (
            'drawing.models.AOI',
            'drawing.models.WindEnergySite',
            'scenarios.models.Scenario',
            'general.models.Folder',
        )
