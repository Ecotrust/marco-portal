from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from views import *

urlpatterns = patterns('',
    (r'^topic/([\w-]*)', topic_page),
    (r'^comments/', direct_to_template, {'template': 'comments_page.html'}),
    (r'^([\w-]*)', learn_page),
)
