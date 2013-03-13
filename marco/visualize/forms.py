from madrona.features.forms import FeatureForm
from django import forms
from models import *

class BookmarkForm(FeatureForm):
    
    class Meta(FeatureForm.Meta):
        model = Bookmark
