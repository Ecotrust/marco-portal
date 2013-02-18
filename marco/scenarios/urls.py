from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    #feature reports
    url(r'sdc_report/(\d+)', sdc_analysis, name='sdc_analysis'), #user requested sdc analysis 
    url(r'delete_design/(?P<uid>[\w_]+)/$', delete_design), #user deletes scenario (or cancels empty geometry result)
    url(r'get_attributes/(?P<uid>[\w_]+)/$', get_attributes), #get attributes for a given scenario
    url(r'get_scenarios$', get_scenarios),
    url(r'get_leaseblocks$', get_leaseblocks),
    url(r'get_sharing_groups$', get_sharing_groups),
    url(r'share_design$', share_design),
    url(r'copy_design/(?P<uid>[\w_]+)/$', copy_design),
    url(r'get_selections$', get_selections),
    url(r'get_leaseblock_features$', get_leaseblock_features)
)
