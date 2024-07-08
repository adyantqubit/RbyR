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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("id","src","category","display_on")
    list_display=("action","id","src","category","display_on")
    list_display_links=("action",)
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/head_img/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

# End of code modification


class ProductAdmin(admin.ModelAdmin):
   list_display = ['category','title','S','M','L','XL','XXL','date']

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(product_detail,ProductAdmin)
 
@admin.register(product_detail)
class product_detailAdmin(admin.ModelAdmin):
    # Modification and addition by Om Shrivastava on 11-11-23
    # Reason : Need to display the is active field 
    # list_display=(short_title,"menu","category","S","M","L","XL","price","color")
    # list_display=(short_title,"menu","category","S","M","L","XL","price","color",'is_active','subMenu')

    # Modified by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to see details of a row
    list_display=("action",short_title,"menu","category","S","M","L","XL","price","color",'is_active','subMenu')
    list_display_links=("action",)
    # End of code modification by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to see details of a row

    # End of Modification and addition by Om Shrivastava on 11-11-23
    # Reason : Need to display the is active field
    
    ordering =("title",)
    exclude=("XS","XXXL","XXL")
    
    readonly_fields=('search_key','category','menu','product_price_after_sale')
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
        # form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        # # form.base_fields['category'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['color'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['XS'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['S'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['M'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['L'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['XL'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['XXL'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['price'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['XXXL'].widget.attrs['style'] = 'width: 100%;'
        # form.base_fields['about'].widget.attrs['style'] = 'dispaly: 100%;'
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
        
        # Addition by Om Shrivastava on 21-12-23
        # Reason : Need to remove this field from the list 
        field = form.base_fields['available']
        data = form.base_fields['shipping_days']


        # field = form.base_fields['product_price_after_sale']
        field.widget = field.hidden_widget()
        data.widget = data.hidden_widget()
        # End of addition by Om Shrivastava on 21-12-23
        # Reason : Need to remove this field from the list 

        return form    
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color: #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/product_detail/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 
   
# End of code modification


# Commented by Ashish Dewangan on 27-11-2022
# Reason - To hide unused table from admin panel
# admin.site.register(image)
# End of comment


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(Liked)
# Modification and addition by Om Shrivastava on 03-01-24
# Reason : Need to change the product name 
# def title_of_liked_product(obj):
def product_name(obj):
# End of modification and addition by Om Shrivastava on 03-01-24
# Reason : Need to change the product name 
    return Truncator(obj.item.title).chars(30) 

@admin.register(Liked)
class LikedAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_of_liked_product,"user_no")
    # Modification and addition by Om Shrivastava on 03-01-24
    # Reason : Need to change the product name 
    # list_display=("action",title_of_liked_product,"user_no")
    list_display=("action",product_name,"user_no")
    # End of modification and addition by Om Shrivastava on 03-01-24
    # Reason : Need to change the product name 

    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Added by - Ashish Dewangan on 14-12-2023
    # Reason - To add filter according to menu and sub menu
    list_filter=("item__upper_menu","item__subMenu")
    # End of code addition by - Ashish Dewangan on 14-12-2023
    # Reason - To add filter according to menu and sub menu

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
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/liked/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 

# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(Cart)
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("product_no","user_no","quantity","size")
    list_display=("action","product_no","user_no","quantity","size")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    list_per_page=10
    # list_filter=("user_no",)
    sortable_by=("user_no","product_no")
    ordering=("product_no",)
    search_fields=("user_no__name","user_no__email","product_no__title")
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/cart/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 
        
# End of code modification


# Commented by Ashish Dewangan on 27-11-2022
# Reason - To not show garbage tables
# admin.site.register(Cart_buy)
# End of comment


#Added by Rohan 7/12/22 
# reason to save currency
# @admin.register(CurrencySelected)
# class CurrencySelectedAdmin(admin.ModelAdmin):
#     list_display=("user","currency","currency_value","currency_sign")
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
# @admin.register(HomeGifImages)
# class HomeGIF_imgAdmin(admin.ModelAdmin):
#     list_display=("category","Gif_image")
#     readonly_fields=("category","menu")
    
