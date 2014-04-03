from django.shortcuts import redirect
from social import exceptions
from social.pipeline.partial import partial

def validate_password(strategy, user, is_new=False, *args, **kwargs):
    if strategy.backend.name != 'username':
        return

    password = strategy.request_data()['password']
    if is_new:
        user.set_password(password)
        user.save()
    elif not user.check_password(password):
    	print 'not matched'
        raise exceptions.AuthException(strategy.backend)