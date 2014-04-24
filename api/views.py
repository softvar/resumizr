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
from api.models import ResumizrUserData
from django.core.exceptions import ObjectDoesNotExist
import requests


import json

sys.path.append('../..')

from modules.forms import RegisterationForm , LoginForm

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

        users = User.objects.filter(email=request.POST['email']).count()

        if(users > 0):
            form.errors['email'] = 'this email id is already taken did you <a href="/forgot-password/">forgot</a> password'


        elif form.is_valid():

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

def password_reset_middleware(request):
    ''' password change middlware '''
    #redirect if users is logged in
    if request.user.is_authenticated():
        return redirect('app')
    else:
        return redirect('/users/password/reset')


def login(request):
    ''' login mechanism '''
    if request.user.is_authenticated():
        return redirect('app')
    else:
        form = LoginForm()
        return render(request, 'login.html', {'oauth_providers': backends , 'form' : form})

@strategy('social:complete')
def username_login(request, backend, *args, **kwargs):
    ''' login form processing'''
    if request.user.is_authenticated():
        return redirect('app')   
    
    if request.method == 'POST':
        form = LoginForm(request.POST)

        
        users = User.objects.filter(username=request.POST['username']).count()

        if(users == 0):
            form.errors['__all__'] = 'you have entered wrong username/password'



        elif form.is_valid():

            try:
                return do_complete(request.social_strategy, lambda strategy, user, social_user=None: auth_login(strategy.request, user), request.user)

            except exceptions.AuthException:
                form.errors['__all__'] = 'you have entered wrong username/password'

    else:

        form = LoginForm()  # An unbound form

    return render(request, 'login.html', {'form' : form})





def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect(home)


@login_required
def app(request):
    """Login complete view, displays user data"""

    # checking if user has resumizr_data object and creating if it doesnt exists
    try:
        request.user.resumizr_data
    except ObjectDoesNotExist:
        request.user.resumizr_data = ResumizrUserData(user = request.user)
        request.user.resumizr_data.save()
    


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





# api test
@login_required
def fb_graph_test(request):
    fb_access_token = request.user.social_auth.get(provider='facebook').extra_data['access_token']

    if not fb_access_token:
        return HttpResponse('facebook access token not available', mimetype='application/text')

    else :
        payload = {'access_token':fb_access_token}
        r = requests.get('https://graph.facebook.com/me/',params=payload)
        request.user.resumizr_data.detailed_social_data['facebook'] = r.json()
        request.user.resumizr_data.save()
        return HttpResponse(r.text,mimetype='application/json')



@login_required
def github_api_test(request):
    
    try:
        github_access_token = request.user.social_auth.get(provider='github').extra_data['access_token']

    except ObjectDoesNotExist:
        return HttpResponse('github access token not available', mimetype='text/plain')
    
    if not github_access_token:
        return HttpResponse('github access token not available', mimetype='text/plain')

    else :
        payload = {'access_token':github_access_token}
        r = requests.get('https://api.github.com/user',params=payload)
        request.user.resumizr_data.detailed_social_data['github'] = r.json()

        r_repos = requests.get('https://api.github.com/users/psych0der/repos')
        #print r_repos.json()

        request.user.resumizr_data.detailed_social_data['github']['repos'] = r_repos.json()


        request.user.resumizr_data.save()
        return HttpResponse(json.dumps(request.user.resumizr_data.detailed_social_data['github']),mimetype='application/json')


@login_required
def linkedin_api_test(request):
    
    try:
        linkedin_access_token = request.user.social_auth.get(provider='linkedin-oauth2').extra_data['access_token']

    except ObjectDoesNotExist:
        return HttpResponse('linkedin access token not available', mimetype='text/plain')
    
    if not linkedin_access_token:
        return HttpResponse('linkedin access token not available', mimetype='text/plain')

    else :
        payload = {'oauth2_access_token':linkedin_access_token ,'format':'json'}
        r = requests.get('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,summary,specialties,email-address,positions,skills,educations,following,courses,num_connections)',params=payload)
        request.user.resumizr_data.detailed_social_data['linkedin'] = r.json()
        request.user.resumizr_data.save()
        return HttpResponse(r.text,mimetype='application/json')

    

