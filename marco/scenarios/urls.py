from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    #feature reports
    url(r'sdc_report/(\d+)', sdc_analysis, name='sdc_analysis'), #user requested sdc analysis 
    url(r'delete_scenario/(?P<uid>[\w_]+)/$', delete_scenario), #user deletes scenario (or cancels empty geometry result)
    url(r'get_attributes/(?P<uid>[\w_]+)/$', get_attributes), #get attributes for a given scenario
    url(r'get_scenarios$', get_scenarios),
    url(r'get_leaseblocks$', get_leaseblocks),
    url(r'get_sharing_groups$', get_sharing_groups)
)
