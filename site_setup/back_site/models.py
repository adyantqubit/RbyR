from distutils.command.upload import upload
from email.policy import default
from itertools import product
from pyexpat import model
from unicodedata import category
from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.postgres.fields import ArrayField
from phone_field import PhoneField
from django.core.validators import MinLengthValidator
from django.utils.timezone import now

import datetime

from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

 
# Create your models here.

class MyUserManager(BaseUserManager):
    def create_user(self, email, name,tc,contact_number, password=None,password2=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            contact_number=contact_number,
            tc=tc,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name,tc,contact_number, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            contact_number=contact_number,
            tc=tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    contact_number=models.CharField(max_length=13, validators=[MinLengthValidator(13)])
    tc=models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','tc','contact_number']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
  

category = (
    ('partywear','Party wear'),
    ('kurti', 'Kurti'),
    ('casual','Casual'),
    ('weddingwear','Wedding Wear'),
    ('formal','Formal'),
    ('luxurypret','Luxury'),
    ('readytowear','ready to wear'),
    ('worldofrr','world of rr')
)

class product_detail(models.Model):
    id=models.AutoField(primary_key=True)
    title=models.CharField(max_length=100)
    about=models.CharField(max_length=300)
    category=models.CharField(max_length=50,choices=category,default="casual")
    img_main=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)  
    img_sub1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    img_sub2=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    img_sub3=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    like=models.IntegerField(default=0)
    price=models.IntegerField()
    color=models.CharField(max_length=25,default="blue")
    description=models.CharField(max_length=300,default="Draped Halter Top With Cutout And Handkerchief Drape")
    fabric=models.CharField(max_length=50,default="Chiffon")
    made_in=models.CharField(max_length=30,default="India")
    style_code=models.CharField(max_length=30,default="AAIR-129-KTH")
    S=models.IntegerField(default=30)
    M=models.IntegerField(default=30)
    L=models.IntegerField(default=30)
    XL=models.IntegerField(default=30)
    XXL=models.IntegerField(default=30)
    date = models.DateTimeField(default=now, blank=True)
    available=models.BooleanField(default=True)
    shipping_charges=models.IntegerField(default=100)

    #Added by Ashish dewangan on 23-11-2022
    #Reason - to have shipping days and ready to wear functionality for product
    #Jira issue no - RBYR -194
    shipping_days=models.CharField(max_length=50,default="3-4 weaks")
    ready_to_ship=models.BooleanField(default=False)
    ready_to_ship_days=models.CharField(max_length=50,default="under 7 working days")
    #End of code addition

    #Added by Ashish dewangan on 18-11-2022
    #Reason - to have search functionality
    #Jira issue no - RBYR -141
    search_key=models.TextField(default="",blank=True)

    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        strWithSpace =  self.title+self.category
        self.search_key=strWithSpace.replace(" ", "")
        super().save(*args,**kwargs) 
    #End of code addition
    
class image(models.Model):
    src=models.CharField(max_length=200)
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    
    
class Liked(models.Model):
    item=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    user_no=models.ForeignKey(User,on_delete=models.CASCADE)
    
    
SIZE_CHOICES = (
    ('Short','S'),
    ('Medium', 'M'),
    ('Large','L'),
    ('Extra Large','XL'),
    ('Extra Extra Large','XXL'),
)    
class Cart(models.Model):
   product_no=models.ForeignKey(product_detail,on_delete=models.CASCADE)
   user_no=models.ForeignKey(User,on_delete=models.CASCADE)
   quantity=models.IntegerField(default=1)       
   size=models.CharField(max_length=20, choices=SIZE_CHOICES, default='Short')
   
class Cart_buy(models.Model):
    no=models.IntegerField()
    product=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=0)
    total_price=models.IntegerField(default=0)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    size=models.CharField(max_length=10,default="m")
       
   
   
class Head_img(models.Model):
    src=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)   
    label=models.CharField(max_length=100,default="slider")
    about=models.CharField(max_length=200,default="here you have to write something")
    category=models.CharField(max_length=50,choices=category,default="casual")

class HomeCard_img(models.Model):
         img_top1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top1=models.CharField(max_length=50,choices=category,default="casual")
         img_top1_1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top1_1=models.CharField(max_length=50,choices=category,default="casual")
         img_top2=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top2=models.CharField(max_length=50,choices=category,default="casual")
         img_top2_1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top2_1=models.CharField(max_length=50,choices=category,default="casual")
         img_top3=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top3=models.CharField(max_length=50,choices=category,default="casual")
         img_top4=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
         category_top4=models.CharField(max_length=50,choices=category,default="casual")
         video_url=models.CharField(max_length=200,default="")
         
         
