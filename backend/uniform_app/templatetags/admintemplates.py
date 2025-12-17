# Created by - Ashlekh on 16-02-2024
# Reason - To show payment status (pending or completed)

from django import template
from uniform_app.models import *
from uniform_app.serializers import *
import datetime
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum

register = template.Library()

# @register.simple_tag(takes_context=True)
# def getJyotTypeRequestReport(context):
#     request=context['request']
#     data = dict()
#     totalJyotTypeRequest = JyotRequest.objects.all().count()
#     data['totalJyotRequest']=totalJyotTypeRequest
#     return data

# @register.simple_tag(takes_context=True)
# def getJyot(context):
#     request = context['request']
#     jyotData = dict()
#     # totalJyot = Jyot.objects.all().count()
#     totalJyot = Jyot.objects.all()
#     jyotData['totalJyotRequest'] = totalJyot
#     return jyotData