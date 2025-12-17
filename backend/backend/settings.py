# from pathlib import Path
# import os
# from datetime import timedelta
# import logging.config

# BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY = 'django-insecure-6t3_v1#1*k%@(f5+b9arl=4vp#2f5k-fzb9ca%es)#g_8#y^-='

# DEBUG = True

# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'rest_framework',
#     'rest_framework_simplejwt',
#     'corsheaders',
#     'uniform_app',
#     # Code added by Unnati on 10-06-2024
#     # Reason - Installed ckeditor


#     'ckeditor',

#     # End of code addition by Unnati on 10-06-2024
#     # Reason - Installed ckeditor
#     'colorfield',
# ]

# MIDDLEWARE = [
#     "corsheaders.middleware.CorsMiddleware",
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'backend.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'backend.wsgi.application'

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": "euniform",
#         # for local ----------->
#         "USER": "postgres",
#         "PASSWORD": "admin",
#         # for server ---------->
#         #"USER": "admin",
#         #"PASSWORD": "Adyant@0122",
#         "HOST": "localhost",
#         "PORT": "5432",
#     }
# }

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     )
# }

# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = "Asia/Kolkata"

# USE_I18N = True

# USE_TZ = True

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# STATIC_ROOT = os.path.join(BASE_DIR, "admin_app/static")


# # for local ------------>
# STATIC_URL = 'static/'

# # for server ------------>
# #STATIC_URL = "/staticfiles/"

# # Added by - Jhamman on 11-10-2024
# # Reason - Added a link for site
# SITE_URL = "http://192.168.1.11:8000/"
# # End of code addition by - Jhamman on 11-10-2024
# # Reason - Added a link for site

# # Added by - Ashish Dewangan on 28-11-2024
# # Reason - variable being used in stripe's code 
# DOMAIN_URL_FOR_STRIPE = "http://localhost:3000"
# # End of code addition by - Ashish Dewangan on 28-11-2024
# # Reason - variable being used in stripe's code 

# MEDIA_ROOT = os.path.join(BASE_DIR, "media")
# MEDIA_URL = "media/"

# # CORS_ALLOWED_ORIGINS=[]
# CORS_ALLOW_ALL_ORIGINS = True
# ALLOWED_HOSTS = ["*"]
# CORS_ALLOW_CREDENTIALS = True

# AUTH_USER_MODEL = "uniform_app.User"

# CSRF_TRUSTED_ORIGINS = ['https://euniform.adyantsofttech.com', 'http://euniform.adyantsofttech.com']

# """
# Added by - Ashish Dewangan on 26-05-2024
# Reason - To configure email setting
# """
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_USE_TLS = True
# EMAIL_PORT = 587
# # EMAIL_ HOST_USER = 'om2019sri@gmail.com'
# # EMAIL_ HOST_ PASSWORD - 'shfjpvicaylvssj'
# EMAIL_HOST_USER = 'adyant.ashishdew@gmail.com'
# EMAIL_HOST_PASSWORD = 'iodgtzixghezvmrx'
# """
# End of code addition by - Ashish Dewangan on 26-05-2024
# Reason - To configure email setting
# """

# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(minutes=180),
#     "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
#     # "REFRESH_TOKEN_LIFETIME": timedelta(minutes=30),
#     "ROTATE_REFRESH_TOKENS": False,
#     "BLACKLIST_AFTER_ROTATION": False,
#     "UPDATE_LAST_LOGIN": False,

#     "ALGORITHM": "HS256",
#     "SIGNING_KEY": SECRET_KEY,
#     "VERIFYING_KEY": "",
#     "AUDIENCE": None,
#     "ISSUER": None,
#     "JSON_ENCODER": None,
#     "JWK_URL": None,
#     "LEEWAY": 0,

#     "AUTH_HEADER_TYPES": ("Bearer",),
#     "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
#     "USER_ID_FIELD": "id",
#     "USER_ID_CLAIM": "user_id",
#     "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

#     "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
#     "TOKEN_TYPE_CLAIM": "token_type",
#     "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

#     "JTI_CLAIM": "jti",

#     "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
#     "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
#     "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

#     "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
#     "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
#     "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
#     "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
#     "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
#     "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
# }
# '''
# Code added by Unnati on 10-06-2024
# Reason - Added ckeditor
# '''
# CKEDITOR_CONFIGS = {
#     'default': {
#         'toolbar': 'full',
#     },
# }
# '''
# End of code addition by Unnati on 10-06-2024
# Reason - Added ckeditor
# '''


# # Added by - Ashish Dewangan on 24-07-2024
# # Reason - To have logging functionality
# LOGGING_CONFIG = logging.config.dictConfig({
#     "version": 1,
#     "disable_existing_loggers": True,

#     "formatters": {
#         "simple": {
#             "format": "{levelname} {asctime} {module} {lineno:d} {message}",
#             "style": "{",

