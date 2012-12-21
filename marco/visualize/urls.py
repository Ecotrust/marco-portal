from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    url(r'^get_bookmarks$', get_bookmarks),
    url(r'^remove_bookmark$', remove_bookmark),
    url(r'^add_bookmark$', add_bookmark),
    (r'', show_planner),
)
