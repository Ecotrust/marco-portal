from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    url(r'^get_bookmarks$', get_bookmarks),
    url(r'^remove_bookmark$', remove_bookmark),
    url(r'^add_bookmark$', add_bookmark),
    url(r'^get_sharing_groups$', get_sharing_groups),
    url(r'share_bookmark$', share_bookmark),
    (r'^map', show_embedded_map),
    (r'^mobile', show_mobile_map),
    (r'', show_planner),
)
