# Create your views here.

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


from django.shortcuts import render, redirect

import json

import time
# list of social auth mapping
backends = ['twitter', 'github', 'facebook',
            'google-oauth2', 'linkedin-oauth2']
            
@login_required
def show_dashboard(request):
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

    context = {'user': request.user, 'oauth_providers': oauth_providers}
    return render(request, 'dashboard/index.html', context)

@login_required
def create_new_resume(request):
    numOfCv = len(request.user.resumizr_data.resume_data['resume']) + 1;
    now = time.strftime('%x %X')
    data = []
    data.append(now)
    #request.user.resumizr_data.resume_data['resume'] = {}
    request.user.resumizr_data.resume_data['resume'][str(numOfCv)]= {'UpdatedOn': data}
    request.user.resumizr_data.save()
    return HttpResponse(json.dumps({'no':numOfCv}),mimetype='application/json')

@login_required
def get_all_resumes(request):
    #try :
    numOfCv = len(request.user.resumizr_data.resume_data['resume'])
    _json = {}
    for x in xrange(1,numOfCv + 1):
        x = str(x)
        try:
            _json[x] = request.user.resumizr_data.resume_data['resume'][x]['UpdatedOn']
        except:
            _json[x] = ''
    return HttpResponse(json.dumps(_json),mimetype='application/json')
        #return HttpResponse(json.dumps(request.user.resumizr_data.resume_data['resume']),mimetype='application/json')
    #except :
    #    return HttpResponse(json.dumps({'ERROR':'No such resumse data found'}),mimetype='application/json')
