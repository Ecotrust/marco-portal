from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^data_layers/(\w*)', data_layers),
)
