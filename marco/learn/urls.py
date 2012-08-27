from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^(\w*)', learn_page),
)
