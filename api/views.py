import sys
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout, login as auth_login
from django.conf import settings
from social.apps.django_app.utils import strategy
from social.actions import do_complete
from social.backends import username
from social import exceptions


import json

sys.path.append('../..')

from lib.forms import RegisterationForm , LoginForm

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


@strategy('social:complete')
def signup(request, backend, *args, **kwargs):
    ''' registeration form '''
    if request.user.is_authenticated():
        return redirect('app')
    
    if request.method == 'POST':
        form = RegisterationForm(request.POST)

        if form.is_valid():

            try:
                return do_complete(request.social_strategy, lambda strategy, user, social_user=None: auth_login(strategy.request, user), request.user)

            except exceptions.AuthException:
                form.errors['__all__'] = 'you have entered wrong username/password'

    else:

        form = RegisterationForm()  # An unbound form

    return render(request, 'register.html', {
        'form': form,
    })


def validation_sent(request):
    return render(request,'validation_sent.html', {
        'email': request.session.get('email_validation_address')
    })




def login(request):
    ''' login mechanism '''
    if request.user.is_authenticated():
        return redirect('app')
    else:
        form = LoginForm()
        return render(request, 'social_auth.html', {'oauth_providers': backends , 'form' : form})

@strategy('social:complete')
def username_login(request, backend, *args, **kwargs):
    ''' login form processing'''
    if request.user.is_authenticated():
        return redirect('app')   
    
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():

            try:
                return do_complete(request.social_strategy, lambda strategy, user, social_user=None: auth_login(strategy.request, user), request.user)

            except exceptions.AuthException:
                form.errors['__all__'] = 'you have entered wrong username/password'

    else:

        form = LoginForm()  # An unbound form

    return render(request, 'social_auth.html', {'form' : form})





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




# helper functions





# user auth API 

def username_availability(request, username):
    ''' checks availability of username '''
    users = User.objects.filter(username=username).count()
    if users == 0:
        available = True
    else:
        available = False
    return HttpResponse(json.dumps({'available': available}), content_type="application/json")
