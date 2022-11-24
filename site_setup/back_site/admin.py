from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register(Head_img)
class ProductAdmin(admin.ModelAdmin):
   list_display = ['category','title','S','M','L','XL','XXL','date']
admin.site.register(product_detail,ProductAdmin)
admin.site.register(image)
admin.site.register(Liked)
admin.site.register(Cart)
admin.site.register(Cart_buy)
admin.site.register(HomeCard_img)
admin.site.register(userbillingDetail)
admin.site.register(usershippingDetail)
class InvoiceAdmin(admin.ModelAdmin):
    readonly_fields = ('date',)
admin.site.register(product_orders,InvoiceAdmin)
#Added by Ashish on 06-11-2022
#Reason - To Register FAQ Model 
admin.site.register(FAQ)
#End of code addition

#Added by Ashish on 09-11-2022
#Reason - To register contact us model
admin.site.register(ContactUs)
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To register TermsAndConditions model
admin.site.register(TermAndCondition)
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To register Privacy Policy model
admin.site.register(PrivacyPolicy) 
#End of code addition

#Added by Ashish on 13-11-2022
#Reason - To register Delivery and shipping policy model
admin.site.register(DeliveryAndShippingPolicy) 
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To register Refund policy model
admin.site.register(RefundPolicy) 
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To register Cancellation policy model
admin.site.register(CancellationPolicy) 
#End of code addition

#Added by Ashish on 14-11-2022
#Reason - To register Store Locator model
admin.site.register(StoreLocator) 
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To SocialLinks model
admin.site.register(SocialLink) 
#End of code addition

#Added by Ashish on 16-11-2022
#Reason - To register Bridal model
admin.site.register(Bridal) 
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To register BridalDetails model
admin.site.register(BridalForm) 
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To register Copyright model
admin.site.register(Copyright) 
#End of code addition

#Added by Ashish on 17-11-2022
#Reason - To register EmailSubscription model
admin.site.register(EmailSubscription) 
#End of code addition

#Added by Rohan on 17-11-2022
#Reason - To register InstagramCollection model
admin.site.register(InstagramCollection) 
#End of code addition

#Added by Ashish on 19-11-2022
#Reason - To register LogoAndCover model
admin.site.register(LogoAndCover) 
#End of code addition

admin.site.register(Transaction_history)
admin.site.register(Online_Qr)
admin.site.register(coupon)
admin.site.register(Tax)
admin.site.register(ImportantNoticeToBuy)

#Added by Ashish on 21-11-2022
#To have footer text in the table
admin.site.register(FooterDescription) 
#End of code addition

#Added by Ashish Dewangan on 23-11-2022
#Reason - To have size chart table at admin side
#Jira issue no - RBYR-193
admin.site.register(WomenClothSizeChart) 
#End of code addition

#Added by Ashish Dewangan on 24-11-2022
#Reason - To save custom tailored details that will come from front end
#Jira issue no - RBYR-193
admin.site.register(CustomTailoredForm) 
#End of code addition
 

class UserModelAdmin(BaseUserAdmin):

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id','email', 'name','tc','contact_number', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        ('user Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name','tc','contact_number')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name','tc','contact_number', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email','id')
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)
