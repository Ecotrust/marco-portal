from django.contrib.sites.models import Site
from settings import *

def get_domain():
    try:
        #domain = Site.objects.all()[0].domain 
        domain = Site.objects.get(id=SITE_ID).domain
        if 'localhost' in domain:
            domain = 'localhost:8010'
        domain = 'http://' + domain
    except:
        domain = '..'   
    return domain
