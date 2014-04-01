import sys
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout
from django.conf import settings

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


def register(request):
    ''' registeration form '''

    if request.method == 'POST':
        form = RegisterationForm(request.POST)
        if form.is_valid():
            return redirect('/thanks/')  # Redirect after POST
    else:
        form = RegisterationForm()  # An unbound form

    return render(request, 'register.html', {
        'form': form,
    })


def login(request):
    ''' login mechanism '''
    if request.user.is_authenticated():
        return redirect('app')
    else :
        return render(request,'social_auth.html',{'oauth_providers' : backends})
        
def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect(home)

@login_required
def app(request):
    """Login complete view, displays user data"""

    # list of associated user auth
    associated_providers = [oauth.provider for oauth in request.user.social_auth.all()]
   
    oauth_providers = []

    for provider in backends :
        if provider not in associated_providers:
            oauth_providers.append(provider)

    return render(request,'app.html',{'user': request.user, 'oauth_providers' : oauth_providers})
