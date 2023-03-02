from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.text import Truncator

# Register your models here.


# Added by Ashish Dewangan on 26-11-2022
# Reason - To show header of admin panel as RbyR
admin.site.site_header="RbyR Dashboard"
# End of code addition


# Added by Ashish Dewangan on  27-11-2022
# Reason - To truncate long text of fields
def short_title(obj):
    return Truncator(obj.title).chars(30)
# End of code addition  

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(Head_img)
@admin.register(Head_img)
class Head_imgAdmin(admin.ModelAdmin):
    list_display=("id","src","category","display_on")
    # ordering=("display_on")
    readonly_fields=("category",)
    list_per_page=10
    def get_form(self, request, obj=None, **kwargs):
        form = super(Head_imgAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        form.base_fields['Menu'].widget.attrs['style'] = 'width: 280px;'
        # form.base_fields['about'].widget.attrs['style'] = 'width: 50%;'
        # form.base_fields['category'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['display_on'].widget.attrs['style'] = 'width: 50%'

        return form
# End of code modification


class ProductAdmin(admin.ModelAdmin):
   list_display = ['category','title','S','M','L','XL','XXL','date']

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(product_detail,ProductAdmin)
 
@admin.register(product_detail)
class product_detailAdmin(admin.ModelAdmin):
    list_display=(short_title,"menu","category","XS","S","M","L","XL","XXL","XXXL","price","color")
    ordering =("title",)
    
    readonly_fields=('search_key','category','menu')
    search_fields=("title","category","color")
    list_filter=("category","color")
    list_per_page=10
    #Added by Ashish dewangan on 23-11-2022
    #Reason - to have shipping days and ready to wear functionality for product
    #Jira issue no - RBYR -194
    shipping_days=models.CharField(max_length=50,default="3-4 weaks")
    ready_to_ship=models.BooleanField(default=False)
    ready_to_ship_days=models.CharField(max_length=50,default="under 7 working days")
    def get_form(self, request, obj, **kwargs):
        print(request)
        form = super(product_detailAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['category'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['color'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['XS'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['S'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['M'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['L'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['XL'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['XXL'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['price'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['XXXL'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['about'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['img_main'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['img_sub1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['img_sub2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['img_sub3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['like'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['description'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['fabric'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['style_code'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['made_in'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['date'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['shipping_charges'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['shipping_days'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['ready_to_ship_days'].widget.attrs['style'] = 'width: 100%;'
        # added by rohan- on 18/2/23,reason- to show parent linked menu name on submenu dropdown
        form.base_fields['subMenu'].label_from_instance = lambda inst: "{}:{}".format(inst.Menu.menu,inst.sub)
        form.base_fields['upper_menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        # form.base_fields['subMenu'].queryset = subMenu.objects.filter(='company')
        # form.fields['subMenu'].choices = [(None, 'Subscriber\'s Location')] + list(subMenu.objects.all().values_list('menu').order_by('menu'))


        return form    
       
   
# End of code modification


# Commented by Ashish Dewangan on 27-11-2022
# Reason - To hide unused table from admin panel
# admin.site.register(image)
# End of comment


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(Liked)
def title_of_liked_product(obj):
    return Truncator(obj.item.title).chars(30) 
@admin.register(Liked)
class LikedAdmin(admin.ModelAdmin):
    list_display=(title_of_liked_product,"user_no")
    readonly_fields=("item","user_no")
    ordering=("item__title",)
    search_fields=("item__title","user_no__name","user_no__email")
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False   
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(Cart)
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display=("product_no","user_no","quantity","size")
    list_per_page=10
    list_filter=("user_no",)
    sortable_by=("user_no","product_no")
    ordering=("product_no",)
    search_fields=("user_no__name","user_no__email","product_no__title")
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False       
# End of code modification


# Commented by Ashish Dewangan on 27-11-2022
# Reason - To not show garbage tables
# admin.site.register(Cart_buy)
# End of comment


#Added by Rohan 7/12/22 
# reason to save currency
@admin.register(CurrencySelected)
class CurrencySelectedAdmin(admin.ModelAdmin):
    list_display=("user","currency","currency_value","currency_sign")
#end of code

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(HomeCard_img)

# Commented by Rohan- on 31/12/22
# Reson - Because not needed any more becuase we make header to dynamic and this model is creating issue.

# @admin.register(HomeCard_img)
# class HomeCard_imgAdmin(admin.ModelAdmin):
#     list_display=("category_top1","img_top1","category_top1_1","img_top1_1"
#     ,"category_top2","img_top2","category_top2_1","img_top2_1"
#     ,"category_top3","img_top3","category_top4","img_top4","video_url",)

# End of commentation

# End of code modification


# Added By Rohan - 31/12/22
# Reason - To shwing on Admin
@admin.register(HomeGifImages)
class HomeGIF_imgAdmin(admin.ModelAdmin):
    list_display=("category","Gif_image")
    readonly_fields=("category","menu")
    
    def get_form(self, request, obj, **kwargs):
        form = super(HomeGIF_imgAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        form.base_fields['sub'].label_from_instance = lambda inst: "{} : {}".format(inst.Menu.menu,inst.sub)
        return form    
    
@admin.register(HomeNormalImages)
class HomeNormal_imgAdmin(admin.ModelAdmin):
    list_display=("category","image")  
    readonly_fields=("category","menu")
    def get_form(self, request, obj, **kwargs):
        form = super(HomeNormal_imgAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        form.base_fields['sub'].label_from_instance = lambda inst: "{} : {}".format(inst.Menu.menu,inst.sub)
        return form    
    
admin.site.register(Home_video)      
#End of code


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(userbillingDetail)
@admin.register(userbillingDetail)
class userbillingDetailAdmin(admin.ModelAdmin):
    list_display=("user_id","firstname","lastname","street","houseno","city","state","zipcode","country","number")
    ordering=("user_id",)
    list_filter=("city","state","country")
    search_fields=("firstname","lastname","city","state","country")
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False   
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(usershippingDetail)
@admin.register(usershippingDetail)
class usershippingDetailAdmin(admin.ModelAdmin):
    list_display=("user_id","firstname","lastname","street","houseno","city"
    ,"state","zipcode","country","number","isSelected")
    ordering=("user_id",)
    list_filter=("city","state","country")
    search_fields=("firstname","lastname","city","state","country")
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False   
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# class InvoiceAdmin(admin.ModelAdmin):
# readonly_fields = ('date',)
# admin.site.register(product_orders,InvoiceAdmin)
@admin.register(product_orders)
class product_ordersAdmin(admin.ModelAdmin):
    list_display=("id","order_no","user_no","product_id","billing_id","shipping_id","quantity"
    ,"price","size","payment_mode","date")
    list_filter=("date","payment_mode","price","user_no")
    search_fields=("product_id__title","user_no__name")
    readonly_fields=("id","order_no","user_no","product_id","billing_id","shipping_id","quantity"
    ,"price","size","payment_mode","date","selected_currency_sign","selected_currency_value")
    ordering=("order_no",)
    list_per_page=10
    def has_add_permission(self, request):
        return False
    # def has_change_permission(self, request, obj=None):
    #     return False
    def has_delete_permission(self, request, obj=None):
        return False   
# End of code modification

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 06-11-2022
    #Reason - To Register FAQ Model 
    #admin.site.register(FAQ)
    #End of code addition
@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display=("qno","question","answer")
    search_fields=("question",)
    ordering=("qno",)
    list_per_page= 10
    def get_form(self, request, obj=None, **kwargs):
        form = super(FAQAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['question'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['answer'].widget.attrs['style'] = 'width: 100%;'
        return form   
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 09-11-2022
    #Reason - To register contact us model
    #admin.site.register(ContactUs)
    #End of code addition  
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def content_one(obj):
    return Truncator(obj.content1).chars(30)
def subtitle_two(obj):
    return Truncator(obj.subtitle2).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
def subtitle_three(obj):
    return Truncator(obj.subtitle3).chars(30)
def content_three(obj):
    return Truncator(obj.content3).chars(30)              
@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display=(subtitle_one,content_one,subtitle_two,content_two,subtitle_three,content_three,"contactUsImage")
    def has_add_permission(self, request):
        return not ContactUs.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(ContactUsAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content3'].widget.attrs['style'] = 'width: 100%;'
        return form 
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 13-11-2022
    #Reason - To register TermsAndConditions model
    #admin.site.register(TermAndCondition)
    #End of code addition
def title_one(obj):
    return Truncator(obj.title1).chars(30) 
def content_one(obj):
    return Truncator(obj.content1).chars(30) 
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
def subtitle_two(obj):
    return Truncator(obj.subtitle2).chars(30)
def content_three(obj):
    return Truncator(obj.content3).chars(30)
def subtitle_three(obj):
    return Truncator(obj.subtitle3).chars(30)
def content_four(obj):
    return Truncator(obj.content4).chars(30)
def subtitle_four(obj):
    return Truncator(obj.subtitle4).chars(30)
def content_five(obj):
    return Truncator(obj.content5).chars(30)               
@admin.register(TermAndCondition)
class TermAndConditionAdmin(admin.ModelAdmin):
    list_display=(title_one,content_one,subtitle_one,content_two,subtitle_two,content_three,subtitle_three,content_four
    ,subtitle_four,content_five)
    def has_add_permission(self, request):
        return not TermAndCondition.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(TermAndConditionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle4'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content4'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content5'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 13-11-2022
    #Reason - To register Privacy Policy model
    #admin.site.register(PrivacyPolicy) 
    #End of code addition
def title_one(obj):
    return Truncator(obj.title1).chars(30) 
def content_one(obj):
    return Truncator(obj.content1).chars(30) 
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
def subtitle_two(obj):
    return Truncator(obj.subtitle2).chars(30)
def content_three(obj):
    return Truncator(obj.content3).chars(30)
def subtitle_three(obj):
    return Truncator(obj.subtitle3).chars(30)
@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display=(title_one,content_one,subtitle_one,content_two,subtitle_two,content_three)
    def has_add_permission(self, request):
        return not PrivacyPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(PrivacyPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content3'].widget.attrs['style'] = 'width: 100%;'
        return form      
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 13-11-2022
    #Reason - To register Delivery and shipping policy model
    #admin.site.register(DeliveryAndShippingPolicy) 
    #End of code addition
def title_one(obj):
    return Truncator(obj.title1).chars(30) 
def content_one(obj):
    return Truncator(obj.content1).chars(30) 
def title_two(obj):
    return Truncator(obj.title2).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
@admin.register(DeliveryAndShippingPolicy)
class DeliveryAndShippingPolicyAdmin(admin.ModelAdmin):
    list_display=(title_one,content_one,title_two,content_two)
    def has_add_permission(self, request):
         return not DeliveryAndShippingPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(DeliveryAndShippingPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['title2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 14-11-2022
    #Reason - To register Refund policy model
    #admin.site.register(RefundPolicy) 
    #End of code addition
def title_one(obj):
    return Truncator(obj.title1).chars(30) 
def content_one(obj):
    return Truncator(obj.content1).chars(30) 
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
@admin.register(RefundPolicy)
class RefundPolicyAdmin(admin.ModelAdmin):
    list_display=(title_one,content_one,subtitle_one,content_two)
    def has_add_permission(self, request):
        return not RefundPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(RefundPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 14-11-2022
    #Reason - To register Cancellation policy model
    #admin.site.register(CancellationPolicy) 
    #End of code addition
def title_one(obj):
    return Truncator(obj.title1).chars(30) 
def content_one(obj):
    return Truncator(obj.content1).chars(30) 
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def content_two(obj):
    return Truncator(obj.content2).chars(30)
@admin.register(CancellationPolicy)
class CancellationPolicyAdmin(admin.ModelAdmin):
    list_display=(title_one,content_one,subtitle_one,content_two)
    def has_add_permission(self, request):
        return not CancellationPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(CancellationPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 14-11-2022
    #Reason - To register Store Locator model
    #admin.site.register(StoreLocator) 
    #End of code addition
def address_of_store(obj):
    return Truncator(obj.address).chars(30) 
def phone_number(obj):
    return Truncator(obj.phoneNumber).chars(30)
def email_id(obj):
    return Truncator(obj.email).chars(30)
@admin.register(StoreLocator)
class StoreLocatorAdmin(admin.ModelAdmin):
    list_display=("city",address_of_store,phone_number,email_id,"timing","storeImage")
    def has_add_permission(self, request):
        return True if StoreLocator.objects.count() < 2  else False
    def get_form(self, request, obj=None, **kwargs):
        form = super(StoreLocatorAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['address'].widget.cha
        form.base_fields['city'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['address'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['phoneNumber'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['timing'].widget.attrs['style'] = 'width: 100%;'
        return form          
# End of code modification


# Commented and modified by Ashish on 26-11-2022
# To customize admin panel
    #Added by Ashish on 16-11-2022
    #Reason - To SocialLinks model
    # admin.site.register(SocialLink) 
    #End of code addition
@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display=("linkName","link")
    def has_add_permission(self, request):
        return True if SocialLink.objects.count() < 3  else False
    def get_form(self, request, obj=None, **kwargs):
        form = super(SocialLinkAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['linkName'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['link'].widget.attrs['style'] = 'width: 100%;'
        return form     
#End of code addition


# Commented and modified by Ashish on 26-11-2022
# To customize admin panel
    #Added by Ashish on 16-11-2022
    #Reason - To register Bridal model
    #admin.site.register(Bridal) 
    #End of code addition
def title_of_bridal(obj):
    return Truncator(obj.title).chars(30) 
def subtitle_one(obj):
    return Truncator(obj.subtitle1).chars(30)
def subtitle_two(obj):
    return Truncator(obj.subtitle2).chars(30)
@admin.register(Bridal)
class BridalAdmin(admin.ModelAdmin):
    list_display=(title_of_bridal,subtitle_one,subtitle_two,"bridalImage")
    def has_add_permission(self, request):
        return not Bridal.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(BridalAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        return form     
#End of code addition


# Commented and modified by Ashish on 26-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register BridalDetails model
    # admin.site.register(BridalForm) 
    #End of code addition
@admin.register(BridalForm)
class BridalFormAdmin(admin.ModelAdmin):
    list_display=("firstName","lastName","email","contactNumber","zipCode","dateOfWedding","message","termsAndCondition")
    ordering =("firstName",)
    search_fields=("firstName","contactNumber","lastName","email")
    list_filter=("dateOfWedding",)
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False
# End of code modification
    
# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register Copyright model
    #admin.site.register(Copyright) 
    #End of code addition
@admin.register(Copyright)
class CopyrightAdmin(admin.ModelAdmin):
    list_display=("title",)
    def has_add_permission(self, request):
        return not Copyright.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(CopyrightAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        return form      
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register EmailSubscription model
    #admin.site.register(EmailSubscription) 
    #End of code addition
@admin.register(EmailSubscription)
class EmailSubscriptionAdmin(admin.ModelAdmin):
    list_display=("email","subscribe")
    list_filter=("subscribe",)
    search_fields=("email",)
    ordering=("email",)
    list_per_page=10
    def get_form(self, request, obj=None, **kwargs):
        form = super(EmailSubscriptionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        return form   
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Rohan on 17-11-2022
    #Reason - To register InstagramCollection model
    #admin.site.register(InstagramCollection) 
    #End of code addition
@admin.register(InstagramCollection)
class InstagramCollectionAdmin(admin.ModelAdmin):
    list_display=("instagram_home_link","instagram_post1","instagram_post1_link"
    ,"instagram_post2","instagram_post2_link"
    ,"instagram_post3","instagram_post3_link"
    ,"instagram_post4","instagram_post4_link"
    ,"instagram_post5","instagram_post5_link")
    def has_add_permission(self, request):
        return not InstagramCollection.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(InstagramCollectionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['instagram_home_link'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post1_link'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post2_link'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post3_link'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post4'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post4_link'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post5'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['instagram_post5_link'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 19-11-2022
    #Reason - To register LogoAndCover model
    #admin.site.register(LogoAndCover) 
    #End of code addition
@admin.register(LogoAndCover)
class LogoAndCoverAdmin(admin.ModelAdmin):
    list_display=("id","logo","cover1","cover2","cover3","cover4","cover5")
    def has_add_permission(self, request):
        return not LogoAndCover.objects.exists()
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
#admin.site.register(Transaction_history)
@admin.register(Transaction_history)
class Transaction_historyAdmin(admin.ModelAdmin):
    list_display=("order_no","user_no","coupon_discount","shipping_price","subtotal_price"
    ,"tax","grand_total","payment_status","date")
    readonly_fields=("order_no","user_no","coupon_discount","shipping_price","subtotal_price"
    ,"tax","grand_total","date")
    ordering=("order_no","date")
    list_filter=("payment_status","date")
    search_fields=("user_no__name",)
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_delete_permission(self, request, obj=None):
        return False   
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(Online_Qr)
@admin.register(Online_Qr)
class Online_QrAdmin(admin.ModelAdmin):
    list_display=("name","bank_name","account_number","upi_id","qr_img",)
    def has_add_permission(self, request):
        return not Online_Qr.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(Online_QrAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['name'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['bank_name'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['account_number'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['upi_id'].widget.attrs['style'] = 'width: 100%;'
        return form      
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(coupon)
@admin.register(coupon)    
class couponAdmin(admin.ModelAdmin):
    list_display=("promocode","discount_percentage","maximum_discount_price","expiry_date","isActive",)
    list_per_page = 10
    list_filter=("isActive","expiry_date")
    ordering=("promocode",)
    sortable_by=("discount_percentage","maximum_discount_price","expiry_date")
    def get_form(self, request, obj=None, **kwargs):
        form = super(couponAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['promocode'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['discount_percentage'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['maximum_discount_price'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['expiry_date'].widget.attrs['style'] = 'width: 100%;'
        return form
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(Tax)
@admin.register(Tax)    
class TaxAdmin(admin.ModelAdmin):
    list_display=("tax_rate",)
    def has_add_permission(self, request):
        return not Tax.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(TaxAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['tax_rate'].widget.attrs['style'] = 'width: 100%;'
        return form    
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(ImportantNoticeToBuy)
@admin.register(ImportantNoticeToBuy)    
class ImportantNoticeToBuyAdmin(admin.ModelAdmin):
    list_display=("point1","point2","point3")
    def has_add_permission(self, request):
        return not ImportantNoticeToBuy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(ImportantNoticeToBuyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['point1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['point2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['point3'].widget.attrs['style'] = 'width: 100%;'
        return form     
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
#Added by Ashish on 21-11-2022
#To have footer text in the table
    #admin.site.register(FooterDescription)
@admin.register(FooterDescription)    
class FooterDescriptionAdmin(admin.ModelAdmin):
    list_display=(subtitle_one,content_one,subtitle_two,content_two,subtitle_three,content_three,subtitle_four,content_four,)
    def has_add_permission(self, request):
        return not FooterDescription.objects.exists() 
    def get_form(self, request, obj=None, **kwargs):
        form = super(FooterDescriptionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle4'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content3'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content4'].widget.attrs['style'] = 'width: 100%;'
        return form       
#End of code addition
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #Added by Ashish Dewangan on 23-11-2022
    #Reason - To have size chart table at admin side
    #Jira issue no - RBYR-193
    #admin.site.register(WomenClothSizeChart) 
    #End of code addition
@admin.register(WomenClothSizeChart)    
class WomenClothSizeChartAdmin(admin.ModelAdmin):
    list_display=("id","image",)
    def has_add_permission(self, request):
        return not WomenClothSizeChart.objects.exists() 
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #Added by Ashish Dewangan on 24-11-2022
    #Reason - To save custom tailored details that will come from front end
    #Jira issue no - RBYR-193
    #admin.site.register(CustomTailoredForm) 
    #End of code addition
def name_of_user(obj):
    return Truncator(obj.firstName+"  "+obj.lastName).chars(50)    
@admin.register(CustomTailoredForm)    
class CustomTailoredFormAdmin(admin.ModelAdmin):
    list_display=(name_of_user,"email","contactNumber")
    list_filter=("email",)
    sortable_by=("email","contactNumber")
    search_fields=("firstName","lastName","email")
    ordering=("firstName",)
    list_per_page = 10
    def get_form(self, request, obj=None, **kwargs):
        form = super(CustomTailoredFormAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['firstName'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['lastName'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['contactNumber'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['shoulder'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['chest'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['upperChest'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['lowerChest'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['dartPoint'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['armhole'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['armround'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['waist'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['lowerWaist'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['hips'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['length'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['otherInstructions'].widget.attrs['style'] = 'width: 100%;'
        return form
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #Added by Ashish Dewangan on 24-11-2022
    #Reason - To send whatsapp contact number to front end
    #admin.site.register(WhatsappContact) 
    #End of code addition 
@admin.register(LogoAndNumber)    
class LogoAndNumberAdmin(admin.ModelAdmin):
    list_display=("whatsappNmber",)
    def has_add_permission(self, request):
        return not LogoAndNumber.objects.exists() 
    def get_form(self, request, obj=None, **kwargs):
        form = super(LogoAndNumberAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['whatsappNmber'].widget.attrs['style'] = 'width: 100%;'
        return form    
 # End of code modification






class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('name','email', 'tc','contact_number', 'is_admin','is_active')
    list_filter = ('is_admin','is_active')
    ordering=("name",)
    search_fields=("name","email")
    list_per_page=10
    fieldsets = (
        ('user Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name','tc','contact_number')}),
        ('Permissions', {'fields': ('is_admin','is_active')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name','tc','is_active','contact_number', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    filter_horizontal = ()
    def get_form(self, request, obj=None, **kwargs):
        form = super(UserModelAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['name'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['contact_number'].widget.attrs['style'] = 'width: 100%;'
        return form

# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)

# commented by Rohan - 21/12/22 
# Reason - TO store used coupon for user
admin.site.register(couponUsed)
# end of code


# Added by Rohan - 28/12/22
# Reason - To add menu of header 
@admin.register(Menus)
class Menu_Detail(admin.ModelAdmin):
    list_display=("menu",)
    # ordering =("menu",)
    # readonly_fields=('menu',)
    # search_fields=("menu",)
    # list_filter=("menu",)
    # list_per_page=10
    # def get_form(self, request, obj=None, **kwargs):
    #     form = super(Menu_Detail, self).get_form(request, obj, **kwargs)
    #     form.base_fields['menu'].widget.attrs['style'] = 'width: 100%;'
    #     # form.base_fields['category'].widget.attrs['style'] = 'width: 100%;
    #     return form  
    def has_add_permission(self, request):
        return not Menus.objects.count()>=4
      



@admin.register(subMenu)
class subMenu_Detail(admin.ModelAdmin):
    #added by rohan-on-17/2/23
    #reason -to show menu name not an object of foreign key
    list_display=("sub","get_menu")
    def get_menu(self, obj):
        return obj.Menu.menu
    def get_form(self, request, obj, **kwargs):
        form = super(subMenu_Detail, self).get_form(request, obj, **kwargs)
        form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
      
        # form.base_fields['subMenu'].queryset = subMenu.objects.filter(='company')
        # form.fields['subMenu'].choices = [(None, 'Subscriber\'s Location')] + list(subMenu.objects.all().values_list('menu').order_by('menu'))


        return form    
# end of code


# Created on 31/12/22
#Reason- showing Design page
admin.site.register(ItDesignContent)
#end of code

# Created on 4/1/23
#Reason- Showing Celebrity and editorial page
@admin.register(Celebrity)
class CelebrityAdmin(admin.ModelAdmin):
    list_display=("ModelName",)
    readonly_fields=("menu","category",)
    def get_form(self, request, obj, **kwargs):
        form = super(CelebrityAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['upper_menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        form.base_fields['subMenu'].label_from_instance = lambda inst:"{}:{}".format(inst.Menu.menu,inst.sub)
        return form 
    
    
@admin.register(Editorial)
class EditorialAdmin(admin.ModelAdmin):
    list_display=("ModelName","MagzineName")
    readonly_fields=("menu","category",)    
    def get_form(self, request, obj, **kwargs):
        print(request)
        form = super(EditorialAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['upper_menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
        form.base_fields['subMenu'].label_from_instance = lambda inst:"{}:{}".format(inst.Menu.menu,inst.sub)
        return form  
    
    
admin.site.register(WorldOfRByRContent)
admin.site.register(worldOfRByRRow)

  
admin.site.register(Feature)  
  
     
#end of code