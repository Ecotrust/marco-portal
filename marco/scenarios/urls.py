from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    #feature reports
    url(r'sdc_report/(\d+)', sdc_analysis, name='sdc_analysis'), #user requested sdc analysis 
    url(r'delete_scenario/(\d+)', delete_scenario), #user deletes scenario (or cancels empty geometry result)
    url(r'get_scenarios$', get_scenarios)
)
