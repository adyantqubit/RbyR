from audioop import alaw2lin
from dataclasses import field
from genericpath import exists
from multiprocessing import context
from pyexpat import model
from unittest.util import _MAX_LENGTH
from xml.dom import ValidationErr
from back_site.utils import Util
from django.conf import settings
from django.core.mail import send_mail

from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from back_site.renderers import UserRenderer
from .models import *;
from rest_framework import serializers
from django.contrib.auth.hashers import check_password



        
class product_serializer(serializers.ModelSerializer):
    class Meta:
        model=product_detail
        fields='__all__'    
        
class image_serializer(serializers.ModelSerializer):
    class Meta:
        model=image
        fields='__all__'  
        
class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=True)
    password2=serializers.CharField(style={'input_type':'password'},write_only=True)

    class Meta:
        model = User
        fields = ('email','name','password','password2','contact_number','tc')
        extra_kwargs = {
            'password':{'write_only':True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
        
        
class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255,error_messages={'blank': 'This field cannot be left blank.'})
    class Meta:
        model=User
        fields=['email','password']
        extra_kwargs = {'password': {'error_messages': {'blank': 'This field cannot be left blank.'}}}

        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User   
        fields=['id','email','name','contact_number']             
        
        
class UserChangePasswordSerializer(serializers.ModelSerializer):
      password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
      password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
      class Meta:
          model=User
          fields=['password','password2']
          
      def validate(self,attrs):
          user=self.context.get('user')
          ch= check_password(self.context.get('oldPass'),user.password)
          if(ch==True):
              pass
          else:
            raise serializers.ValidationError("Old password is Incorect")
          password=attrs.get('password')
          password2=attrs.get('password2')
          if password != password2:
            raise serializers.ValidationError("Password and confirm Password doesn't match")
          if password==self.context.get('oldPass'):
              raise serializers.ValidationError("New password should not be matched with old")
          user.set_password(password)
          user.save()
          print(ch)
          return attrs
      
      
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model=User
        fields=['email'] 
        
    def validate(self,attrs):
        email=attrs.get('email')
        if User.objects.filter(email=email).exists():
            user=User.objects.get(email=email)
        
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print("encoded --",uid)
            token=PasswordResetTokenGenerator().make_token(user)
            print('Password reset token--',token)
            from site_setup.settings import Base_url
            link= Base_url+'/reset-password/'+uid+'/'+token
            print("passwordn reset link",link)
            #Send Email
            data={
                "subject":'Reset your Password',
                "body":"click to reset password"+link,
                'to_email':user.email
            }
            subject = 'Password Reset Link RbyR'
            message = f'Hi {user.name}, click this link to reset - '+link+''
            email_from = settings.EMAIL_HOST_USER
            recipient_list =[user.email,]
            send_mail( subject, message, email_from, recipient_list )
            return attrs
        else:
            raise serializers.ValidationError("Entered Email-id is not registered.")
            
 
        
class UserPasswordResetSerializer(serializers.ModelSerializer):
      password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
      password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
      class Meta:
          model=User
          fields=['password','password2']
          
      def validate(self,attrs):
        try:
          password=attrs.get('password')
          password2=attrs.get('password2')
          uid=self.context.get('uid')
          token=self.context.get('token')
          if password != password2:
            raise serializers.ValidationError("Password and confirm Password doesn't match")
          id=smart_str(urlsafe_base64_decode(uid))
          user=User.objects.get(id=id)
          if not PasswordResetTokenGenerator().check_token(user,token):
             raise serializers.ValidationError('Token is not valid or expired')
          user.set_password(password)
          user.save()
          return attrs
      
        except DjangoUnicodeDecodeError as Identifier:
            PasswordResetTokenGenerator().check_token(user,token)
            raise serializers.ValidationError('Token is not valid or expired')

class LikeUpdateSerializer(serializers.ModelSerializer):
        class Meta:
            model=Liked
            fields=['item']
            
        def validate(self, attrs):
          product=product_detail.objects.get(id=attrs.get('item').id) 
          user=User.objects.get(email=self.context.get("user"))
          if Liked.objects.filter(item=product,user_no=user).exists():
             li= Liked.objects.get(item=product,user_no=user)
             li.delete()
            #  product.like=False
            #  product.save()
             raise serializers.ValidationError({"jds"})
          else:
              like=Liked.objects.create(item=product,user_no=user)
              like.save()
            #   product.like=True
            #   product.save()
          return attrs  
        
       
class giveLikedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=Liked
        fields="__all__"
            
         
         
class CartUpdateSerializer(serializers.ModelSerializer):
        class Meta:
            model=Cart
            fields=['product_no','size']
            
        def validate(self, attrs):
          print(attrs.get('product_no'),attrs.get('size'))
          product=product_detail.objects.get(id=attrs.get('product_no').id) 
          user=User.objects.get(email=self.context.get("user"))
          if Cart.objects.filter(product_no=product,user_no=user,size=attrs.get('size')).exists():
             li= Cart.objects.get(product_no=product,user_no=user,size=attrs.get('size'))
             li.delete()
            #  product.like=False
            #  product.save()
             raise serializers.ValidationError({"jds"})
          else:
              like=Cart.objects.create(product_no=product,user_no=user,size=attrs.get("size"))
              like.save()
            #   product.like=True
            #   product.save()
          return attrs           
      
      
class giveCartdDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cart
        fields="__all__"      
        
        
class getPictureSer(serializers.ModelSerializer):
    class Meta:
        model=Head_img
        fields="__all__"              
        
        
class getCardSer(serializers.ModelSerializer):
    class Meta:
        model=HomeCard_img
        fields="__all__"         
        
        
# class invoiceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Product_orders
#         fields="__all__"     
        
#     def validate(self,attrs):
#             print("hello")
#             return attrs
        
        
        
class shippingSerializer(serializers.ModelSerializer):
    class Meta:
        model=usershippingDetail
        fields="__all__"     
        
    def validate(self,attrs):
            if usershippingDetail.objects.filter(street=attrs.get('street'),city=attrs.get('city'),number=attrs.get('number'),user_id=attrs.get('user_id')).exists():
                raise serializers.ValidationError("this is already exist")
            
            return attrs        
        
class billingSerializer(serializers.ModelSerializer):
    class Meta:
        model=userbillingDetail
        fields="__all__"
        
    def validate(self,attrs):
     if userbillingDetail.objects.filter(street=attrs.get('street'),city=attrs.get('city'),number=attrs.get('number'),user_id=attrs.get('user_id')).exists():
        raise serializers.ValidationError("this is already exist")
            
     return attrs     
    
class invoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model=product_orders
        fields="__all__"
        
        
class transactionHistorySerialize(serializers.ModelSerializer):
       class Meta:
        model=Transaction_history
        fields="__all__"     
          
class QrDetailSerializer(serializers.ModelSerializer):
         class Meta:
           model=Online_Qr
           fields="__all__"            
           
class promocodeSerilizer(serializers.ModelSerializer):
    class Meta:
        model=coupon
        fields="__all__"       
        
class TaxSerilizer(serializers.ModelSerializer):
    class Meta:
        model=Tax
        fields="__all__"             
           
class ImportantNoticeSerilizer(serializers.ModelSerializer):
    class Meta:
        model=ImportantNoticeToBuy
        fields="__all__"                        

#Added by Ashish on 06-11-2022
#Reason - To have FAQ functionality
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model=FAQ
        fields=['question','answer']    
#End of code addition              

#Added by Ashish on 09-11-2022
#Reason - To send contact us details to front end
class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactUs
        fields="__all__"
#End of code addition        

#Added by Ashish on 13-11-2022
#Reason - To send T&C details to front end
class TermAndConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model=TermAndCondition
        fields="__all__"
#End of code addition 

#Added by Ashish on 13-11-2022
#Reason - To send Privacy Policy details to front end
class PrivacyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model=PrivacyPolicy
        fields="__all__"
#End of code addition 

#Added by Ashish on 13-11-2022
#Reason - To send delivery and shipping policy details to front end
class DeliveryAndShippingPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model=DeliveryAndShippingPolicy
        fields="__all__"
#End of code addition 

#Added by Ashish on 14-11-2022
#Reason - To sendrefund policy details to front end
class RefundPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model=RefundPolicy
        fields="__all__"
#End of code addition 

#Added by Ashish on 14-11-2022
#Reason - To send cancellation policy details to front end
class CancellationSerializer(serializers.ModelSerializer):
    class Meta:
        model=CancellationPolicy
        fields="__all__"
#End of code addition 

#Added by Ashish on 15-11-2022
#Reason - To send Store locator details to front end
class StoreLocatorSerializer(serializers.ModelSerializer):
    class Meta:
        model=StoreLocator
        fields="__all__"
#End of code addition 


#Added by Ashish on 16-11-2022
#Reason - To send Social links to front end
class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model=SocialLink
        fields="__all__"
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To send Bridal to front end
class BridalSerializer(serializers.ModelSerializer):
    class Meta:
        model=Bridal
        fields="__all__"
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To get Bridal details from front end
class BridalFormSerializer(serializers.ModelSerializer):
    class Meta:
        model=BridalForm
        fields="__all__"
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To get Bridal details from front end
class EmailSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model=EmailSubscription
        fields="__all__"
#End of code addition

#Added by Rohan on 17-11-2022
#Reason - To get Instagram images and links
class InstagramCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=InstagramCollection
        fields="__all__"

#Added by Ashish on 24-11-2022
#Reason - To save custom tailored details
class CustomTailoredFormSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomTailoredForm
        fields="__all__"
#End of code addition        

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model=CurrencySelected
        fields="__all__"