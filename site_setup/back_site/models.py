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
    contact_number=models.CharField(max_length=13, validators=[MinLengthValidator(10)])
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
)    
class Transaction_history(models.Model):
    order_no=models.IntegerField()
    payment_status=models.CharField(max_length=50,choices=status,default="pending")
    user_no=models.ForeignKey(User,on_delete=models.CASCADE)    
    