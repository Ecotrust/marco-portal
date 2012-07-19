from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    #feature reports
    url(r'wind_report/(\d+)', wind_analysis, name='wind_analysis'), #user requested wind energy site analysis 
    url(r'aoi_report/(\d+)', aoi_analysis, name='aoi_analysis'), #user requested area of interest analysis 
)
