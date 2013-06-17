from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^get_legend_json/(?P<url>)$', getLegendJSON)
    
)
