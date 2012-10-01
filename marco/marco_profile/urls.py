from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib.auth import views as auth_views
from user_profile_mod.views import *

try:
    use_openid = settings.OPENID_ENABLED
except:
    use_openid = False

urlpatterns = patterns('',
    url(r'^password/reset/$', auth_views.password_reset, {'post_reset_redirect': '/marco_profile/password/reset/done/'}),
    url(r'^password/reset/confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        auth_views.password_reset_confirm,
        name='auth_password_reset_confirm'),
    url(r'^password/reset/complete/$',
        auth_views.password_reset_complete,
        name='auth_password_reset_complete'),
    url(r'^password/reset/done/$',
        auth_views.password_reset_done, {'template_name': 'registration/password_reset_done_ext.html'},
        name='auth_password_reset_done'),
    url(r'^password/$', password_change, name='auth_password_change'),

    url(r'^forgot_username/$', send_username),
    url(r'^update_profile/(?P<username>\w+)/$', update_profile, {'use_openid': use_openid}),
)