#         },
#     },
#     "handlers": {
#         "DjangoLogsHandler": {
#             "level": "DEBUG",
#             "class": "logging.handlers.RotatingFileHandler",
#             "filename":  "./logs/django_logs.log",
#             'maxBytes': 1024 * 1024 * 5,  # 1024 * 1024 * 1 = 1MB
#             'backupCount': 5,
#             "formatter": "simple",
#             'delay': True
#         },
#         "CustomLogsHandler": {
#             "level": "DEBUG",
#             "class": "logging.handlers.RotatingFileHandler",
#             "filename":  "./logs/custom_logs.log",
#             'maxBytes': 1024 * 1024 * 1,  # 1024 * 1024 * 1 1MB
#             'backupCount': 5,
#             "formatter": "simple",
#             'delay': True
#         },
#     },
#     "loggers": {
#         "django": {
#             "handlers": ["DjangoLogsHandler"],
#             "level": "INFO",
#             "propagate": True,
#         },
#         "custom_logger": {
#             "handlers": ["CustomLogsHandler"],
#             "level": "INFO",
#             "propagate": True,
#         },
#     }
# })
# # End of code addition by - Ashish Dewangan on 24-07-2024
# # Reason - To have logging functionality



from pathlib import Path
from datetime import timedelta
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-wl*u#gsj^b%)#7kf%wj-0^1nn)_9dd1=^t(=bh#qj&sm74sm*!'
SECRET_KEY = 'django-insecure-f88pdh#efcjx_s#2p4#8ov7n=z%(o888wsyh6-3hxujay#wc+-'

# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = ['10.73.112.144']
ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'admin_volt.apps.AdminVoltConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'uniform_app',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'phone_field',
    'ckeditor'

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.common.CommonMiddleware",


]

CKEDITOR_CONFIGS = {
  'default': {
    'removePlugins': 'stylesheetparser',
    'allowedContent': True,
  },
}

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Commented and modifed by Ashish Dewangan on 05-12-2022
        # Reason - To register cutom templates 
        # 'DIRS': [],
        # 'DIRS': ['uniform_app/templates',],
         'DIRS': [
            BASE_DIR / "templates",
        ],
        # End of code modification
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    
    # 'default': {
    #     'ENGINE': 'django.db.backends.postgresql',
    #     'NAME': 'rbyr_db',
    #     'USER': 'postgres',
    #     'PASSWORD': 'admin',
    #     'HOST': 'localhost',
    #     'PORT': '5432',
    # }
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': "rbyr",
        'USER': 'admin',
        'PASSWORD': 'Adyant@0122',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# REST_FRAMEWORK = {
                
#     'DEFAULT_AUTHENTICATION_CLASSES': (
        
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
    
# }

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

# Commented and modified by - Ashish Dewangan on 02-12-2023
# Reason - To set server's time zone
# TIME_ZONE = 'GMT'
TIME_ZONE = 'Asia/Kolkata'
# End of code modification by - Ashish Dewangan on 02-12-2023
# Reason - To set server's time zone

USE_I18N = True

USE_TZ = True

SITE_URL = "https://rbyr.adyantsofttech.com/"

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

# Base_url="http://10.73.112.144:3000"


import os
# STATIC_URL = '/static/'
# STATIC_ROOT =  os.path.join(BASE_DIR, 'static')
STATIC_URL = 'static/'
STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, 'uniform_app/static')
MEDIA_URL = 'media/'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# CORS_ORIGIN_ALLOW_ALL=True
# CORS_ALLOW_CREDENTIAL=True


# CORS_ORIGIN_WHITELIST = [
#      "http://localhost:3000",
#      "http://10.73.112.144:3000",
# ]

# Django project settings.py
AUTH_USER_MODEL= 'uniform_app.User'
# CSRF_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = True

# CSRF_COOKIE_HTTPONLY = True
# Email Confiuration
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_USE_TLS = True
# EMAIL_PORT = 25
# EMAIL_HOST_USER="adyant.rohan@gmail.com"
# EMAIL_HOST_PASSWORD="dvzgndsfzrxpbchx"

# Modification and addition by Om Shrivastava on 22-11-23
# Reason : Need to Add new Email and password 
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_HOST_USER = 'adyant.rohan@gmail.com'
# EMAIL_HOST_PASSWORD = 'dvzgndsfzrxpbchx'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'    

EMAIL_HOST= 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587

# EMAIL_HOST_USER = 'tq.buildcon@gmail.com'
# EMAIL_HOST_PASSWORD = 'xoodgdrderlwlsgz'
EMAIL_HOST_USER = 'rbyr2023@gmail.com'
EMAIL_HOST_PASSWORD = 'phcc pqul yufd soce'



# End of modification and addition by Om Shrivastava on 22-11-23
# Reason : Need to Add new Email and password 

# CSRF_TRUSTED_ORIGINS=['https://*.10.73.112.144']
CSRF_TRUSTED_ORIGINS=['https://rbyr.adyantsofttech.com', 'http://rbyr.adyantsofttech.com']


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=180),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    # "REFRESH_TOKEN_LIFETIME": timedelta(minutes=30),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

PASSWORD_RESET_TIMEOUT = 1800 # 30 mint, in seconds

# CORS_ALLOWED_ORIGINS=[
#     "http://localhost:3000",
#     "http://10.73.112.144:3000",
# ]

# Added by - Ashish Dewangan on 13-12-2023
# Reason - To specify http mehtod used
HTTP_METHOD="http://"
# End of code addition by - Ashish Dewangan on 13-12-2023
# Reason - To specify http mehtod used