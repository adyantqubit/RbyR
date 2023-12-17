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
from ckeditor.fields import RichTextField
from django.core.files.base import ContentFile




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


# Addition by Om Shrivastava on 14-12-23
# Reason : Add the validation in price field
def validate_product_price(value):
    if value<=1500000:
        return value
    else:
        raise ValidationError("Price can't be exceed from 1500000.") 
# End of Addition by Om Shrivastava on 14-12-23
# Reason : Add the validation in price field

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
            # is_active=True
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name,tc,is_active,contact_number, password=None):
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
            # is_active=is_active
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
    contact_number=models.CharField(max_length=20,validators=[validate_phone_number])
    tc=models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','tc','contact_number','is_active']

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
  

# category = (
#     ('partywear','Party wear'),
#     ('kurti', 'Kurti'),
#     ('casual','Casual'),
#     ('wedding_wear','Wedding Wear'),
#     ('formal','Formal'),
#     ('luxury_pret','Luxury pret'),
#     ('rbyr_man','RBYR Men'),
#     ('ready_to_wear','Ready To Wear'),
#     ('world_of_rbyr','World Of RBYR')
# )

# Added by Rohan on 27-12-2022
#Reason - Adding category and menus name from backend

GEEKS_CHOICES =(
    ("1", "Show subMenu with image"),
    ("2", "Show instant filter for subMenu"),
)


class Menus(models.Model):
    # Modification and addition by Om Shrivastava on 09-12-23
    # Reason : Need to add unique property
    # menu=models.CharField(max_length=13)
    menu=models.CharField(max_length=13,unique=True)
    # End of Modification and addition by Om Shrivastava on 09-12-23
    # Reason : Need to add unique property
    # Added by Rohan- on -17/2/23
    # Reason- giving image showing functionality for each category and filteration option
    Show_subMenu_with_image=models.BooleanField(default=False)
    show_instant_filter_for_subMenu=models.BooleanField(default=False)
    Choose_menu_type = models.CharField(max_length=40,choices=GEEKS_CHOICES,default="1")

    # end of code - 17/2/23
    
    # Added by Rohan - on - 18/2/23
    # Reason - after adding product if we change menu name so in product menu remain old name
    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        super().save(*args,**kwargs)   

        for pro in product_detail.objects.all():
            if pro.upper_menu.id==self.id:
               pro.category=self.menu
               pro.save()
            #    super().save(*args,**kwargs)   
   

            #Added by Rohan-23/2/23
            #Reason- if we change menu name then it should also reflect to cover image category   
        for slide in Head_img.objects.all():
            if slide.Menu==self:
               slide.category=self.menu      
               slide.save() 
            #    super().save(*args,**kwargs)  
            
        # This line is used to save any one option of menu type
        print(self.Choose_menu_type)

        if self.Choose_menu_type=="1":
            self.Show_subMenu_with_image=True
            self.show_instant_filter_for_subMenu=False
            print("------------------",self.Choose_menu_type)
        else: 
            self.show_instant_filter_for_subMenu=True 
            self.Show_subMenu_with_image=False
            print("------------------",self.Choose_menu_type)

     
        super().save(*args,**kwargs)   
        #End of code
    
    def clean(self):
        if (Menus.objects.count() >= 4 and self.pk is None):
            raise ValidationError("Can only create five Menu instances. Try editing/removing one of the existing instances.") 

    def __str__(self):
         return self.menu

    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To changed display name from menuss to menus on sidebar
    class Meta:
            verbose_name_plural = "Menus"      
    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To changed display name from menuss to menus on sidebar    
 
class subMenu(models.Model):
    # Added by Rohan- on -17/2/23
    # reason - Showing images for category
    image=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    # End of code
    
    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To make it unique and increased max length
    # sub=models.CharField(max_length=15)
    sub=models.CharField(max_length=30,unique=True,verbose_name="Sub menu")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To make it unique and increased max length

    Menu=models.ForeignKey(Menus,on_delete=models.CASCADE)
    
     # Added by Rohan - on - 18/2/23
    # Reason - after adding product if we change menu name so in product menu remain old name
    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        super().save(*args,**kwargs) 
        for pro in product_detail.objects.all():
            if pro.subMenu==self:
               pro.category=self.sub
               pro.save()
               #Added by -Rohan-23/2/23
               #Reason-Calling super.save method 2 times for saving issue
        
        super().save(*args,**kwargs)  
             
    def __str__(self):
         return self.sub
#End of the code

