from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout

import datetime


# list of social auth mapping
backends = ['twitter','github','facebook','google-oauth2','linkedin-oauth2']
    
    

def home(request):
    '''Home view, displays login mechanism'''
    if request.user.is_authenticated():
        return redirect('app')
    else :
    	return redirect('login')

def login(request):
	''' login mechanism '''
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
