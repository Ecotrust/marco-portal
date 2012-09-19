from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('', 
    (r'^send', send_feedback),
    # (r'^bookmark', send_bookmark),
)
