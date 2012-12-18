from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^layer/([A-Za-z0-9_-]+)$', update_layer),
    (r'^layer', create_layer),
    (r'^get_json', get_json)
)
