#Created by Ashish on 04-12-2022
#Reason - To show Revenue, todays orders, pending orders on dashboard

from django import template
from ..models import *
from ..serializers import *
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum

register = template.Library()

@register.simple_tag
def getTodaysOrders():
    today=datetime.date.today()
    if Transaction_history.objects.filter(date=today) is not None:
        serialize=transactionHistorySerialize(Transaction_history.objects.filter(date=today).order_by("-payment_status"),many=True)
        return serialize.data 
    else:
        return {"msg":"no data found"}   

@register.simple_tag
def getRevenue():
   
    today=datetime.date.today()
    weekDay=today.weekday()
    startOfTheWeek=today - timedelta(days=weekDay)
    dayOfMonth=today.day
    startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
    thisYear=today.year
    data=[]

    summary=dict()
    totalOrders = Transaction_history.objects.filter(date=today).count()
    totalPendingOrders = Transaction_history.objects.filter(date=today,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date=today,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date=today,payment_status='cancel').count()
    totalIncome = Transaction_history.objects.filter(date=today,payment_status='paid').aggregate(Sum("grand_total"))
    summary["title"]="Today's Revenue"
    summary["totalOrders"]=totalOrders
    summary["totalPendingOrders"]=totalPendingOrders
    summary["totalPaidOrders"]=totalPaidOrders
    summary["totalCancelledOrders"]=totalCancelledOrders
    summary["totalRevenue"]=totalIncome["grand_total__sum"]
    data.append(summary)
    
    summary=dict()
    totalOrders=Transaction_history.objects.filter(date__gte=startOfTheWeek).count()
    totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='cancel').count()
    totalIncome=Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='paid').aggregate(Sum("grand_total"))
    summary["title"]="This Week's Revenue"
    summary["totalOrders"]=totalOrders
    summary["totalPendingOrders"]=totalPendingOrders
    summary["totalPaidOrders"]=totalPaidOrders
    summary["totalCancelledOrders"]=totalCancelledOrders
    summary["totalRevenue"]=totalIncome["grand_total__sum"]
    data.append(summary)

    summary=dict()
    totalOrders=Transaction_history.objects.filter(date__gte=startOfTheMonth).count()
    totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='cancel').count()
    totalIncome=Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='paid').aggregate(Sum("grand_total"))
    summary["title"]="This Month's Revenue"
    summary["totalOrders"]=totalOrders
    summary["totalPendingOrders"]=totalPendingOrders
    summary["totalPaidOrders"]=totalPaidOrders
    summary["totalCancelledOrders"]=totalCancelledOrders
    summary["totalRevenue"]=totalIncome["grand_total__sum"]
    data.append(summary)

    summary=dict()
    totalOrders=Transaction_history.objects.filter(date__year=thisYear).count()
    totalPendingOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='cancel').count()
    totalIncome=Transaction_history.objects.filter(date__year=thisYear,payment_status='paid').aggregate(Sum("grand_total"))
    summary["title"]="This Year's Revenue"
    summary["totalOrders"]=totalOrders
    summary["totalPendingOrders"]=totalPendingOrders
    summary["totalPaidOrders"]=totalPaidOrders
    summary["totalCancelledOrders"]=totalCancelledOrders
    summary["totalRevenue"]=totalIncome["grand_total__sum"]
    data.append(summary)

    return data        

@register.simple_tag
def getTodaysOrders():
    today=datetime.date.today()
    orders=Transaction_history.objects.filter(date=today).order_by("-payment_status")
    AllOrdersDetails=[]
    for order in orders:
        singleOrdersDetails=dict()
        singleOrdersDetails["orderData"]=order
        singleOrdersDetails["orderId"]=order.id
        user = User.objects.filter(email=order.user_no).first()
        singleOrdersDetails["userId"]=user.id
        AllOrdersDetails.append(singleOrdersDetails)
    return AllOrdersDetails 

