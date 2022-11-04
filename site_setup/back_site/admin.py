from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register(Head_img)
admin.site.register(product_detail)
admin.site.register(image)
admin.site.register(Liked)
admin.site.register(Cart)
admin.site.register(Cart_buy)
admin.site.register(HomeCard_img)
admin.site.register(userbillingDetail)
admin.site.register(usershippingDetail)
admin.site.register(product_orders)
admin.site.register(Transaction_history)





 

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
