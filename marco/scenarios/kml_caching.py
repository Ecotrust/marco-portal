from scenarios.models import KMLCache

def kml_cache_exists(key):
    try:
        cache = KMLCache.objects.get(key=key)
        return True
    except:
        return False

def get_kml_cache(key):
    #return django_cache.get(key)
    try:
        val = KMLCache.objects.get(key=key).val
        return val
    except:
        return None

def set_kml_cache(key, value):
    if kml_cache_exists(key):
        KMLCache.objects.get(key=key).delete()
    cache = KMLCache()
    cache.key = key
    cache.val = value
    cache.save()
    return value
    
def remove_kml_cache(instance):
    try:
        key = get_kml_cache_key(instance)
        KMLCache.objects.get(key=key).delete()
        return True
    except:
        return False
    
def empty_kml_cache(i_am_sure=False):
    if not i_am_sure:
        raise Exception("I don't believe you really want to do this...convice me.")
    KMLCache.objects.all().delete()
    
    
def get_kml_cache_key(model_instance, identifier='kml'):
    return '%s_%s_%s' %(model_instance.__class__.__name__, model_instance.pk, identifier)

def cache_kml(func):
    def caching_function(self):
        key = get_kml_cache_key(self)
        val = get_kml_cache(key)
        return set_kml_cache(key, func(self)) if val is None else val
    return caching_function