@register.simple_tag
def getPendingOrders():
    # Modification and addition by Om Shrivastava on 21-12-23
    # Reason : Need to arrange the data by order number
    # orders=Transaction_history.objects.filter(payment_status="pending").order_by("-date")
    orders=Transaction_history.objects.filter(payment_status="pending").order_by("-order_no")
    # End of modification and addition by Om Shrivastava on 21-12-23
    # Reason : Need to arrange the data by order number

    AllPendingOrdersDetails=[]
    
    for order in orders:
        singlePendingOrderDetails=dict()
        singlePendingOrderDetails["orderData"]=order
        singlePendingOrderDetails["orderId"]=order.id
        user = User.objects.filter(email=order.user_no).first()
        singlePendingOrderDetails["userId"]=user.id
        AllPendingOrdersDetails.append(singlePendingOrderDetails)
    return AllPendingOrdersDetails 

# Added by - Ashish Dewangan on 14-12-2023
# Reason - To send completed orders to admin panel
@register.simple_tag
def getCompletedOrders():
    # Modification and addition by Om Shrivastava on 21-12-23
    # Reason : Need to arrange the data by order number
    # orders=Transaction_history.objects.filter(payment_status="paid").order_by("-date")
    # orders=Transaction_history.objects.filter(payment_status="paid").order_by("-date")
    orders=Transaction_history.objects.filter(payment_status="paid").order_by("-order_no")
    # End of modification and addition by Om Shrivastava on 21-12-23
    # Reason : Need to arrange the data by order number

    AllCompletedOrdersDetails=[]
    
    for order in orders:
        singleCompletedOrderDetails=dict()
        singleCompletedOrderDetails["orderData"]=order
        singleCompletedOrderDetails["orderId"]=order.id
        user = User.objects.filter(email=order.user_no).first()
        singleCompletedOrderDetails["userId"]=user.id
        AllCompletedOrdersDetails.append(singleCompletedOrderDetails)
    return AllCompletedOrdersDetails 
# End of code addition by - Ashish Dewangan on 14-12-2023
# Reason - To send completed orders to admin panel


@register.simple_tag
def getPieChartData():
    today=datetime.date.today()
    thisYear=today.year
    weekDay=today.weekday()
    startOfTheWeek=today - timedelta(days=weekDay)
    dayOfMonth=today.day
    startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
    data=dict()
    summaryLabels=["Pending Transactions","Completed Transactions","Cancelled Transactions"]
    
    totalPendingOrders = Transaction_history.objects.filter(date=today,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date=today,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date=today,payment_status='cancel').count()
    summaryScore=[]
    summaryScore.append(totalPendingOrders)
    summaryScore.append(totalPaidOrders)
    summaryScore.append(totalCancelledOrders)
    summaryData=dict()
    summaryData["scores"]=summaryScore
    summaryData["labels"]=summaryLabels
    data["today"]=summaryData

    totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='cancel').count()
    summaryScore=[]
    summaryScore.append(totalPendingOrders)
    summaryScore.append(totalPaidOrders)
    summaryScore.append(totalCancelledOrders)
    summaryData=dict()
    summaryData["scores"]=summaryScore
    summaryData["labels"]=summaryLabels
    data["thisWeek"]=summaryData

    totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='cancel').count()
    summaryScore=[]
    summaryScore.append(totalPendingOrders)
    summaryScore.append(totalPaidOrders)
    summaryScore.append(totalCancelledOrders)
    summaryData=dict()
    summaryData["scores"]=summaryScore
    summaryData["labels"]=summaryLabels
    data["thisMonth"]=summaryData

    totalPendingOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='pending').count()
    totalPaidOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='paid').count()
    totalCancelledOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='cancel').count()
    summaryScore=[]
    summaryScore.append(totalPendingOrders)
    summaryScore.append(totalPaidOrders)
    summaryScore.append(totalCancelledOrders)
    summaryData=dict()
    summaryData["scores"]=summaryScore
    summaryData["labels"]=summaryLabels
    data["thisYear"]=summaryData
    return data

# @register.simple_tag
# def getThisYearsOrders():
#     today = datetime.date.today()
#     thisYear=today.year
#     data=Transaction_history.objects.filter(date__year=thisYear).order_by("-payment_status")
#     return data     