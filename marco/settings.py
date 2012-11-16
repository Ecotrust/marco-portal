# Django settings for lot project.
from madrona.common.default_settings import *

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIME_ZONE = 'America/Vancouver'
ROOT_URLCONF = 'urls' # 'marco.urls'
LOGIN_REDIRECT_URL = '/visualize'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'marco',
        'USER': 'vagrant',
    }
}

COMPRESS_CSS['application']['source_filenames'] += (
    'marco/css/analysis_reports.css',
    'kmltree/dist/kmltree_mod.css',
)

COMPRESS_JS['application']['source_filenames'] += (
    'marco/js/jquery.qtip-1.0.0-rc3.min.js',
    #'marco/js/mColorPicker.js',
)

LOG_FILE =  os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'marco.log'))

INSTALLED_APPS += ( 'clipping',
                    'general', 
                    'scenarios', 
                    'drawing',
                    'reports',
                    'data_manager',
                    'learn',
                    'explore',
                    'visualize',
                    'feedback',
                    'django.contrib.humanize',
                    'flatblocks',
                    'marco_profile' )

GEOMETRY_DB_SRID = 99996
GEOMETRY_CLIENT_SRID = 4326 #for latlon
GEOJSON_SRID = 3857

APP_NAME = "MARCO Mid-Atlantic Ocean Data Portal"
FEEDBACK_RECIPIENT = "MARCO Portal Team <info@midatlanticocean.org>"
HELP_EMAIL = "info@midatlanticocean.org"
DEFAULT_FROM_EMAIL = "MARCO Portal Team <info@midatlanticocean.org>"

TEMPLATE_DIRS = ( os.path.realpath(os.path.join(os.path.dirname(__file__), 'templates').replace('\\','/')), )

import logging
logging.getLogger('django.db.backends').setLevel(logging.ERROR)

from settings_local import *
