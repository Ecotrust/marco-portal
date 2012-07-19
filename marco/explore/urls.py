from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^catalog', data_catalog),
    (r'^needs', data_needs)
)