class usershippingDetail(models.Model):
     id=models.AutoField(primary_key=True)
     user_id=models.ForeignKey(User,on_delete=models.CASCADE)
     firstname=models.CharField(max_length=20)
     lastname=models.CharField(max_length=20)
     street=models.CharField(max_length=200)
     houseno=models.CharField(max_length=20)
     city=models.CharField(max_length=30)
     state=models.CharField(max_length=30)
     zipcode=models.CharField(max_length=20)
     country=models.CharField(max_length=30)
     number=models.CharField(max_length=15)
     isSelected=models.BooleanField(default=False)
     
     
class userbillingDetail(models.Model):
     id=models.AutoField(primary_key=True)
     user_id=models.ForeignKey(User,on_delete=models.CASCADE)
     firstname=models.CharField(max_length=20)
     lastname=models.CharField(max_length=20)
     street=models.CharField(max_length=200)
     houseno=models.CharField(max_length=20)
     city=models.CharField(max_length=30)
     state=models.CharField(max_length=30)
     zipcode=models.CharField(max_length=20)
     country=models.CharField(max_length=30)
     number=models.CharField(max_length=15) 
     
         
class product_orders(models.Model):
    order_no=models.IntegerField()
    user_no=models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    
    billing_id=models.ForeignKey(userbillingDetail,on_delete=models.CASCADE)  
    shipping_id=models.ForeignKey(usershippingDetail,on_delete=models.CASCADE)
    
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE)  
    quantity=models.IntegerField()          
    price=models.IntegerField()
    size=models.CharField(max_length=20)
    payment_mode=models.CharField(max_length=20,default="cod")
    date=models.DateField(('purchase date'), null=False, blank=False, auto_now=True)
    
   

status = (
    ('paid','paid'),
    ('pending','pending'),
    ('cancle','cancle'),

)    
class Transaction_history(models.Model):
    order_no=models.IntegerField()
    payment_status=models.CharField(max_length=50,choices=status,default="pending")
    user_no=models.ForeignKey(User,on_delete=models.CASCADE)    
    coupon_discount=models.IntegerField()
    shipping_price=models.IntegerField()
    subtotal_price=models.IntegerField()
    tax=models.IntegerField()
    grand_total=models.IntegerField()
    
    def save(self,*args,**kwargs):
        if (self.payment_status=="cancle"):
          pros= product_orders.objects.filter(order_no=self.order_no)
          for product in pros:
             pro=product_detail.objects.get(id=product.product_id.id)
             
             if product.size=="Short":
               pro.S+=product.quantity
               pro.save()               
             if product.size=="Medium":
                   pro.M+=product.quantity
                   pro.save()     
             if product.size=="Large":
                   pro.L+=product.quantity 
                   pro.save()             
             if product.size=="Extra Large" :
                 pro.XL+=product.quantity
                 pro.save()                
             if product.size=="Extra Extra Large":
                 pro.XXL+=product.quantity 
                 pro.save()      
        super().save(*args,**kwargs)          
    
class Online_Qr(models.Model):
     qr_img=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
     name=models.CharField(max_length=100)
     bank_name=models.CharField(max_length=100)
     account_number=models.CharField(max_length=18)
     upi_id=models.CharField(max_length=50)
              
class coupon(models.Model):
    id=models.AutoField(primary_key=True)
    promocode=models.CharField(max_length=10)
    discount_percentage=models.IntegerField()
    maximum_discount_price=models.IntegerField()               
    expiry_date=models.DateField()
    isActive=models.BooleanField(default=False)
    
class Tax(models.Model):
    tax_rate=models.IntegerField()    
    
    
class ImportantNoticeToBuy(models.Model):
    point1=models.CharField(max_length=200)
    point2=models.CharField(max_length=200)
    point3=models.CharField(max_length=200)    
    
#Added by Ashish on 06-11-2022
#Reason - To have FAQ functionality
class FAQ(models.Model):
    qno=models.AutoField(primary_key=True)
    question=models.CharField(max_length=255)
    answer=models.TextField()

    def __str__(self):
        return f"{'Qusetion: ',self.question}, {'Answer: ',self.answer}"