class product_detail(models.Model):
    id=models.AutoField(primary_key=True)

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To make this field unique
    # title=models.CharField(max_length=100)
    title=models.CharField(max_length=100,unique=True)
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To make this field unique

    # about=models.CharField(max_length=300)
    # Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Need to mandatory this menu field
    # upper_menu=models.ForeignKey(Menus,on_delete=models.CASCADE,null=True,blank=True)
    upper_menu=models.ForeignKey(Menus,on_delete=models.CASCADE,null=True)
    # End of Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Need to mandatory this menu field
    # Modification and addition by Om Shrivastava on 08-10-23
    # Reason : Need to set the unique property
    subMenu=models.ForeignKey(subMenu,on_delete=models.CASCADE,null=True,blank=True)
    # subMenu=models.ForeignKey(subMenu,on_delete=models.CASCADE,null=True,)
    # End of Modification and addition by Om Shrivastava on 08-10-23
    # Reason : Need to set the unique property
    
    menu=models.CharField(max_length=50,null=True,blank=True)
    category=models.CharField(max_length=50,null=True,blank=True)
    img_main=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)  
    img_sub1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    img_sub2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    img_sub3=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100,default="null") 
    like=models.BigIntegerField(default=0, validators=[MaxValueValidator(999999999)])
    # Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Set the validation for max 15 lakh price 
    # price=models.DecimalField(decimal_places=2,max_digits=10)
    price=models.DecimalField(decimal_places=2,
                              max_digits=10,
                                  validators=[MaxValueValidator(1500000)])
    # End of Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Set the validation for max 15 lakh price 
    # Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Need to remove mandatory and set the default value
    # color=models.CharField(max_length=25,default="blue")
    # description=models.CharField(max_length=300,default="Draped Halter Top With Cutout And Handkerchief Drape")
    # fabric=models.CharField(max_length=50,default="Chiffon")
    # made_in=models.CharField(max_length=30,default="India")
    # style_code=models.CharField(max_length=30,default="AAIR-129-KTH")
    # XS=models.BigIntegerField(default=30,null=True,blank=True)
    # S=models.BigIntegerField(default=30)
    # M=models.BigIntegerField(default=30)
    # L=models.BigIntegerField(default=30)
    # XL=models.BigIntegerField(default=30)
    # XXL=models.BigIntegerField(default=30)
    # XXXL=models.BigIntegerField(default=30)
    # date = models.DateTimeField(default=now, blank=True)
    # available=models.BooleanField(default=True)

    color=models.CharField(max_length=25,null=True,blank=True)
    description=models.CharField(max_length=300,null=True,blank=True)
    fabric=models.CharField(max_length=50,null=True,blank=True)
    made_in=models.CharField(max_length=30,null=True,blank=True)
    style_code=models.CharField(max_length=30,null=True,blank=True)
    XS=models.BigIntegerField(null=True,blank=True)
    S=models.BigIntegerField(null=True,blank=True)
    M=models.BigIntegerField(null=True,blank=True)
    L=models.BigIntegerField(null=True,blank=True)
    XL=models.BigIntegerField(null=True,blank=True)
    XXL=models.BigIntegerField(null=True,blank=True)
    XXXL=models.BigIntegerField(null=True,blank=True)
    date = models.DateTimeField(default=now, blank=True)
    available=models.BooleanField(default=True)
    # End of modification and addition by Om Shrivastava on 14-12-23
    # Reason : Need to remove mandatory and set the default value
    # Modification and addition by Om Shrivastava on 10-12-23
    # Reason : Need to remove the mandatory field
    # shipping_charges=models.BigIntegerField(default=100)
    shipping_charges=models.BigIntegerField(default=100,null=True,blank=True,
                                            # Addition by Om Shrivastava on 14-12-23
                                            # Reason : Set the max value 10000
                                            validators=[MaxValueValidator(10000)]
                                            # End of Addition by Om Shrivastava on 14-12-23
                                            # Reason : Set the max value 10000
                                            )
    # End of modification and addition by Om Shrivastava on 10-12-23
    # Reason : Need to remove the mandatory field   
    # Modification and addition by Om Shrivastava on 22-10-23
    # Reason : Add the is active feature of the product table
    is_active = models.BooleanField(default=True)
    # End of modification and addition by Om Shrivastava on 22-10-23
    # Reason : Add the is active feature of the product table

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

    #Added by - Ashish Dewangan on 17-02-2023
    #Reason - To have best seller checkbox for product
    bestSeller=models.BooleanField(default=False)
    #End of code addition

    # Added by Om Shrivastava on 04-11-23
    # Reason : Need to add the care tip field in product details page
    careTip = models.CharField(max_length=250,null=True,blank=True)
    # End of addition by Om Shrivastava on 04-11-23
    # Reason : Need to add the care tip field in product details page

    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        if self.subMenu is not None:
            strWithSpace =  self.title+self.subMenu.sub
            self.category=self.subMenu.sub
        else:
            strWithSpace =  self.title
            self.category=""
        self.menu=self.upper_menu.menu
        self.search_key=strWithSpace.replace(" ", "")
        super().save(*args,**kwargs) 
    #End of code addition

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
        #  return self.title
         return str(self.id)
    class Meta:
            verbose_name_plural = "Products"
    #End of code addition
    
class image(models.Model):
    src=models.CharField(max_length=200)
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    
    
class Liked(models.Model):
    item=models.ForeignKey(product_detail,on_delete=models.CASCADE)

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - Added verbose name
    # user_no=models.ForeignKey(User,on_delete=models.CASCADE)
    user_no=models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="User email")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - Added verbose name

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Product in user's wishlist"
    class Meta:
            verbose_name_plural = "Wishlist Of Users"
    #End of code addition 
    
