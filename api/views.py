from django.shortcuts import render

# Create your views here.
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.shortcuts import render
import datetime


def test_login(request):
    #now = datetime.datetime.now()
    return render(request,'index.html',{'user': 'varun','current_date': datetime.datetime.now()})


def social_auth_login(request):
	return render(request,'social_auth.html')
