from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
from django.core.exceptions import ValidationError
from ckeditor.fields import RichTextField
from colorfield.fields import ColorField
from uniform_app import colors
from django.db.models import Max
import re
from django.db import transaction
from decimal import Decimal
# Added by - Ashish Dewangan on 24-11-2024
# Reason - method to generate credit note number 
def generate_credit_note_number():
    now = datetime.datetime.now()
    month = now.strftime("%m")
    year = now.strftime("%Y")

    prefix = f"CN{month}{year}"

    last_credit_note = OrderItem.objects.filter(
        credit_note_number__startswith=prefix
    ).aggregate(Max('credit_note_number'))
    
    last_number = last_credit_note['credit_note_number__max']
    
    if last_number:
        match = re.search(rf"{prefix}(\d+)", last_number)
        if match:
            last_sequence = int(match.group(1))
            new_sequence = last_sequence + 1
        else:
            new_sequence = 1
    else:
        new_sequence = 1
    new_sequence_formatted = f"{new_sequence:05d}"
    credit_note_number = f"{prefix}{new_sequence_formatted}"
    
    return credit_note_number
# End of addition by - Ashish Dewangan on 24-11-2024
# Reason - method to generate credit note number 


class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    # Code added by Unnati on 11-10-2024
    # Reason-Added last name field
    last_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    # End of code addition by Unnati on 11-10-2024
    # Reason-Added last name field
    contact_number = models.CharField(max_length=150, null=True, blank=True)
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    # Added by - Unnati Bajaj on 26-05-2024
    # Reason - To store the OTP for user verification during the password reset process
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_creation_time = models.DateTimeField(default=datetime.datetime.now())
    gender = models.CharField(max_length=10, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name_plural = 'Users'
    # End of code addition by - Unnati Bajaj on 26-05-2024
    # Reason - To enable OTP storage for the password reset functionality


# class Category(models.Model):
#     id=models.AutoField(primary_key=True)
#     name=models.CharField(default='',null=True,blank=True,max_length=30,unique=True)
#     parent_category=models.ForeignKey('self',on_delete=models.CASCADE,blank=True,null=True,related_name='nodes')
#     is_active=models.BooleanField(default=False)
#     ordering=models.IntegerField()

#     def __str__(self):
#        return self.name

# class Item(models.Model):
#     id=models.AutoField(primary_key=True)
#     name=models.CharField(max_length=100,unique=True)
#     category=models.ForeignKey(Category,on_delete=models.CASCADE)
#     image1=models.ImageField(upload_to='Item/', height_field=None,\
#            width_field=None)
#     image2=models.ImageField(upload_to='Item/', height_field=None,\
#            width_field=None,null=True,blank=True)
#     image3=models.ImageField(upload_to='Item/', height_field=None,\
#            width_field=None,null=True,blank=True)
#     image4=models.ImageField(upload_to='Item/', height_field=None,\
#            width_field=None,null=True,blank=True)
#     image5=models.ImageField(upload_to='Item/', height_field=None,\
#            width_field=None,null=True,blank=True)
#     likes=models.BigIntegerField(default=0)
#     price=models.DecimalField(decimal_places=2,
#                               max_digits=10)
#     color=models.CharField(max_length=25,null=True,blank=True)
#     description=models.CharField(max_length=300,null=True,blank=True)
#     made_in=models.CharField(max_length=30,null=True,blank=True)
#     XS=models.BigIntegerField(null=True,blank=True)
#     S=models.BigIntegerField(null=True,blank=True)
#     M=models.BigIntegerField(null=True,blank=True)
#     L=models.BigIntegerField(null=True,blank=True)
#     XL=models.BigIntegerField(null=True,blank=True)
#     XXL=models.BigIntegerField(null=True,blank=True)
#     XXXL=models.BigIntegerField(null=True,blank=True)
#     is_active=models.BooleanField(default=True)
#     shipping_charges=models.BigIntegerField(null=True,blank=True,)
#     shipping_days=models.CharField(max_length=50,null=True,blank=True)
#     ready_to_ship=models.BooleanField(default=False)
#     ready_to_ship_days=models.CharField(max_length=50,null=True,blank=True)
#     search_key=models.TextField(default="",blank=True)
#     is_best_seller=models.BooleanField(default=False)
#     is_featured_item=models.BooleanField(default=False)
#     careTip = models.CharField(max_length=250,null=True,blank=True)

#     def __str__(self):
#         return self.name


# class UserBillingDetail(models.Model):
#     pass

# class UserShippingDetail(models.Model):
#     pass

# class Category(models.Model):
#     id=models.AutoField(primary_key=True)
#     name=models.CharField(default='',null=True,blank=True,max_length=30,unique=True)
#     parent = models.ForeignKey('self', null=True, blank=True, related_name='subcategories', on_delete=models.CASCADE)

# class Brands(models.Model):
#     id=models.AutoField(primary_key=True)
#     name=models.CharField(default='',null=True,blank=True,max_length=30,unique=True)

# class Security(models.Model):
#     id=models.AutoField(primary_key=True)
#     name=models.CharField(default='',null=True,blank=True,max_length=30,unique=True)


# Added by - Unnati Bajaj on 29-05-2024
# Reason - To store contact us details
class ContactRequest(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default='', null=True, blank=True)
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    message = models.CharField(
        default='', null=True, blank=True, max_length=250)
    # Added by - Ashlekh on 22-01-2025
    # Reason - To add created at
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    # End of code - Ashlekh on 22-01-2025
    # Reason - To add created at
    def __str__(self):
        return f"Contact Request {self.pk}"

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Contact Request"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

 # End of code addition by - Unnati Bajaj on 29-05-2024
 # Reason - To store contact us details

# Added by - Unnati Bajaj on 29-05-2024
# Reason - To store setting details


class Setting(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default='', null=True, blank=True, max_length=30)
    address = models.CharField(
        default='', null=True, blank=True, max_length=100)
    pincode = models.CharField(
        max_length=8, null=True, blank=True)

    # Modified by jhamman on 19-10-2024
    # Reason - changed max length
    # contact_number = models.CharField(
    #     max_length=10, unique=True, null=True, blank=True)
    contact_number = models.CharField(
        max_length=25, unique=True, null=True, blank=True)
    # End of modification by jhamman on 19-10-2024
    # Reason - changed max length
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    opening_hours = models.CharField(default='', null=True, blank=True)
    closing_hours = models.CharField(default='', null=True, blank=True)
    map_link = models.TextField(default="", blank=True)
    logo = models.ImageField(
        upload_to='Images/', default='', blank=True, null=True)

    # Commented by jhamman on 18-10-2024
    # Reason - have to remove these field
    # faqBanner = models.ImageField(
    #     upload_to='Images/', default='', blank=True, null=True)
    # aboutUsBanner = models.ImageField(
    #     upload_to='Images/', default='', blank=True, null=True)
    # faqBannerTitle = models.CharField(
    #     default='', null=True, blank=True, max_length=100)
    # storeLocatorBanner = models.ImageField(
    #     upload_to='Images/', default='', blank=True, null=True)
    # storeLocatorBannerTitle = models.CharField(
    #     default='', null=True, blank=True, max_length=100)
    # End of commentation by jhamman on 18-10-2024
    # Reason - have to remove these field
    # Added by - Ashlekh on 05-10-2024
    # Reason - To add field for storing size chart
    size_chart = models.ImageField(
        upload_to='Images/', default='', blank=True, null=True)
    # End of code - Ashlekh on 05-10-2024
    # Reason - To add field for storing size chart
    # Code added by Unnati on 06-11-2024
    # Reason-Added cancellation days,return days,exchange days
    max_cancellation_days = models.IntegerField(
        default=7, null=True, blank=True)
    max_return_days = models.IntegerField(default=30, null=True, blank=True)
    max_exchange_days = models.IntegerField(default=30, null=True, blank=True)
    # End of code addition by Unnati on 06-11-2024
    # Reason-Added cancellation days,return days,exchange days

    def __str__(self):
        return f"Setting"

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Setting"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

# End of code addition by - Unnati Bajaj on 29-05-2024
# Reason - To store setting details

# Added by - Unnati Bajaj on 02-06-2024
# Reason - To store social media links


class Social(models.Model):
    name = models.CharField(default='', null=True, blank=True, max_length=30)
    social_link = models.TextField(default="", blank=False, null=False)
    icon = models.ImageField(
        upload_to='icons/', default='', blank=False, null=False)

    def __str__(self):
        return f"Social Link {self.pk}"

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        # Added by - Ashlekh on 28-11-2024
        # Reason - To display Add Social Media + in button
        verbose_name = "Social Media"
        # End of code - Ashlekh on 28-11-2024
        # Reason - To display Add Social Media + in button
        verbose_name_plural = "Social Media"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
# End of code addition by - Unnati Bajaj on 02-06-2024
# Reason - To store social media links

# Added by - Unnati Bajaj on 02-06-2024
# Reason - To store faq


class Faq(models.Model):
    description = RichTextField(null=True, blank=True)
    # question = models.CharField(
    #     default='', null=True, blank=True, max_length=150)
    # answer = models.CharField(default='', null=True, blank=True)

    def __str__(self):
        return f"FAQ {self.pk}"

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "FAQ"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
# End of code addition by - Unnati Bajaj on 02-06-2024
# Reason - To store faq

# Added by - Unnati Bajaj on 02-06-2024
# Reason - To store store locator


class StoreLocator(models.Model):
    address = models.CharField(
        default='', null=True, blank=True, max_length=100)
    contact_number = models.CharField(max_length=10, null=True, blank=True)
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    image = models.ImageField(
        upload_to='Images/', default='', blank=True, null=True)
    directionLink = models.TextField(default="", blank=True)
    # Added by - Unnati Bajaj on 19-06-2024
    # Reason - Added city and timings of store
    city = models.CharField(default='', null=True, blank=True, max_length=100)
    timings = models.CharField(
        default='', null=True, blank=True, max_length=100)
    # End of code addition by- Unnati Bajaj on 19-06-2024
    # Reason - Added city and timings of store

    def __str__(self):
        return f"Store Locator {self.pk}"

# End of code addition by - Unnati Bajaj on 02-06-2024
# Reason - To store store locator
# Code added by Unnati on 05-08-2024
# Reason-To store home page details


class HomeBanner(models.Model):

    # Added by Jhamman on 12-10-2024
    # Reason - Added verbose name for HomeBanner
    class Meta:
        verbose_name_plural = "Banner"
        # End of addition by Jhamman on 12-10-2024
    # Reason - Added verbose name for HomeBanner
    # Code modified by Unnati on 05-10-2024
    # Reason-Added fields in home banner

    # Commented by Jhamman on 12-10-2024
    # Reason - this field is removed so no need
    # APPLIED_CHOICES = (
    #     ('Percentage', 'Percentage'),
    #     ('Amount', 'Amount'),
    # )
    # End of commentation by Jhamman on 12-10-2024
    # Reason - this field is removed so no need

    # Code added by Unnati on 06-10-2024
    # Reason-Added banner choices
    BANNER_CHOICES = (
        ('Small', 'Small'),
        ('Medium', 'Medium'),
        ('Large', 'Large'),
    )
    # End of code addition by Unnati on 06-10-2024
    # Reason-Added banner choices
    #Code added by Unnati on 15-01-2025
    #Reason-Added banner type choices
    BANNER_TYPE_CHOICES = (
        ('None','None'),
        ('Bestseller', 'Bestseller'),
        ('Featured', 'Featured'),
    )
    #End of code addition by Unnati on 15-01-2025
    #Reason-Added banner type choices
    name = models.CharField(
        default='', null=True, blank=True, max_length=30, unique=False)
    banner_image = models.ImageField(
        upload_to='Images/', default='', blank=True, null=True)
    # offer_amount = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True)

    # Modified by jhamman on 12-10-2024
    # Reason - changed charfield to integerfield
    # offer_percentage = models.CharField(
    #     default='', null=True, blank=True, max_length=30, unique=False)
    offer_percentage = models.IntegerField(
        default='', null=True, blank=True, max_length=30, unique=False)
    # End of modification by jhamman on 12-10-2024
    # Reason - changed charfield to integerfield
    # applied_in = models.CharField(
    #     max_length=20, choices=APPLIED_CHOICES, default='Percentage')
    # End of code modification by Unnati on 05-10-2024
    # Reason-Added fields in home banner
    # Code added by Unnati on 06-10-2024
    # Reason-Added banner options
    banner_options = models.CharField(
        max_length=20, choices=BANNER_CHOICES, default='Medium')
    # End of code addition by Unnati on 06-10-2024
    # Reason-Added banner options
    #Code added by Unnati on 15-01-2025
    #Reason-Added banner type choices
    banner_type = models.CharField(
        max_length=20, choices=BANNER_TYPE_CHOICES, default='None')
    #End of code addition by Unnati on 15-01-2025
    #Reason-Added banner type choices
    # Code added by Unnati on 11-10-2024
    # Reason-Added else condition

    def __str__(self):
        return self.name if self.name else "Unnamed Banner"
    # Code modified by Unnati on 16-10-2024
    # Reason-Added limitation for adding more than 4 banners

    def clean(self):
        if self.banner_options == 'Small':
            current_small_banner_count = HomeBanner.objects.filter(
                banner_options='Small'
            ).exclude(pk=self.pk).count()

            if current_small_banner_count >= 4:
                raise ValidationError(
                    "You cannot create more than 4 Small banners."
                )
    # End of code modification by Unnati on 16-10-2024
    # Reason-Added limitation for adding more than 4 banners
    # End of code addition by Unnati on 11-10-2024
    # Reason-Added else condition
# End of code addition by Unnati on 05-08-2024
# Reason-To store home page details
# Added by - Unnati Bajaj on 04-06-2024
# Reason - To store Category

class Banner(models.Model):
    name = models.CharField(
         max_length=30,)
    description = models.TextField(
         null=True, blank=True)
    banner_image = models.ImageField(
        upload_to='Banners/',)
            
# Added by - Ashish Dewangan on 18-12-2024
# Reason - Method to get ids of child categories perent in parent-child hierarchy            
def get_child_categories(category, categoryIds):
        try:
            categoryIds.append(category.id)
            children = Category.objects.filter(parent_id=category)
            if children.exists():
                for child in children:
                    get_child_categories(child, categoryIds)
            return categoryIds
        except Exception as e:
            pass
# End of addition by - Ashish Dewangan on 18-12-2024
# Reason - Method to get ids of child categories perent in parent-child hierarchy 

class Category(models.Model):
    name = models.CharField(default='', null=True, blank=True, max_length=50)
    parent_id = models.ForeignKey(
        'self', on_delete=models.CASCADE, blank=True, null=True, related_name='nodes')
    # Code changed by - Ashlekh on 14-01-2025
    # Reason - By default, is_active should be checked
    # is_active = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # End of code - Ashlekh on 14-01-2025
    # Reason - By default, is_active should be checked
    # Code added by Unnati on 05-10-2024
    # Reason-Added image field in category
    # Code modified by Unnati on 14-10-2024
    # Reason-Made image field mandatory
    image = models.ImageField(
        upload_to='Images/', default='')
    # End of code modification  by Unnati on 14-10-2024
    # Reason-Made image field mandatory
    # End by Unnati on 05-10-2024
    # Reason-Added image field in category
    # Code added by Unnati on 05-10-2024
    # Reason-Added banner field
    # Commented by jhamman on 10-10-2024
    # Reason - remove field banner, because we dont have to apply discountt on category
    # banner = models.ForeignKey(
    #     HomeBanner, on_delete=models.CASCADE, null=True, blank=True)
    # End of commentation by jhamman on 10-10-2024
    # Reason - remove field banner, because we dont have to apply discountt on category
    # End of code addition by Unnati on 05-10-2024
    # Reason-Added banner field
    # Added by-Unnati on 16-11-2024
    # Reason- To have is_coming soon
    is_coming_soon =models.BooleanField(default=False)
    # End of code addition by-Unnati on 16-11-2024
    # Reason- To have is_coming soon
    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    # Addition by Om Shrivastava on 09-11-2025
    # Reason : Add Description 
    description = models.TextField(null=True,blank=True)
    # End of addiiton by Om Shrivastava on 09-11-2025
    # Reason : Add Description 
    class Meta:
        verbose_name_plural = "Category"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def save(self, *args, **kwargs):
        # Added by - Ashlekh on 28-12-2024
        # Reason - To prevent saving a category with same name in different upper and lower case
        if Category.objects.filter(
                name__iexact=self.name.strip(), 
                parent_id=self.parent_id
        ).exclude(id=self.id).exists():
            raise ValidationError("A category with the same name and parent already exists.")
        # End of code - Ashlekh on 28-12-2024
        # Reason - To prevent saving a category with same name in different upper and lower case
        # Code added by Unnati on 18-11-2024
        # Reason-Added condition for category

        # Modified by - Ashish Dewangan on 18-12-2024
        # Reason - To inactivate child categories and product if category becomes inactive
        # if self.pk:
            # original_instance = Category.objects.get(pk=self.pk)
            # if original_instance.name == self.name and original_instance.parent_id == self.parent_id:
            #     super().save(*args, **kwargs)
            #     return
        if self.id:    
            if self.is_active==False:
                child_category_ids=[]
                child_category_ids = get_child_categories(self,child_category_ids)
                Category.objects.filter(id__in=child_category_ids).update(is_active=False)
                Product.objects.filter(category_id__in=child_category_ids).update(is_active=False)
        # End of modification by - Ashish Dewangan on 18-12-2024
        # Reason - To inactivate child categories and product if category becomes inactive

        # Added by - Ashish Dewangan on 19-12-2024
        # Reason - can not activate the category if parent category is inactivated        
        if self.parent_id is not None:
            if self.parent_id.is_active == False:
                self.is_active = False     
        # End of addition by - Ashish Dewangan on 19-12-2024
        # Reason - can not activate the category if parent category is inactivated            
                        
        #End of code addition by Unnati on 18-11-2024
        #Reason-Added condition for category    
        #Code modified by Unnati on 13-11-2024
        #Reason-Added validation
        #Code modified by Unnati on 18-11-2024
        #Reason-Modified condition
        # Commented by - Ashlekh on 12-12-2024
        # Reason - Category with same name was not saving
        if Category.objects.filter(name=self.name).exclude(id=self.id).exists():
            raise ValidationError(
                "A category with the same name and parent already exists."
            )
        # End of comment - Ashlekh on 12-12-2024
        # Reason - Category with same name was not saving
        #End of code modification by Unnati on 18-11-2024
        #Reason-Modified condition
        if self.parent_id:
            if self.parent_id and self.get_hierarchy_depth() > 3:
            #End of code modification by Unnati on 13-11-2024
            #Reason-Added validation    
                raise ValidationError(
                    "Category hierarchy cannot be deeper than 3 levels.")
        super().save(*args, **kwargs)

    def get_hierarchy_depth(self):
        depth = 1
        parent = self.parent_id
        while parent:
            depth += 1
            parent = parent.parent_id
        return depth

    def __str__(self):
        # Code changed by - Ashlekh on 11-11-2024
        # Reason - To save with category name else save with empty string
        # return self.name
        return self.name if self.name else ""
        # End of code - Ashlekh on 11-11-2024
        # Reason - To save with category name else save with empty string
# End of code addition by - Unnati Bajaj on 04-06-2024
# Reason - To store category

# Code added by - Unnati Bajaj on 10-06-2024
# Reason - To store Policies


class Policies(models.Model):
    privacyPolicy = RichTextField(null=True, blank=True)
    shippingPolicy = RichTextField(null=True, blank=True)
    returnPolicy = RichTextField(null=True, blank=True)
    cancellationPolicy = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Policy"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Policies"
# End of code addition by - Unnati Bajaj on 10-06-2024
# Reason - To store policies

# Code added by - Unnati Bajaj on 10-06-2024
# Reason - To store terms and conditions


class TermsAndConditions(models.Model):
    heading = RichTextField(null=True, blank=True)
    description = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Term and Conditions"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Terms And conditions {self.pk}"
# End of code addition by - Unnati Bajaj on 10-06-2024
# Reason - To store terms and conditions

# Code commented by - Unnati Bajaj on 10-06-2024
# Reason - To store about us details
# class AboutUsSection1(models.Model):
#     heading=RichTextField(null=True, blank=True)
#     description=RichTextField(null=True, blank=True)
#     def __str__(self):
#         return f"Section1 {self.pk}"

# class AboutUsSection2(models.Model):
#     heading=models.CharField(default='',null=True,blank=True)
#     description=models.CharField(default='',null=True,blank=True)
#     image=models.ImageField(upload_to='Images/', default='', blank=True, null=True)
#     def __str__(self):
#         return f"Section2 {self.pk}"

# class AboutUsSection3(models.Model):
#     section3=RichTextField(null=True, blank=True)
#     def __str__(self):
#         return f"Section3 {self.pk}"

# class AboutUsSection4(models.Model):
#     heading=RichTextField(null=True, blank=True)
#     description=RichTextField(null=True, blank=True)
#     video=RichTextField(null=True, blank=True)
#     def __str__(self):
#         return f"Section4 {self.pk}"
# End of code comment by - Unnati Bajaj on 10-06-2024
# Reason - To store about us details
# Code commented by - Unnati Bajaj on 06-10-2024
# Reason - To remove brand


# class Brand(models.Model):
#     # Code added by Unnati on 31-08-2024
#     # Reason-Image field would be mandatory
#     image = models.ImageField(
#         upload_to='Images/', default='')
#     # End of code addition by Unnati on 31-08-2024
#     # Reason-Image field would be mandatory
#     text = models.CharField(default='', max_length=100)
#     # Code added by Unnati on 25-08-2024
#     # Reason-To return brand name

#     def __str__(self):
#         return self.text
    # End of code addition by Unnati on 25-08-2024
    # Reason-To return brand name
# End of code comment by - Unnati Bajaj on 06-10-2024
# Reason - To remove brand
# End of code addition by - Unnati Bajaj on 19-06-2024
# Reason - To store brand
# Code added by - Unnati Bajaj on 19-06-2024
# Reason - To store product details


class Product(models.Model):
    # Code added by Unnati on 10-08-2024
    # Reason-Added item type choices
    ITEM_TYPE_CHOICES = [
        ('security', 'Security'),
        ('police', 'Police'),
        ('sheriff', 'Sheriff'),
        ('fire', 'Fire'),
        ('others', 'Others'),
    ]
    # End of code addition by Unnati on 10-08-2024
    # Reason-Added item type choices

    # Added by Jhamman on 05-10-2024
    # Reason - Added chouce for discount type

    # Commented by jhamman on 12-10-2024
    # Reason - To remove discount type choice
    # DISCOUNT_CHOICES = [
    #     ('percentage', 'Percentage'),
    #     ('amount', 'Amount'),
    # ]
    # End of commentation by jhamman on 12-10-2024
    # Reason - To remove discount type choice

    # End of addition by Jhamman on 05-10-2024
    # Reason - Added chouce for discount type

    product_id = models.CharField()
    name = models.TextField(default='')
    # Code added by Unnati on 12-09-2024
    # Reason-This code is not in use currently
    # short_name = models.CharField(
    #     default='', null=True, blank=True, max_length=30)
    # End of code addition by Unnati on 12-09-2024
    # Reason-This code is not in use currently
    description = models.TextField(default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    # Code commented by Unnati on 06-10-2024
    # Reason-To remove brand
    # brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    # End of code commented by Unnati on 06-10-2024
    # Reason-To remove brand
    # Code modified by Unnati on 10-08-2024
    # Reason-Added menu field
    # menu = models.CharField(
    #     choices=ITEM_TYPE_CHOICES, max_length=50, default='others')
    # End of code modification by Unnati on 10-08-2024
    # Reason-Added menu field
    # End of code modification by Unnati on 10-08-2024
    # Reason-Added item type field

    # Commented by Jhamman on 14-10-2024
    # Reason - to remove mrp field
    # mrp = models.CharField(max_length=100, null=True, blank=True)
    # End of commentation by Jhamman on 14-10-2024
    # Reason - to remove mrp field

    # Modified by Jhamman on 23-10-2024
    # Reason - change verbose name
    # sales_rate = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True)
    sales_rate = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, verbose_name='Selling Price')
    # End of modification by Jhamman on 23-10-2024
    # Reason - change verbose name

    # Code commented by Unnati on 11-09-2024
    # Reason-Discount is not used currently
    # discount_applied_in = models.CharField(
    #     max_length=100, null=True, blank=True)
    # discount_amount = models.CharField(max_length=100, null=True, blank=True)
    # End of code comment by Unnati on 11-09-2024
    # Reason-Discount is not used currently
    XS = models.BigIntegerField(null=True, blank=True)
    S = models.BigIntegerField(null=True, blank=True)
    M = models.BigIntegerField(null=True, blank=True)
    L = models.BigIntegerField(null=True, blank=True)
    XL = models.BigIntegerField(null=True, blank=True)
    XXL = models.BigIntegerField(null=True, blank=True)
    XXXL = models.BigIntegerField(null=True, blank=True)
    #Code added by Unnati on 30-12-2024
    #Reason-Added free size field
    is_free_size = models.BooleanField(default=False)
    free_size = models.BigIntegerField(null=True, blank=True)
    #End of code addition by Unnati on 30-12-2024
    #Reason-Added free size field
    ##Code modified by Unnati on 16-01-2025
    ##Reason-Added max length
    image1 = models.ImageField(
        upload_to='Images/',max_length=255, default='')
    image2 = models.ImageField(
        upload_to='Images/',max_length=255,  default='', blank=True, null=True)
    image3 = models.ImageField(
        upload_to='Images/',max_length=255,  default='', blank=True, null=True)
    image4 = models.ImageField(
        upload_to='Images/',max_length=255,  default='', blank=True, null=True)
    image5 = models.ImageField(
        upload_to='Images/',max_length=255,  default='', blank=True, null=True)
    ##End of code addition by Unnati on 16-01-2025
    ##Reason-Added max length
    color = ColorField(default='#000000')

    # Added by Jhamman on 14-10-2024
    # Reason - added a field to show patches
    # Modification and addition by Om Shrivastava on 18-11-2024
    # Reason : Change the name of this field 
    # Code changed by - Ashlekh on 13-12-2024
    # Reason - To change name of this field
    # show_patches_and_embroider_on_UI = models.BooleanField(default=False,verbose_name="Customization price")
    show_patches_and_embroider_on_UI = models.BooleanField(default=False,verbose_name="Show Customization Details")
    # End of code - Ashlekh on 13-12-2024
    # Reason - To change name of this field
    # End of addition by Jhamman on 14-10-2024
    # Reason - added a field to show patches
    # End of modification and addition by Om Shrivastava on 18-11-2024
    # Reason : Change the name of this field
    # Addition by Om Shrivastava on 18-11-2024
    # Reason : Add the field of customization price 
    # Modification and addition by Om Shrivastava on 28-11-2024
    # Reason : Change the name of customization fields and also checkboxes of customization
    logo = models.BooleanField(default=False)
    patches = models.BooleanField(default=False,verbose_name="Patches / Batches")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches = models.BooleanField(default=False,verbose_name="Security id")
    security_batches = models.BooleanField(default=False,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back = models.BooleanField(default=False)
    printed_id = models.BooleanField(default=False)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    # Code changed by - Ashlekh on 07-03-2025
    # Reason - To change field name
    # embroider = models.BooleanField(default=False,verbose_name="Embroider / Name")
    embroider = models.BooleanField(default=False,verbose_name="Embroider")
    # End of code - Ashlekh on 07-03-2025
    # Reason - To change field name
    logo_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    patches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Patches / Batches Price")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches_price = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security id Price")
    security_batches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    printed_id_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    # Added by - Ashlekh on 13-12-2024
    # Reason - To change name of embroider field
    # embroider_price = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Embroider / Name Price")
    embroider_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Embroider Price")
    # End of code - Ashlekh on 13-12-2024
    # Reason - To change name of embroider field
    # End of modification and addition by Om Shrivastava on 28-11-2024
    # Reason : Change the name of customization fields
    # End of addition by Om Shrivastava on 18-11-2024
    # Reason : Add the field of customization price 
    # Addition by Om Shrivastava on 20-11-2024
    # Reason : Add the customization comment field 
    customization_comment = models.TextField(null=True,blank=True)
    after_customization_product_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    # End of addition by Om Shrivastava on 20-11-2024
    # Reason : Add the customization comment field 
    # Code commented by Unnati on 12-09-2024
    # Reason-This code is currently not in use(User can add these in detail section)
    # prints = models.CharField(max_length=50, null=True, blank=True)
    # material = models.CharField(max_length=100, null=True, blank=True)
    # material_care = models.TextField(null=True, blank=True)
    # video = models.URLField(max_length=200, null=True, blank=True)
    # End of code comment by Unnati on 12-09-2024
    # Reason-This code is currently not in use(User can add these in detail section)
    # is_coupon_applied = models.BooleanField(default=True)
    # coupons_amount = models.CharField(max_length=150, null=True, blank=True)
    # coupon_code = models.CharField(max_length=150, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    shipping_days = models.CharField(max_length=50, null=True, blank=True)
    # Code commented by Unnati on 12-09-2024
    # Reason-Shipping charge is included in sales rate
    # shipping_charges = models.BigIntegerField(null=True, blank=True)
    # End of code comment by Unnati on 12-09-2024
    # Reason-Shipping charge is included in sales rate
    is_best_seller = models.BooleanField(default=False)
    is_featured_product = models.BooleanField(default=False)

    # Commented by Jhamman on 10-10-2024
    # Reason - Remove field is on sale from model
    # is_on_sale = models.BooleanField(default=False)
    # End of commentation by Jhamman on 10-10-2024
    # Reason - Remove field is on sale from model

    # Added by Jhamman on 05-10-2024
    # Reason - added dropdown for discount
    # discount_in = models.CharField(
    #     choices=DISCOUNT_CHOICES, max_length=50, default='others')
    # End of addition by Jhamman on 05-10-2024
    # Reason - added dropdown for discount

    # Modified by Jhamman on 05-10-2024
    # Reason - changed verbose name
    # on_sale_amount = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True)
    # sale_amount = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True, verbose_name='Sale amount')
    # End of modification by Jhamman on 05-10-2024
    # Reason - changed verbose name

    # Added by Jhamman on 05-10-2024
    # Reason - added field sale Percentage
    sale_percentage = models.IntegerField(max_length=2, null=True, blank=True)
    # End of addition by Jhamman on 05-10-2024
    # Reason - added field sale Percentage

    is_ready_to_ship = models.BooleanField(default=False)
    # Code added by Unnati on 12-09-2024
    # Reason-This code is not in use currently
    # made_in = models.CharField(max_length=30, null=True, blank=True)
    # likes = models.BigIntegerField(default=0)
    # End of code addition by Unnati on 12-09-2024
    # Reason-This code is not in use currently
# Code added by - Unnati Bajaj on 01-06-2024
# Reason - To store product details like features,product specifications
    details = RichTextField(null=True, blank=True)
# End of code addition by - Unnati Bajaj on 01-06-2024
# Reason - To store product details like features,product specifications
# Code added by Unnati on 05-09-2024
# Reason-To have created at time for product
    created_at = models.DateTimeField(auto_now_add=True)
# End of code addition by Unnati on 05-09-2024
# Reason-To have created at time for product
# Code added by Unnati on 05-10-2024
# Reason-Added banner field
    banner = models.ForeignKey(
        HomeBanner, on_delete=models.SET_NULL, null=True, blank=True)
# End of code addition by Unnati on 05-10-2024
# Reason-Added banner field
# Code added by Unnati on 17-10-2024
# Reason-Added rating field
    rating = models.DecimalField(
        decimal_places=1, max_digits=3, null=True, blank=True)
# End of code addition by Unnati on 17-10-2024
# Reason-Added rating field
# Code added by Unnati on 06-11-2024
# Reason-Adding is_exchangeable,is_cancellable,is_returnable
    is_exchangeable = models.BooleanField(default=False)
    is_returnable = models.BooleanField(default=False)
    is_cancellable = models.BooleanField(default=False)
# End of code addition by Unnati on 06-11-2024
# Reason-Adding is_exchangeable,is_cancellable,is_returnable
    # @property
    # def color_name(self):
    #     try:
    #         return webcolors.hex_to_name(self.color)
    #     except ValueError:
    #         return colors.get_closest_color_name(self.color)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Product"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return self.name
    #Code added by Unnati on 13-12-2024
    #Reason-To update all products with same porduct_id 
    def update_related_products(self):
    
     Product.objects.filter(product_id=self.product_id).exclude(id=self.id).update(
        show_patches_and_embroider_on_UI=self.show_patches_and_embroider_on_UI,
        logo=self.logo,
        patches=self.patches,
        name=self.name,
        description=self.description,
        category=self.category,
        security_batches=self.security_batches,
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        security_id_on_back=self.security_id_on_back,
        printed_id=self.printed_id,
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        embroider=self.embroider,
        logo_price=self.logo_price,
        patches_price=self.patches_price,
        security_batches_price=self.security_batches_price,
        # Added by - Ashlekh on 18-02-2025
        # Reason - To add customization price
        security_id_on_back_price = self.security_id_on_back_price,
        printed_id_price = self.printed_id_price,
        # End of code - Ashlekh on 18-02-2025
        # Reason - To add customization price
        embroider_price=self.embroider_price,
        shipping_days=self.shipping_days,
        is_best_seller=self.is_best_seller,
        is_featured_product=self.is_featured_product,
        is_ready_to_ship=self.is_ready_to_ship,
        details=self.details,
        banner=self.banner,
        is_exchangeable=self.is_exchangeable,
        is_returnable=self.is_returnable,
        is_cancellable=self.is_cancellable,
    )
    #End of code addition by Unnati on 13-12-2024
    #Reason-To update all products with same porduct_id 
    # Added by jhamman on 11-10-2024
    # Reason - update cart when we change the value of field in Product model
    """ 
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        carts = Cart.objects.filter(product=self.id)
        # Code modified by Unnati on 16-10-2024

        if self.sale_percentage:
            for cart in carts:
                discounted_price = float(
                    self.sales_rate) * (self.sale_percentage/100)
                cart.sales_rate = float(self.sales_rate) - (discounted_price)
                cart.save()
        ##Code added by Unnati on 01-12-2024
        ##Reason-Added condition for products with no sales percentage        
        else:
            for cart in carts:
                cart.sales_rate = float(self.sales_rate)
                cart.save()
        ##End of code addition by Unnati on 01-12-2024
        ##Reason-Added condition for products with no sales percentage  
                # End of code modification by Unnati on 16-10-2024
    # End of addition by jhamman on 11-10-2024
    # Reason - update cart when we change the value of field in Product model
    # Code added by Unnati on 17-10-2024
    # Reason-Added validation for rating value
    """

    # Added by Unnati on 13-12-2024
    # Reason - Added condition for updating product with same product_id or creating new product 
    def save(self, *args, **kwargs):
        ##Code added by Unnati on 15-01-2025
        ##Reaso-To make name first letter capital
        if self.name:
            self.name = self.name.capitalize()
        ##End of code addition by Unnati on 15-01-2025
        ##Reaso-To make name first letter capital    
        # Added by - Ashish Dewangan on 19-12-2024
        # Reason - can not activate the product if it's category is inactivated 
        if self.category.is_active == False:
            self.is_active=False
        # End of addition by - Ashish Dewangan on 19-12-2024
        # Reason - can not activate the product if it's category is inactivated 
            
        if self.id:
            self.update_related_products()

        else:
            
            existing_product = Product.objects.filter(product_id=self.product_id).first()

            if existing_product:
                
                self.show_patches_and_embroider_on_UI = existing_product.show_patches_and_embroider_on_UI
                self.logo = existing_product.logo
                self.patches = existing_product.patches
                self.description = existing_product.description
                self.category =existing_product.category
                self.security_batches = existing_product.security_batches
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                self.security_id_on_back = existing_product.security_id_on_back
                self.printed_id = existing_product.printed_id
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                self.embroider = existing_product.embroider
                self.logo_price = existing_product.logo_price
                self.patches_price = existing_product.patches_price
                self.security_batches_price = existing_product.security_batches_price
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization price
                self.security_id_on_back_price = existing_product.security_id_on_back_price
                self.printed_id_price = existing_product.printed_id_price
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization price
                self.embroider_price = existing_product.embroider_price
                self.shipping_days = existing_product.shipping_days
                self.is_best_seller = existing_product.is_best_seller
                self.is_featured_product = existing_product.is_featured_product
                self.is_ready_to_ship = existing_product.is_ready_to_ship
                self.details = existing_product.details
                self.banner = existing_product.banner
                self.is_exchangeable = existing_product.is_exchangeable
                self.is_returnable = existing_product.is_returnable
                self.is_cancellable = existing_product.is_cancellable

        carts = Cart.objects.filter(product=self.id)
        for cart in carts:
                cart.name=self.name
                cart.sales_rate = float(self.sales_rate)
                if cart.logo:
                    cart.logo_price=self.logo_price
                if cart.patches:   
                    cart.patches_price=self.patches_price
                if cart.security_batches:   
                    cart.security_batches_price=self.security_batches_price
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization price
                if cart.security_id_on_back:
                    cart.security_id_on_back_price=self.security_id_on_back_price
                if cart.printed_id:
                    cart.printed_id_price=self.printed_id_price
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization price
                if cart.embroider:  
                    cart.embroider_price=self.embroider_price

                discounted_price=self.sales_rate
                if self.sale_percentage:
                    discounted_price = Decimal(float(self.sales_rate) -(float(self.sales_rate) * float(self.sale_percentage/100) ))
                    
                if cart.logo == True and cart.logo_price is not None and cart.logo_price >0:
                        discounted_price += Decimal(str(cart.logo_price))
                if cart.patches == True and cart.patches_price is not None  and cart.patches_price>0:
                        discounted_price += Decimal(str(cart.patches_price))
                if cart.security_batches == True and cart.security_batches_price is not None  and cart.security_batches_price>0:
                        discounted_price += Decimal(str(cart.security_batches_price))
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization details
                if cart.security_id_on_back == True and cart.security_id_on_back_price is not None  and cart.security_id_on_back_price>0:
                        discounted_price += Decimal(str(cart.security_id_on_back_price))
                if cart.printed_id == True and cart.printed_id_price is not None  and cart.printed_id_price>0:
                        discounted_price += Decimal(str(cart.printed_id_price))
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization details
                if cart.embroider == True and cart.embroider_price is not None  and cart.embroider_price>0:
                        discounted_price += Decimal(str(cart.embroider_price))
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization condition security_id_on_back & printed_id
                # if cart.logo == True or cart.patches==True or cart.security_batches==True or cart.embroider==True:
                if cart.logo == True or cart.patches==True or cart.security_batches==True or cart.security_id_on_back==True or cart.printed_id==True or cart.embroider==True:
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization condition security_id_on_back & printed_id    
                    cart.after_customization_product_price = discounted_price
                else:
                    cart.after_customization_product_price = None
                
                cart.save()
                
        super().save(*args, **kwargs)
    # End of addition by Unnati on 13-12-2024
    # Reason - Added condition for updating product with same product_id or creating new product    

    def clean(self):
        super().clean()
        if self.rating is not None:
            if self.rating < 0 or self.rating > 5:
                raise ValidationError(
                    ('Please add a value between 0 and 5 for the rating.'))
        #Code added by Unnati on 13-12-2024
        #Reason-Added a condition 
        if self.show_patches_and_embroider_on_UI:
         if not any([
            self.logo_price, 
            self.patches_price, 
            self.security_batches_price, 
            # Added by - Ashlekh on 18-02-2025
            # Reason - To add customization price
            self.security_id_on_back_price,
            self.printed_id_price,
            # End of code - Ashlekh on 18-02-2025
            # Reason - To add customization price
            self.embroider_price
        ]):
            raise ValidationError(
                "When customization price is ticked, at least one price field must be set."
            )    
        #End of code addition by Unnati on 13-12-2024
        #Reason-Added a condition 
    # End of code addition by Unnati on 17-10-2024
    # Reason-Added validation for rating value
# End of code addition by - Unnati Bajaj on 19-06-2024
# Reason - To store product details
# Code added by - Unnati Bajaj on 03-07-2024
# Reason - To store email subscription details


class EmailSubscriptionRequest(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Email Subscription Request"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Email Subscription {self.pk}"
# End of code addition by - Unnati Bajaj on 03-07-2024
# Reason - To store email subscription details
# Code added by - Unnati Bajaj on 04-07-2024
# Reason - To store add to cart details


class Cart(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    # Code modified by Unnati on 30-07-2024
    # Reason-Change productId to product
    product = models.ForeignKey(
        Product, related_name='cart_products', on_delete=models.CASCADE)
    # End of code modification by Unnati on 30-07-2024
    # Reason-Change productId to product
    XS = models.BigIntegerField(null=True, blank=True)
    S = models.BigIntegerField(null=True, blank=True)
    M = models.BigIntegerField(null=True, blank=True)
    L = models.BigIntegerField(null=True, blank=True)
    XL = models.BigIntegerField(null=True, blank=True)
    XXL = models.BigIntegerField(null=True, blank=True)
    XXXL = models.BigIntegerField(null=True, blank=True)
    ##Code added by Unnati on 03-01-2024
    ##Reason-Added free size functionality 
    free_size = models.BigIntegerField(null=True, blank=True)
    ##End of code addition by Unnati on 03-01-2024
    ##Reason-Added free size functionality
    color = models.CharField(max_length=50, null=True, blank=True)
    # Code added by Unnati on 26-07-2024
    # Reason-To add sales rate,image and name field
    sales_rate = models.DecimalField(
        decimal_places=2, max_digits=10, null=True)
    image1 = models.CharField(default='', null=True,
                              blank=True, max_length=500)
    # Code added by Unnati on 05-09-2024
    # Reason-Remove charfield and added textfield
    name = models.TextField(default='', null=True, blank=True)
    # End of code addition by Unnati on 05-09-2024
    # Reason-Remove charfield and added textfield
    # Modification and addition by Om Shrivastava on 29-11-2024
    # Reason : Add customization, size, quanity fields 
    size = models.CharField(max_length=50, null=True,blank=True)
    # Modification and addition by Om Shrivastava on 01-12-2024
    # Reason : Change the charfield to integer field 
    # quantity = models.CharField(max_length=50, null=True,blank=True)
    quantity = models.IntegerField(max_length=50, null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 01-12-2024
    # Reason : Change the charfield to integer field
    logo = models.BooleanField(default=False)
    patches = models.BooleanField(default=False,verbose_name="Patches / Batches")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches = models.BooleanField(default=False,verbose_name="Security id")
    security_batches = models.BooleanField(default=False,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back = models.BooleanField(default=False)
    printed_id = models.BooleanField(default=False)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    embroider = models.BooleanField(default=False,verbose_name="Embroider / Name")
    # Addition by Om Shrivastava on 01-12-2024
    # Reason : Add customization price all fields
    logo_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    patches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Patches / Batches Price")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches_price = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security id Price")
    security_batches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    printed_id_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    embroider_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Embroider / Name Price")
    # End of addition by Om Shrivastava on 01-12-2024
    # Reason : Add customization price all fields
    after_customization_product_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    # Modification and addition by Om Shrivastava on 29-11-2024
    # Reason : Add customization, size, quanity fields 
    customization_comment = models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 29-11-2024
    # Reason : Add customization, size, quanity fields 
    # End of modification and addition by Om Shrivastava on 29-11-2024
    # Reason : Add customization, size, quanity fields 
    # End of code addition by Unnati on 26-07-2024
    # Reason-To add sales rate,image and name field
    # Code added by Unnati on 28-07-2024
    # Reason-Added created_at and updated_at field
    created_at = models.DateTimeField(default=datetime.datetime.now())
    updated_at = models.DateTimeField(auto_now=True)
    # End of code addition by Unnati on 28-07-2024
    # Reason-Added created_at and updated_at field
    # Code added by Unnati on 11-09-2024
    # Reason-Added patches and embroider for each sizes

    # Modified by jhamman on 17-10-2024
    # Reason - added default value false
    # xs_patches = models.BooleanField(null=True, blank=True)
    # s_patches = models.BooleanField(null=True, blank=True)
    # m_patches = models.BooleanField(null=True, blank=True)
    # l_patches = models.BooleanField(null=True, blank=True)
    # xl_patches = models.BooleanField(null=True, blank=True)
    # xxl_patches = models.BooleanField(null=True, blank=True)
    # xxxl_patches = models.BooleanField(null=True, blank=True)

    # xs_embroider = models.BooleanField(null=True, blank=True)
    # s_embroider = models.BooleanField(null=True, blank=True)
    # m_embroider = models.BooleanField(null=True, blank=True)
    # l_embroider = models.BooleanField(null=True, blank=True)
    # xl_embroider = models.BooleanField(null=True, blank=True)
    # xxl_embroider = models.BooleanField(null=True, blank=True)
    # xxxl_embroider = models.BooleanField(null=True, blank=True)

    xs_patches = models.BooleanField(default=False)
    s_patches = models.BooleanField(default=False)
    m_patches = models.BooleanField(default=False)
    l_patches = models.BooleanField(default=False)
    xl_patches = models.BooleanField(default=False)
    xxl_patches = models.BooleanField(default=False)
    xxxl_patches = models.BooleanField(default=False)

    xs_embroider = models.BooleanField(default=False)
    s_embroider = models.BooleanField(default=False)
    m_embroider = models.BooleanField(default=False)
    l_embroider = models.BooleanField(default=False)
    xl_embroider = models.BooleanField(default=False)
    xxl_embroider = models.BooleanField(default=False)
    xxxl_embroider = models.BooleanField(default=False)
    # End of modification by jhamman on 17-10-2024
    # Reason - added default value false

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Cart"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Cart {self.pk}"
    # End of code addition by Unnati on 11-09-2024
    # Reason-Added patches and embroider for each sizes


# End of code addition by - Unnati Bajaj on 04-07-2024
# Reason - To store add to cart details
# Code added by - Unnati Bajaj on 15-07-2024
# Reason - To store Return and exchange description


class ReturnsAndExchanges(models.Model):
    description = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Return and Exchange"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Return and exchanges"
# End of code addition by - Unnati Bajaj on 15-07-2024
# Reason - To store Return and exchange description
# Code added by - Unnati Bajaj on 17-07-2024
# Reason - To store About us description


class AboutUs(models.Model):
    description = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "About Us"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"About Us"
# End of code addition by - Unnati Bajaj on 17-07-2024
# Reason - To store About us description


# Code added by Unnati on 24-07-2024
# Reason-To store discount details


class Discount(models.Model):
    discount_code = models.CharField(
        null=True, blank=True, max_length=30, unique=False)
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    is_active = models.BooleanField(default=False)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Discount"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return self.discount_code
# End of code addiition by Unnati on 24-07-2024
# Reason-To store discount details


# Code added by Unnati on 24-07-2024
# Reason-To store order summary details

# Code modified by Unnati on 10-08-2024
# Reason-Changed Order summary to order
class Order(models.Model):
    # Code added by Unnati on 24-08-2024
    # Reason-Added order status and payment status choices
    ORDER_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        # Code modified by Unnati on 06-11-2024
        # Reason-Modified process to In Process
        ('Process', 'Process'),
        # End of code modication by Unnati on 06-11-2024
        # Reason-Modified process to In Process
        # Code commented by Unnati on 06-11-2024
        # Reason-These status is not in use
        # ('Shipped', 'Shipped'),
        # ('Delivered', 'Delivered'),
        # End of code commented by Unnati on 06-11-2024
        # Reason-These status is not in use
        # Added by - Ashlekh on 19-10-2024
        # Reason - To have options for failed and cancelled
        ('Failed', 'Failed'),
        # End of code - Ashlekh on 19-10-2024
        # Reason - To have options for failed and cancelled
        # Code added by Unnati on 06-11-2024
        # Reason-Added other order status
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
        ('Refunded', 'Refunded'),
        # End of code addition by Unnati on 06-11-2024
        # Reason-Added other order status
    ]
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    # End of code addition by Unnati on 24-08-2024
    # Reason-Added order status and payment status choices
    # End of code modification by Unnati on 10-08-2024
    # Reason-Changed Order summary to order
    order_id = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subtotal = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    # Code added by Unnati on 01-08-2024
    # Reason-Adding is_discountApplied
    is_discount_applied = models.BooleanField(default=False)
    # End of code addition by Unnati on 01-08-2024
    # Reason-Adding is_discountApplied
    # Code added by Unnati on 18-09-2024
    # Reason-Added null=true and blank=true
    discount_code = models.ForeignKey(
        'Discount', null=True, on_delete=models.CASCADE, blank=True)
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    # End by Unnati on 18-09-2024
    # Reason-Added null=true and blank=true
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    shipping_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    taxable_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    tax_percentage = models.CharField(
        #Code modified by Unnati on 25-11-2024 
        #Reason-Modified max_length
        # max_length=3,
        max_length=5,
        #End of code modification by Unnati on 25-11-2024 
        #Reason-Modified max_length
        null=True, blank=True)
    tax_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    grand_total = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False)
    # payment_details = models.ForeignKey(
    #     PaymentDetails, on_delete=models.CASCADE,default="1")
    # Code added by Unnati on 24-08-2024
    # Reason-Added order status and payment status choices
    order_status = models.CharField(
        max_length=100, choices=ORDER_STATUS_CHOICES, default='Process')
    payment_status = models.CharField(
        max_length=100, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    # End of code addition by Unnati on 24-08-2024
    # Reason-Added order status and payment status choices
    shipping_status = models.CharField(max_length=100, null=True, blank=True)
    # Code modified by Unnati on 24-08-2024
    # Reason-Changedate time field to date field
    # This field is deprecated use order_date instead
    date = models.DateField(default=datetime.date.today)
    # End of code modification by Unnati on 24-08-2024
    # Reason-Changedate time field to date field
    # Code added by Unnati on 07-11-2024
    # Reason-Added order_date field
    order_date = models.DateTimeField(null=True, blank=True)
    # End of code addition by Unnati on 07-11-2024
    # Reason-Added order_date field
    # Code added by Unnati on 18-09-2024
    # Reason-To return order_id
    # Added by - Ashlekh on 16-10-2024
    # Reason - To save paypal_order_id and paypal_access_token
    paypal_order_id = models.TextField(null=True, blank=True)
    paypal_access_token = models.TextField(null=True, blank=True)
    # End of code - Ashlekh on 16-10-2024
    # Reason - To save paypal_order_id and paypal_access_token
    # Added by - Ashlekh on 25-10-2024
    # Reason - To add tracking id & tracking link
    tracking_id = models.TextField(null=True, blank=True)
    tracking_link = models.TextField(null=True, blank=True)
    # End of code - Ashlekh on 25-10-2024
    # Reason - To add tracking id & tracking link

    # Added by - Ashish Dewangan on 27-11-2024
    # Reason - Added field to store session id of stripe checkout
    stripe_session_id = models.TextField(null=True, blank=True)
    # End of addition by - Ashish Dewangan on 27-11-2024
    # Reason - Added field to store session id of stripe checkout

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Order"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return self.order_id
    # End of code addition on 18-09-2024
    # Reason-To return order_id
# End of code addition by Unnati on 24-07-2024
# Reason-To store order summary details

# Code added by Unnati on 24-07-2024
# Reason-To store order items


class OrderItem(models.Model):
    # Code added by Unnati on 30-09-2024
    # Reason-To add item status choices
    ITEM_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        # Code commented by Unnati on 06-11-2024
        # Reason-These status is not in use
        # ('In Process', 'In Process'),
        # ('Shipped', 'Shipped'),
        # ('Delivered', 'Delivered'),
        # End of code comment by Unnati on 06-11-2024
        # Reason-These status is not in use
        # Code added by Unnati on 06-11-2024
        # Reason-Added more item status
        ('Delivered', 'Delivered'),
        ('Shipped', 'Shipped'),
        ('Cancelled', 'Cancelled'),
        ('Return Initiated', 'Return Initiated'),
        # Added by - Ashish Dewangan on 24-11-2024
        # Reason - added more status
        ('Return Approved', 'Return Approved'),
        ('Return Rejected', 'Return Rejected'),
        ('Parcel Pickup Initiated for Return', 'Parcel Pickup Initiated for Return'),
        ('Parcel Picked Up for Return', 'Parcel Picked Up for Return'),
        # End of addition by - Ashish Dewangan on 24-11-2024
        # Reason - added more status
        ('Returned', 'Returned'),
        ('Exchange Initiated', 'Exchange Initiated'),
        # Added by - Ashish Dewangan on 24-11-2024
        # Reason - added more status
        ('Exchange Approved', 'Exchange Approved'),
        ('Exchange Rejected', 'Exchange Rejected'),
        ('Parcel Pickup Initiated for Exchange', 'Parcel Pickup Initiated for Exchange'),
        ('Parcel Picked Up for Exchange', 'Parcel Picked Up for Exchange'),
        # End of addition by - Ashish Dewangan on 24-11-2024
        # Reason - added more status
        ('Exchanged', 'Exchanged'),
        ('Refund Initiated', 'Refund Initiated'),
        ('Refunded', 'Refunded'),
        # End of code addition by Unnati on 06-11-2024
        # Reason-Added more item status
        # Added by - Ashlekh on 12-12-2024
        # Reason - To add more status
        # Code changed by - Ashlekh on 18-12-2024
        # Reason - To keep the first letter of second word in capital
        # ('Order placed', 'Order placed'),
        # ('Order confirmed', 'Order confirmed'),
        # ('Order processing', 'Order Processing'),
        # ('Dispatched', 'Dispatched'),
        # ('In transit', 'In transit'),
        # ('Out for delivery', 'Out for delivery'),
        # ('Attempted delivery', 'Attempted delivery'),
        ('Order Placed', 'Order Placed'),
        ('Order Confirmed', 'Order Confirmed'),
        ('Order Processing', 'Order Processing'),
        ('Dispatched', 'Dispatched'),
        ('In Transit', 'In Transit'),
        ('Out For Delivery', 'Out For Delivery'),
        ('Attempted Delivery', 'Attempted Delivery'),
        # End of code - Ashlekh on 18-12-2024
        # Reason - To keep the first letter of second word in capital
        # End of code - Ashlekh on 12-12-2024
        # Reason - To add more status
    ]
    # Code added by Unnati on 11-11-2024
    # Reason-Added cancel choices
    CANCEL_CHOICES = [
        ('None','None'),
        ('Admin','Admin'),
        ('User','User')
    ]
    # End of code addition by Unnati on 11-11-2024
    # Reason-Added cancel choices
    #Code added by Unnati on 22-12-2024
    #Reason-Added payemnt status choices
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    #End of code addition by Unnati on 22-12-2024
    #Reason-Added payemnt status choices
    # Added by - Ashish Dewangan on 23-11-2024
    # Reason - added return by choices
    RETURN_BY_CHOICES = [
        ('None','None'),
        ('Admin','Admin'),
        ('User','User')
    ]
    # End of addition by - Ashish Dewangan on 23-11-2024
    # Reason - added return by choices
    #Code added by Unnati on 22-12-2024
    #Reason-Added type choices
    TYPE=[('Sold','Sold'),
          ('Exchanged','Exchanged'),
          ('Returned','Returned'),
          #Code added by unnati on 26-12-2024
          #Reason-Added cancelled type
          ('Cancelled','Cancelled'),
          #End of code addition by unnati on 26-12-2024
          #Reason-Added cancelled type
          ]
    #End of code addition by Unnati on 22-12-2024
    #Reason-Added type choices
    # End of code addition by Unnati on 30-09-2024
    # Reason-To add item status choices
    # Code modified by Unnati on 10-08-2024
    # Reason-Changed Order summary to order
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    # End of code modification by Unnati on 10-08-2024
    # Reason-Changed Order summary to order
    product = models.ForeignKey(
        'Product', related_name='order_items', on_delete=models.CASCADE)
    size = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.BigIntegerField(null=True, blank=True)
    color = models.CharField(max_length=25, null=True, blank=True)
    # Code added by Unnati on 18-09-2024
    # Reason-Remove customization field as it is not in use currently
    # customization = models.CharField(max_length=100, null=True, blank=True)
    # End od code addition by Unnati on 18-09-2024
    # Reason-Remove customization field as it is not in use currently
    # Added by - Ashlekh on 25-01-2025
    # Reason - To change field name
    # sales_rate = models.DecimalField(
    #     max_digits=10, decimal_places=2, blank=True, null=True,)
    sales_rate = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Sales rate ($)")
    # End of code - Ashlekh on 25-01-2025
    # Reason - To change field name
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    # Code modified by Unnati on 30-09-2024
    # Reason-To add item status choices
    # Code changed by - Ashlekh on 12-12-2024
    # Reason - To change default in item_status
    # item_status = models.CharField(
    #     max_length=100, choices=ITEM_STATUS_CHOICES, default='In Process')
    item_status = models.CharField(
        max_length=100, choices=ITEM_STATUS_CHOICES, default='Order placed')
    # End of code - Ashlekh on 12-12-2024
    # Reason - To change default in item_status
    # End of code modification by Unnati on 30-09-2024
    # Reason-To add item status choices
    # Code added by Unnati on 12-09-2024
    # Reason-To have patches and embroidery for order item
    has_patch = models.BooleanField(default=False)
    has_embroidery = models.BooleanField(default=False)
    # End of code addition by Unnati on 12-09-2024
    # Reason-To have patches and embroidery for order item
    # Code added by Unnati on 06-11-2024
    # Reason-Added cancelled_at,restocking fee
    cancelled_at = models.DateTimeField(null=True, blank=True)
    restocking_fee = models.DecimalField(
        decimal_places=2, max_digits=100, null=True, blank=True)
    ordered_at = models.DateTimeField(null=True, blank=True)
    # End of code addition by Unnati on 06-11-2024
    # Reason-Added cancelled_at,restocking fee
    # Code added by Unnati on 10-11-2024
    # Reason- Added cancel_reason 
    cancel_reason=models.CharField(null=True,blank=True)
    # End of code addition by Unnati on 10-11-2024
    # Reason- Added cancel_reason
    # Code added by Unnati on 11-11-2024
    # Reason-Added cancelled by
    cancelled_by = models.CharField(
        max_length=100, choices=CANCEL_CHOICES, default='None')
    # End of code addition by Unnati on 11-11-2024
    # Reaso-Added cancelled by
    # Code added by Unnati on 18-11-2024
    # Reason-Added credit note number
    credit_note_number =models.CharField(null=True,blank=True,max_length=100)
    # End of code addition by Unnati on 18-11-2024
    # Reason-Added credit note number
    # Addition by Om Shrivastava on 25-11-2024 
    # Reason : Add customization field 
    show_patches_and_embroider_on_UI = models.BooleanField(default=False,verbose_name="Customization price",null=True,blank=True)
    # Modification and addition by Om Shrivastava on 28-11-2024
    # Reason : Change the name of customization fields and also checkboxes of customization
    logo = models.BooleanField(default=False)
    patches = models.BooleanField(default=False,verbose_name="Patches / Batches")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches = models.BooleanField(default=False,verbose_name="Security id")
    security_batches = models.BooleanField(default=False,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back = models.BooleanField(default=False)
    printed_id = models.BooleanField(default=False)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    # Code changed by - Ashlekh on 18-12-2024
    # Reason - To change field name
    # embroider = models.BooleanField(default=False,verbose_name="Embroider / Name")
    embroider = models.BooleanField(default=False,verbose_name="Embroider")
    # End of code - Ashlekh on 18-12-2024
    # Reason - To change field name
    logo_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    patches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Patches / Batches Price")
    # Code changed by - Ashlekh on 18-02-2025
    # Reason - To change field name
    # security_batches_price = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security id Price")
    security_batches_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Security ID on Back and Chest")
    # End of code - Ashlekh on 18-02-2025
    # Reason - To change field name
    # Added by - Ashlekh on 18-02-2025
    # Reason - To add customization field
    security_id_on_back_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    printed_id_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    # End of code - Ashlekh on 18-02-2025
    # Reason - To add customization field
    # Code changed by - Ashlekh on 18-12-2024
    # Reason - To change field name
    # embroider_price = models.DecimalField(
    #     decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Embroider / Name Price") 
    embroider_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True,verbose_name="Embroider Price") 
    # End of code - Ashlekh on 18-12-2024
    # Reason - To change field name
    after_customization_product_price = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, blank=True)
    customization_comment = models.TextField(null=True,blank=True)
    # End of modification and addition by Om Shrivastava on 28-11-2024
    # Reason : Change the name of customization fields
    # End of addition by Om Shrivastava on 25-11-2024 
    # Reason : Add customization field 

    # Added by - Ashish Dewangan on 23-11-2024
    # Reason - Added new fields to store relevant dates
    shipping_date = models.DateTimeField(null=True, blank=True)
    delivery_date = models.DateTimeField(null=True, blank=True)

    return_initiated_date = models.DateTimeField(null=True, blank=True)
    return_pickup_date = models.DateTimeField(null=True, blank=True)
    return_date = models.DateTimeField(null=True, blank=True)

    refund_date = models.DateTimeField(null=True, blank=True)
    
    exchange_initiated_date = models.DateTimeField(null=True, blank=True)
    exchange_pickup_date = models.DateTimeField(null=True, blank=True)
    exchange_shipping_date = models.DateTimeField(null=True, blank=True)
    exchange_delivery_date = models.DateTimeField(null=True, blank=True)
    # End of addition by - Ashish Dewangan on 23-11-2024
    # Reason - Added new fields to store relevant dates

    # Added by - Ashish Dewangan on 23-11-2024
    # Reason - Added a field to store who initiated return
    returned_by = models.CharField(
        max_length=100, choices=RETURN_BY_CHOICES, default='None')
    # End of addition by - Ashish Dewangan on 23-11-2024
    # Reason - Added a field to store who initiated return

    # Added by Ashish Dewangan on 23-11-2024
    # Reason- Added field to store return reason and return rejected reason
    return_reason=models.TextField(null=True,blank=True)
    return_approval_reason=models.TextField(null=True,blank=True)
    return_rejection_reason=models.TextField(null=True,blank=True)
    # End of addition by Ashish Dewangan on 23-11-2024
    # Reason- Added field to store return reason and return rejected reason

    # Added by - Ashish Dewangan on 23-11-2024
    # Reason - Added fields to store returned_item_image1, returned_item_image2,
    # return_autoriation_no, restocking_fee, refund_amount, refund_transaction_id,tracking_id
    returned_item_image1 = models.ImageField(
        upload_to='Images/Return/', default='', blank=True, null=True)
    returned_item_image2 = models.ImageField(
        upload_to='Images/Return/', default='', blank=True, null=True)
    return_authorization_no=models.TextField(null=True,blank=True)
    # Code changed by - Ashlekh on 25-01-2025
    # Reason - To change field name
    # refund_amount = models.DecimalField(
    #     max_digits=10, decimal_places=2, blank=True, null=True)
    refund_amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Refund amount ($)")
    # End of code - Ashlekh on 25-01-2025
    # Reason - To change field name
    refund_transaction_id= models.TextField(null=True,blank=True)
    tracking_id= models.TextField(null=True,blank=True)
    # End of addition by - Ashish Dewangan on 23-11-2024
    # Reason - Added fields to store return_autoriation_no, restocking_fee,
    # refund_amount, refund_transaction_id,tracking_id

    # Added by - Ashish Dewangan on 25-11-2024
    # Reason - added field to enter name of courier service provider
    courier_service_provider_name = models.TextField(null=True,blank=True)
    # End of addition by - Ashish Dewangan on 25-11-2024
    # Reason - added field to enter name of courier service provider
    #Code added by Unnati on 29-11-2024
    #Reason-To have exchange id and parent exchange id
    #Code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    # exchange_id = models.CharField(max_length=255,null=True,blank=True)
    # parent_exchange_id = models.CharField(max_length=255,null=True,blank=True)
    #End of code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    #End of code addition by Unnati on 29-11-2024
    #Reason-To have exchange id and parent exchange id
    #Code added by Unnati on 29-11-2024
    #Reason-To have exchange reason
    #Code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    exchange_reason=models.TextField(null=True,blank=True)
    #End of code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    #End of code addition by Unnati on 29-11-2024
    #Reason-To have exchange reason
    #Code added by Unnati on 04-12-2024
    #Reason-To have invoice number
    #Code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    invoice_number = models.CharField(max_length=100,null=True,blank=True)
    #End of code commented by Unnati on 05-12-2024
    #Reason-Created another model for this
    #End of code addition by Unnati on 04-12-2024
    #Reason-To have invoice number
    #Code added by Unnati on 22-12-2024
    #Reason-Added fields in order item table
    sale_percentage = models.IntegerField(max_length=2, null=True, blank=True)
    # Code changed by - Ashlekh on 25-01-2025
    # Reason - To change field name
    # customization_price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    # subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    customization_price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True, verbose_name="Customization Price ($)")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Subtotal ($)")
    # End of code - Ashlekh on 25-01-2025
    # Reason - To change field name
    ##Code added by Unnati on 15-01-2025
    ##Reason-Change name of tax percentage
    ##Code modified by Unnati on 23-01-2025
    ##Reason-To increase max length
    # tax_percentage = models.CharField(max_length=5,null=True, blank=True,verbose_name="Tax amount")
    # Code changed by - Ashlekh on 25-01-2025
    # Reason - To change field name
    # tax_percentage = models.CharField(max_length=10,null=True, blank=True,verbose_name="Tax amount")
    tax_percentage = models.CharField(max_length=10,null=True, blank=True,verbose_name="Tax amount ($)")
    # End of code - Ashlekh on 25-01-2025
    # Reason - To change field name
    ##End of code modification by Unnati on 23-01-2025
    ##Reason-To increase max length
    ##End of code addition by Unnati on 15-01-2025
    ##Reason-Change name of tax percentage
    # Code changed by - Ashlekh on 25-01-2025
    # Reason - To change field name
    # total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Total amount ($)")
    # End of code - Ashlekh on 25-01-2025
    # Reason - To change field name
    invoice_id = models.CharField(max_length=255,null=True,blank=True)
    type=models.CharField(max_length=255, choices=TYPE,default='Sold')
    to_pay=models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    parent_id=models.CharField(null=True,blank=True)
    paypal_order_id = models.TextField(null=True, blank=True)
    paypal_access_token = models.TextField(null=True, blank=True)
    stripe_session_id = models.TextField(null=True, blank=True)
    payment_status = models.CharField(
        max_length=100, choices=PAYMENT_STATUS_CHOICES, default='Pending'
        ##Code added by Unnati on 10-01-2025
        ##Reason-Added verbose name
        ,verbose_name="Exchange payment status")
        ##End of code addition by Unnati on 10-01-2025
        ##Reason-Added verbose name
    #Code added by Unnati on 27-12-2024
    #Reason-To have exchanged item images
    exchanged_item_image1 = models.ImageField(
        upload_to='Images/Exchange/', default='', blank=True, null=True)
    exchanged_item_image2 = models.ImageField(
        upload_to='Images/Exchange/', default='', blank=True, null=True)
    #End of code addition by Unnati on 27-12-2024
    #Reason-To have exchanged item images
    #End of code addition by Unnati on 22-12-2024
    #Reason-Added fields in order item table
    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Order Items"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    # Code added by Unnati on 26-10-2024
    # Reason-Added order item

    def __str__(self):
        return f"Item"
    # Code added by Unnati on 18-11-2024
    # Reason-Added cancelled_at time when save button is clicked
    def save(self, *args, **kwargs):
        if self.cancelled_by == 'Admin' and not self.cancelled_at:
            from django.utils import timezone
            self.cancelled_at = timezone.now()

        # Added by - Ashish Dewangan on 24-11-2024
        # Reason - To save return date only if item is return by admin and return date is empty    
        if self.returned_by == 'Admin' and not self.return_date:
            from django.utils import timezone
            self.return_date = timezone.now()
        # End of addition by - Ashish Dewangan on 24-11-2024
        # Reason - To save return date only if item is return by admin and return date is empty      
        
        # Added by - Ashish Dewangan on 24-11-2024
        # Reason - If item status is refunded and credit_note number is not there then generate it
        if self.item_status =="Refunded" and not self.credit_note_number:
            self.credit_note_number = generate_credit_note_number()

        if self.item_status =="Refunded" and not self.refund_date:
            self.refund_date = datetime.datetime.now()
        # End of addition by - Ashish Dewangan on 24-11-2024
        # Reason - If item status is refunded and credit_note number is not there then generate it    

        
        # Added by - Ashish Dewangan on 29-11-2024
        # Reason - If item status falls in return category and returned by is not selected then set returned by value as admin
        if (self.item_status =="Return Initiated"  or self.item_status =="Return Approved"  or  self.item_status =="Return Rejected" or         self.item_status =="Parcel Pickup Initiated for Return" or         self.item_status =="Parcel Picked Up for Return" or       self.item_status =="Returned" )   and self.returned_by =="None":
            self.returned_by = "Admin"
        # End of addition by - Ashish Dewangan on 29-11-2024
        # Reason - If item status falls in return category and returned by is not selected then set returned by value as admin  
        # Added by Unnati on 22-01-2025
        # Reason-To calculate refund amount  
        if hasattr(self, 'restocking_fee') and self.restocking_fee is not None:
            self.refund_amount = self.total_amount - self.restocking_fee
        # End of code addition by Unnati on 22-01-2025
        # Reason-To calculate refund amount 
        super(OrderItem, self).save(*args, **kwargs)
    # End of code addition by Unnati on 18-11-2024
    # Reason-Added cancelled_at time when save button is clicked    
    # End of code addition by Unnati on 26-10-2024
    # Reason-Added order item
# End of code addition by Unnati on 24-07-2024
# Reason-To store order items
# Code added by - Unnati Bajaj on 21-07-2024
# Reason - To store shipping details


class UserAddressDetails(models.Model):
    # Code commented by Unnati on 24-07-2024
    # Reason-Email is not in use currently
    # email = models.CharField(default='', null=True, blank=True, max_length=30)
    # End of code comment by Unnati on 24-07-2024
    # Reason-Email is not in use currently
    # Code modified by Unnati on 10-08-2024
    # Reason-Changed Order summary to order
    # order = models.ForeignKey(
    #   Order, on_delete=models.CASCADE, default='', null=True, blank=True)
    # order = models.ForeignKey(
    #     Order, on_delete=models.CASCADE, null=True, blank=True)
    # End of code modification by Unnati on 10-08-2024
    # Reason-Changed Order summary to order
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    # Code added by Unnati on 04-09-2024
    # Reason-Remove charfield and added textfield
    first_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    last_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    # End of code addition by Unnati on 04-09-2024
    # Reason-Remove charfield and added textfield
    company = models.CharField(
        default='', null=True, blank=True, max_length=100, unique=False)
    address = models.TextField(
        default='', null=True, blank=True)
    city = models.CharField(default='', null=True, blank=True, max_length=100)
    country = models.CharField(
        default='', null=True, blank=True, max_length=100)
    state = models.CharField(default='', null=True, blank=True, max_length=100)
    zipcode = models.CharField(
        max_length=8, null=True, blank=True)
    # Modified by jhamman o 24-10-2024
    # Reason - max_lengh changed
    # contact_number = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=25, null=True, blank=True)
    # End of modification by jhamman o 24-10-2024
    # Reason - max_lengh changed
    is_primary = models.BooleanField(default=False)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "User Address Details"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return self.address
# End of code addition by - Unnati Bajaj on 21-07-2024
# Reason - To store shipping details
# Code added by Unnati on 24-07-2024
# Reason-To store payment details


class PaymentDetails(models.Model):
    # Code modified by Unnati on 10-08-2024
    # Reason-Added order as a foreign key
    # order = models.ForeignKey(
    #   Order, on_delete=models.CASCADE, default='', null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    # End of code modification by Unnati on 10-08-2024
    # Reason-Added order as a foreign key
    PAYMENT_CHOICES = (
        ('credit card', 'Credit card'),
        ('cod', 'Cash on delivery'),
    )
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    credit_card_number = models.CharField(
        null=True, blank=True, max_length=16, unique=True)
    expiration_date = models.DateField(null=True, blank=True)
    card_verification_number = models.CharField(
        null=True, blank=True, max_length=4, unique=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Payment Details"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Payment Details {self.pk}"
# End of code addition by Unnati on 24-07-2024
# Reason-To store payment details
# Code added by Unnati on 24-07-2024
# Reason-To store shipping address


class ShippingAddress(models.Model):
    # Code modified by Unnati on 10-08-2024
    # Reason-Changed order summary to order
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    # End of code modification by Unnati on 10-08-2024
    # Reason-Changed order summary to order
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    last_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    company = models.CharField(
        default='', null=True, blank=True, max_length=100, unique=False)
    address = models.TextField(
        default='', null=True, blank=True)
    city = models.CharField(default='', null=True, blank=True, max_length=100)
    country = models.CharField(
        default='', null=True, blank=True, max_length=100)
    state = models.CharField(default='', null=True, blank=True, max_length=100)
    zipcode = models.CharField(
        max_length=8, null=True, blank=True)

    # Modification by jhamman on 20-10-2024
    # Reason - changed max length
    # contact_number = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=25, null=True, blank=True)
    # End of modification by jhamman on 20-10-2024
    # Reason - changed max length

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    class Meta:
        verbose_name_plural = "Shipping Address"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    def __str__(self):
        #Code addition by Unnati 24-11-2024
        #Reason-Remove pk and adding "shipping address" text
        # return f"Shipping Address {self.pk}"
        return f"Shipping Address"
        #End of code addition by Unnati 24-11-2024
        #Reason-Remove pk and adding "shipping address" text
   
# End of code addition by Unnati on 24-07-2024
# Reason-To store shipping address

# Code added by Unnati on 24-07-2024
# Reason-To store billing address


class BillingAddress(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    # Code added by Unnati on 14-09-2024
    # Reason-Added fields for billing address
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    last_name = models.TextField(
        default='', null=True, blank=True, unique=False)
    company = models.CharField(
        default='', null=True, blank=True, max_length=100, unique=False)
    address = models.TextField(
        default='', null=True, blank=True)
    city = models.CharField(default='', null=True, blank=True, max_length=100)
    country = models.CharField(
        default='', null=True, blank=True, max_length=100)
    state = models.CharField(default='', null=True, blank=True, max_length=100)
    zipcode = models.CharField(
        max_length=8, null=True, blank=True)
    # Modification by jhamman on 20-10-2024
    # Reason - changed max length
    # contact_number = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=25, null=True, blank=True)
    # End of modification by jhamman on 20-10-2024
    # Reason - changed max length

    # Added by jhamman on 18-10-2024
    # Reason - added field date
    order_date = models.DateField(default=datetime.date.today)
    # End of addition by jhamman on 18-10-2024
    # Reason - added field date

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Billing Address"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        #Code addition by Unnati 24-11-2024
        #Reason-Remove pk and adding text "Billing address"
        # return f"Billing Address {self.pk}"
        return f"Billing Address"
        #End of code addition by Unnati 24-11-2024
        #Reason-Remove pk and adding text "Billing address"
    # End of code addition by Unnati on 14-09-2024
    # Reason-Added fields for billing address
# End of code addition by Unnati on 24-07-2024
# Reason-To store shipping address

# Code added by Unnati on 04-08-2024
# Reason-To store company information


class CompanyInfo(models.Model):
    id = models.AutoField(primary_key=True)
    # Code modified by Unnati on 10-08-2024
    # Reason-Changed order summary to order
    # order = models.ForeignKey(
    #   Order, on_delete=models.CASCADE, default='', null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    # End of code modification by Unnati on 10-08-2024
    # Reason-Changed order summary to order
    name = models.CharField(default='', null=True, blank=True, max_length=30)
    address = models.CharField(
        default='', null=True, blank=True, max_length=100)
    pincode = models.CharField(
        max_length=8, null=True, blank=True)
    # Modified by jhamman on 19-10-2024
    # Reason - changed max length
    # contact_number = models.CharField(max_length=10, null=True, blank=True)
    contact_number = models.CharField(max_length=25, null=True, blank=True)
    # End of modification by jhamman on 19-10-2024
    # Reason - changed max length
    email = models.CharField(default='', null=True, blank=True, max_length=30)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Company Info"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Company Info {self.pk}"
# End of code addition by Unnati on 04-08-2024
# Reason-To store company information

# Code added by - Unnati Bajaj on 11-08-2024
# Reason - To store shipping description


class Shipping(models.Model):
    description = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Shipping"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Shipping"

# End of code addition by - Unnati Bajaj on 11-08-2024
# Reason - To store shipping description

# Code added by - Unnati Bajaj on 16-08-2024
# Reason - To store big and tall form details


class BigAndTallInquiry(models.Model):
    item_name = models.CharField(
        default='', null=True, blank=True, max_length=100, unique=False)
    size_and_dimension = models.CharField(
        max_length=150, null=True, blank=True)
    first_name = models.CharField(
        default='', null=True, blank=True, max_length=30, unique=False)
    last_name = models.CharField(
        default='', null=True, blank=True, max_length=30, unique=False)
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    contact_number = models.CharField(max_length=150, null=True, blank=True)
    # Code modified by Unnati on 30-08-2024
    # Reason-Changed charfield to textfield
    additional_information = models.TextField(
        default='', null=True, blank=True, max_length=250)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Billing and Tall Inquiry"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Big and tall inquiry {self.pk}"
    # End of code modification by Unnati on 30-08-2024
    # Reason-Changed charfield to textfield
# End of code addition by - Unnati Bajaj on 16-08-2024
# Reason - To store big and tall form details
# Code added by - Unnati Bajaj on 22-08-2024
# Reason - To store request catalog details


class RequestCatalog(models.Model):
    first_name = models.CharField(
        default='', null=True, blank=True, max_length=30, unique=False)
    last_name = models.CharField(
        default='', null=True, blank=True, max_length=30, unique=False)
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    contact_number = models.CharField(max_length=150, null=True, blank=True)
    company = models.CharField(
        default='', null=True, blank=True, max_length=100, unique=False)
    address_line1 = models.CharField(
        default='', null=True, blank=True, max_length=100)
    address_line2 = models.CharField(
        default='', null=True, blank=True, max_length=100)
    city = models.CharField(default='', null=True, blank=True, max_length=100)
    state = models.CharField(default='', null=True, blank=True, max_length=100)
    zipcode = models.CharField(
        max_length=8, null=True, blank=True)
    comments = models.CharField(
        default='', null=True, blank=True, max_length=250)
    # Added by - Ashlekh on 22-01-2025
    # Reason - To add created_at date
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    # End of code - Ashlekh on 22-01-2025
    # Reason - To add created_at date

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Request Catalog"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Request Catalog {self.pk}"
# End of code addition by - Unnati Bajaj on 22-08-2024
# Reason - To store request catalog details
# Code added by - Unnati Bajaj on 22-08-2024
# Reason - To store blog details


class Blog(models.Model):
    title = models.CharField(
        default='', null=True, blank=True, max_length=100)
    date = models.DateField(null=True, blank=True)
    description = RichTextField(null=True, blank=True)

    # Added by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel
    class Meta:
        verbose_name_plural = "Blog"
    # End of addition by - jhamman Lal Sahu on 18-10-2024
    # Reason - To remove "s" from modals name in admin panel

    def __str__(self):
        return f"Blog {self.pk}"
# End of code addition by - Unnati Bajaj on 22-08-2024
# Reason - To store blog details


# Added by - Unnati Bajaj on 23-10-2024
# Reason - To store LeaveFeedback
class LeaveFeedback(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default='', null=True, blank=True)
    email = models.CharField(default='', null=True, blank=True, max_length=30)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    message = models.CharField(
        default='', null=True, blank=True, max_length=250)
    # Added by - Ashlekh on 22-01-2025
    # Reason - To add created_at date
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    # End of code - Ashlekh on 22-01-2025
    # Reason - To add created_at date

    def __str__(self):
        # Code changed by - Ashlekh on 10-12-2024
        # Reason - To remove object id
        # return f"Leave Feedback {self.pk}"
        return f"Leave Feedback"
        # End of code - Ashlekh on 10-12-2024
        # Reason - To remove object id

    class Meta:
        verbose_name_plural = "Leave Feedback"
 # End of code addition by - Unnati Bajaj on 23-10-2024
 # Reason - To store LeaveFeedback


 # Added by - Ashlekh on 30-10-2024
 # Reason - To have Wishlist table
class WishList(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        # Code changed by - Ashlekh on 29-11-2024
        # Reason - To save details with WishList name
        # return f"WishList {self.pk}"
        return f"WishList"
        # End of code - Ashlekh on 29-11-2024
        # Reason - To save details with WishList name
 # End of code - Ashlekh on 30-10-2024
 # Reason - To have Wishlist table
#Code commented by Unnati on 26-12-2024
#Reason-To delete return exchange table
# class ReturnExchangeRequest(models.Model):
#         REQUEST_TYPE= (
#         ('Exchange', 'Exchange'),
#         ('Return', 'Return'),
#         )
#         ITEM_STATUS_CHOICES =(
#         ('Pending', 'Pending'),
#         ('Return Initiated', 'Return Initiated'),
#         ('Return Approved', 'Return Approved'),
#         ('Return Rejected', 'Return Rejected'),
#         ('Parcel Pickup Initiated for Return', 'Parcel Pickup Initiated for Return'),
#         ('Parcel Picked Up for Return', 'Parcel Picked Up for Return'),
#         ('Returned', 'Returned'),
#         ('Exchange Initiated', 'Exchange Initiated'),
#         ('Exchange Approved', 'Exchange Approved'),
#         ('Exchange Rejected', 'Exchange Rejected'),
#         ('Parcel Pickup Initiated for Exchange', 'Parcel Pickup Initiated for Exchange'),
#         ('Parcel Picked Up for Exchange', 'Parcel Picked Up for Exchange'),
#         ('Exchanged', 'Exchanged'),
#         ('Refund Initiated', 'Refund Initiated'),
#         ('Refunded', 'Refunded'),
#         )
#         order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
#         item_id =models.ForeignKey(OrderItem, on_delete=models.CASCADE)
#         quantity = models.IntegerField(max_length=50, null=True,blank=True)
#         exchange_id = models.CharField(max_length=255,null=True,blank=True)
#         linked_exchange_id = models.CharField(max_length=255,null=True,blank=True)
#         invoice_number = models.CharField(max_length=255,null=True,blank=True)
#         request_type = models.CharField(max_length=255, choices=REQUEST_TYPE)
#         item_status = models.CharField(max_length=255, choices=ITEM_STATUS_CHOICES, default='Pending')
#End of code commented by Unnati on 26-12-2024
#Reason-To delete return exchange table

# Added by - Ashlekh on 01-01-2025
# Reason - To store Feedback request
class FeedBackRequest(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.DecimalField(null=True, blank=True, max_digits=3, decimal_places=2)
    content = models.TextField(null=True, blank=True)
    name = models.CharField(null=True, blank=True, max_length=250)
    email = models.EmailField(null=True, blank=True)
    # Added by - Ashlekh on 13-02-2025
    # Reason - To add date field
    created_at =  models.DateField(auto_now_add=True)
    # End of code - Ashlekh on 13-02-2025
    # Reason - To add date field

    def __str__(self):
        return f"Feedback"
# End of code - Ashlekh on 01-01-2025
# Reason - To store Feedback request