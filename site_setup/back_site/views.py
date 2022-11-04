from distutils.command.config import config
from logging import raiseExceptions
from multiprocessing import context
from urllib import request, response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework import status
from django.contrib.auth import authenticate
from back_site.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated
import random  
import string  
from django.core import serializers
import jwt
from site_setup.settings import SIMPLE_JWT



def specific_string():  
    sample_string = 'pqrstuvwxydjlkfdsjk'  
    result = ''.join((random.choice(sample_string)) for x in range(10))  
    print(" Randomly generated string is: ", result) 


#generating token for auth by jwt
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    

    


# Create your views here.


class User2API(APIView,):
    def get(self,request):
        datap=product_detail.objects.all()
        datai=image.objects.all()
        serializers1=product_serializer(datap,many=True)
        serializers2=image_serializer(datai,many=True)
        return Response({"product":serializers1.data,"image":serializers2.data})
        
        
class UserRegistrationView(APIView):
      renderer_classes=[UserRenderer]
      def post(self,request,format=None):
          
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
              user=serializer.save()
              token=get_tokens_for_user(user)
              return Response({'token':token,'msg':'registration successfully done'},status=status.HTTP_201_CREATED)
              
        return Response(serializer.errors,status=status.HTTP_404_NOT_FOUND)     
      
      
      
class UserLoginView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
        serializer=UserLoginSerializer(data=request.data)
        if(serializer.is_valid(raise_exception=True)):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            user= authenticate(email=email,password=password)
            
            if user is not None:
                token=get_tokens_for_user(user)
                return Response({'token':token,'msg':'login successful'},status=status.HTTP_200_OK)   
            else:
                return Response({'errors':{'none_field_errors':['email or password is not valid']}},status=status.HTTP_404_NOT_FOUND)     
            
            
class UserProfileView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request,format=None):
        print(request.user)
        serializer=UserProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)
              
              
class UserChangePasswordView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=UserChangePasswordSerializer(data=request.data,context={'user':request.user,'oldPass':request.data['oldPass']})     
        if serializer.is_valid(raise_exception=True):
           return Response({'msg':'password change successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_)  
    
    
class SendPasswordResetEmailView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
         serailizer=SendPasswordResetEmailSerializer(data=request.data)
         if serailizer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset Link send. Please check your email'},status=status.HTTP_200_OK)          
         return Response({"error":serailizer.errors})  

class UserPasswordResetView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,uid,token,format=None):
        serializer=UserPasswordResetSerializer(data=request.data,context={'uid':uid,'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset Successfully'},status=status.HTTP_200_OK)          
        return Response(serializer.errors,status=status.HTTP_400_) 
    
    
class LikedUpdateView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serialize=LikeUpdateSerializer(data=request.data,context={"user":request.user}) 
        if serialize.is_valid(raise_exception=True):
            return Response({'msg':"Successful"})  
    def get(self,request):
        data =giveLikedDataSerializer(Liked.objects.filter(user_no=request.user),many=True)
        return Response({"liked":data.data})
    
    
class CartUpdateView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serialize=CartUpdateSerializer(data=request.data,context={"user":request.user}) 
        if serialize.is_valid(raise_exception=True):
           return Response({'msg':"Successful"})  
        
    def get(self,request):
        data =giveCartdDataSerializer(Cart.objects.filter(user_no=request.user),many=True)
        return Response({"cart":data.data})
        
class ProductSetting(APIView):
        renderer_classes=[UserRenderer]
        def get(self,request,category):
            cart=product_detail.objects.filter(category=category)
            serializers1=product_serializer(cart,many=True)
            return Response({"category":serializers1.data})
        
class picget(APIView):
        renderer_classes=[UserRenderer]
        def get(self,request):
            ser=getPictureSer(Head_img.objects.all(),many=True)
            return Response({"j":ser.data})
        
class Givingdetail(APIView):
        renderer_classes=[UserRenderer]
        def get(self,request,id):
            ser=product_serializer(product_detail.objects.get(id=id))
            return Response(ser.data)
        
        
class gettingAccess(APIView):
    def post(self,request):
        try:
          tokens = jwt.decode(request.data['refresh'],SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
          return Response(get_tokens_for_user(User.objects.get(id=tokens['user_id'])))  
        except:
          return Response({"error":"expired"})        
      
      
class cartBuyAll(APIView):
    def post(self,request):
        return Response(request.data)      
    
class CartSetting(APIView):
    def post(self,request):
        car= Cart.objects.get(user_no=request.user,product_no=product_detail.objects.get(id=request.data["id"]),size=request.data['size'])
        car.quantity=request.data['quantity']
        car.save()
        return Response({"success":car.quantity})    

class cardImage(APIView):
    def get(self,request):
              iamges=HomeCard_img.objects.all()
              serialize=getCardSer(iamges.last())              
              return Response({"response":serialize.data})
             
             
class shippingOrder(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        shippingData=request.data
        shippingData['user_id']=request.user.id
        serialize2=shippingSerializer(data=shippingData)
        try:
         if serialize2.is_valid(raise_exception=True):
            ship=serialize2.save()
            return Response({"shipping_id":ship.id})
        except:
          ship=usershippingDetail.objects.get(street=request.data['street'],city=request.data['city'],number=request.data['number'],user_id=request.user)
          return Response({"shipping_id":ship.id})
        return Response(request.data)       
    
class billingOrder(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        billingData=request.data
        billingData['user_id']=request.user.id
        serialize2=billingSerializer(data=billingData)
        try:
         if serialize2.is_valid(raise_exception=True):
            bill=serialize2.save()
            return Response({"billing_id":bill.id})
        except:
          bill=userbillingDetail.objects.get(street=request.data['street'],city=request.data['city'],number=request.data['number'],user_id=request.user)
          return Response({"billing_id":bill.id})
        return Response(request.data)          
             
class Invoice(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):           
        
        instanceshipping=usershippingDetail.objects.get(id=request.data['shipping_id'])
        instancebilling=userbillingDetail.objects.get(id=request.data['billing_id'])
        
        num=40000
        if Transaction_history.objects.all().last() is not None:
          num=Transaction_history.objects.all().last().order_no+1;
          
        date=45  
        cartdata=[];
        for cart in request.data['cart']:
            cartdata.append(cart)
            data={
                "order_no":num,
                "user_no":request.user.id,
                "billing_id":instancebilling.id,
                "shipping_id":instanceshipping.id,
                "product_id":cart['id'],
                "quantity":cart['quantity'],
                "price":cart['price'],
                "size":cart['size'],
                "payment_mode":request.data['payment']
            }
            serialize3=invoiceSerializer(data=data)
            if serialize3.is_valid(raise_exception=True):
                serialize3.save()          
     
        tran=Transaction_history.objects.create(order_no=num,payment_status="pending",user_no=request.user)   
        return Response({"order_no":tran.order_no,'cart':cartdata})             
    
    
class CartDelete(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]  
    def get(self,request):
        print(request.user)
        if Cart.objects.filter(user_no=request.user) is not None:
            Cart.objects.filter(user_no=request.user).delete()
        else:
            return Response("nothing is listed")
        return Response({"done":"successfully"})