#End of code addition

#Added by Ashish on 09-11-2022
#Reason - To create contact us table
class ContactUs(models.Model):
    subtitle1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle2=models.CharField(max_length=255)
    content2=models.TextField()
    subtitle3=models.CharField(max_length=255)
    content3=models.TextField()
    contactUsImage=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100,default='None/a1.jpg')
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To create T&C table
class TermAndCondition(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()
    subtitle2=models.CharField(max_length=255)
    content3=models.TextField()
    subtitle3=models.CharField(max_length=255)
    content4=models.TextField()
    subtitle4=models.CharField(max_length=255)
    content5=models.TextField()
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To create T&C table
class PrivacyPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()
    subtitle2=models.CharField(max_length=255)
    content3=models.TextField()
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To create T&C table
class DeliveryAndShippingPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    title2=models.CharField(max_length=255)
    content2=models.TextField()
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Refund policy table
class RefundPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Cancellation policy table
class CancellationPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Store locator table
class StoreLocator(models.Model):
    city=models.CharField(max_length=255)
    address=models.TextField()
    phoneNumber=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    timing=models.CharField(max_length=255)
    storeImage=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To create Social Links table
class SocialLink(models.Model):
    linkName=models.CharField(max_length=255)
    link=models.CharField(max_length=255)
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To create bridal table
class Bridal(models.Model):
    title=models.CharField(max_length=255)
    subtitle1=models.TextField()
    subtitle2=models.TextField()
    bridalImage=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To create bridalDetails table
class BridalForm(models.Model):
    firstName=models.CharField(max_length=255)
    lastName=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    contactNumber=models.CharField(max_length=255)
    zipCode=models.CharField(max_length=255)
    message=models.TextField()
    dateOfWedding=models.DateTimeField()
    termsAndCondition=models.BooleanField()
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To create copyright text table
class Copyright(models.Model):
    title=models.CharField(max_length=255)
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To have email subscription list in the table
class EmailSubscription(models.Model):
    email=models.CharField(max_length=255)
    unsubscribe=models.BooleanField(default=False)
#End of code addition

#Added by Rohan on 17-11-2022
#Reason - To get Intagram photos
class InstagramCollection(models.Model):
    instagram_home_link=models.CharField(max_length=255)
    instagram_post1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post1_link=models.CharField(max_length=255)
    instagram_post2=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post2_link=models.CharField(max_length=255)
    instagram_post3=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post3_link=models.CharField(max_length=255)
    instagram_post4=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post4_link=models.CharField(max_length=255)
    instagram_post5=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post5_link=models.CharField(max_length=255)       

#Added by Ashish on 19-11-2022
#Reason - To save logo and cover in the table
class LogoAndCover(models.Model):
    logo=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    cover1=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    cover2=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    cover3=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    cover4=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    cover5=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
#End of code addition

#Added by Ashish on 21-11-2022
#Reason - To have footer text in the table
class FooterDescription(models.Model):
    subtitle1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle2=models.CharField(max_length=255)
    content2=models.TextField()
    subtitle3=models.CharField(max_length=255)
    content3=models.TextField()
    subtitle4=models.CharField(max_length=255)
    content4=models.TextField()
#End of code addition

#Added by Ashish Dewangan on 23-11-2022
#Reason - To save size chart image
#Jira issue no - RBYR-193
class WomenClothSizeChart(models.Model):
    image=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
#End of code addition           

#Added by Ashish on 24-11-2022
#Reason - To create custom tailored table
class CustomTailoredForm(models.Model):
    firstName=models.CharField(max_length=255)
    lastName=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    contactNumber=models.CharField(max_length=255)
    shoulder=models.CharField(max_length=255)
    chest=models.CharField(max_length=255)
    upperChest=models.CharField(max_length=255)
    lowerChest=models.CharField(max_length=255)
    dartPoint=models.CharField(max_length=255)
    armhole=models.CharField(max_length=255)
    armround=models.CharField(max_length=255)
    waist=models.CharField(max_length=255)
    lowerWaist=models.CharField(max_length=255)
    hips=models.CharField(max_length=255)
    length=models.CharField(max_length=255)
    otherInstructions=models.TextField(default="")
    
#End of code addition

#Added by Ashish on 24-11-2022
#Reason - To save whatsapp number in table
class WhatsappContact(models.Model):
    whatsappNmber=models.CharField(max_length=255)
#End of code addition