from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',

    url(r'', include('social.apps.django_app.urls', namespace='social')),
    
    # API
    url(r'^usernames/(?P<username>\w+)/$','api.views.username_availability',name='username_availability'),
    url(r'^users/social-data/(?P<backend>\w+)/$','api.views.fetch_social_data',name='fetch_social_data'),
    url(r'^users/refresh-social-data/(?P<backend>\w+)/$','api.views.refresh_social_data',name='refresh_social_data'),

    # api test
    url(r'^fb-graph-test/$','api.views.fb_graph_test'),
    url(r'^github-api-test/$','api.views.github_api_test'),
    url(r'^linkedin-api-test/$','api.views.linkedin_api_test'),

    # forget password implementation
    url(r'^forgot-password/$','api.views.password_reset_middleware', name='forgot_password'),

    url(r'^users/password/reset/$', 'django.contrib.auth.views.password_reset', 
        {'post_reset_redirect' : '/users/password/reset/done/'}),
    url(r'^users/password/reset/done/$', 'django.contrib.auth.views.password_reset_done'),
    url(r'^users/password/reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm', 
        {'post_reset_redirect' : '/users/password/done/'}),
    url(r'^users/password/done/$', 'django.contrib.auth.views.password_reset_complete'),


    url(r'^$', 'api.views.home',name='home'),
    url(r'^signup/(?P<backend>[^/]+)/$', 'api.views.signup', name='signup'),
    url(r'^signup/$' , RedirectView.as_view(url='/signup/username/')),
    url(r'^email-sent/', 'api.views.validation_sent'),

    url(r'^resumizr-login/(?P<backend>[^/]+)/$', 'api.views.username_login', name='username_login'),
    
    url(r'^login/$','api.views.login', name='login'),
    url(r'^logout/$','api.views.logout', name='logout'),
    url(r'^app/$','api.views.app',name='app'),
    url(r'^admin/', include(admin.site.urls)),
    
)

#development media server
if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )