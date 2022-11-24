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
                return Response({'errors':{'none_field_errors':['Email or Password is not valid.']}},status=status.HTTP_404_NOT_FOUND)     
            
            
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
        try:
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
                
                if(cart['size']=="Short"):
                    pro=product_detail.objects.get(id=cart['id'])
                    pro.S=pro.S-cart['quantity']
                    print(pro.S)
                    pro.save()
                elif(cart['size']=="Medium"):
                    pro=product_detail.objects.get(id=cart['id'])
                    pro.M=pro.M-cart['quantity']
                    print(pro.M)
                    pro.save() 
                elif(cart['size']=="Large"):
                    pro=product_detail.objects.get(id=cart['id'])
                    pro.L=pro.L-cart['quantity']
                    print(pro.L)
                    pro.save()
                elif(cart['size']=="Extra Large"):
                    pro=product_detail.objects.get(id=cart['id'])
                    pro.XL=pro.XL-cart['quantity']
                    print(pro.XL)
                    pro.save()  
                elif(cart['size']=="Extra Extra Large"):
                    pro=product_detail.objects.get(id=cart['id'])
                    pro.XXL=pro.XXL-cart['quantity']
                    print(pro.XXL)
                    pro.save()  
                    
                
                serialize3=invoiceSerializer(data=data)
                if serialize3.is_valid(raise_exception=True):
                    serialize3.save()       
                    
        
            tran=Transaction_history.objects.create( order_no=num,payment_status="pending"
                                                    ,user_no=request.user
                                                    ,coupon_discount=request.data['CouponDiscount']
                                                    ,shipping_price=request.data['ShippingCharges']
                                                    ,subtotal_price=request.data['SubTotal']
                                                    ,tax=request.data['tax']
                                                    ,grand_total=request.data['grand'] )  
            tran.save() 
            return Response({"order_no":tran.order_no,'cart':cartdata})   
        except:
            return Response({"error":"Facing issue on generating bill please contact to Admin"})          
    
    
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
    
class Invoiceget(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def get(self,request):
        serialize=6
        if product_orders.objects.filter(user_no=request.user) is not None:
            serialize=invoiceSerializer(product_orders.objects.filter(user_no=request.user),many=True)
        else:
            return Response({})    
        return Response(serialize.data)    
    
    
class InvoiceSingleget(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def put(self,request):
        serialize=6
        if product_orders.objects.filter(user_no=request.user) is not None:
            serialize=invoiceSerializer(product_orders.objects.filter(user_no=request.user,order_no=request.data['order']),many=True)
        else:
            return Response({})
        
        shipping=serialize.data[0]['shipping_id']
        billing=serialize.data[0]['billing_id']
        orderno=serialize.data[0]['order_no']

        shippingSeri= shippingSerializer(usershippingDetail.objects.get(id=shipping))
        billingSeri=billingSerializer(userbillingDetail.objects.get(id=billing))
        transactionSeri=transactionHistorySerialize(Transaction_history.objects.get(order_no=orderno))
        return Response({"history":serialize.data,"shipping":shippingSeri.data,"billing":billingSeri.data,"transaction":transactionSeri.data})        
    
    
class transactionget(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def get(self,request):
        serialize=6
        pro=7
        prodata=[]
        if Transaction_history.objects.filter(user_no=request.user) is not None:
            serialize=transactionHistorySerialize(Transaction_history.objects.filter(user_no=request.user),many=True)
            for data in serialize.data:
                pro=product_orders.objects.filter(user_no=request.user,order_no=data['order_no']).last()
                data['firstname']=pro.billing_id.firstname
                data['lastname']=pro.billing_id.lastname
                prodata.append(data)
        else:
            return Response({})    
        
        return Response({"response":prodata})    
    
    
class ShippingGetApi(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def get(self,request):
        serialize=6
        if usershippingDetail.objects.filter(user_id=request.user) is not None:
            serialize=shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True)
        else:
            return Response({})    
        return Response(serialize.data)   
    
    
    
class ShippingUpdateApi(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def put(self,request):
        serialize=6
        ship=request.data
        ship_instance=usershippingDetail.objects.get(id=ship['id'])  
        ship_instance.firstname=ship['firstname']
        ship_instance.lastname=ship['lastname']
        ship_instance.state=ship['state']
        ship_instance.city=ship['city']
        ship_instance.houseno=ship['houseno']
        ship_instance.street=ship['street']
        ship_instance.zipcode=ship['country']
        ship_instance.country=ship['zipcode']
        ship_instance.number=ship['number']
        ship_instance.save()
        # if usershippingDetail.objects.filter(user_id=request.user) is not None:
        #     serialize=shippingSerializer(,usershippingDetail.objects.filter(user_id=request.user),many=True)
        # else:
        #     return Response({})    
        return Response({"msg":"successFully"}) 
    
    
    
    
class ShippingDeleteApi(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated] 
    def put(self,request):
        usershippingDetail.objects.get(id=request.data).delete()
        return Response({"msg":"successfully"})
    
class getQrDetails(APIView):
      def get(self,request):
       try:
        serialize= QrDetailSerializer(Online_Qr.objects.all().last())  
        print(serialize.data)
        return Response(serialize.data)
       except:
           return Response({"error":"something went wrong"})
       
       
class IncrementCheck(APIView):
    def post(self,request):
        try:
           size=request.data['size']
           quantity=request.data['quantity']+1
           product_instance= product_detail.objects.get(id=request.data['id'])
           from django.forms.models import model_to_dict
           ff=model_to_dict(product_instance)
           if quantity>ff.get(size):
              return Response({"error":True})
           else:
              return Response({"success":True})
        except:
            return Response({"error":True})
        
        
class CouponCheck(APIView):
    def post(self,request):
        try:
         if coupon.objects.get(promocode=request.data) is not None:
            if coupon.objects.get(promocode=request.data).expiry_date<datetime.date.today():
                return Response({"error":"This Coupon is Expired"})
            if coupon.objects.get(promocode=request.data).isActive==False:
                return Response({"error":"This Coupon is Not Active"})
            serialize= promocodeSerilizer(coupon.objects.get(promocode=request.data))
            return Response(serialize.data)
        except:
         return Response({"error":"Coupon You Entered is not exist"})        
     
     
class TaxGet(APIView):
    def get(self,request):
        if Tax.objects.last() is not None:
            serialize=TaxSerilizer(Tax.objects.last())
            return Response(serialize.data)
        return Response({"tax_rate":1})     
    
class ImportantTextGet(APIView):
    def get(self,request):
      try:  
       if ImportantNoticeToBuy.objects.last() is not None:
            serialize=ImportantNoticeSerilizer(ImportantNoticeToBuy.objects.last())
            return Response(serialize.data)
      except:  
       return Response({"error":"nothing Found"}) 
   
class CartRecheck(APIView):
    def post(self,request):
        car=[]
        for cart in request.data:
            if(cart['size']=="Short"):
                pro=product_detail.objects.get(id=cart['id'])
                if cart['quantity']>pro.S:
                    car.append({"id":pro.id,"size":"Short","name":pro.title})
            elif(cart['size']=="Medium"):
                pro=product_detail.objects.get(id=cart['id'])
                if cart['quantity']>pro.M:
                    car.append({"id":pro.id,"size":"Medium","name":pro.title})
            elif(cart['size']=="Large"):
                 pro=product_detail.objects.get(id=cart['id'])
                 if cart['quantity']>pro.L:
                    car.append({"id":pro.id,"size":"Large","name":pro.title})
            elif(cart['size']=="Extra Large"):
                 pro=product_detail.objects.get(id=cart['id'])
                 if cart['quantity']>pro.XL:
                    car.append({"id":pro.id,"size":"Extra Large","name":pro.title})
            elif(cart['size']=="Extra Extra Large"):
                 pro=product_detail.objects.get(id=cart['id'])
                 if cart['quantity']>pro.XXL:
                    car.append({"id":pro.id,"size":"Extra Extra Large","name":pro.title})  
        
        if len(car)>0:
           return Response({"error":car})
        else:
            return Response({"Success":"go ahead"})               
          
          
class ShippingTick(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
           return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True).data)
        except:
            return Response({"error":"Nothing Found"})   
          
    def post(self,request):
       try: 
        # if usershippingDetail.objects.get(id=request.data,user_id=request.user).isSelected==True:
        #     data=usershippingDetail.objects.get(id=request.data)
        #     data.isSelected=False
        #     data.save()
        #     return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True).data)
        if  usershippingDetail.objects.get(id=request.data,user_id=request.user).isSelected==False: 
            data2=usershippingDetail.objects.filter(user_id=request.user)
            for element in data2:
                element.isSelected=False  
                element.save()
            data=usershippingDetail.objects.get(id=request.data)
            data.isSelected=True
            data.save()
            return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True).data)
        return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True).data)
       except:              
        return Response({"error":"you are facing error on shipping"})          
          
          
