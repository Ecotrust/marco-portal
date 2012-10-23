from django.conf.urls.defaults import *
from django.contrib import admin
from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('',
    (r'^marco_profile/', include('marco_profile.urls')),
    (r'^sdc/', include('scenarios.urls')),
    (r'^drawing/', include('drawing.urls')),
    (r'^data_manager/', include('data_manager.urls')),
    (r'^learn/', include('learn.urls')),
    (r'^explore/', include('explore.urls')),
    (r'^visualize/', include('visualize.urls')),
    (r'^planner/', include('visualize.urls')),
    (r'^feedback/', include('feedback.urls')),
    (r'^$', redirect_to, {'url': '/portal/'}),
    (r'', include('madrona.common.urls')),
)