SIZE_CHOICES = (
    ('Extra Short','XS'),
    # Modification and addition by Om Shrivastava on 16-12-23
    # Reason : Need to change the short to small
    # ('Short','S'),
    ('Small','S'),
    # End of modification and addition by Om Shrivastava on 16-12-23
    # Reason : Need to change the short to small
    ('Medium', 'M'),
    ('Large','L'),
    ('Extra Large','XL'),
    ('Extra Extra Large','XXL'),
    ('Extra Extra Extra Large','XXL'),

)    
class Cart(models.Model):
    product_no=models.ForeignKey(product_detail,on_delete=models.CASCADE)
    user_no=models.ForeignKey(User,on_delete=models.CASCADE)
    quantity=models.BigIntegerField(default=1)    
    # Modification and addition by Om Shrivastava on 16-12-23
    # Reason : Need to change the short to small   
    # size=models.CharField(max_length=40, choices=SIZE_CHOICES, default='Short')
    size=models.CharField(max_length=40, choices=SIZE_CHOICES, default='Small')
    # End of Modification and addition by Om Shrivastava on 16-12-23
    # Reason : Need to change the short to small   
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
    # Commented and modified by - Ashish Dewangan on 02-12-2023
    # Reason - To change label name of column
    # src=models.ImageField(upload_to='None/', height_field=None,\
    #        width_field=None, max_length=100) 
    src=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100, verbose_name="Cover image")   
    # End of code modification by - Ashish Dewangan on 02-12-2023
    # Reason - To change label name of column

    # label=models.CharField(max_length=100,default="slider")
    # about=models.CharField(max_length=200,default="here you have to write something")
    Menu=models.ForeignKey(Menus,on_delete=models.CASCADE,blank=True,null=True)
    category=models.CharField(max_length=50)
    display_on=models.CharField(max_length=20,choices=window_CHOICES,default="window")
    
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Images to display on cover slider at landing page"
    class Meta:
            verbose_name_plural = "Cover Images"
    #End of code addition 
    
# Added by ROhan -31/12/22
# Reason- Making Header menu dynamic so, user is able select category from available list
    
    def save(self,*args, **kwargs):
        self.category=self.Menu.menu
        super().save(*args,**kwargs) 
    
    

# Reason - Creating new 3 models and commenting HomeCard_img model becuase
# HomeCard_Img is generating Issuebeacuse all content in one model so making different model for each  
# Content according to our need
class HomeGifImages(models.Model):
    Gif_image=models.ImageField(upload_to='Images/', height_field=None,\
    width_field=None, max_length=100)   
    Menu=models.ForeignKey(Menus,on_delete=models.CASCADE,blank=True,null=True)
    sub=models.ForeignKey(subMenu,on_delete=models.CASCADE,blank=True,null=True)
    menu=models.CharField(max_length=50,blank=True)
    category=models.CharField(max_length=50,blank=True) 
    
    def save(self,*args, **kwargs):
        self.menu=self.Menu.menu
        self.category=self.sub.sub
        super().save(*args,**kwargs) 
  
class HomeNormalImages(models.Model):
    image=models.ImageField(upload_to='Images/', height_field=None,\
    width_field=None, max_length=100)   
    Menu=models.ForeignKey(Menus,on_delete=models.CASCADE,blank=True,null=True)
    sub=models.ForeignKey(subMenu,on_delete=models.CASCADE,blank=True,null=True)
    menu=models.CharField(max_length=50,blank=True)
    category=models.CharField(max_length=50) 
    
    def save(self,*args, **kwargs):
        self.menu=self.Menu.menu
        self.category=self.sub.sub
        super().save(*args,**kwargs) 
        
class Home_video(models.Model):
    Video_url=models.CharField(max_length=200)        
    
# End of code    

# class HomeCard_img(models.Model):
#     img_top1=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top1=models.CharField(max_length=50,choices=category,default="casual")
#     img_top1_1=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top1_1=models.CharField(max_length=50,choices=category,default="casual")
#     img_top2=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top2=models.CharField(max_length=50,choices=category,default="casual")
#     img_top2_1=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top2_1=models.CharField(max_length=50,choices=category,default="casual")
#     img_top3=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top3=models.CharField(max_length=50,choices=category,default="casual")
#     img_top4=models.ImageField(upload_to='Images/', height_field=None,\
#     width_field=None, max_length=100)
#     category_top4=models.CharField(max_length=50,choices=category,default="casual")
#     video_url=models.CharField(max_length=200,default="")

#     #Added by Ashish Dewangan on 28-11-2022
#     #Reason - To change table's displayed name
#     def __str__(self):
#          return "Images that will be shown on Home page categories"
#     class Meta:
#             verbose_name_plural = "Category Images"
#     #End of code addition      
         
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
    # commented and modified by - Ashish Dewangan on 04-12-2023
    # Reason - To increase length for country
    # country=models.CharField(max_length=30)
    country=models.CharField(max_length=255)
    # End of code modification by - Ashish Dewangan on 04-12-2023
    # Reason - To increase length for country
    number=models.CharField(max_length=20)
    isSelected=models.BooleanField(default=False)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
        #  Modification and addition by Om Shrivastava on 15-12-23
        #  Reason : Need to remove the dot
        #  return "User - "+self.firstname+" "+self.lastname+"."
         return "User - "+self.firstname+" "+self.lastname
        #  End of modification and addition by Om Shrivastava on 15-12-23
        #  Reason : Need to remove the dot
    
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
    # commented and modified by - Ashish Dewangan on 04-12-2023
    # Reason - To increase length for country
    # country=models.CharField(max_length=30)
    country=models.CharField(max_length=255)
    # End of code modification by - Ashish Dewangan on 04-12-2023
    # Reason - To increase length for country
    number=models.CharField(max_length=20) 
     
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
        #  Modification and addition by Om Shrivastava on 15-12-23
        #  Reason : Need to remove the dot
        #  return "User - "+self.firstname+" "+self.lastname+"."
         return "User - "+self.firstname+" "+self.lastname
        # End of modification and addition by Om Shrivastava on 15-12-23
        #  Reason : Need to remove the dot
    
    class Meta:
            verbose_name_plural = "User's Billing Details"
    #End of code addition
    
order_status=(
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to remove underscore
    # ("processing","Proccessing"),
    # ("accepted","Accepted"),
    # ("out_for_shipping","Out for Shipping"),
    # ("shipped","shipped"),
    # ("arrived","Arrived"),
    # ("out_for_delivery","Out For Delivery"),
    # ("delivered","Delivered"),
      ("Proccessing","Proccessing"),
    ("Accepted","Accepted"),
    ("Out for Shipping","Out for Shipping"),
    ("Shipped","Shipped"),
    ("Arrived","Arrived"),
    ("Out For Delivery","Out For Delivery"),
    ("Delivered","Delivered"),
    # End of modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to remove underscore
)
         
class product_orders(models.Model):
    order_no=models.BigIntegerField()
    user_no=models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to rename the field
    # billing_id=models.ForeignKey(userbillingDetail,on_delete=models.CASCADE)  
    # shipping_id=models.ForeignKey(usershippingDetail,on_delete=models.CASCADE)
    billing_id=models.ForeignKey(userbillingDetail,on_delete=models.CASCADE,verbose_name='Billing Address')  
    shipping_id=models.ForeignKey(usershippingDetail,on_delete=models.CASCADE,verbose_name='Shipping Address')
    # End of Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to rename the field
    # Added by - Ashish Dewangan on 29-11-2023
    # Reason - Added column for product name
    product_name=models.CharField(max_length=100,null=True,blank=True,default='')
    # End of code addition by - Ashish Dewangan on 29-11-2023
    # Reason - Added column for product name 
    quantity=models.BigIntegerField()          
    price=models.BigIntegerField()
    total_price=models.BigIntegerField()
    size=models.CharField(max_length=40)   
    payment_mode=models.CharField(max_length=20,default="cod")
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Set the created date
    # date=models.DateField(('purchase date'), null=False, blank=False, auto_now=True)
    date=models.DateField(('purchase date'), null=False, blank=False, auto_now_add=True)
    # End of modification and addition by Om Shrivastava on 11-12-23
    # Reason : Set the created date
    selected_currency_sign=models.CharField(max_length=255)
    selected_currency_value=models.FloatField()
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to show the capital alphabet
    # order_status=models.CharField(max_length=50,choices=order_status,default="processing",blank=True,null=True)
    order_status=models.CharField(max_length=50,choices=order_status,default="Processing",blank=True,null=True)
    # End of modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to show the capital alphabet
    # Added by - Ashish Dewangan on 27-11-2023
    # Reason - Added column for shipping charges
    # Modification and addition by Om Shrivastava on 10-12-23
    # Reason : Need to remove the mandatory field
    # shipping_charges=models.BigIntegerField(default=100)
    shipping_charges=models.BigIntegerField(default=100,null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-12-23
    # Reason : Need to remove the mandatory field
    # End of code addition by - Ashish Dewangan on 27-11-2023
    # Reason - Added column for shipping charges

    # Added by - Ashish Dewangan on 29-11-2023
    # Reason - To save image of product
    product_image=models.ImageField(upload_to='product_orders/', height_field=None,\
           width_field=None, max_length=100,null=True,blank=True)  
    # End of code addition by - Ashish Dewangan on 29-11-2023
    # Reason - To save image of product
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE)

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Order created by User"
    class Meta:
        verbose_name_plural = "Product Orders"
    #End of code addition

# Modified by - Ashish Dewangan on 14-12-2023
# Reason - To capitalize paid, pending and cancel
# status = (
#     ('paid','paid'),
#     ('pending','pending'),
#     ('cancel','cancel'),

# ) 
status = (
    ('paid','Paid'),
    ('pending','Pending'),
    ('cancel','Cancel'),

)    
# End of code modification by - Ashish Dewangan on 14-12-2023
# Reason - To capitalize paid, pending and cancel