class updateUser(APIView):
       def post(self,request):
          user= User.objects.get(id=request.user.id)
          user.email=request.data['email']
          user.name=request.data['firstname']+" "+request.data["lastname"]
          
          user.save()
          
          data={"name":user.name,"email":user.email}
          return Response(data)    
       
       
       
       
#Added by Ashish on 06-11-2022
#Reason - To have FAQ functionality    
class FAQView(APIView):
    def get(self,request):
        faqs = FAQ.objects.all().values()
        faqList = {}
        faqList['faqs'] = faqs
        return Response(faqList)  
#End of code addition

#Added by Ashish on 09-11-2022
#Reason - To send contact us details to front end
class ContactUsView(APIView):
    def get(self,request):
        contactUsDetail = ContactUs.objects.all().values()
        contactUsResponse = {}
        contactUsResponse['contactUsDetail'] = contactUsDetail
        return Response(contactUsDetail)
#End of code addition  

#Added by Ashish on 13-11-2022
#Reason - To send T&C details to front end
class TermAndConditionView(APIView):
    def get(self,request):
        TermAndConditionDetail = TermAndCondition.objects.all().values()
        TermAndConditionResponse = {}
        TermAndConditionResponse['TermAndConditionDetail'] = TermAndConditionDetail
        return Response(TermAndConditionDetail)
#End of code addition               

#Added by Ashish on 13-11-2022
#Reason - To send Privacy policy details to front end
class PrivacyPolicyView(APIView):
    def get(self,request):
        PrivacyPolicyDetail = PrivacyPolicy.objects.all().values()
        PrivacyPolicyResponse = {}
        PrivacyPolicyResponse['PrivacyPolicyDetail'] = PrivacyPolicyDetail
        return Response(PrivacyPolicyDetail)
#End of code addition   

#Added by Ashish on 13-11-2022
#Reason - To send delivery and shipping policy details to front end
class DeliveryAndShippingPolicyView(APIView):
    def get(self,request):
        DeliveryAndShippingPolicyDetail = DeliveryAndShippingPolicy.objects.all().values()
        DeliveryAndShippingPolicyResponse = {}
        DeliveryAndShippingPolicyResponse['DeliveryAndShippingPolicyDetail'] = DeliveryAndShippingPolicyDetail
        return Response(DeliveryAndShippingPolicyDetail)
#End of code addition  

#Added by Ashish on 14-11-2022
#Reason - To send refund policy details to front end
class RefundPolicyView(APIView):
    def get(self,request):
        RefundPolicyDetail = RefundPolicy.objects.all().values()
        RefundPolicyResponse = {}
        RefundPolicyResponse['RefundPolicyDetail'] = RefundPolicyDetail
        return Response(RefundPolicyDetail)
#End of code addition  

#Added by Ashish on 14-11-2022
#Reason - To send cancellation policy details to front end
class CancellationPolicyView(APIView):
    def get(self,request):
        CancellationPolicyDetail = CancellationPolicy.objects.all().values()
        CancellationPolicyResponse = {}
        CancellationPolicyResponse['CancellationPolicyDetail'] = CancellationPolicyDetail
        return Response(CancellationPolicyDetail)
#End of code addition  

#Added by Ashish on 14-11-2022
#Reason - To send Store locator details to front end
class StoreLocatorView(APIView):
    def get(self,request):
        StoreLocatorDetail = StoreLocator.objects.all().values()
        StoreLocatorResponse = {}
        StoreLocatorResponse['StoreLocatorDetail'] = StoreLocatorDetail
        return Response(StoreLocatorDetail)
#End of code addition  

#Added by Ashish on 16-11-2022
#Reason - To send social links to front end
class SocialLinkView(APIView):
    def get(self,request):
        SocialLinkDetail = SocialLink.objects.all().values()
        SocialLinkResponse = {}
        SocialLinkResponse['SocialLinkDetail'] = SocialLinkDetail
        return Response(SocialLinkDetail)
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To send bridal to front end
class BridalView(APIView):
    def get(self,request):
        BridalDetail = Bridal.objects.all().values()
        BridalResponse = {}
        BridalResponse['BridalDetail'] = BridalDetail
        return Response(BridalDetail)
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To send bridal form details to front end
class BridalFormView(APIView):
    def post(self,request,format=None):
        print("----------",request.data)
        serializer=BridalFormSerializer(data=request.data)
        print("----------",serializer)
        if(serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'msg':'bridal details posted'},status=status.HTTP_200_OK)
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To send copyright text to front end
class CopyrightView(APIView):
    def get(self,request):
        CopyrightDetail = Copyright.objects.all().values()
        return Response(CopyrightDetail)
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To get EmailSubscription details  from ui end
class EmailSubscriptionView(APIView):
    def post(self,request,format=None):
        print("----------",request.data)
        email=EmailSubscription.objects.filter(email=request.data.get("email"))
        print("backend----------",email)
        if(email):
            return Response({'error':'You have already subscribed to updates'},status=status.HTTP_200_OK)
        else:
            serializer=EmailSubscriptionSerializer(data=request.data)
            print("----------",serializer)
            if(serializer.is_valid(raise_exception=True)):
                serializer.save()
                return Response({'msg':'You have successfully subscribed to email updates'},status=status.HTTP_200_OK)
#End of code addition


#Added by Rohan on 17-11-2022
#Reason-To Get instagram collections in ui

class InstagrampostRetrive(APIView):
    def get(self,request):
        try:
            if InstagramCollection.objects.last() is not None:
              instagram=InstagramCollection.objects.last()
              serialize=InstagramCollectionSerializer(instagram)
              return Response(serialize.data)
        except:
            return Response({"error":"Nothing Found"})    
#End of code addition

#Added by Ashish dewangan on 18-11-2022
#Reason - to have search functionality
#Jira issue no - RBYR -141
class SearchProductView(APIView):
    def get(self,request,query):
        print("query----------------------",query.replace(" ",""))
        AllProduct = product_detail.objects.all()
        wordsArray= query.split()
        import itertools
        permutations=list(itertools.permutations(wordsArray))
    
        combinationArray=[]
        combinationArrayOfHighestWordLength=[]
        length=len(query.replace(" ",""))
        # print("len--------------------------",length)
        for permutation in permutations:
            combination=""
            for word in permutation:
                combination =combination+word
                combinationArray.append(combination)
                
        # print("combinationArray--------------------------",combinationArray) 
        for w in combinationArray:
            if(len(w)==length):
                combinationArrayOfHighestWordLength.append(w)

        # print("combinationArraywit len--------------------------",combinationArrayOfHighestWordLength)
        resultSet={}
        for data in combinationArrayOfHighestWordLength:
            # print("data--------------------------",data) 
            if(AllProduct.filter(search_key__icontains=data)):
                resultSet=AllProduct.filter(search_key__icontains=data)
        # print("product........",AllProduct)        
        # print("result---------------",resultSet)
        if(len(resultSet)==0):
            for data in combinationArray:
                # print("data--------------------------",data) 
                if(AllProduct.filter(search_key__icontains=data)):
                    resultSet=AllProduct.filter(search_key__icontains=data)

        serializedData=product_serializer(resultSet,many=True)
        return Response(serializedData.data)        
#End of code addition

#Added by Ashish on 19-11-2022
#Reason-To send logo and cover images to frontend
class LogoAndCoverView(APIView):
    def get(self,request):
        LogoAndCoverDetail = LogoAndCover.objects.all().values()
        LogoAndCoverResponse = {}
        LogoAndCoverResponse['BLogoAndCoverDetail'] = LogoAndCoverDetail
        return Response(LogoAndCoverDetail)
        
#End of code addition

#Added by Ashish on 21-11-2022
#Reason-To have footer text in the table
class FooterDescriptionView(APIView):
    def get(self,request):
        footerDescriptionDetail = FooterDescription.objects.all().values()
        return Response(footerDescriptionDetail)
#End of code addition

#Added by Ashish Dewangan on 23-11-2022
#Reason - To save size chart image
#Jira issue no - RBYR-193
class WomenClothSizeChartView(APIView):
    def get(self,request):
        womenClothSizeChartDetail = WomenClothSizeChart.objects.all().values()
        return Response(womenClothSizeChartDetail)
#End of code addition