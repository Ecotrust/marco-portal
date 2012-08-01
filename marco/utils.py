from django.contrib.sites.models import Site

def get_domain():
    try:
        domain = Site.objects.all()[0].domain 
        if 'localhost' in domain:
            domain = 'localhost:8010'
        domain = 'http://' + domain
    except:
        domain = '..'   
    return domain
