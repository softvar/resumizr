import sys
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout , login as auth_login, REDIRECT_FIELD_NAME
from django.conf import settings
from social.apps.django_app.utils import strategy
from social.actions import do_complete
from social.backends import username


import json

sys.path.append('../..')

from lib.forms import RegisterationForm

import datetime


# list of social auth mapping
backends = ['twitter', 'github', 'facebook',
            'google-oauth2', 'linkedin-oauth2']


def home(request):
    '''Home view, displays login mechanism'''
    if request.user.is_authenticated():
        return redirect('app')
    else:
        return redirect('login')


def signup_redirect(request):
    return redirect('signup')


@strategy('social:complete')
def signup(request,backend,*args, **kwargs):
    ''' registeration form '''
    if request.method == 'POST':
        form = RegisterationForm(request.POST)
        if form.is_valid():
            return do_complete(request.social_strategy,lambda strategy, user, social_user=None: auth_login(strategy.request, user), request.user) 

            if request.user.is_authenticated() :
                redirect('app')

    else:
        form = RegisterationForm()  # An unbound form

    return render(request, 'register.html', {
        'form': form,
    })


def login(request):
    ''' login mechanism '''
    if request.user.is_authenticated():
        return redirect('app')
    else:
        return render(request, 'social_auth.html', {'oauth_providers': backends})


def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect(home)


@login_required
def app(request):
    """Login complete view, displays user data"""

    # list of associated user auth
    associated_providers = [
        oauth.provider for oauth in request.user.social_auth.all()]

    oauth_providers = []

    for provider in backends:
        if provider not in associated_providers:
            oauth_providers.append(provider)

    return render(request, 'app.html', {'user': request.user, 'oauth_providers': oauth_providers})


''' user auth API '''


def username_availability(request, username):
    # available username
    users = User.objects.filter(username=username).count()
    if users == 0 :
        available = True
    else :
        available = False
    return HttpResponse(json.dumps({'available' : available}), content_type="application/json")




