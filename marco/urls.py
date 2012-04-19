from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'', include('madrona.common.urls')),
    (r'^sdc/', include('scenarios.urls'))
)
