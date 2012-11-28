def settings(request):
    from django.conf import settings
    return {'SETTINGS': settings}