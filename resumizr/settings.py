# Django settings for server project.

import os

# setting up dynamic path

SETTINGS_DIR = os.path.dirname(__file__)
PROJECT_PATH = os.path.join(SETTINGS_DIR, os.pardir)
PROJECT_PATH = os.path.abspath(PROJECT_PATH)


TEMPLATE_PATH = os.path.join(PROJECT_PATH, 'templates')
MODULES_PATH = os.path.join(PROJECT_PATH,'modules')

if os.environ.get('DEVELOPMENT', None) == 'YES':
    DEBUG= True
else :
    DEBUG = False


TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

SITE_ID=u'53122d9b0638c70ed097a9a5'


MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine', 
        'NAME': 'resumizr',                      
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Asia/Calcutta'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'



# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = os.path.join(PROJECT_PATH, 'media') # Absolute path to the media directory

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

STATIC_PATH = os.path.join(PROJECT_PATH,'static')

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    STATIC_PATH,
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '63aa#=hxah4bg7_%x!b9f7b(y24^=ual%oqbg&(e61#yz9-x5z'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'resumizr.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'resumizr.wsgi.application'




TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    TEMPLATE_PATH,
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'djangotoolbox',
    'django_mongodb_engine',
    'api',
    'pdfconvertor',
    'django.contrib.admin',
    'social.apps.django_app.default',
   
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}


############################
## Test specific settings ##
############################

if DEBUG :
    EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
    EMAIL_FILE_PATH = os.path.join(PROJECT_PATH, 'tmp')

    EMAIL_HOST=''
    EMAIL_HOST_PASSWORD=''
    EMAIL_HOST_USER=''
    EMAIL_PORT = 25
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = ''
    SERVER_EMAIL = ''




###############################
## Social Auth configuration ##
###############################

SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/app/'

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.social_auth.associate_by_email',  # association by email enabled
    'social.pipeline.user.create_user',
    'api.pipeline.validate_password',
    'social.pipeline.mail.mail_validation',   # email vaildation for username auth
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details'
    
)


AUTHENTICATION_BACKENDS = (
    'social.backends.twitter.TwitterOAuth',
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.google.GoogleOAuth2',
    'social.backends.github.GithubOAuth2',
    'social.backends.username.UsernameAuth',
    'social.backends.linkedin.LinkedinOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)



SOCIAL_AUTH_USERNAME_FORCE_EMAIL_VALIDATION = True

# keys and secrets of social authentication services

SOCIAL_AUTH_TWITTER_KEY         = os.environ.get('TWITTER_KEY', None)
SOCIAL_AUTH_TWITTER_SECRET      = os.environ.get('TWITTER_SECRET', None)
SOCIAL_AUTH_FACEBOOK_KEY        = os.environ.get('FACEBOOK_KEY', None)
SOCIAL_AUTH_FACEBOOK_SECRET     = os.environ.get('FACEBOOK_SECRET', None)

SOCIAL_AUTH_GITHUB_KEY          = os.environ.get('GITHUB_KEY', None)
SOCIAL_AUTH_GITHUB_SECRET       = os.environ.get('GITHUB_SECRET', None)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY   = os.environ.get('GOOGLE_KEY', None)
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get('GOOGLE_SECRET', None)

SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY = os.environ.get('LINKEDIN_KEY', None)
SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET = os.environ.get('LINKEDIN_SECRET', None)



SOCIAL_AUTH_STRATEGY = 'social.strategies.django_strategy.DjangoStrategy'
SOCIAL_AUTH_STORAGE = 'social.apps.django_app.default.models.DjangoStorage'


LOGIN_URL          = '/login/'
LOGIN_REDIRECT_URL = '/app/'
LOGIN_ERROR_URL    = '/login-error/'
SOCIAL_AUTH_DISCONNECT_REDIRECT_URL = '/app/'

SOCIAL_AUTH_EMAIL_VALIDATION_FUNCTION = 'api.mail.send_validation'
SOCIAL_AUTH_EMAIL_VALIDATION_URL = '/email-sent/'



SOCIAL_AUTH_BACKEND_ERROR_URL = '/oauth-error/'

SOCIAL_AUTH_COMPLETE_URL_NAME  = 'socialauth_complete'
SOCIAL_AUTH_ASSOCIATE_URL_NAME = 'socialauth_associate_complete'

SOCIAL_AUTH_SANITIZE_REDIRECTS = False

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)

''' subject to change, refer : http://django-social-auth.readthedocs.org/en/latest/configuration.html '''


# oauth scopes

SOCIAL_AUTH_GOOGLE_OAUTH_SCOPE = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile'
]

SOCIAL_AUTH_FACEBOOK_SCOPE = ['email','user_birthday', 'user_about_me' , 'user_education_history','user_likes','user_interests']


SOCIAL_AUTH_GITHUB_SCOPE = ['user','public_repo']


SOCIAL_AUTH_LINKEDIN_OAUTH2_FIELD_SELECTORS = ['email-address', 'headline', 'industry','picture-url']

SOCIAL_AUTH_LINKEDIN_OAUTH2_EXTRA_DATA = [('id', 'id'),
                                   ('firstName', 'first_name'),
                                   ('lastName', 'last_name'),
                                   ('emailAddress', 'email_address'),
                                   ('headline', 'headline'),
                                   ('profile-picture', 'picture-url'),
                                   ('industry', 'industry')]




SOCIAL_AUTH_DEFAULT_USERNAME = 'new_social_auth_user'
SOCIAL_AUTH_UID_LENGTH = 16
SOCIAL_AUTH_ASSOCIATION_HANDLE_LENGTH = 16
SOCIAL_AUTH_NONCE_SERVER_URL_LENGTH = 16
SOCIAL_AUTH_ASSOCIATION_SERVER_URL_LENGTH = 16
SOCIAL_AUTH_ASSOCIATION_HANDLE_LENGTH = 16


#####################
## Heroku settings ##
#####################

if not DEBUG:

    # Parse database configuration from $DATABASE_URL
    import dj_database_url
    #DATABASES['default'] =  dj_database_url.config()


    DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine', 
        'NAME': 'resumizr',                      
        # The following settings are not used with sqlite3:
        'USER': 'resumizr',
        'PASSWORD': 'bholavarun',
        'HOST': 'mongodb://troup.mongohq.com/resumizr', 
        'PORT': '10071',                      # Set to empty string for default.
    }
    }


    # Honor the 'X-Forwarded-Proto' header for request.is_secure()
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    # Allow all host headers
    ALLOWED_HOSTS = ['*']

    # Static asset configuration
    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    STATIC_ROOT = 'staticfiles'
    STATIC_URL = '/static/'

    STATICFILES_DIRS = (
        os.path.join(BASE_DIR, 'static'),
    )