from django.shortcuts import render

# Create your views here.
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
import datetime

def login(request):
    now = datetime.datetime.now()
    t = get_template('index.html')
    html = t.render(Context({'user': 'varun','current_date': now}))
    return HttpResponse(html)
