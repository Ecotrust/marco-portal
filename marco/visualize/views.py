# Create your views here.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from querystring_parser import parser
import simplejson
import settings
from models import *
from data_manager.models import *

def show_planner(request, template='planner.html'):
    try:
        socket_url = settings.SOCKET_URL
    except AttributeError:
        socket_url = ''
    context = {'MEDIA_URL': settings.MEDIA_URL, 'SOCKET_URL': socket_url, 'login': 'true'}
    return render_to_response(template, RequestContext(request, context)) 
    
def show_embedded_map(request, template='map.html'):
    context = {'MEDIA_URL': settings.MEDIA_URL}
    return render_to_response(template, RequestContext(request, context)) 
    
def get_bookmarks(request):
    #sync the client-side bookmarks with the server side bookmarks
    #update the server-side bookmarks and return the new list
    try:        
        bookmark_dict = parser.parse(request.POST.urlencode())['bookmarks']
    except:
        bookmark_dict = {}
    try:
        #loop through the list from the client
        #if user, bm_name, and bm_state match then skip 
        #otherwise, add to the db
        for key,bookmark in bookmark_dict.items():
            try:
                Bookmark.objects.get(user=request.user, name=bookmark['name'], url_hash=bookmark['hash'])
            except:
                new_bookmark = Bookmark(user=request.user, name=bookmark['name'], url_hash=bookmark['hash'])
                new_bookmark.save()
    
        #grab all bookmarks belonging to this user 
        #serialize bookmarks into 'name', 'hash' objects and return simplejson dump 
        content = []
        bookmark_list = Bookmark.objects.filter(user=request.user)
        for bookmark in bookmark_list:
            content.append({'name': bookmark.name, 'hash': bookmark.url_hash})
        return HttpResponse(simplejson.dumps(content), mimetype="application/json", status=200)
    except:
        return HttpResponse(status=304)
    
def remove_bookmark(request): 
    try:
        bookmark = Bookmark.objects.get(user=request.user, name=request.POST.get('name'), url_hash=request.POST.get('hash'))
        bookmark.delete()
        return HttpResponse(status=200)
    except:
        return HttpResponse(status=304)

def add_bookmark(request):
    try:
        bm = Bookmark(user=request.user, name=request.POST.get('name'), url_hash=request.POST.get('hash'))
        bm.save()
        return HttpResponse(status=200)
    except:
        return HttpResponse(status=304)
        