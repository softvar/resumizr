from django.db import models
from django.conf import settings
from social.utils import setting_name
from djangotoolbox.fields import ListField, DictField


USER_MODEL = getattr(settings, setting_name('USER_MODEL'), None) or \
    getattr(settings, 'AUTH_USER_MODEL', None) or \
    'auth.User'


class ResumizrUserData(models.Model):

    ''' misc data for resumizr '''
    user = models.OneToOneField(USER_MODEL, related_name='resumizr_data')
    detailed_social_data = DictField()
    resume_data = DictField()
    subscribers = ListField()
    following = ListField()

    class Meta:
    	verbose_name_plural = "Resumizr User Data"
    	verbose_name = "Resumizr User Data"

    