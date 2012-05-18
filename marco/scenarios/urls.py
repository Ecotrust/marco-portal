from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    #feature reports
    url(r'sdc_report/(\d+)', sdc_analysis, name='sdc_analysis'), #user requested sdc analysis 
    url(r'scenario/delete/(\d+)', sdc_delete), #user cancels empty geometry result
)
