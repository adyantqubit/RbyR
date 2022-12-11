from distutils.command.upload import upload
from email.policy import default
from itertools import product
from pyexpat import model
from unicodedata import category
from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.postgres.fields import ArrayField
from phone_field import PhoneField
from django.core.validators import MinLengthValidator,MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils.timezone import now

import datetime

from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


#Added by Ashish on 30-11-2022
#Reason - To add custom validation on admin site
def validate_phone_number(value):
    if len(str(value))<=15:
        return value
    else:
        raise ValidationError("Contact number can't be more than 15 digits.") 

def validate_address(value):
    if len(value)<=255:
        return value
    else:
        raise ValidationError("Length of address can't be more than 255 characters.") 
    
def validate_zipcode(value):
    if len(str(value))==6:
        return value
    else:
        raise ValidationError("zip code must be 6 digits long.")

def validate_integer_field(value):
    if len(str(value))<=10:
        return value
    else:
        raise ValidationError("Length of this field can't be more than 10 digits.") 

def validate_tax(value):
    if value<=99:
        return value
    else:
        raise ValidationError("Tax percentage can not be more than 99.")    

def validate_price(value):
    if value<=99999999:
        return value
    else:
        raise ValidationError("Price can not be more than 99999999.")     

def validate_discount(value):
    if value<=99:
        return value
    else:
        raise ValidationError("Discount percentage can not be more than 99.")       

def validate_title(value):

    if len(value)>0:
        return value
    else:
        raise ValidationError("Title is required.") 
#End of code addition
      
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
    contact_number=models.IntegerField(validators=[validate_phone_number])
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
    ('wedding_wear','Wedding Wear'),
    ('formal','Formal'),
    ('luxury_pret','Luxury pret'),
    ('ready_to_wear','Ready To Wear'),
    ('world_of_rbyr','World Of RBYR')
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
    like=models.IntegerField(default=0, validators=[MaxValueValidator(999999999)])
    price=models.DecimalField(decimal_places=2,max_digits=10)
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return self.title
    class Meta:
            verbose_name_plural = "Products"
    #End of code addition
    
class image(models.Model):
    src=models.CharField(max_length=200)
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    
    
class Liked(models.Model):
    item=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    user_no=models.ForeignKey(User,on_delete=models.CASCADE)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Product in user's wishlist"
    class Meta:
            verbose_name_plural = "Wishlist Of Users"
    #End of code addition 
    
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
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        return "Item in user's cart"
    class Meta:
        verbose_name_plural = "Cart Of User"
   #End of code addition     


#Commented by Ashish Dewangan on 30-11-2022
# Reason - To filterout garbage tables  
# class Cart_buy(models.Model):
#     no=models.IntegerField()
#     product=models.ForeignKey(product_detail,on_delete=models.CASCADE)
#     quantity=models.IntegerField(default=0)
#     total_price=models.IntegerField(default=0)
#     user=models.ForeignKey(User,on_delete=models.CASCADE)
#     size=models.CharField(max_length=10,default="m")
#End of comment
       
   
window_CHOICES = (
    ('window', 'For Window'),
    ('Mobile','For Mobile')
) 
class Head_img(models.Model):
    src=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)   
    label=models.CharField(max_length=100,default="slider")
    about=models.CharField(max_length=200,default="here you have to write something")
    category=models.CharField(max_length=50,choices=category,default="casual")
    display_on=models.CharField(max_length=20,choices=window_CHOICES,default="window")
    
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Images to display on cover slider at landing page"
    class Meta:
            verbose_name_plural = "Cover Images"
    #End of code addition 

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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Images that will be shown on Home page categories"
    class Meta:
            verbose_name_plural = "Category Images"
    #End of code addition      
         
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
    number=models.IntegerField()
    isSelected=models.BooleanField(default=False)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "User - "+self.firstname+" "+self.lastname+". Phone no - "+str(self.number)+". Address - "+self.houseno+" "+self.street+" "+self.city+" "+self.state+" "+self.country+". "+self.zipcode
    class Meta:
            verbose_name_plural = "User's Shipping Details"
    #End of code addition
     
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
    number=models.IntegerField() 
     
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "User - "+self.firstname+" "+self.lastname+". Phone no - "+str(self.number)+". Address - "+self.houseno+" "+self.street+" "+self.city+" "+self.state+" "+self.country+". "+self.zipcode
    class Meta:
            verbose_name_plural = "User's Billing Details"
    #End of code addition
    
order_status=(
    ("proccessing","Proccessing"),
    ("accepted","Accepted"),
    ("out_for_shipping","Out for Shipping"),
    ("shipped","shipped"),
    ("arrived","Arrived"),
    ("out_for_delivery","Out For Delivery"),
    ("delivered","Delivered"),
    ("cancel","Cancel")
)
         
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
    selected_currency_sign=models.CharField(max_length=5)
    selected_currency_value=models.FloatField()
    order_status=models.CharField(max_length=50,choices=order_status,default="proccessing",blank=True,null=True)

    
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Order created by User"
    class Meta:
        verbose_name_plural = "Product Orders"
    #End of code addition

status = (
    ('paid','paid'),
    ('pending','pending'),
    ('cancel','cancel'),

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

    #Commented by Rohan 10/12/22
    # I make change on datefield to auto not before i am using today() function so while migrating transactiona history date changes
    date=models.DateField(('ordered date'), null=False, blank=False, auto_now=True)
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Transaction"
    class Meta:
            verbose_name_plural = "Transaction Histories"
    #End of code addition              
    
class Online_Qr(models.Model):
    qr_img=models.ImageField(upload_to='None/', height_field=None,\
        width_field=None, max_length=100)
    name=models.CharField(max_length=100)
    bank_name=models.CharField(max_length=100)
    account_number=models.CharField(max_length=18)
    upi_id=models.CharField(max_length=50)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Online payment settings of RbyR"
    class Meta:
            verbose_name_plural = "Online Payment Settings"
    #End of code addition
              
class coupon(models.Model):
    id=models.AutoField(primary_key=True)
    promocode=models.CharField(max_length=10)
    discount_percentage=models.IntegerField(validators=[validate_discount])
    maximum_discount_price=models.IntegerField(validators=[validate_integer_field])               
    expiry_date=models.DateField()
    isActive=models.BooleanField(default=False)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Coupon details"
    class Meta:
            verbose_name_plural = "Coupons"
    #End of code addition   
    
class Tax(models.Model):
    tax_rate=models.IntegerField(validators=[validate_tax])    
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Tax setting"
    class Meta:
            verbose_name_plural = "Tax Setting"
    #End of code addition
    
class ImportantNoticeToBuy(models.Model):
    point1=models.CharField(max_length=200)
    point2=models.CharField(max_length=200)
    point3=models.CharField(max_length=200)

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Important notice for users to display at cart page"
    class Meta:
            verbose_name_plural = "Important Notice On Cart"
    #End of code addition     
    
#Added by Ashish on 06-11-2022
#Reason - To have FAQ functionality
class FAQ(models.Model):
    qno=models.AutoField(primary_key=True)
    question=models.CharField(max_length=255)
    answer=models.TextField()

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        return "Frequently Asked Question"
    class Meta:
            verbose_name_plural = "FAQ List"
    #End of code addition    
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Details for users to contact RbyR"
    class Meta:
        verbose_name_plural = "Contact Us"
    #End of code addition          
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "Terms and Conditions of RbyR"
    class Meta:
            verbose_name_plural = "Terms & Conditions"
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
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Privacy policy of RbyR"
    class Meta:
            verbose_name_plural = "Privacy Policy"
    #End of code addition
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To create T&C table
class DeliveryAndShippingPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    title2=models.CharField(max_length=255)
    content2=models.TextField()

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Delivery & Shipping policy of RbyR"
    class Meta:
        verbose_name_plural = "Delivery & Shipping Policy"
    #End of code addition   
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Refund policy table
class RefundPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()
#End of code addition

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "Refund policy of RbyR"
    class Meta:
            verbose_name_plural = "Refund Policy"
    #End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Cancellation policy table
class CancellationPolicy(models.Model):
    title1=models.CharField(max_length=255)
    content1=models.TextField()
    subtitle1=models.CharField(max_length=255)
    content2=models.TextField()

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        return "Cancellation policy of RbyR"
    class Meta:
        verbose_name_plural = "Cancellation Policy"
    #End of code addition
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Store locator table
class StoreLocator(models.Model):
    city=models.CharField(max_length=50)
    address=models.TextField(validators=[validate_address])
    phoneNumber=models.IntegerField(validators=[validate_phone_number])
    email=models.CharField(max_length=50)
    timing=models.CharField(max_length=50)
    storeImage=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
#End of code addition
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "Location, contact and timing detail of RbyR store"
    class Meta:
            verbose_name_plural = "RbyR Store Details"
    #End of code addition

#Added by Ashish on 16-11-2022
#Reason - To create Social Links table
class SocialLink(models.Model):
    linkName=models.CharField(max_length=255)
    link=models.CharField(max_length=255)
#End of code addition
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Social link of RbyR"
    class Meta:
            verbose_name_plural = "Social Links"
    #End of code addition

#Added by Ashish on 16-11-2022
#Reason - To create bridal table
class Bridal(models.Model):
    title=models.CharField(max_length=255,validators=[validate_title])
    subtitle1=models.TextField(default="",blank=True)
    subtitle2=models.TextField(default="",blank=True)
    bridalImage=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        return "Description of bridal page"
    class Meta:
        verbose_name_plural = "Bridal Description"
    #End of code addition       
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To create bridalDetails table
class BridalForm(models.Model):
    firstName=models.CharField(max_length=255)
    lastName=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    contactNumber=models.IntegerField()
    zipCode=models.IntegerField()
    message=models.TextField()
    dateOfWedding=models.DateTimeField()
    termsAndCondition=models.BooleanField()

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        return "Bridal request received from - "+self.firstName+" "+self.lastName
    class Meta:
        verbose_name_plural = "Bridal Requests"
    #End of code addition    
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To create copyright text table
class Copyright(models.Model):
    title=models.CharField(max_length=255)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Copyrights of RbyR"
    class Meta:
        verbose_name_plural = "Copyright Text"
    #End of code addition   
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To have email subscription list in the table
class EmailSubscription(models.Model):
    email=models.CharField(max_length=255)
    subscribe=models.BooleanField(default=True)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "Email subscription by user for updates"
    class Meta:
            verbose_name_plural = "Email Subsciptions"
    #End of code addition   
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Links of instagram posts"
    class Meta:
            verbose_name_plural = "Instagram Posts"
    #End of code addition 


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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Logo of RbyR"
    class Meta:
            verbose_name_plural = "RbyR Logo"
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Text to display at the bottom of the page"
    class Meta:
            verbose_name_plural = "Footer Description"
    #End of code addition 
#End of code addition

#Added by Ashish Dewangan on 23-11-2022
#Reason - To save size chart image
#Jira issue no - RBYR-193
class WomenClothSizeChart(models.Model):
    image=models.ImageField(upload_to='None/', height_field=None,\
           width_field=None, max_length=100)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Women's cloth size chart"
    class Meta:
            verbose_name_plural = "Women's Cloth Size Chart"
    #End of code addition       
#End of code addition           

#Added by Ashish on 24-11-2022
#Reason - To create custom tailored table
class CustomTailoredForm(models.Model):
    firstName=models.CharField(max_length=255)
    lastName=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    contactNumber=models.IntegerField()
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

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Custom tailored requests made by - "+self.firstName+" "+self.lastName
    class Meta:
            verbose_name_plural = "Custom Tailored Requests"
    #End of code addition   
    
#End of code addition


#Added by Ashish on 24-11-2022
#Reason - To save whatsapp number in table
class WhatsappContact(models.Model):
    whatsappNmber=models.IntegerField(validators=[validate_phone_number])
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Whatsapp Number"
    class Meta:
            verbose_name_plural = "Whatsapp Number"
    #End of code addition
#End of code addition



#Added by Rohan on 7-12-2022
#Reason - To save Currency 
class CurrencySelected(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    currency=models.CharField(max_length=10)
    currency_sign=models.CharField(max_length=5)
    currency_value=models.FloatField()
#End of code addition
#End of code addition



