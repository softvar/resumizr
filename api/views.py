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

from django.views.decorators.csrf import csrf_exempt
from django.utils import simplejson

import json

sys.path.append('../..')

from modules.forms import RegisterationForm , LoginForm

import datetime

from textblob import TextBlob

# list of social auth mapping
backends = ['twitter', 'github', 'facebook',
            'google-oauth2', 'linkedin-oauth2']


def home(request):
    '''Home view, displays login mechanism'''
    if request.user.is_authenticated():
        return redirect('user/dashboard')
    else:
        return redirect('login')


@strategy('social:complete')
def signup(request, backend, *args, **kwargs):
    ''' registeration form '''
    if request.user.is_authenticated():
        return redirect('user/dashboard')
    
    if request.method == 'POST':
        form = RegisterationForm(request.POST)

        homo_emails = User.objects.filter(email=request.POST['email']).count()
        homo_usernames = User.objects.filter(username = request.POST['username']).count()
        
        if(homo_emails > 0):
            form.errors['email'] = 'this email id is already taken did you <a href="/forgot-password/">forgot</a> password'

        elif(homo_usernames > 0):
            form.errors['username'] = 'this username is not available'


        elif form.is_valid():

            try:
                return do_complete(request.social_strategy, lambda strategy, user, social_user=None: auth_login(strategy.request, user), request.user)

            except exceptions.AuthException:
                form.errors['__all__'] = 'you have entered wrong username/password'

    
        else :
            print 'got error !!!'
            print form.errors.keys()

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
        return redirect('user/dashboard')
    else:
        return redirect('/users/password/reset')


def login(request):
    ''' login mechanism '''
    if request.user.is_authenticated():
        return redirect('user/dashboard')
    else:
        form = LoginForm()
        return render(request, 'login.html', {'oauth_providers': backends , 'form' : form})

@strategy('social:complete')
def username_login(request, backend, *args, **kwargs):
    ''' login form processing'''
    if request.user.is_authenticated():
        return redirect('user/dashboard')   
    
    if request.method == 'POST':
        form = LoginForm(request.POST)

        
        users = User.objects.filter(username=request.POST['username']).count()

        if(users == 0):
            form.errors['__all__'] = 'There is no user with username: '+request.POST['username']



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
    if request.user.is_authenticated():
        return redirect('../user/dashboard')
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




@login_required
def previewCv(request):
    if request.method == 'POST':
        request.POST
        contextRender = {'data': request.POST}
        return render(request, 'cv/preview.html',contextRender)
    else:
        return render(request, 'custom_404.html', '')

@login_required
def generateForm(request, resumeNum):
    ''' resume form rendere '''
    if request.method == 'POST':
        sectionHeading = request.POST.getlist("heading","")
        sectionContent = request.POST.getlist("content","")
        headingStatus =[]
        contentStatus = []

        # calculating sentimental analysis of each heading
        for eachHeading in sectionHeading:
            testimonial = TextBlob(str(eachHeading))
            headingStatus.append(testimonial.sentiment.polarity)

        # calculating sa of each content
        for eachContent in sectionContent:
            testimonial = TextBlob(str(eachContent))
            contentStatus.append(testimonial.sentiment.polarity)

        contextRender = {'headingStatus':headingStatus,'contentStatus':contentStatus}
        return render(request, 'cv/generateform.html',contextRender)
    else:
        _resumeJson = request.user.resumizr_data.resume_data['resume']
        resumeIds = []
        for key, value in _resumeJson.iteritems():
            resumeIds.append(key)
        if(resumeNum not in resumeIds):
            return render(request,'custom_404.html',{})
        else:
            return render(request, 'cv/generateform.html',{'user': request.user})

# @login_required
# @csrf_exempt
# def writepdf(request):
#     json_data = simplejson.loads(request.body)
#     try:
#       data = json_data['css']
#       print data
#     except KeyError:
#       HttpResponseServerError("Malformed data!")

#     if request.method == 'POST':
#         print 'POST'
#         c = {'lol':request.POST}
#         return HttpResponse(request.body,mimetype='application/json')
#         return render(request, request.body ,c)
#     else:
#         print 'data'
#         return render(request, 'landing_page/index.html', {})

def landing_page(request):
    return render(request, 'landing_page/index.html',{})    


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

@login_required
def refresh_social_data(request , backend) :
    ''' refreshes social data of particular backend and returns json '''
    access_token = None
    url = None
    payload = {}

    try:
        if backend == 'facebook':
            access_token = request.user.social_auth.get(provider='facebook').extra_data['access_token']
            url = 'https://graph.facebook.com/me/'
            payload = {'access_token':access_token}

        elif backend == 'github':
            access_token = request.user.social_auth.get(provider='github').extra_data['access_token']
            url = 'https://api.github.com/user'
            payload = {'access_token':access_token}

        elif backend == 'linkedin':
            access_token = request.user.social_auth.get(provider='linkedin-oauth2').extra_data['access_token']
            url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,summary,specialties,projects,email-address,positions,skills,educations,following,courses,num_connections)'
            payload = {'oauth2_access_token':access_token ,'format':'json'}

        else :
            return HttpResponse('Error : Invalid backend entered', mimetype='text/plain')


    except ObjectDoesNotExist:
        return HttpResponse('Error : Access token not available for '+backend, mimetype='text/plain')



    # making api call to corresponding social data vendor
    r = requests.get(url,params=payload)

    request.user.resumizr_data.detailed_social_data[backend] = r.json()

    if backend == 'github' :
        r_repos = requests.get(r.json()['repos_url'],params = payload)
        request.user.resumizr_data.detailed_social_data['github']['repos'] = r_repos.json()


    # saving the data
    request.user.resumizr_data.save()

    return HttpResponse(json.dumps(request.user.resumizr_data.detailed_social_data[backend]),mimetype='application/json')

@login_required
def fetch_social_data(request , backend) :
    ''' fetches social data of particular backend from database and returns json '''

    try :    
        return HttpResponse(json.dumps(request.user.resumizr_data.detailed_social_data[backend]),mimetype='application/json')

    except:
        return redirect('http://myapp.com:8000/users/refresh-social-data/'+backend)


@login_required
@csrf_exempt
def save_data(request, resumeId):
    if request.method == "POST" and request.is_ajax():
        #request.user.resumizr_data.resume_data['resume'] = {}
        request.user.resumizr_data.resume_data['resume'][resumeId] = json.loads(request.body)
        request.user.resumizr_data.save()
        return HttpResponse("OK")
    else:
        return HttpResponse("Not authorized.")



@login_required
def get_resume_data(request, resumeId):
    try :
        return HttpResponse(json.dumps(request.user.resumizr_data.resume_data['resume'][resumeId]),mimetype='application/json')
    except :
        print 'loha'
        return HttpResponse(json.dumps({'ERROR':'No such resumse data found'}),mimetype='application/json')



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
        return HttpResponse(r.text,mimetype='application/json')


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

