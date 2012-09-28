from django.conf.urls.defaults import *
from django.conf import settings
from views import *

try:
    use_openid = settings.OPENID_ENABLED
except:
    use_openid = False

urlpatterns = patterns('',
    url(r'^change_password/$', change_password),
    url(r'^(?P<username>\w+)/$', update_profile, {'use_openid': use_openid}),
)