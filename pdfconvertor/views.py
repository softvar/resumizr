# Create your views here.

from django.http import HttpResponse


from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import simplejson

# module to convert html/css to pdf
from weasyprint import HTML, CSS


@login_required
@csrf_exempt
def writepdf(request):

    if request.method == 'POST':
        json_data = simplejson.loads(request.body)
        try:
            data = json_data['css']
            if (data == 'professional'):
                with open('api/resume-pre-templates/bootstrap-file', 'r') as content:
                    cssData = content.read()
                
                with open('api/resume-pre-templates/design-professional', 'r') as content:
                    cssData += content.read()
                HTML(string=json_data['html']).write_pdf('lol.pdf',stylesheets=[CSS(string=cssData)])
        except KeyError:
          HttpResponseServerError("Malformed data!")
        
        return HttpResponse(request.body,mimetype='application/json')
        
    else:
        print 'data'
        return render(request, 'landing_page/index.html', {})