#     def get_form(self, request, obj, **kwargs):
#         form = super(HomeGIF_imgAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
#         form.base_fields['sub'].label_from_instance = lambda inst: "{} : {}".format(inst.Menu.menu,inst.sub)
#         return form    
    
# @admin.register(HomeNormalImages)
# class HomeNormal_imgAdmin(admin.ModelAdmin):
#     list_display=("category","image")  
#     readonly_fields=("category","menu")
#     def get_form(self, request, obj, **kwargs):
#         form = super(HomeNormal_imgAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
#         form.base_fields['sub'].label_from_instance = lambda inst: "{} : {}".format(inst.Menu.menu,inst.sub)
#         return form    
    
@admin.register(Home_video)
class HomeVideoAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("Video_url",)   
    list_display=("action","Video_url",)   
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/home_video/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

#End of code

# Added by - Ashish Dewangan on 14-12-2023
# Reason - To show only 30 characters for long street name
def street_name(obj):
    return Truncator(obj.street).chars(30)
# End of code addition by - Ashish Dewangan on 14-12-2023
# Reason - To show only 30 characters for long street name

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(userbillingDetail)

# Added by - Om Shrivastava on 24-12-23
# Reason - To show only 30 characters for long street name
def house_no(obj):
    return Truncator(obj.houseno).chars(40)
# End of code addition by - Om Shrivastava on 24-12-23
# Reason - To show only 30 characters for long street name

@admin.register(userbillingDetail)
class userbillingDetailAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("user_id","firstname","lastname","street","houseno","city","state","zipcode","country","number")
    list_display=("action","user_id","firstname","lastname",street_name,
                #  Modification and addition by Om Shrivastava on 29-12-23
                #  Reason : Need to rename the house no field 
                #   "houseno",
                house_no,
                # End of modification and addition by Om Shrivastava on 29-12-23
                #  Reason : Need to rename the house no field 
                  "city","state","zipcode","country","number")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # Commeted by Om Shrivastava on 14-12-3
    # Reason : Need to remove ordering
    # ordering=("user_id",)
    # End of commeted by Om Shrivastava on 14-12-3
    # Reason : Need to remove ordering
    list_filter=("city","state","country")

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - Makde phone number and email searchable
    # search_fields=("firstname","lastname","city","state","country")
    search_fields=("firstname","lastname","city","state","country","number","user_id__email")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - Makde phone number and email searchable

    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False   
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/userbillingdetail/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 

# End of code modification




# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# admin.site.register(usershippingDetail)
@admin.register(usershippingDetail)
class usershippingDetailAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("user_id","firstname","lastname","street","houseno","city"
    # ,"state","zipcode","country","number","isSelected")

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To show only 30 characters for long street name
    # list_display=("action","user_id","firstname","lastname",street,"houseno","city"
    # ,"state","zipcode","country","number","isSelected")
    list_display=("action","user_id","firstname","lastname",street_name,
                  
                 #  Modification and addition by Om Shrivastava on 29-12-23
                #  Reason : Need to rename the house no field 
                #   "houseno",
                house_no,
                # End of modification and addition by Om Shrivastava on 29-12-23
                #  Reason : Need to rename the house no field 

                  "city"
    ,"state","zipcode","country","number","isSelected")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To show only 30 characters for long street name
    
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To show latest address on top
    # ordering=("user_id",)
    ordering=("-id",)
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To show latest address on top


    list_filter=("city","state","country")

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To make email also searchable
    # search_fields=("firstname","lastname","city","state","country")
    search_fields=("firstname","lastname","city","state","country","user_id__email")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To make email also searchable

    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False
 
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/usershippingdetail/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 
       
# End of code modification


# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
# class InvoiceAdmin(admin.ModelAdmin):
# readonly_fields = ('date',)
# admin.site.register(product_orders,InvoiceAdmin)

# Added by - Om Shrivastava on 24-12-23
# Reason - To show only 30 characters for long street name
def product_name(obj):
    return Truncator(obj.product_name).chars(40)
# End of code addition by - Om Shrivastava on 24-12-23
# Reason - To show only 30 characters for long street name


@admin.register(product_orders)
class product_ordersAdmin(admin.ModelAdmin):
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # Commented and modified by - Ashish Dewangan on 29-11-2023
    # Reason - To show product name instead of product id
    # list_display=("id","order_no","user_no","product_id","billing_id","shipping_id","quantity"
    # ,"price","size","payment_mode","date")
    # list_display=("id","order_no","user_no","product_name","billing_id","shipping_id","quantity"
    # ,"price","size","payment_mode","date",
    # # Addition by Om Shrivastava on 05-12-23
    # # Reason : Need to show this field
    # 'order_status'
    # # End of addition by Om Shrivastava on 05-12-23
    # # Reason : Need to show this field
    # )
    # End of code modification by - Ashish Dewangan on 29-11-2023
    # Reason - To show product name instead of product id
    list_display=("action","id","order_no","user_no",
                #   Modification and addition by Om Shrivastava on 23-12-23
                #   Reason : Need to set product name 
                #   "product_name",
                  product_name,
                #   End of Modification and addition by Om Shrivastava on 23-12-23
                #   Reason : Need to set product name 
                # Modification and addition by Om Shrivastava on 24-12-23
                # Reason : Need to arrange the list display
                #               "billing_id","shipping_id","quantity"
                # ,"price","size","payment_mode","date",'order_status')
                # "quantity","price","product_discount_price","grand_total","size",'order_status',"payment_mode","billing_id","shipping_id","date")
                "price","quantity","product_discount_price","grand_total","size",'order_status',"payment_mode","billing_id","shipping_id","date")
    
                # End of Modification and addition by Om Shrivastava on 24-12-23
                # Reason : Need to arrange the list display
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    list_filter=(
         # Addition by Om Shrivastava on 05-12-23
    # Reason : Need to show this field
    'order_status',
    # End of addition by Om Shrivastava on 05-12-23
    # Reason : Need to show this field
        "date","payment_mode","price","user_no")
    search_fields=("product_id__title","user_no__name",
                #    Addition by Om Shrivastava on 14-12-23
                #    Reason : Set by Order id
                "user_no__email",
                "order_no"
                # End of addition by Om Shrivastava on 14-12-23
                #    Reason : Set by Order id
                   )

    # Commented and modified by - Ashish Dewangan on 29-11-2023
    # Reason - To make shipping_charges, product_name and product_image read only
    # readonly_fields=("id","order_no","user_no","product_id","billing_id","shipping_id","quantity"
    # ,"price","total_price","size","payment_mode","date","selected_currency_sign","selected_currency_value")
    readonly_fields=("id","order_no","user_no","product_id","billing_id","shipping_id","size","quantity"
    ,"price",
    'product_discount_price',"total_price",
    #   'product_price_after_sale',
      "shipping_charges",'grand_total',"payment_mode","date","selected_currency_sign"
    ,"product_name","product_image",
    # Addition by Om Shrivastava on 22-06-2024
    # Reason : Add this field only readonly 
   )
    # End of addition by Om Shrivastava on 22-06-2024
    # Reason : Add this field only readonly 
    

    # End of code modification by - Ashish Dewangan on 29-11-2023
    # Reason - To make shipping_charges, product_name and product_image read only

    ordering=("-order_no",)
    list_per_page=10

    def has_add_permission(self, request):
        return False
    # def has_change_permission(self, request, obj=None):
    #     return False
    def has_delete_permission(self, request, obj=None):
        return False  
     
   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/product_orders/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Addition by Om Shrivastava on 21-12-23
    # Reason : Need to remove the selected_currency_value
    def get_form(self, request, obj=None, **kwargs):
        form = super(product_ordersAdmin, self).get_form(request, obj, **kwargs)
        field = form.base_fields['selected_currency_value']
        field.widget = field.hidden_widget()
        
        return form 
    # End of addition by Om Shrivastava on 21-12-23
    # Reason : Need to remove the selected_currency_value

# End of code modification

# Commented and modified by Ashish Dewangan on 27-11-2022
# Reason - To customize admin panel
    #Added by Ashish on 06-11-2022
    #Reason - To Register FAQ Model 
    #admin.site.register(FAQ)
    #End of code addition
@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("qno","question","answer")
    list_display=("action","qno","question","answer")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    search_fields=("question",)
    ordering=("qno",)
    list_per_page= 10
    def get_form(self, request, obj=None, **kwargs):
        form = super(FAQAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['question'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['answer'].widget.attrs['style'] = 'width: 100%;'
        return form   
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/faq/"+str(obj.qno)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(subtitle_one,content_one,subtitle_two,content_two,subtitle_three,content_three,"contactUsImage")
    list_display=("action",subtitle_one,content_one,subtitle_two,content_two,subtitle_three,content_three,"contactUsImage")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/contactus/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_one,content_one,subtitle_one,content_two,subtitle_two,content_three,subtitle_three,content_four
    # ,subtitle_four,content_five)
    list_display=("action",title_one,content_one,subtitle_one,content_two,subtitle_two,content_three,subtitle_three,content_four
    ,subtitle_four,content_five)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/termandcondition/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
      
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_one,content_one,subtitle_one,content_two,subtitle_two,content_three)
    list_display=("action",title_one,content_one,subtitle_one,content_two,subtitle_two,content_three)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/privacypolicy/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
        
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_one,content_one,title_two,content_two)
    list_display=("action",title_one,content_one,title_two,content_two)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
         return not DeliveryAndShippingPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(DeliveryAndShippingPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['title2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form    

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/deliveryandshippingpolicy/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
     
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
@admin.register(ReturnPolicy)
class RefundPolicyAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_one,content_one,subtitle_one,content_two)
    list_display=("action",title_one,content_one,subtitle_one,content_two)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not ReturnPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(RefundPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/refundpolicy/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
      
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_one,content_one,subtitle_one,content_two)
    list_display=("action",title_one,content_one,subtitle_one,content_two)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not CancellationPolicy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(CancellationPolicyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
        return form 

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/cancellationpolicy/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 
        
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("city",address_of_store,phone_number,email_id,"timing","storeImage")
    list_display=("action","city",address_of_store,phone_number,email_id,"timing","storeImage")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Added by - Ashish Dewangan on 23-12-2023
    # Reason - To sort list by id
    ordering=("id",)
    # End of code addition by - Ashish Dewangan on 23-12-2023
    # Reason - To sort list by id

    def has_add_permission(self, request):
        return True if StoreLocator.objects.count() < 2  else False
    def get_form(self, request, obj=None, **kwargs):
        form = super(StoreLocatorAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['address'].widget.attrs['style']='width: 100%'
        form.base_fields['city'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['address'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['phoneNumber'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['timing'].widget.attrs['style'] = 'width: 100%;'
        return form   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/storelocator/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
           
# End of code modification


# Commented and modified by Ashish on 26-11-2022
# To customize admin panel
    #Added by Ashish on 16-11-2022
    #Reason - To SocialLinks model
    # admin.site.register(SocialLink) 
    #End of code addition
@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("linkName","link")
    list_display=("action","linkName","link")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return True if SocialLink.objects.count() < 3  else False
    def get_form(self, request, obj=None, **kwargs):
        form = super(SocialLinkAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['linkName'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['link'].widget.attrs['style'] = 'width: 100%;'
        return form   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/sociallink/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
      
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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(title_of_bridal,subtitle_one,subtitle_two,"bridalImage")
    list_display=("action",title_of_bridal,subtitle_one,subtitle_two,"bridalImage")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not Bridal.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(BridalAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
        return form

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/bridal/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 
          
#End of code addition


# Commented and modified by Ashish on 26-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register BridalDetails model
    # admin.site.register(BridalForm) 
    #End of code addition
@admin.register(BridalForm)
class BridalFormAdmin(admin.ModelAdmin):

    # Modified by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("firstName","lastName","email","contactNumber","zipCode","dateOfWedding","message","createdDate","termsAndCondition")
    list_display=("action","firstName","lastName","email","contactNumber","zipCode","dateOfWedding","message","createdDate","termsAndCondition")
    list_display_links=("action",)
    # End of code modification by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Added by - Ashish Dewangan on 14-12-2023
    # Reason - To make all fields read only
    readonly_fields = ("firstName","lastName","email","contactNumber","zipCode","dateOfWedding","message","createdDate","termsAndCondition")
    # End of code addition by - Ashish Dewangan on 14-12-2023
    # Reason - To make all fields read only

    # Modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to show first data 
    # ordering =("firstName",)
    # End of modification and addition by Om Shrivastava on 11-12-23
    # Reason : Need to show first data  
    search_fields=("firstName","contactNumber","lastName","email","createdDate","dateOfWedding","createdDate")
    list_filter=("dateOfWedding",)
    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/bridalform/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 

# End of code modification
    
# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register Copyright model
    #admin.site.register(Copyright) 
    #End of code addition
@admin.register(Copyright)
class CopyrightAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("title",)
    list_display=("action","title",)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not Copyright.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(CopyrightAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'width: 100%;'
        return form

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/copyright/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
          
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 17-11-2022
    #Reason - To register EmailSubscription model
    #admin.site.register(EmailSubscription) 
    #End of code addition
@admin.register(EmailSubscription)
class EmailSubscriptionAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("email","subscribe")
    list_display=("action","email","subscribe")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    list_filter=("subscribe",)
    search_fields=["email",]
    # readonly_fields=("date",)
    ordering=("-id",)
    list_per_page=10
    def get_form(self, request, obj=None, **kwargs):
        form = super(EmailSubscriptionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['email'].widget.attrs['style'] = 'width: 100%;'
        return form 

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/emailsubscription/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
      
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Rohan on 17-11-2022
    #Reason - To register InstagramCollection model
    #admin.site.register(InstagramCollection) 
    #End of code addition
@admin.register(InstagramCollection)
class InstagramCollectionAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("instagram_home_link","instagram_post1","instagram_post1_link"
    # ,"instagram_post2","instagram_post2_link"
    # ,"instagram_post3","instagram_post3_link"
    # ,"instagram_post4","instagram_post4_link"
    # ,"instagram_post5","instagram_post5_link")
    list_display=("action","instagram_home_link","instagram_post1","instagram_post1_link"
    ,"instagram_post2","instagram_post2_link"
    ,"instagram_post3","instagram_post3_link"
    ,"instagram_post4","instagram_post4_link"
    ,"instagram_post5","instagram_post5_link")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/instagramcollection/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
         
# End of code modification


# Commented and modified by Ashish on 27-11-2022
# To customize admin panel
    #Added by Ashish on 19-11-2022
    #Reason - To register LogoAndCover model
    #admin.site.register(LogoAndCover) 
    #End of code addition
# @admin.register(LogoAndCover)
# class LogoAndCoverAdmin(admin.ModelAdmin):
#     list_display=("id","logo","cover1","cover2","cover3","cover4","cover5")
#     def has_add_permission(self, request):
#         return not LogoAndCover.objects.exists()
# End of code modification

# Added by - Ashish Dewangan on 14-12-2023
# Reason - To add rupees sign
def shipping_charges(obj):
    return "₹ %s " % obj.shipping_price if obj.shipping_price else ""
def subtotal(obj):
    return "₹ %s " % obj.subtotal_price if obj.subtotal_price else ""
def grand_total(obj):
    return "₹ %s " % obj.grand_total if obj.grand_total else ""
# End of code modification by - Ashish Dewangan on 14-12-2023
# Reason - To add rupees sign
# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
#admin.site.register(Transaction_history)
@admin.register(Transaction_history)
class Transaction_historyAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("order_no","user_no",
    #             #   "coupon_discount",
    #               "shipping_price","subtotal_price",
    #             #   "tax",
    # "grand_total","payment_status","date",
    # # Addition by Om Shrivastava on 05-12-23
    # # Reason : Add the field
    # 'payment_status'
    # # End of addition by Om Shrivastava on 05-12-23
    # # Reason : Add the field
    # )

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To add rupees sign in front of price
    # list_display=("action","order_no","user_no","shipping_price","subtotal_price","grand_total","payment_status","date"
    #               ,'payment_status'
    # )
    list_display=("action","order_no","date","user_no",shipping_charges,subtotal,grand_total,"payment_status"
                  
    )
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To add rupees sign in front of price

    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Commented and modified by - Ashish Dewangan on 29-11-2023
    # Reason - To make shipping details read only
    # readonly_fields=("order_no","user_no",
    #                 #  "coupon_discount",
    #                  "shipping_price","subtotal_price",
    #                 #  "tax",
    # "grand_total","date")
    readonly_fields=("order_no","user_no",
                    #  "coupon_discount",
                     "shipping_price","subtotal_price",
                    #  "tax",
    "grand_total","date","firstname","lastname","street","houseno","city","state","zipcode","country","number")
    # End of code modification by - Ashish Dewangan on 29-11-2023
    # Reason - To make shipping details read only
    
    ordering=("-order_no","date")
    list_filter=("payment_status","date")

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To have search functionality enabled for email and order no
    # search_fields=("user_no__name",)
    search_fields=("user_no__name","user_no__email","order_no")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To have search functionality enabled for email and order no

    list_per_page=10
    def has_add_permission(self, request):
        return False
    def has_delete_permission(self, request, obj=None):
        return False   
    
     # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/transaction_history/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    
    
    
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(Online_Qr)
@admin.register(Online_Qr)
class Online_QrAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("name","bank_name","account_number","upi_id","qr_img",)
    list_display=("action","name","bank_name","account_number","upi_id","qr_img",)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not Online_Qr.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(Online_QrAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['name'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['bank_name'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['account_number'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['upi_id'].widget.attrs['style'] = 'width: 100%;'
        return form    

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/online_qr/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
      
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(coupon)
# @admin.register(coupon)    
# class couponAdmin(admin.ModelAdmin):
#     list_display=("promocode","discount_percentage","maximum_discount_price","expiry_date","isActive",)
#     list_per_page = 10
#     list_filter=("isActive","expiry_date")
#     ordering=("promocode",)
#     sortable_by=("discount_percentage","maximum_discount_price","expiry_date")
#     def get_form(self, request, obj=None, **kwargs):
#         form = super(couponAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['promocode'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['discount_percentage'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['maximum_discount_price'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['expiry_date'].widget.attrs['style'] = 'width: 100%;'
#         return form
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(Tax)
# @admin.register(Tax)    
# class TaxAdmin(admin.ModelAdmin):
#     list_display=("tax_rate",)
#     def has_add_permission(self, request):
#         return not Tax.objects.exists()
#     def get_form(self, request, obj=None, **kwargs):
#         form = super(TaxAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['tax_rate'].widget.attrs['style'] = 'width: 100%;'
#         return form    
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #admin.site.register(ImportantNoticeToBuy)
@admin.register(ImportantNoticeToBuy)    
class ImportantNoticeToBuyAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("point1","point2","point3")
    list_display=("action","point1","point2","point3")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not ImportantNoticeToBuy.objects.exists()
    def get_form(self, request, obj=None, **kwargs):
        form = super(ImportantNoticeToBuyAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['point1'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['point2'].widget.attrs['style'] = 'width: 100%;'
        form.base_fields['point3'].widget.attrs['style'] = 'width: 100%;'
        return form 

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/importantnoticetobuy/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
        
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
#Added by Ashish on 21-11-2022
#To have footer text in the table
    #admin.site.register(FooterDescription)
# @admin.register(FooterDescription)    
# class FooterDescriptionAdmin(admin.ModelAdmin):
#     list_display=(subtitle_one,content_one,subtitle_two,content_two,subtitle_three,content_three,subtitle_four,content_four,)
#     def has_add_permission(self, request):
#         return not FooterDescription.objects.exists() 
#     def get_form(self, request, obj=None, **kwargs):
#         form = super(FooterDescriptionAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['subtitle1'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['subtitle2'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['subtitle3'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['subtitle4'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['content1'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['content2'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['content3'].widget.attrs['style'] = 'width: 100%;'
#         form.base_fields['content4'].widget.attrs['style'] = 'width: 100%;'
#         return form       
#End of code addition
# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #Added by Ashish Dewangan on 23-11-2022
    #Reason - To have size chart table at admin side
    #Jira issue no - RBYR-193
    #admin.site.register(WomenClothSizeChart) 
    #End of code addition
    # Modification and addition by Om Shrivastava on 10-12-23
    # Reason : No need to show this model

# Added by - Ashish Dewangan on 16-12-2023
# Reason - To show woman size chart on Admin panel
@admin.register(WomenClothSizeChart)    
class WomenClothSizeChartAdmin(admin.ModelAdmin):
    list_display=("action","id","image",)
    def has_add_permission(self, request):
        return not WomenClothSizeChart.objects.exists() 

    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    list_display_links=("action",)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/womenclothsizechart/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
# End of code addition by - Ashish Dewangan on 16-12-2023
# Reason - To show woman size chart on Admin panel


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

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=(name_of_user,"email","contactNumber")
    list_display=("action",name_of_user,"email","contactNumber")
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    list_filter=("email",)
    sortable_by=("email","contactNumber")
    search_fields=("firstName","lastName","email",'contactNumber')
    # Modification and addition by Om shrivastava on 13-12-23
    # Reason : Need to set the readonly field of the product id
    # ordering=("firstName",)
    readonly_fields = ('product_id','product_name')
    # End of modification and addition by Om shrivastava on 13-12-23
    # Reason : Need to set the readonly field of the product id
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
        # # Addition by Om Shrivastava on 13-12-23
        # # Reason : Set the product name full width
        # form.base_fields['product_name'].widget.attrs['style'] = 'width: 100%;'
        # # End of addition by Om Shrivastava on 13-12-23
        # # Reason : Set the product name full width
        return form
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/customtailoredform/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

# End of code modification


# Commented and modified by Ashish on 28-11-2022
# To customize admin panel
    #Added by Ashish Dewangan on 24-11-2022
    #Reason - To send whatsapp contact number to front end
    #admin.site.register(WhatsappContact) 
    #End of code addition 
@admin.register(LogoAndNumber)    
class LogoAndNumberAdmin(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("whatsappNmber",)
    list_display=("action","whatsappNmber",)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    def has_add_permission(self, request):
        return not LogoAndNumber.objects.exists() 
    def get_form(self, request, obj=None, **kwargs):
        form = super(LogoAndNumberAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['whatsappNmber'].widget.attrs['style'] = 'width: 100%;'
        return form    
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/logoandnumber/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

 # End of code modification






class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display = ('name','email', 'tc','contact_number', 'is_admin','is_active')
    list_display = ("action",'name','email', 'tc','contact_number', 'is_admin','is_active')
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    list_filter = ('is_admin','is_active')
    ordering=("-id",)
    search_fields=("name","email",
                #    Addition by Om Shrivastava on 08-12-23
                #    Reason : Add the contact number for searching
                   'contact_number')
                #    End of addition by Om Shrivastava on 08-12-23
                #    Reason : Add the contact number for searching
    list_per_page=10
    fieldsets = (
        # Modified by - Ashish Dewangan on 15-12-2023
        # Reason - To capitalizer user credentials
        # ('user Credentials', {'fields': ('email', 'password')}),
        ('User Credentials', {'fields': ('email', 'password')}),
        # End of code modification by - Ashish Dewangan on 15-12-2023
        # Reason - To capitalizer user credentials
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
    
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/user/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row 

# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)

# commented by Rohan - 21/12/22 
# Reason - TO store used coupon for user
# admin.site.register(couponUsed)
# end of code


# Added by Rohan - 28/12/22
# Reason - To add menu of header 
@admin.register(Menus)
class Menu_Detail(admin.ModelAdmin):

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("menu",)
    list_display=("action","menu",)
    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    exclude=("show_instant_filter_for_subMenu","Show_subMenu_with_image",)
    # ordering =("menu",)
    # readonly_fields=('menu',)
    # search_fields=("menu",)
    # list_filter=("menu",)
    # list_per_page=10
    def get_form(self, request, obj=None, **kwargs):
        form = super(Menu_Detail, self).get_form(request, obj, **kwargs)
        form.base_fields['Choose_menu_type'].widget.attrs['style'] = 'width:100%;'
   
        # form.base_fields['category'].widget.attrs['style'] = 'width: 100%;
        return form   
    def has_add_permission(self, request):
        # Modification and addition by Om Shrivastava on 19-06-2024
        # Reason : User can add only one menu
        # return not Menus.objects.count()>=4
        return not Menus.objects.count()>=1
        # End of modification and addition by Om Shrivastava on 19-06-2024
        # Reason : User can add only one menu
    
      
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/menus/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row


@admin.register(subMenu)
class subMenu_Detail(admin.ModelAdmin):
    #added by rohan-on-17/2/23
    #reason -to show menu name not an object of foreign key

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    # list_display=("sub","get_menu")
    
    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To display sub as sub menu and get menu as menu
    # list_display=("action","sub","get_menu")
    list_display=("action","sub_menu","menu")
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To display sub as sub menu and get menu as menu

    list_display_links=("action",)
    # End of code additon by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row

    # Modified by - Ashish Dewangan on 14-12-2023
    # Reason - To display sub as sub menu and get menu as menu
    # def get_menu(self, obj):
    #     return obj.Menu.menu
    def sub_menu(self,obj):
        return obj.sub
    def menu(self, obj):
        return obj.Menu.menu
    # End of code modification by - Ashish Dewangan on 14-12-2023
    # Reason - To display sub as sub menu and get menu as menu
    
    def get_form(self, request, obj, **kwargs):
        form = super(subMenu_Detail, self).get_form(request, obj, **kwargs)
        form.base_fields['Menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
      
        # form.base_fields['subMenu'].queryset = subMenu.objects.filter(='company')
        # form.fields['subMenu'].choices = [(None, 'Subscriber\'s Location')] + list(subMenu.objects.all().values_list('menu').order_by('menu'))


        return form   

    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/submenu/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added a button to view details of a row
     
# end of code


# Created on 31/12/22
#Reason- showing Design page
# admin.site.register(ItDesignContent)
#end of code

# Created on 4/1/23
#Reason- Showing Celebrity and editorial page
# @admin.register(Celebrity)
# class CelebrityAdmin(admin.ModelAdmin):
#     list_display=("ModelName",)
#     readonly_fields=("menu","category",)
#     def get_form(self, request, obj, **kwargs):
#         form = super(CelebrityAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['upper_menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
#         form.base_fields['subMenu'].label_from_instance = lambda inst:"{}:{}".format(inst.Menu.menu,inst.sub)
#         return form 
    
    
# @admin.register(Editorial)
# class EditorialAdmin(admin.ModelAdmin):
#     list_display=("ModelName","MagzineName")
#     readonly_fields=("menu","category",)    
#     def get_form(self, request, obj, **kwargs):
#         print(request)
#         form = super(EditorialAdmin, self).get_form(request, obj, **kwargs)
#         form.base_fields['upper_menu'].label_from_instance = lambda inst: "{}".format(inst.menu)
#         form.base_fields['subMenu'].label_from_instance = lambda inst:"{}:{}".format(inst.Menu.menu,inst.sub)
#         return form  
    

# Modified by - Ashish Dewangan on 13-12-2023
# Reason - To show more details of world of rbyr content
# admin.site.register(worldOfRByRRow)    
@admin.register(WorldOfRByRContent)
class WorldOfRByRContentAdmin(admin.ModelAdmin):

    list_display=("action","video_url","top_image","title1","description1")
    list_display_links=("action",)

    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/worldofrbyrcontent/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True  
# End of code modification by - Ashish Dewangan on 13-12-2023
# Reason - To show more details of world of rbyr content

# Modified by - Ashish Dewangan on 13-12-2023
# Reason - To show more details of world of rbyr content
# admin.site.register(worldOfRByRRow)
@admin.register(worldOfRByRRow)
class worldOfRByRRowAdmin(admin.ModelAdmin):

    list_display=("action","title","img1","img2","img3","description1","description2")
    list_display_links=("action",)

    # Added by - Ashish Dewangan on 23-12-2023
    # Reason - To sort rows by id in ascending order
    ordering=("id",)
    # End of code addition by - Ashish Dewangan on 23-12-2023
    # Reason - To sort rows by id in ascending order

    def __init__(self, model, admin_site): 
        self.request = None
        super().__init__(model, admin_site)

    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    def action(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/back_site/worldofrbyrrow/"+str(obj.id)+"/change/'>View Details</a>")
    action.allow_tags = True 
# End of code modification by - Ashish Dewangan on 13-12-2023
# Reason - To show more details of world of rbyr content

  
# admin.site.register(Feature)  
  
     
#end of code