class Transaction_history(models.Model):
    order_no=models.BigIntegerField()
    payment_status=models.CharField(max_length=50,choices=status,default="pending")
    user_no=models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="User email")    
    # coupon_discount=models.BigIntegerField()

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To add verbose name
    # shipping_price=models.BigIntegerField()
    # subtotal_price=models.BigIntegerField()
    shipping_price=models.BigIntegerField(verbose_name="Shipping charges")
    subtotal_price=models.BigIntegerField(verbose_name="Subtotal")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To add verbose name

    # tax=models.BigIntegerField()
    grand_total=models.BigIntegerField()

    #Commented by Rohan 10/12/22
    # I make change on datefield to auto not before i am using today() function so while migrating transactiona history date changes
    date=models.DateField(('ordered date'), null=False, blank=False, auto_now=True)

    # Added by - Ashish Dewangan on 29-11-2023
    # Reason - To save shipping details on transaction history
    firstname=models.CharField(max_length=20,null=True,blank=True,default='')
    lastname=models.CharField(max_length=20,null=True,blank=True,default='')
    street=models.CharField(max_length=200,null=True,blank=True,default='')
    houseno=models.CharField(max_length=20,null=True,blank=True,default='')
    city=models.CharField(max_length=30,null=True,blank=True,default='')
    state=models.CharField(max_length=30,null=True,blank=True,default='')
    zipcode=models.CharField(max_length=20,null=True,blank=True,default='')
    # Commented and modified by - Ashish Dewangan on 04-12-2023
    # Reason - To increase max length of country
    # country=models.CharField(max_length=30,null=True,blank=True,default='')
    country=models.CharField(max_length=255,null=True,blank=True,default='')
    # End of code modification by - Ashish Dewangan on 04-12-2023
    # Reason - To increase max length of country
    number=models.CharField(max_length=20,null=True,blank=True,default='')
    # End of code addition by - Ashish Dewangan on 29-11-2023
    # Reason - To save shipping details on transaction history

         
    def save(self,*args,**kwargs):
        if (self.payment_status=="cancle"):
          pros= product_orders.objects.filter(order_no=self.order_no)
          for product in pros:
             pro=product_detail.objects.get(id=product.product_id.id)
             
             if product.size=="Extra Short":
               pro.XS+=product.quantity
               pro.save()
            # Modification and addition by Om Shrivastava on 16-12-23
            # Reason : Need to change the short to small 
            #  if product.size=="Short":
             if product.size=="Small":
            # End of modification and addition by Om Shrivastava on 16-12-23
            # Reason : Need to change the short to small  
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
             if product.size=="Extra Extra Extra Large":
                 pro.XXXL+=product.quantity 
                 pro.save()

        # Added by - Ashish Dewangan on 11-12-2023
        # Reason - To save payment details to Payment_Details table when payment_status is paid  
        if self.payment_status == "paid":
             try:
                payment_details=Payment_Details.objects.filter(order_no=self.order_no).first()
                if payment_details is None:
                     online_qr_details = Online_Qr.objects.first()
                     if online_qr_details:

                          from django.db import transaction
                          try:
                            with transaction.atomic():
                                payment_details_object=Payment_Details()
                                payment_details_object.order_no=self.order_no
                                payment_details_object.name=online_qr_details.name
                                payment_details_object.bank_name=online_qr_details.bank_name
                                payment_details_object.account_number=online_qr_details.account_number
                                payment_details_object.upi_id=online_qr_details.upi_id
                                payment_details_object.contact_number=online_qr_details.contact_number
                                payment_details_object.save()

                          except Exception as transaction_error:
                                print("Exception occured whitle Transaction",transaction_error)
                          
             except Exception as e:
                print("Exception occured while saving transacetion",e)
        # End of code addition by - Ashish Dewangan on 11-12-2023
        # Reason - To save payment details to Payment_Details table when payment_status is paid
                 
        super().save(*args,**kwargs)

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Transaction"
    class Meta:
            verbose_name_plural = "Transaction Histories"
    #End of code addition              
    
# Added by - Ashish Dewangan on 11-12-2023
# Reason - To save payment details        
class Payment_Details(models.Model):
    order_no=models.BigIntegerField(null=True,blank=True)
    name=models.CharField(max_length=50,null=True,blank=True)
    bank_name=models.CharField(max_length=30,null=True,blank=True)
    account_number=models.CharField(max_length=18,null=True,blank=True)
    upi_id=models.CharField(max_length=50,null=True,blank=True)
    contact_number=models.CharField(max_length=20,validators=[validate_phone_number],null=True,blank=True)
# End of code addition by - Ashish Dewangan on 11-12-2023
# Reason - To save payment details    
    

class Online_Qr(models.Model):
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to remove mandatory field
    # qr_img=models.ImageField(upload_to='Images/', height_field=None,\
    #     width_field=None, max_length=100)
    # name=models.CharField(max_length=50)
    # bank_name=models.CharField(max_length=30)
    # account_number=models.CharField(max_length=18)
    # upi_id=models.CharField(max_length=50)
    qr_img=models.ImageField(upload_to='Images/', height_field=None,\
        width_field=None, max_length=100,null=True,blank=True)
    name=models.CharField(max_length=50,null=True,blank=True)
    bank_name=models.CharField(max_length=30,null=True,blank=True)
    account_number=models.CharField(max_length=18,null=True,blank=True)
    upi_id=models.CharField(max_length=50,null=True,blank=True)
    # End of addition by Om Shrivastava on 08-11-23
    # Reason : Set the contact number 
    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to remove mandatory field
    # contact_number=models.CharField(max_length=20,validators=[validate_phone_number],null=True)
    contact_number=models.CharField(max_length=20,validators=[validate_phone_number],null=True,blank=True)
    # End of addition by Om Shrivastava on 08-11-23
    # Reason : Set the contact number 
    # Addition by Om Shrivastava on 08-11-23
    # Reason : Set the contact number 
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
    discount_percentage=models.BigIntegerField(validators=[validate_discount])
    maximum_discount_price=models.BigIntegerField(validators=[validate_integer_field])               
    expiry_date=models.DateField()
    isActive=models.BooleanField(default=False)
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Coupon details"
    class Meta:
            verbose_name_plural = "Coupons"
    #End of code addition   
    
# Commented by Rohan - 21/12/22 
# Reason - I have to save which user is alredy used coupon and should not able to apply again.

class couponUsed(models.Model):
    id=models.AutoField(primary_key=True) 
    user=models.ForeignKey(User,on_delete=models.CASCADE) 
    used=models.CharField(max_length=50)
    
    
class Tax(models.Model):
    tax_rate=models.BigIntegerField(validators=[validate_tax])    
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Tax setting"
    class Meta:
            verbose_name_plural = "Tax Setting"
    #End of code addition
    def save(self,*args,**kwargs):
        self.tax_rate=0       
        super().save(*args,**kwargs)
    
class ImportantNoticeToBuy(models.Model):
    point1=models.CharField(max_length=200)
    # Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field 
    # point2=models.CharField(max_length=200)
    # point3=models.CharField(max_length=200)
    point2=models.CharField(max_length=200,null=True,blank=True)
    point3=models.CharField(max_length=200,null=True,blank=True)
    # End of Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # End of modification on 04-11-23
    # Reason : End 
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
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # answer=RichTextField(null=True,blank=True)
    answer=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

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
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content1=RichTextField(null=True,blank=True)
    content1 = models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    
    # subtitle2=models.CharField(max_length=255)
    subtitle2=models.CharField(max_length=255,null=True,blank=True)
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content2=RichTextField(null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

    # subtitle3=models.CharField(max_length=255)
    subtitle3=models.CharField(max_length=255,null=True,blank=True)
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content3=RichTextField(null=True,blank=True)
    content3=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # Modification and addition by Om shrivastava on 04-12-23
    # Reason : According to Preeti mam Don't add the default field
    # contactUsImage=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100,default='None/a1.jpg',verbose_name="Contact Us Image")
    contactUsImage=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100,verbose_name="Contact Us Image", null=True,blank=True)
    # End of modification and addition by Om shrivastava on 04-12-23
    # Reason : According to Preeti mam Don't add the default field
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
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content1=RichTextField(null=True,blank=True)

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To make content1 mandatory field
    # content1=models.TextField(null=True,blank=True)
    content1=models.TextField(null=True)
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To make content1 mandatory field

    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To remove mandatory from subtitle
    # subtitle1=models.CharField(max_length=255)
    subtitle1=models.CharField(max_length=255,blank=True)
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To remove mandatory from subtitle

    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content2=RichTextField(null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # subtitle2=models.CharField(max_length=255)
    subtitle2=models.CharField(max_length=255,null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content3=RichTextField(null=True,blank=True)
    content3=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # End of Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # subtitle3=models.CharField(max_length=255)
    subtitle3=models.CharField(max_length=255,null=True,blank=True)
    # End of Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content4=RichTextField(null=True,blank=True)
    content4=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field
    # subtitle4=models.CharField(max_length=255)
    subtitle4=models.CharField(max_length=255,null=True,blank=True)
    # End of Modification and addition by Om Shrivastava on 04-11-23
    # Reason : Need to remove the mandatory field

    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content5=RichTextField(null=True,blank=True)
    content5=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
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
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Set the null and blank true 
    subtitle1=models.CharField(max_length=255,null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    subtitle2=models.CharField(max_length=255,null=True,blank=True)
    content3=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Set the null and blank true 
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
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content1=RichTextField(null=True,blank=True)
    content1=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    title2=models.CharField(max_length=255)
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content2=RichTextField(null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield


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
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content1=RichTextField(null=True,blank=True)
    content1=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - Removed mandatory from this field
    # subtitle1=models.CharField(max_length=255)
    subtitle1=models.CharField(max_length=255,blank=True)
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - Removed mandatory from this field


    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content2=RichTextField(null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

#End of code addition

    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self) -> str:
         return "Return policy of RbyR"
    class Meta:
            verbose_name_plural = "Return Policy"
    #End of code addition

#Added by Ashish on 14-11-2022
#Reason - To create Cancellation policy table
class CancellationPolicy(models.Model):
    title1=models.CharField(max_length=255)
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content1=RichTextField(null=True,blank=True)
    content1=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    subtitle1=models.CharField(max_length=255)
    # Modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield
    # content2=RichTextField(null=True,blank=True)
    content2=models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 10-11-23
    # Reason : Need to change the richtextfield to charfield

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
    phoneNumber=models.BigIntegerField(validators=[validate_phone_number])
    email=models.CharField(max_length=50)
    timing=models.CharField(max_length=50)
    storeImage=models.ImageField(upload_to='Images/', height_field=None,\
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
    logo=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
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
    # Addition by Om Shrivastava on 15-12-23
    # Reason : Set the max field
    # subtitle1=models.TextField(default="",blank=True,)
    # subtitle2=models.TextField(default="",blank=True)
    subtitle1=models.TextField(default="",blank=True,max_length=20)
    subtitle2=models.TextField(default="",blank=True,max_length=20)
    # End of Addition by Om Shrivastava on 15-12-23
    # Reason : Set the max field
    bridalImage=models.ImageField(upload_to='Images/', height_field=None,\
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
    firstName=models.CharField(max_length=255,verbose_name="First Name")
    lastName=models.CharField(max_length=255,verbose_name="Last Name")
    email=models.CharField(max_length=255,blank=True,null=True)
    contactNumber=models.BigIntegerField(verbose_name="Contact Number")
    zipCode=models.BigIntegerField()
    message=models.TextField()
    dateOfWedding=models.DateField(blank=True,null=True,verbose_name="Date Of Wedding")
    # Addition by Om Shrivastava on 10-12-23
    # Reason : Add the created date field
    createdDate = models.DateField(auto_now_add=True,null=True,blank=True,verbose_name="Created Date")
    # End of Addition by Om Shrivastava on 10-12-23
    # Reason : Add the created date field
    termsAndCondition=models.BooleanField(verbose_name="Terms And Conditions")
    
    # Added by Rohan -22/12/22-2022
    #Reason - To remove time from date and time field
    def get_date(self):
        return self.modified.date()

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
    # Added by Ashish Dewangan on 28-11-2022
    # Reason - To change table's displayed name
    # Commented by Om Shrivastava on 09-12-23
    # Reason : No need to show this field yet
    date=models.DateField(('Date'), null=False, blank=False, auto_now=True)
    # End of commented by Om Shrivastava on 09-12-23
    # Reason : No need to show this field yet
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
    instagram_post1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post1_link=models.CharField(max_length=255)
    instagram_post2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post2_link=models.CharField(max_length=255)
    instagram_post3=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post3_link=models.CharField(max_length=255)
    instagram_post4=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    instagram_post4_link=models.CharField(max_length=255)
    instagram_post5=models.ImageField(upload_to='Images/', height_field=None,\
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
    logo=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    cover1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    cover2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    cover3=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    cover4=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    cover5=models.ImageField(upload_to='Images/', height_field=None,\
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
    image=models.ImageField(upload_to='Images/', height_field=None,\
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
    email=models.CharField(max_length=255,blank=True)
    contactNumber=models.BigIntegerField()
    shoulder=models.CharField(max_length=255,blank=True)
    chest=models.CharField(max_length=255,blank=True)
    upperChest=models.CharField(max_length=255,blank=True)
    lowerChest=models.CharField(max_length=255,blank=True)
    dartPoint=models.CharField(max_length=255,blank=True)
    armhole=models.CharField(max_length=255,blank=True)
    armround=models.CharField(max_length=255,blank=True)
    waist=models.CharField(max_length=255,blank=True)
    lowerWaist=models.CharField(max_length=255,blank=True)
    hips=models.CharField(max_length=255,blank=True)
    length=models.CharField(max_length=255,blank=True)
    otherInstructions=models.TextField(default="",blank=True)
    
    # Addition by Om Shrivastava on 13-12-23
    # Reason : Need to add the product id and product name
    product_id=models.ForeignKey(product_detail,on_delete=models.CASCADE,null=True,blank=True)
    product_name = models.CharField(max_length=250,null=True,blank=True)
    # End of Addition by Om Shrivastava on 13-12-23
    # Reason : Need to add the product id and product name

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
class LogoAndNumber(models.Model):
    logo=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    # Modification and addition by Om Shrivastava on 28-10-23
    # Reason : Need to change the spelling of the whatsapp number
    # whatsappNmber=models.BigIntegerField(validators=[validate_phone_number])
    # Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Set the contact number validation 
    # whatsappNmber=models.BigIntegerField(validators=[validate_phone_number],verbose_name="Whatsapp Number")
    whatsappNmber=models.BigIntegerField(validators=[MaxValueValidator(12)],verbose_name="Whatsapp Number")
    # End of Modification and addition by Om Shrivastava on 14-12-23
    # Reason : Set the contact number validation 
    # End of Modification and addition by Om Shrivastava on 28-10-23
    # Reason : Need to change the spelling of the whatsapp number
    #Added by Ashish Dewangan on 28-11-2022
    #Reason - To change table's displayed name
    def __str__(self):
         return "Logo and Number"
    class Meta:
            verbose_name_plural = "Logo and Number"
    #End of code addition
#End of code addition



#Added by Rohan on 7-12-2022
#Reason - To save Currency 
class CurrencySelected(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    currency=models.CharField(max_length=10)
    currency_sign=models.CharField(max_length=255)
    currency_value=models.FloatField()
#End of code addition
#End of code addition


# Added by Rohan on 30-12-22
# Reason - It Design page of RR content
class ItDesignContent(models.Model):
    TopImage1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    TopImage2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    HeaderText=models.CharField(max_length=50)
    description1=models.TextField(max_length=200)
    description2=models.TextField(max_length=500)
    descriptionHighlight=models.CharField(max_length=100)
    sliderImg1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    sliderImg2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    sliderImg3=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    contactHeader=models.CharField(max_length=50)
    contactDescription=models.TextField(max_length=100)
# End of code


# created by Rohan - 4/1/23
#Reason - Saving celebrity data and their shoot

class Celebrity(models.Model):
    TopImage1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    ModelName=models.CharField(max_length=50)
    productTitle=models.CharField(max_length=200)
    upper_menu=models.ForeignKey(Menus,on_delete=models.CASCADE,null=True,blank=True)
    subMenu=models.ForeignKey(subMenu,on_delete=models.CASCADE,null=True,blank=True)
    menu=models.CharField(max_length=50,null=True,blank=True)
    category=models.CharField(max_length=50,null=True,blank=True)
    product=models.ForeignKey(product_detail,on_delete=models.CASCADE,blank=True,null=True)

    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        if self.subMenu is not None:
            self.category=self.subMenu.sub
            self.menu=self.upper_menu.menu
        else:
            self.category=""
            self.menu=""

        super().save(*args,**kwargs) 
# End of code


# Created by Rohan - 5/1/23
# Reason - To save all Editorial data and aboutus content
class Editorial(models.Model):
    TopImage1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    ModelName=models.CharField(max_length=50)
    MagzineName=models.CharField(max_length=200)
    upper_menu=models.ForeignKey(Menus,on_delete=models.CASCADE,null=True,blank=True)
    subMenu=models.ForeignKey(subMenu,on_delete=models.CASCADE,null=True,blank=True)
    menu=models.CharField(max_length=50,null=True,blank=True)
    category=models.CharField(max_length=50,null=True,blank=True)
    product=models.ForeignKey(product_detail,on_delete=models.CASCADE,blank=True,null=True)

    def save(self,*args, **kwargs):
        # self.productName_with_category =  self.product_name+self.category_name.category
        if self.subMenu is not None:
            self.category=self.subMenu.sub
            self.menu=self.upper_menu.menu
        else:
            self.category=""
            self.menu=""

        super().save(*args,**kwargs) 
        
class WorldOfRByRContent(models.Model):
    # Modification and additionn by Om shrivastava on 28-10-23
    # Reason : Remove the mandatory field
    # video_url=models.CharField(max_length=400)
    video_url=models.CharField(max_length=400,null=True,blank=True)
    # End of Modification and additionn by Om shrivastava on 28-10-23
    # Reason : Remove the mandatory field
    top_image=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)
    title1=models.CharField(max_length=50)
    description1=models.TextField()
    
    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To display title when displaying row 
    def __str__(self):
         return self.title1
    # End of code addition by - Ashish Dewangan on 02-12-2023
    # Reason - To display title when displaying row

    # Added by - Ashish Dewangan on 15-12-2023
    # Reason - To changed display name 
    class Meta:
            verbose_name_plural = "World of RbyR Section 1"      
    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To changed display name

    # --------------------------
    # commented by Rohan-on 16/2/23
    # reason-removing this rows to this table and making new table to making dynamic row to show
    # ---------------------------
    
    # img1=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img2=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img3=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # title2=models.CharField(max_length=50)
    # description2=models.TextField()
    # img4=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img5=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img6=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # title3=models.CharField(max_length=50)
    # description3=models.TextField()
    # description4=models.TextField()
    # description5=models.TextField()
    # description6=models.TextField()
    # img7=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img8=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img9=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # title4=models.CharField(max_length=50)
    # description7=models.TextField()
    # description8=models.TextField()
    # description9=models.TextField()
    
    # -------------------
    # end of code
    # -------------------
    
    
class worldOfRByRRow(models.Model):
    # Modified by - Ashish Dewangan on 15-12-2023
    # Reason - Made these fields optional
    # img1=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img2=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # img3=models.ImageField(upload_to='Images/', height_field=None,\
    #        width_field=None, max_length=100)
    # title=models.CharField(max_length=50)
    # description1=models.TextField()
    # description2=models.TextField()
    img1=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100, blank=True)
    img2=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100, blank=True)
    img3=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100, blank=True)
    title=models.CharField(max_length=50, blank=True)
    description1=models.TextField(blank=True)
    description2=models.TextField(blank=True)
    # End of code modification by - Ashish Dewangan on 15-12-2023
    # Reason - Made these fields optional

    
    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To display title when displaying row 
    def __str__(self):
         return self.title
    # End of code addition by - Ashish Dewangan on 02-12-2023
    # Reason - To display title when displaying row

    # Added by - Ashish Dewangan on 15-12-2023
    # Reason - To changed display name 
    class Meta:
            verbose_name_plural = "World of RbyR Section 2"      
    # Added by - Ashish Dewangan on 02-12-2023
    # Reason - To changed display name 
    
class Feature(models.Model):
    magzine_img=models.ImageField(upload_to='Images/', height_field=None,\
           width_field=None, max_length=100)    


# End of code