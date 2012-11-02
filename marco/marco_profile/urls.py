from django.views.generic.base import TemplateView
from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib.auth import views as auth_views
from registration import views as reg_views
from marco_profile.views import *

try:
    use_openid = settings.OPENID_ENABLED
except:
    use_openid = False

urlpatterns = patterns('',
    url(r'^password/reset/$', 
        auth_views.password_reset, {'email_template_name': 'registration/marco_password_reset_email.html', 
                                    'from_email': settings.DEFAULT_FROM_EMAIL,
                                    'post_reset_redirect': '/marco_profile/password/reset/done/' }),
    url(r'^password/reset/confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        auth_views.password_reset_confirm, { 'template_name': 'registration/marco_password_reset_confirm.html',
                                             'post_reset_redirect': '/marco_profile/password/reset/complete/' },
        name='marco_password_reset_confirm'),
    url(r'^password/reset/complete/$',
        auth_views.password_reset_complete, { 'template_name': 'registration/marco_password_reset_complete.html' }),
    url(r'^password/reset/done/$',
        auth_views.password_reset_done, {'template_name': 'registration/marco_password_reset_done.html'}),
    url(r'^password_change/(?P<username>\w+)/$', password_change),

    url(r'^signup/$',
        reg_views.register,
        {'backend': 'registration.backends.default.DefaultBackend', 
         #'disallowed_url': '',
         'success_url': 'registration/complete/',
         'template_name': 'registration/marco_registration_username_retry.html'},
         #'extra_context': {'username': 'Sam'}},
        name='marco_registration_register'
    ),
    url(r'^signup/registration/complete/$',
        TemplateView.as_view(template_name='registration/marco_registration_complete.html'),
        name='marco_registration_complete'),
    
    url(r'^forgot_username/$', send_username),
    url(r'^update_profile/(?P<username>\w+)/$', update_profile, {'use_openid': use_openid}),
    
    url(r'^duplicate_username$', duplicate_username),
    url(r'^verify_password$', verify_password),
)