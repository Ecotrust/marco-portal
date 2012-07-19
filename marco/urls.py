from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'', include('madrona.common.urls')),
    (r'^sdc/', include('scenarios.urls')),
    (r'^drawing/', include('drawing.urls')),
    (r'^data_manager/', include('data_manager.urls')),
    (r'^explore/', include('explore.urls')),
    (r'^visualize/', include('visualize.urls')),
)
