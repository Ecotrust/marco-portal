from django.contrib.auth.forms import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from madrona.user_profile.models import UserProfile
from madrona.user_profile.forms import UserForm, UserProfileForm
from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
import simplejson

def verify_password(request):
    username = request.POST.get('username', None)
    password = request.POST.get('password', None)
    
    if username and password:
        try:
            user = User.objects.get(username=username)
            if not user.is_active:
                return HttpResponse(simplejson.dumps({'verified': 'inactive'}), mimetype="application/json", status=200)
            if user.check_password(password):
                return HttpResponse(simplejson.dumps({'verified': True}), mimetype="application/json", status=200)
            else:
                return HttpResponse(simplejson.dumps({'verified': False}), mimetype="application/json", status=200)
        except:
            return HttpResponse(simplejson.dumps({'verified': False}), mimetype="application/json", status=200)
    else:
        return HttpResponse("Received unexpected " + request.method + " request.", status=400)

def duplicate_username(request):
    username = request.GET.get('username', None)
    if username:
        try:
            User.objects.get(username=username)
            found = True
        except:
            found = False
    else:
        return HttpResponse('username not found', status=400)
        
    return HttpResponse(simplejson.dumps({'duplicate': found}), mimetype="application/json", status=200) 

def send_username(request, use_openid=False, redirect_field_name=REDIRECT_FIELD_NAME):
    if request.method == 'POST':
        subject = 'MARCO login'
        reply_email = "MARCO Portal Team <%s>" % settings.DEFAULT_FROM_EMAIL
        #check for user account
        user_email = [request.POST.get('email', '')]
        try:
            user = User.objects.filter(email=user_email[0])[0]
            username = user.username
        except:
            username = None
        if username:
            message = "Hello,"
            message += "\n\nYour username for the MARCO Planner is:  %s" %username
            message += "\n\n-MARCO Portal Technical Team"
        else:
            message = "Hello,"
            message += "\n\nWe did not find a username associated with this email address." 
            message += "\nYou may want to try another email address, or register for an account with this email address."
            message += "\n\Feel free to reply to this email if this does not resolve your problem and you would like further assistance."
            message += "\n\n-MARCO Portal Technical Team"

        #send notification of profile change to user
        if user_email and reply_email:
            try:
                send_mail(subject, message, reply_email, user_email)
            except BadHeaderError:
                return HttpResponse('Invalid header found.')

        #prepare redirect
        redirect_to = request.REQUEST.get(redirect_field_name, '')
        if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
            redirect_to = settings.LOGIN_REDIRECT_URL   
        
        return HttpResponseRedirect(redirect_to)
    else:
        return HttpResponse("Received unexpected " + request.method + " request.", status=400)

@login_required
def update_profile(request, username, use_openid=False, redirect_field_name=REDIRECT_FIELD_NAME):
    """
    redirect_field_name: string, field name used for redirect. by default 'next'
    """
    if request.user.username != username:
        return HttpResponse("You cannot access another user's profile.", status=401)
    else:
        user = User.objects.get(username=username)
        try:
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=user)

    if request.method == 'POST':
        #prepare email fields
        subject = 'MARCO profile change'
        user_email = user.email
        reply_email = "MARCO Portal Team<%s>" % settings.DEFAULT_FROM_EMAIL
        message = "Your MARCO Portal profile was just updated."
        message += "\nIf this was in error, please contact us immediately so that we can rectify the situation."
        message += "\n\nThank you."
        message += "\n\n-MARCO Portal technical staff"
    
        #prepare redirect
        redirect_to = request.REQUEST.get(redirect_field_name, '')
        if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
            redirect_to = settings.LOGIN_REDIRECT_URL   
        
        #update user profile
        uform = UserForm(data=request.POST, instance=user)
        pform = UserProfileForm(data=request.POST, instance=user_profile)
        if uform.is_valid():
            user.save()
        if pform.is_valid():
            user_profile.save()
        
        #send notification of profile change to user
        if user_email and reply_email:
            try:
                send_mail(subject, message, reply_email, user_email)
            except:
                pass

        return HttpResponseRedirect(redirect_to)
    else:
        return HttpResponse("Received unexpected " + request.method + " request.", status=400)

'''
@login_required
def password_change(request):
    # call openid.views password_change?
    #password_change(request, 
    #    template_name='authopenid/password_change_form.html', 
    #    set_password_form=SetPasswordForm, 
    #    change_password_form=PasswordChangeForm, post_change_redirect=None, 
    #    extra_context=None):
'''        

@login_required
def password_change(request, username,
        set_password_form=SetPasswordForm, 
        change_password_form=PasswordChangeForm, 
        redirect_field_name=REDIRECT_FIELD_NAME,
        post_change_redirect=None):
    """
    View that allow a user to add a password to its account or change it.

    :request: request object
    :set_password_form: form use to create a new password. By default 
    ``django.contrib.auth.forms.SetPasswordForm``
    :change_password_form: form objectto change passworf. 
    by default `django.contrib.auth.forms.SetPasswordForm.PasswordChangeForm` 
    form auser auth contrib.
    :redirect_field_name: string, field name used for redirect. by default 'next'
    :post_change_redirect: url used to redirect user after password change.
    It take the register_form as param.
    """
    
    if request.user.username != username:
        return HttpResponse("You cannot access another user's profile.", status=401)
    else:
        user = User.objects.get(username=username)
    
    if post_change_redirect is None:
        post_change_redirect = request.REQUEST.get(redirect_field_name, '')
        if not post_change_redirect or '//' in post_change_redirect or ' ' in post_change_redirect:
            post_change_redirect = settings.LOGIN_REDIRECT_URL   

    set_password = False
    if request.user.has_usable_password():
        change_form = change_password_form
    else:
        set_password = True
        change_form = set_password_form

    if request.POST:
        #prepare email fields
        subject = 'MARCO profile change'
        user_email = user.email
        reply_email = "MARCO Portal Team<%s>" % settings.DEFAULT_FROM_EMAIL
        message = "Your MARCO Portal password was just changed."
        message += "\nIf you did not make this change, please contact us immediately."
        message += "\n\nThank you."
        message += "\n\n-MARCO Portal technical staff"
        
        form = change_form(request.user, request.POST)
        if form.is_valid():
            form.save()
            #send notification of profile change to user
            if user_email and reply_email:
                try:
                    send_mail(subject, message, reply_email, user_email)
                except:
                    pass
            return HttpResponseRedirect(post_change_redirect)
        else:
            #what to do if form is invalid?
            pass
    else:
        return HttpResponse("Received unexpected " + request.method + " request.", status=400)
