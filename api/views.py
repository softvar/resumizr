from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout




import datetime


def home(request):
    '''Home view, displays login mechanism'''
    if request.user.is_authenticated():
        return redirect('app')
    else :
    	return redirect('login')

def login(request):
	''' login mechanism '''
	return render(request,'social_auth.html')

def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect(home)

@login_required
def app(request):
    """Login complete view, displays user data"""
    #print dir(request.user.social_auth)

    return render(request,'app.html',{'user': request.user})
