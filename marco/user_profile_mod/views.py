from django.contrib.auth.forms import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from madrona.user_profile.models import UserProfile
from madrona.user_profile.forms import UserForm, UserProfileForm
from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME

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
        redirect_to = request.REQUEST.get(redirect_field_name, '')
        if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
            redirect_to = settings.LOGIN_REDIRECT_URL   
        uform = UserForm(data=request.POST, instance=user)
        pform = UserProfileForm(data=request.POST, instance=user_profile)
        if uform.is_valid():
            user.save()
        if pform.is_valid():
            user_profile.save()

        return HttpResponseRedirect(redirect_to)
    else:
        return HttpResponse("Received unexpected " + request.method + " request.", status=400)

@login_required
def change_password(request, 
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
        form = change_form(request.user, request.POST)
        if form.is_valid():
            form.save()
            #msg = urllib.quote(_("Password changed"))
            #redirect_to = "%s?%s" % (post_change_redirect, 
            #                    urllib.urlencode({"msg": msg}))
            #return HttpResponseRedirect(redirect_to)
            return HttpResponseRedirect(post_change_redirect)
    