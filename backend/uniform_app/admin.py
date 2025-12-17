from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.utils.html import format_html
from django.conf import settings
from django import forms
from django.utils.html import format_html_join
from django.urls import reverse
from django import forms
from django.forms.widgets import DateInput
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.html import strip_tags
from django.template.defaultfilters import truncatechars
from django.utils.timezone import now
from django.utils.timezone import localtime

# Added by - Ashlekh on 23-11-2024
# Reason - To format date_of_birth in User table
class UserAdminForm(forms.ModelForm):
        class Meta:
            model = User
            fields = "__all__"
        
        date_of_birth = forms.DateField( input_formats=['%m-%d-%Y'], widget=forms.DateInput(format='%m-%d-%Y',attrs={'placeholder': 'MM-DD-YYYY',}) )
            # widgets = {
            #     'date_of_birth': forms.DateInput(
            #         format='%d-%m-%Y', 
            #         attrs={"type": "date",}
            #     ),
            # }

        # def __init__(self, *args, **kwargs):
        #     super().__init__(*args, **kwargs)
        #     if self.instance and self.instance.date_of_birth:
        #         self.fields['date_of_birth'].initial = self.instance.date_of_birth.strftime('%d-%m-%Y')
# End of code - Ashlekh on 23-11-2024
# Reason - To format date_of_birth in User table

@admin.register(User)
class UserModelAdmin(UserAdmin):
	# form = UserAdminForm
    # Added by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/user/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    
    # Code added by Unnati Bajaj on 13-06-2024
    # Reason -To display list that will have email,name,contact number and active status

    # Modified by jhamman on 11-10-2024
    # Reason - Added new field action
    # list_display = ('email', 'username', 'contact_number',
    #                 'date_of_birth', 'gender')
    list_display = ("action", 'email', 'username',
                    # Code added by Unnati on 27-10-2024
                    # Reason-To display last name
                    'last_name',
                    # End of code addition by Unnati on 27-10-2024
                    # Reason-To display last name
                    'contact_number',
                    # Code changed by - Ashlekh on 17-01-2025
                    # Reason - To show date in MM-DD-YYYY
                    # 'date_of_birth',
                    'get_formatted_date',
                    # Code changed by - Ashlekh on 17-01-2025
                    # Reason - To show date in MM-DD-YYYY 
                    'gender')
    # End of modification by jhamman on 11-10-2024
    # Reason - Added new field action

    list_filter = ('is_active',)
    search_fields = ('email', 'username')
    ordering = ('email',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(is_active=True)
        return qs

    def get_list_display(self, request):
        return self.list_display + ('is_active',)

    def get_list_filter(self, request):
        if request.user.is_superuser:
            return self.list_filter
        return tuple()

    fieldsets = (
        (None, {'fields': ('username',
                           # Code added by Unnati on 27-10-2024
                           # Reason-To display last name
                           'last_name',
                           # End of code addition by Unnati on 27-10-2024
                           # Reason-To display last name
                           # Code added by Unnati on 25-10-2024
                           # Reason-To add date of birth and gender
                           'date_of_birth', 'gender'
                           # End of code addition by Unnati on 25-10-2024
                           # Reason-To add date of birth and gender
                           # Code added by Unnati on 18-10-2024
                           # Reason-To remove password
                           # 'password'
                           # End of code addition by Unnati on 18-10-2024
                           # Reason-To remove password
                           )}),
        ('Personal info', {'fields': ('email', 'contact_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    # Added by - Ashlekh on 17-01-2025
    # Reason - To change format of date
    def get_formatted_date(self, obj):
        return obj.date_of_birth.strftime('%m-%d-%Y') if obj.date_of_birth else ""
    get_formatted_date.short_description = 'Date of birth'
    # End of code - Ashlekh on 17-01-2025
    # Reason - To change format of date
# End of code addition by Unnati Bajaj on 13-06-2024
# Reason -To display list that will have email,name,contact number and active status

# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add contact us


@admin.register(ContactRequest)
class ContactUsAdmin(admin.ModelAdmin):
    #  pass
    # Added by - Jhamman lal sahu on 12-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/contactrequest/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 12-10-2024
    # Reason - Added view button

    # Added by Jhamman on 12-10-2024
    # Reason - Added list display
    list_display = ('action', 'name', 'email', 'phone_number', 'message', 
                    # Added by - Ashlekh on 22-01-2025
                    # Reason - To add created at in list
                    'formatted_created_at',
                    # End of code - Ashlekh on 22-01-2025
                    # Reason - To add created at in list
                )
    # End of addition by Jhamman on 12-10-2024
    # Reason - Added list display
    #Code added by Unnati on 01-12-2024
    #Reason-To show all fields in readonly
    readonly_fields=('name', 'email', 'phone_number', 'message')
    #End of code addition by Unnati on 01-12-2024
    #Reason-To show all fields in readonly
    # Added by - Ashlekh on 22-01-2025
    # Reason - To add created_at in MM-DD-YYYY
    def formatted_created_at(self, obj):
        if obj.created_at:
            return localtime(obj.created_at).strftime('%m-%d-%Y %I:%M %p')
        return "-"
    formatted_created_at.short_description = "Created at"
    # End of code - Ashlekh on 22-01-2025
    # Reason - To add created_at in MM-DD-YYYY
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
# End of code addition by Unnati Bajaj on 02-06-2024
# Reason -To add contact us

# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add settings


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):

    # Added by jhamman on 19-10-2024
    # reason - remove opening and closing hour
    fields = ('name', 'address', 'pincode', 'contact_number',
              'email', 'map_link', 'logo', 'size_chart',
              # Added by Unnati on 06-11-2024
              # Reason-Added cancellation days,return days,exchange days
              'max_cancellation_days', 'max_return_days', 'max_exchange_days',
              # End of code addition  by Unnati on 06-11-2024
              # Reason-Added cancellation days,return days,exchange days
              )

    list_display = ['name', 'address', 'pincode', 'contact_number', 'email']
    # End of addition by jhamman on 19-10-2024
    # reason - remove opening and closing hour

    def has_add_permission(self, request):
        return not Setting.objects.exists()
    # Added by - Unnati on 18-10-2024
    # Reason - Added view button

    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/setting/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    list_display = ("action", "name", "address",
                    "pincode", "contact_number", "email", 
                    #Code commented by Unnati on 24-11-2024
                    #Reason-To hide these columns from admin side
                    # "opening_hours", "closing_hours"
                    #End of code comment by Unnati on 24-11-2024
                    #Reason-To hide these columns from admin side
                    )
    # End of code addition by - Unnati on 18-10-2024
    # Reason - Added view button
# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add settings

# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add social links


@admin.register(Social)
class SocialAdmin(admin.ModelAdmin):
    # Code added by Unnati on 18-10-2024
    # Reason-To show list in admin
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/social/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True

    list_display = ('action', 'name', 'social_link', 'icon')
    # End of code addition by Unnati on 18-10-2024
    # Reason-To show list in admin
    # Code added by Unnati on 20-09-2024
    # Reason-Added restriction that social links cannot be added more than 5

    def save_model(self, request, obj, form, change):
        social_links_count = Social.objects.count()
        if social_links_count >= 5 and not change:
            messages.warning(
                request, 'You cannot add more than 5 social links or icons.')
            return

        super().save_model(request, obj, form, change)
    # End of code addition by Unnati on 20-09-2024
    # Reason-Added restriction that social links cannot be added more than 5
    # Added by - Ashlekh on 26-11-2024
    # Reason - To change heading message in Social media table
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = "Select social media to change"
        return super(SocialAdmin, self).changelist_view(request, extra_context=extra_context)
    # End of code - Ashlekh on 26-11-2024
    # Reason - To change heading message in Social media table
# End of code addition by Unnati Bajaj on 02-06-2024
# Reason -To add social links

# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add FAQ


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def action(self, obj):
        #Code modified by Unnati on 28-11-2024
        #Reason-Modified social to faq
        # return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/social/"+str(obj.id)+"/change/'>View</a>")
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/faq/"+str(obj.id)+"/change/'>View</a>")
        #End of code modification by Unnati on 28-11-2024
        #Reason-Modified social to faq
    action.allow_tags = True
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Changed column name
    # list_display=('action','description')
    list_display = ('action', 'Description')
    #End of code addition by Unnati on 28-11-2024
    #Reason-Changed column name
    #End of code additon by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    pass
# End of code addition by Unnati Bajaj on 02-06-2024
# Reason -To add FAQ

# Code added by Unnati Bajaj on 02-06-2024
# Reason -To add store locator
# Commented by jhamman on 17-10-2024
# Reason - removed this field
# @admin.register(StoreLocator)
# class StoreLocatorAdmin(admin.ModelAdmin):
#     pass
# End of commentation by jhamman on 17-10-2024
# Reason - removed this field
# End of code addition by Unnati Bajaj on 02-06-2024
# Reason -To add store locator

# Code added by Unnati Bajaj on 03-06-2024
# Reason -To add category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    # Added by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/category/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button

    # Code added by Unnati on 07-10-2024
    # Added banner field in list display
    # Modified by jhamman on 10-10-2024
    # reason - remove field banner_id because we dont have to show banner in category
    # list_display = ("id", "name", "parent_id","banner_id")

    # Added by Jhamman on 11-10-2024
    # Reason - Added new Field action
    # list_display = ("id", "name", "parent_id")
    list_display = ("action", "id", "name", "parent_id",
                    #Code added by Unnati on 01-12-2024
                    #Reason-To have is active in list display
                    "is_active")
                    #End of code addition by Unnati on 01-12-2024
                    #Reason-To have is active in list display
    # End of addition by Jhamman on 11-10-2024
    # Reason - Added new Field action

    # End of modification by jhamman on 10-10-2024
    # reason - remove field banner_id because we dont have to show banner in category
    # End of code addition Unnati on 07-10-2024
    # Added banner field in list display
    list_display_links = ("id", "name", "parent_id")
    search_fields = ["name", "id", "parent_id"]

    def save_model(self, request, obj, form, change):
        try:
            obj.save()
            # Code commented by Unnati on 14-10-2024
            # Reason-Commented notification
            # messages.success(
            #     request, 'Category "{obj.name}" was saved successfully.')
            # End of code comment by Unnati on 14-10-2024
            # Reason-Commented notification
        except ValidationError as e:
            form.add_error(None, e)
            # Added by - Ashlekh on 19-12-2024
            # Reason - To prevent default success message when there is an error
            messages.set_level(request, messages.ERROR)
            # End of code - Ashlekh on 19-12-2024
            # Reason - To prevent default success message when there is an error
            # Code changed by - Ashlekh on 16-12-2024
            # Reason - To change validation message
            # messages.error(request, 'Cannot save more than 3 categories')
            messages.error(request, 'This category is already exists.')
            # End of code - Ashlekh on 16-12-2024
            # Reason - To change validation message
    #Code added by Unnati on 01-12-2024
    #Reason-To remove delete button from category
    def has_delete_permission(self, request, obj=None):
        return False    
    #End of code addition by Unnati on 01-12-2024
    #Reason-To remove delete button from category    
# End of code additin by Unnati Bajaj on 03-06-2024
# Reason -To add category

# Code added by Unnati Bajaj on 10-06-2024
# Reason -To add policies


@admin.register(Policies)
class PoliciesAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def PrivacyPolicy(self, obj):
        return truncatechars(strip_tags(obj.privacyPolicy), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def ShippingPolicy(self, obj):
        return truncatechars(strip_tags(obj.shippingPolicy), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def ReturnPolicy(self, obj):
        return truncatechars(strip_tags(obj.returnPolicy), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def CancellationPolicy(self, obj):
        return truncatechars(strip_tags(obj.cancellationPolicy), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modication by Unnati on 28-11-2024
    #Reason-Modified column name
    # list_display=('action','privacyPolicy','shippingPolicy','returnPolicy','cancellationPolicy')
    list_display=('action','PrivacyPolicy','ShippingPolicy','ReturnPolicy','CancellationPolicy')
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified column name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/policies/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def has_add_permission(self, request):
        return not Policies.objects.exists()
# End of code by Unnati Bajaj on 10-06-2024
# Reason -To add policies

# Code added by Unnati Bajaj on 10-06-2024
# Reason -To add terms and conditions


@admin.register(TermsAndConditions)
class TermsAndConditionsAdmin(admin.ModelAdmin):
    # Code added by Unnati on 18-10-2024
    # Reason-Added fields in terms and condition
    fields = ["description"]
    # End of code addition by Unnati on 18-10-2024
    # Reason-Added fields in terms and condition
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Modified column name
    # list_display=('action','heading','description')
    list_display=('action',
                # Commented by - Ashlekh on 18-12-2024
                # Reason - To remove heading from list
                #   'heading',
                # End of comment - Ashlekh on 18-12-2024
                # Reason - To remove heading from list
                  'Description')
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified column name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/termsandconditions/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    

    pass
# End of code addition by Unnati Bajaj on 10-06-2024
# Reason -To add terms and conditions

# Code added by Unnati Bajaj on 10-06-2024
# Reason -To add about us sections
# @admin.register(AboutUsSection1)
# class Section1AboutUsAdmin(admin.ModelAdmin):
#     pass

# @admin.register(AboutUsSection2)
# class Section2AboutUsAdmin(admin.ModelAdmin):
#    pass

# @admin.register(AboutUsSection3)
# class Section3AboutUsAdmin(admin.ModelAdmin):
#    pass

# @admin.register(AboutUsSection4)
# class Section4AboutUsAdmin(admin.ModelAdmin):
#    pass
# End of code addition by Unnati Bajaj on 10-06-2024
# Reason -To add about us sections

# Code added by Unnati Bajaj on 20-06-2024
# Reason -To add Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    # Added by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/product/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    # Added by - Ashlekh on 26-11-2024
    # Reason - If product name is long then to display short name
    def name(self):
        return truncatechars(mark_safe(strip_tags(value=self.name)), 45)
    # End of code - Ashlekh on 26-11-2024
    # Reason - If product name is long then to display short name
    
    # Addition by Om Shrivastava on 05-12-2024
    # Reason : Need to remove some fields 
    def get_form(self, request, obj, **kwargs):
        form = super(ProductAdmin, self).get_form(request, obj, **kwargs)
        fields_to_hide = ['logo', 'patches', 'security_batches', 
                        #   Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        'security_id_on_back',
                        'printed_id',
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                          'embroider', 'customization_comment',
                          #Code added by Unnati on 11-12-2024
                          #Reason-To hide after customization price
                          'after_customization_product_price']
                          #End of code addition by Unnati on 11-12-2024
                          #Reason-To hide after customization price
        for field_name in fields_to_hide:
            if field_name in form.base_fields:
                field = form.base_fields[field_name]
                field.widget = field.hidden_widget()
        return form  
    # End of addition by Om Shrivastava on 05-12-2024
    # Reason : Need to remove some fields 
    ##Code added by Unnati on 13-10-2025
    ##Reason-Added condition for free size
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.is_free_size:
            form.base_fields.pop('is_free_size', None) 
            for field in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                if field in form.base_fields:
                    form.base_fields[field].initial = None  
                    form.base_fields[field].widget.attrs['disabled'] = True  
                    form.base_fields[field].widget.attrs['readonly'] = True
                    form.base_fields[field].help_text = "Stock cannot be entered for specific sizes when 'Free Size' is enabled."
        else:
            form.base_fields['is_free_size'].help_text = "Once this checkbox is selected, it cannot be reverted back."
        return form
     ##End of code addition by Unnati on 13-10-2025
    ##Reason-Added condition for free size
     ## code addition by Unnati on 16-10-2025
    ##Reason-Added condition for free size
    def save_model(self, request, obj, form, change):
        if obj.is_free_size:
            for field in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                setattr(obj, field, None)  
        super().save_model(request, obj, form, change)
    ##End of code addition by Unnati on 16-10-2025
    ##Reason-Added condition for free size
    # Code modified by Unnati on 06-10-2024
    # Reason-Added fields in lis display
    # Modified by Jhamman on 10-10-204
    # Reason - remove field is_on_sale from product
    # list_display = ("product_id", "name", "color", "sales_rate", "category", "is_active","is_on_sale","sale_percentage","banner")

    # Added by Jhamman on 11-10-2024
    # Reason - Added new Field action
    # list_display = ("product_id", "name", "color", "sales_rate", "category", "is_active","sale_percentage","banner")

    # Modified by jhamman on 23-10-2024
    # Reason - removed color from list display
    # list_display = ("action", "product_id", "name", "color", "sales_rate",
    #                 "category", "is_active", "sale_percentage", "banner")
    list_display = ("action",
                    #Code added by Unnati on 11-12-2024
                    #Reason-Added product id
                    "product_id",
                    #End of code addition by Unnati on 11-12-2024
                    #Reason-Added product id
                    # Code changed by - Ashlekh on 26-11-2024
                    # Reason - If product name is long then to display short name 
                    # "name",
                    name,
                    # Added by - Ashlekh on 18-12-2024
                    # Reason - To display color
                    "display_color",
                    # End of code - Ashlekh on 18-12-2024
                    # Reason - To display color
                    # Modification and addition by Om Shrivastava on 05-12-2024
                    # Reason : Show some fields from product table 
                    # Commented by - Ashlekh on 18-12-2024
                    # Reason - To display show_patches_and_embroider_on_UI column in last
                    # "show_patches_and_embroider_on_UI",
                    # End of comment - Ashlekh on 18-12-2024
                    # Reason - To display show_patches_and_embroider_on_UI column in last
                    # Commented by - Ashlekh on 10-12-2024
                    # Reason - To remove customization details from list
                    # "logo","patches","security_batches","embroider",
                    # End of comment - Ashlekh on 10-12-2024
                    # Reason - To remove customization details from list
                    # "after_customization_product_price",
                    # End of modification and addition by Om Shrivastava on 05-12-2024
                    # Reason : Show some fields from product table
                    # End of code - Ashlekh on 26-11-2024
                    # Reason - If product name is long then to display short name
                    "sales_rate",
                    "category", "is_active", "sale_percentage", "banner",
                    # Added by - Ashlekh on 18-12-2024
                    # Reason - To display customization details
                    "show_patches_and_embroider_on_UI",
                    # End of code - Ashlekh on 18-12-2024
                    # Reason - To display customization details
                    )
    # End of modification by jhamman on 23-10-2024
    # Reason - removed color from list display
    # End of addition by Jhamman on 11-10-2024
    # Reason - Added new Field action

    # Added by - Ashlekh on 18-12-2024
    # Reason - To display color
    def display_color(self, obj):
        color = obj.color
        if color:
            return format_html('<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #000;"></div>', color)
        return '-'
    display_color.short_description = 'Color'
    # End of code - Ashlekh on 18-12-2024
    # Reason - To display color
    # End of modification by Jhamman on 10-10-204
    # Reason - remove field is_on_sale from product
    # End of code addition by Unnati on 06-10-2024
    # Reason-Added fields in lis display
    list_per_page = 10
    pass
# End of code addition by Unnati Bajaj on 20-06-2024
# Reason -To add Product
# Code commented by Unnati Bajaj on 06-10-2024
# Reason -To add brand
# @admin.register(Brand)
# class BrandAdmin(admin.ModelAdmin):
#     pass
# End of code comment by Unnati Bajaj on 06-10-2024
# Reason -To add brand
# Code added by Unnati Bajaj on 03-07-2024
# Reason -To add Email subscription request


@admin.register(EmailSubscriptionRequest)
class EmailSubscriptionRequestAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    list_display=('action','email','is_active')
    def action(self, obj):
     #Code modified by Unnati on 28-11-2024
     #Reason-Modified url
        # return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/product/"+str(obj.id)+"/change/'>View</a>")
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/emailsubscriptionrequest/"+str(obj.id)+"/change/'>View</a>")
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified url
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 03-07-2024
# Reason -To add Email subscription request
# Code added by Unnati Bajaj on 04-07-2024
# Reason -To have add to cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    # Added by - Ashlekh on 21-11-2024
    # Reason - To display color
    def display_color(self, obj):
        color = obj.color
        if color:
            return format_html('<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #000;"></div>', color)
        return '-'
    display_color.short_description = 'Color'
    # End of code - Ashlekh on 21-11-2024
    # Reason - To display color code
    #Code added by Unnati on 23-11-2024
    #Reason-Added fields 
    fields = (
        'user', 'product', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
        'color', 'sales_rate', 
        'name', 
        # Code changed by - Ashlekh on 19-12-2024
        # Reason - To display formatted date in created_at & updated_at
        # 'created_at', 'updated_at',
        'formatted_created_at',
        'formatted_updated_at',
        # End of code - Ashlekh on 19-12-2024
        # Reason - To display formatted date in created_at & updated_at
        'xs_patches', 's_patches', 'm_patches', 'l_patches', 'xl_patches',
        'xxl_patches', 'xxxl_patches', 'xs_embroider', 's_embroider',
        'm_embroider', 'l_embroider', 'xl_embroider', 'xxl_embroider',
        'xxxl_embroider',
        # Added by - Ashish Dewangan on 30-11-2024
        # Reason - Showing more fields
        "size",
        "quantity",
        "logo",
        "logo_price",
        "patches",
        "patches_price",
        "security_batches",
        "security_batches_price",
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        "security_id_on_back",
        "security_id_on_back_price",
        "printed_id",
        "printed_id_price",
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        "embroider",
        "embroider_price",
        "after_customization_product_price",
        "customization_comment",
        # Added by - Ashish Dewangan on 30-11-2024
        # Reason - Showing more fields  
    )
    #End of code by Unnati on 23-11-2024
    #Reason-Added fields 
    # Added by jhamman on 17-10-2024
    # Reason - added field in read only
    # Code changed by - Ashlekh on 24-11-2024
    # Reason - To dynamically display readonly_fields (if patches and embroider are true then display field else non)
    # readonly_fields = [
    #     'user', 'product', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    #     'color', 'sales_rate', 'image1', 'name', 'created_at', 'updated_at',
    #     'xs_patches', 's_patches', 'm_patches', 'l_patches', 'xl_patches',
    #     'xxl_patches', 'xxxl_patches', 'xs_embroider', 's_embroider',
    #     'm_embroider', 'l_embroider', 'xl_embroider', 'xxl_embroider',
    #     'xxxl_embroider'
    # ]
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = [
            'user', 'product', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
            'color', 'sales_rate', 
            # Commented by - Ashlekh on 16-12-2024
            # Reason - To hide image field
            # 'image1', 
            # End of commment - Ashlekh on 16-12-2024
            # Reason - To hide image field
            'name',
            # Code changed by - Ashlekh on 19-12-2024
            # Reason - To display formatted date in created_at & updated_at 
            # 'created_at', 'updated_at',
            'formatted_created_at', 'formatted_updated_at',
            # End of code - Ashlekh on 19-12-2024
            # Reason - To display formatted date in created_at & updated_at
            # Addition by Om Shrivastava on 01-12-2024
            # Reason : Add some fields 
            "size",
            "quantity",
            "logo",
            "logo_price",
            "patches",
            "patches_price",
            "security_batches",
            "security_batches_price",
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            "security_id_on_back",
            "printed_id",
            "security_id_on_back_price",
            "printed_id_price",
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            "embroider",
            "embroider_price",
            "after_customization_product_price",
            "customization_comment",
            # End of addition by Om Shrivastava on 01-12-2024
            # Reason : Add some fields 
        ]

        if obj:
            for field in [
                'xs_patches', 's_patches', 'm_patches', 'l_patches', 'xl_patches',
                'xxl_patches', 'xxxl_patches', 'xs_embroider', 's_embroider',
                'm_embroider', 'l_embroider', 'xl_embroider', 'xxl_embroider',
                'xxxl_embroider',
            ]:
                if getattr(obj, field):
                    readonly_fields.append(field)

        return readonly_fields

    def get_fields(self, request, obj=None):
        fields = [
            'user', 'product',
            # Modification and addition by Om Shrivastava on 05-12-2024
            # Reason : Remove the all size fields 
            #   'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
             "size",
            "quantity",
            # End of modification and addition by Om Shrivastava on 05-12-2024
            # Reason : Remove the all size fields 
            'color', 'sales_rate', 
            # Commented by - Ashlekh on 16-12-2024
            # Reason - To hide image field
            # 'image1', 
            # End of code - Ashlekh on 16-12-2024
            # Reason - To hide image field
            'name',
            # Code changed by - Ashlekh on 19-12-2024
            # Reason - To display formatted date in created_at & updated_at 
            # 'created_at', 'updated_at',
            'formatted_created_at', 'formatted_updated_at',
            # End of code - Ashlekh on 19-12-2024
            # Reason - To display formatted date in created_at & updated_at
            # Added by - Ashish Dewangan on 30-11-2024
            # Reason - Showing more fields
            "logo",
            "logo_price",
            "patches",
            "patches_price",
            "security_batches",
            "security_batches_price",
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            "security_id_on_back",
            "security_id_on_back_price",
            "printed_id",
            "printed_id_price",
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            "embroider",
            "embroider_price",
            "after_customization_product_price",
            "customization_comment",
            # Added by - Ashish Dewangan on 30-11-2024
            # Reason - Showing more fields
        ]

        if obj:
            for field in [
                'xs_patches', 's_patches', 'm_patches', 'l_patches', 'xl_patches',
                'xxl_patches', 'xxxl_patches', 'xs_embroider', 's_embroider',
                'm_embroider', 'l_embroider', 'xl_embroider', 'xxl_embroider',
                'xxxl_embroider',
            ]:
                if getattr(obj, field):
                    fields.append(field)

        return fields
    # End of code - Ashlekh on 24-11-2024
    # Reason - To dynamically display readonly_fields (if patches and embroider are true then display field else non)
    # End of addition by jhamman on 17-10-2024
    # Reason - added field in read only
    # Added by - Ashlekh on 19-12-2024
    # Reason - To display formatted date in created_at & updated_at
    def formatted_created_at(self, obj):
        if obj.created_at:
            return localtime(obj.created_at).strftime('%Y-%m-%d %I:%M %p')
        return "-"
    formatted_created_at.short_description = "Created at"

    def formatted_updated_at(self, obj):
        if obj.updated_at:
            return localtime(obj.updated_at).strftime('%Y-%m-%d %I:%M %p')
        return "-"
    formatted_updated_at.short_description = "Updated at"
    # End of code - Ashlekh on 19-12-2024
    # Reason - To display formatted date in created_at & updated_at
    # Added by - Ashlekh on 28-11-2024
    # Reason - To display short name for product field
    def product(self):
        return truncatechars(mark_safe(strip_tags(value=self.product)), 50)
    product.short_description = "Product Name"
    # End of code - Ashlekh on 28-11-2024
    # Reason - To display short name for product field
    # Code added by Unnati on 18-10-2024
    # Reason-Added list display and view button
    list_display = ('action',"size","quantity",'user',
                    # Code changed by - Ashlekh on 28-11-2024
                    # Reason - To display short product name 
                    # 'product', 
                    product,
                    # End of code - Ashlekh on 28-11-2024
                    # Reason - To display short product name
                    # Code commented by - Ashlekh on 21-11-2024
                    # Reason - To hide color (here color code is displayed)
                    # 'color', 
                    # End of code - Ashlekh on 21-11-2024
                    # Reason - To hide color (here color code is displayed)
                    'sales_rate',
                    # Code commented by - Ashlekh on 28-11-2024
                    # Reason - To hide name from list
                    # 'name',
                    # End of code - Ashlekh on 28-11-2024
                    # Reason - To hide name from list
                    # Modification and addition by Om Shrivastava on 05-12-2024
                    # Reason : Show some fields from cart table 
                    "logo","patches","security_batches",
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    "security_id_on_back",
                    "security_id_on_back_price",
                    "printed_id",
                    "printed_id_price",
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    "embroider",
                    # "after_customization_product_price",
                    # 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
                    # End of modification and addition by Om Shrivastava on 05-12-2024
                    # Reason : Show some fields from cart table
                    # Added by - Ashlekh on 21-11-2024
                    # Reason - To display color
                    'display_color'
                    # End of code - Ashlekh on 21-11-2024
                    # Reason - To display color
                    )

    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/cart/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by Unnati on 18-10-2024
    # Reason-Added list display and view button
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 04-07-2024
# Reason -To have add to cart
# Code added by Unnati Bajaj on 15-07-2024
# Reason -To have Return and Exchange


@admin.register(ReturnsAndExchanges)
class ReturnsAndExchangesAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Modified column name
    # list_display=('action','description')
    list_display=('action','Description')
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified column name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/returnsandexchanges/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def has_add_permission(self, request):
        return not ReturnsAndExchanges.objects.exists()
# End of code addition by Unnati Bajaj on 15-07-2024
# Reason -To have Return and Exchange
# Code added by Unnati Bajaj on 17-07-2024
# Reason -To have About Us


@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Modified Column name
    # list_display=('action','description')
    list_display=('action','Description')
    #End of code modificaction by Unnati on 28-11-2024
    #Reason-Modified Column name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/aboutus/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def has_add_permission(self, request):
        return not AboutUs.objects.exists()

# End of code addition by Unnati Bajaj on 17-07-2024
# Reason -To have About Us
# Code added by Unnati Bajaj on 21-07-2024
# Reason -To have Shipping details


@admin.register(UserAddressDetails)
class UserAddressDetailsAdmin(admin.ModelAdmin):
    # Added by - Unnati on 18-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/useraddressdetails/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    list_display = ("action", "first_name", "last_name",
                    "address", "zipcode", "contact_number", "is_primary")
    # End of code addition by - Unnati on 18-10-2024
    # Reason - Added view button

    pass
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have Shipping details

# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have discount


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/discount/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    list_display =('action','discount_code','discount_amount','is_active')
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    pass
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have discount
# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have payment details

# Commented by - Ashlekh on 05-12-2024
# Reason - To hide payment details 
# @admin.register(PaymentDetails)
# class PaymentDetailsAdmin(admin.ModelAdmin):
#     pass
# End of code - Ashlekh on 05-12-2024
# Reason - To hide payment details
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have payment details
# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have order summary

# Added by - jhamman on 17-10-2024
# Reason - Added Shipping address inline*/


class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    readonly_fields = (
        "user",
        "first_name",
        "last_name",
        #Code commented by Unnati on 24-11-2024 
        #Reason-Since it is removed from billing address
        # "company",
        #End of code commented by Unnati on 24-11-2024 
        #Reason-Since it is removed from billing address
        "address",
        "city",
        "country",
        "state",
        "zipcode",
        "contact_number",
    )
    #Code added by Unnati on 01-12-2024
    #Reason-To hide company
    exclude = ['company'] 
    #End of code addition by Unnati on 01-12-2024
    #Reason-To hide company
    can_delete = False
    max_num = 0
    extra = 0
    ##Code modified by Unnati o 22-01-2025
    ##Reason-Modified name
    # verbose_name = "Shipping Address"
    verbose_name = "Section" 
    verbose_name_plural = ""
    ##End of code addition by Unnati o 22-01-2025
    ##Reason-Modified name
# End of addition by - jhamman on 17-10-2024
# Reason - Added Shipping address inline*/

# Added by - jhamman on 17-10-2024
# Reason - Added Billing address inline*/


class BillingAddressInline(admin.StackedInline):
    model = BillingAddress
    readonly_fields = (
        "user",
        "first_name",
        "last_name",
        #Code commented by Unnati on 24-11-2024 
        #Reason-Since it is removed from billing address
        # "company",
        #End of code commented by Unnati on 24-11-2024 
        #Reason-Since it is removed from billing address
        "address",
        "city",
        "country",
        "state",
        "zipcode",
        "contact_number",
    )
    #Code added by Unnati on 01-12-2024
    #Reason-To hide company
    exclude = ['company'] 
    #End of code addition by Unnati on 01-12-2024
    #Reason-To hide company 
    can_delete = False
    max_num = 0
    extra = 0
    ##Code modified by Unnati o 22-01-2025
    ##Reason-Modified name
    verbose_name = "Section" 
    verbose_name_plural = ""
    ##End of code addition by Unnati o 22-01-2025
    ##Reason-Modified name
# End of addition by - jhamman on 17-10-2024
# Reason - Added Billing address inline*/


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Code added by Unnati on 15-11-2024
    # Reason-Added list per page and search fields
    list_filter=["payment_status","order_date",
                 # Code added by Unnati on 17-11-2024
                 # Reason-Added order status
                 # Commented by - Ashish Dewangan on 23-11-2024
                 # Reason - this filed is not required
                 #  "order_status"
                 # End of comment by - Ashish Dewangan on 23-11-2024
                 # Reason - this filed is not required
                 ]
                 # End of code addition by Unnati on 17-11-2024
                 # Reason-Added order status
    list_per_page = 10
    search_fields=["email","order_id"]
    # End of code addition by Unnati on 15-11-2024
    # Reason-Added list per page and search fields
    # Added by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/order/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button

    # Code added by Unnati on 18-09-2024
    # Reason-To make fields readonly and display it in list format and order sort accoridng to order id
    readonly_fields = [
        'order_id', 'user', 'subtotal', 'is_discount_applied', 'discount_code',
        'discount_amount', 'total_amount', 'shipping_amount', 'taxable_amount',
        'tax_percentage', 'tax_amount', 'grand_total', 'shipping_status', 'date',
        # Added by - Ashlekh on 16-10-2024
        # Reason - To display paypal_order_id & paypal_access_token
        'paypal_order_id', 'paypal_access_token',
        # End of code - Ashlekh on 16-10-2024
        # Reason - To display paypal_order_id & paypal_access_token
        # Code added by Unnati on 18-11-2024
        # Reason-To have ordered_at in readyonly 
        'order_date',
        # End of code addition by Unnati on 18-11-2024
        # Reason-To have ordered_at in readyonly

        # Added by - Ashish Dewangan on 27-11-2024
        # Reason - To make stripe_session_id read only
        "stripe_session_id",
        # End of addition by - Ashish Dewangan on 27-11-2024
        # Reason - To make stripe_session_id read only
    ]
    fields = (
        'order_id', 'user', 'subtotal', 'is_discount_applied', 'discount_code',
        'discount_amount', 'total_amount', 'shipping_amount', 'taxable_amount',
        'tax_percentage', 'tax_amount', 'grand_total', 'shipping_status',
        'date',
        # Added by Unnati on 07-11-2024
        # Reason-Added order_date
        'order_date',
        # End of code addition by Unnati on 07-11-2024
        # Reason-Added order_date
        # Commented by - Ashish Dewangan on 23-11-2024
        # Reason - this filed is not required
        # 'order_status',
        # End of comment by - Ashish Dewangan on 23-11-2024
        # Reason - this filed is not required
          'payment_status',
        # Added by - Ashlekh on 16-10-2024
        # Reason - To display paypal_order_id & paypal_access_token
        'paypal_order_id', 'paypal_access_token',
        # End of code - Ashlekh on 16-10-2024
        # Reason - To display paypal_order_id & paypal_access_token
        # Added by - Ashlekh on 25-10-2024
        # Reason - To display tracking id & tracking link
        'tracking_id', 'tracking_link',
        # End of code - Ashlekh on 25-10-2024
        # Reason - To display tracking id & link

        # Added by - Ashish Dewangan on 27-11-2024
        # Reason - To show stripe_session_id in admin panel
        "stripe_session_id",
        # End of addition by - Ashish Dewangan on 27-11-2024
        # Reason - To show stripe_session_id in admin panel
    )

    # Modified by Jhamman on 11-10-2024
    # Reason - Added new Field action
    # list_display = (
    #     'order_id', 'user', 'grand_total', 'date', 'order_status', 'payment_status'
    # )
    list_display = (
        "action", 'order_id', 'user', 'grand_total',
        #Code modified by Unnati on 16-11-2024
        #Reason-Added order_date 
        #   'date', 
        # Code changed by - Ashlekh on 15-01-2025
        # Reason - To show formatted date
        # 'order_date',
        'get_formatted_date',
        # End of code - Ashlekh on 15-01-2025
        # Reason - To show formatted date
        #End of code modification by Unnati on 16-11-2024
        #Reason-Added order_date 
        # Commented by - Ashish Dewangan on 23-11-2024
        # Reason - this filed is not required
        # 'order_status',
        # End of comment by - Ashish Dewangan on 23-11-2024
        # Reason - this filed is not required
            'payment_status',
    )
    # End of modification by Jhamman on 11-10-2024
    # Reason - Added new Field action

    # Addition by - jhamman on 17-10-2024
    # Reason - Added Shipping address inline*/
    inlines = [BillingAddressInline, ShippingAddressInline]
    # End of addition by - jhamman on 17-10-2024
    # Reason - Added Shipping address inline*/

    list_per_page = 10

    # Commented by jhamman on 16-10-2024
    # Reason - want to show newly added data in the top of the list
    # ordering = ('-date', 'order_id')
    sortable_by = ('order_id',)
    # End of commentation by jhamman on 16-10-2024
    # Reason - want to show newly added data in the top of the list

    # Added by - Ashlekh on 15-01-2025
    # Reason - To show formatted date
    def get_formatted_date(self, obj):
        return obj.order_date.strftime('%m-%d-%Y') if obj.order_date else ""
    get_formatted_date.short_description = 'Order Date'
    # End of code - Ashlekh on 15-01-2025
    # Reason - To show formatted date
    def has_add_permission(self, request):
        return not Order.objects.exists()
    # End of code addition by Unnati on 18-09-2024
    # Reason-To make fields readonly and display it in list format and order sort accoridng to order id
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have order summary

# Added by - Ashlekh on 14-12-2024
# Reason - To restrict user (can only add today & future dates)
class OrderItemAdminForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()
        today = now().date()

        date_fields = [
            'shipping_date', 
            'delivery_date', 
            'return_initiated_date', 
            'return_pickup_date', 
            'return_date',
            'refund_date',
            'exchange_initiated_date',
            'exchange_pickup_date',
            'exchange_shipping_date',
            'exchange_delivery_date',
        ]

        for field in date_fields:
            if field in cleaned_data and cleaned_data[field]:
                field_date = cleaned_data[field].date()
                print(f"Validating field: {field} with value: {field_date}")
                if field_date < today:
                    raise ValidationError(
                        {field: f"{field.replace('_', ' ').capitalize()} cannot be in the past."}
                    )
        return cleaned_data
# End of code - Ashlekh on 14-12-2024
# Reason - To restrict user (can only add today & future dates)
# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have order item


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    # Added by - Ashlekh on 17-01-2025
    # Reason - To add $ in price
    def formatted_logo_price(self, obj):
        return f"${obj.logo_price:.2f}" if obj.logo_price else ""
    formatted_logo_price.short_description = "Logo Price"
    def formatted_patches_price(self, obj):
        return f"${obj.patches_price:.2f}" if obj.patches_price else ""
    formatted_patches_price.short_description = "Patches Price"
    def formatted_security_batches_price(self, obj):
        return f"${obj.security_batches_price:.2f}" if obj.security_batches_price else ""
    formatted_security_batches_price.short_description = "Security Batches Price"
    def formatted_embroider_price(self, obj):
        return f"${obj.embroider_price:.2f}" if obj.embroider_price else ""
    formatted_embroider_price.short_description = "Embroider Price"
    # Added by - Ashlekh on 06-03-2025
    # Reason - To format customization price
    def formatted_security_id_on_back_price(self, obj):
        return f"${obj.security_id_on_back_price:.2f}" if obj.security_id_on_back_price else ""
    formatted_security_id_on_back_price.short_description = "Security Id On Back Price"
    def formatted_printed_id_price(self, obj):
        return f"${obj.printed_id_price:.2f}" if obj.printed_id_price else ""
    formatted_printed_id_price.short_description = "Printed Id Price"
    # End of code - Ashlekh on 06-03-2025
    # Reason - To format customization price
    def formatted_amount(self, obj):
        return f"${obj.amount:.2f}" if obj.amount else ""
    formatted_amount.short_description = "Amount"
    def formatted_after_customization_product_price(self, obj):
        return f"${obj.after_customization_product_price:.2f}" if obj.after_customization_product_price else ""
    formatted_after_customization_product_price.short_description = "After Customization Product Price"
    # End of code - Ashlekh on 17-01-2025
    # Reason - To add $ in price
    # Added by - Ashlekh on 14-12-2024
    # Reason - To add custom form (Used to prevent adding previous dates)
    # Commented by - Ashlekh on 19-12-2024
    # Reason - Currently admin can update previous dates
    # form = OrderItemAdminForm
    # End of comment - Ashlekh on 19-12-2024
    # Reason - Currently admin can update previous dates
    # End of code - Ashlekh on 14-12-2024
    # Reason - To add custom form (Used to prevent adding previous dates)
    # Added by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/orderitem/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by - Jhamman lal sahu on 11-10-2024
    # Reason - Added view button

    # Code added by Unnati on 11-09-2024
    # Reason-To have readonly fields
    readonly_fields = (
          
        'order',
        'product',
        'size',
        'quantity',
        # Code commented by Unnati on 30-10-2024
        # Reason-To hide color from admin
        # 'color',
        # End of code comment by Unnati on 30-10-2024
        # Reason-To hide color from admin
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in logo price
        # 'amount',
        'get_user',
        'formatted_amount',
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in logo price
        # Commented by - Ashlekh on 14-12-2024
        # Reason - To hide has patch & has embroidery field
        # 'has_patch',
        # 'has_embroidery',
        # End of comment - Ashlekh on 14-12-2024
        # Reason - To hide has patch & has embroidery field
        # Code added by Unnati on 18-11-2024
        # Reason-To have ordered_at in readyonly 
        # Code changed by - Ashlekh on 19-12-2024
        # Reason - To display formatted date of ordered_at
        # 'ordered_at',
        "formatted_ordered_at",
        # End of code - Ashlekh on 19-12-2024
        # Reason - To display formatted date of ordered_at
        # End of code addition by Unnati on 18-11-2024
        # Reason-To have ordered_at in readyonly
        # Added by - Ashlekh on 21-11-2024
        # Reason - To display color
        'display_color',
        # End of code - Ashlekh on 21-11-2024
        # Reason - To display color

        # Added by - Ashish Dewangan on 25-11-2024
        # Reason - To make these fields readonly
        "credit_note_number",
        "return_authorization_no",
        # End of addition by - Ashish Dewangan on 25-11-2024
        # Reason - To make these fields readonly
        "show_patches_and_embroider_on_UI",
        # Added by - Unnati on 04-12-2024
        # Reason - To make invoice number readonly
        # "invoice_number",
        # End of code addition by - Unnati on 04-12-2024
        # Reason - To make invoice number readonly
        # Addition by Om Shrivastava on 05-12-2024
        # Reason : Add some fields 
        "logo",
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in logo price
        # "logo_price",
        "formatted_logo_price",
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in logo price
        "patches",
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # "patches_price",
        "formatted_patches_price",
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        "security_batches",
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        # "security_id_on_back",
        # "printed_id",
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # "security_batches_price",
        "formatted_security_batches_price",
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # Added by - Ashlekh on 06-03-2025
        # Reason - To add customization
        "security_id_on_back",
        "formatted_security_id_on_back_price",
        "printed_id",
        "formatted_printed_id_price",
        # End of code - Ashlekh on 06-03-2025
        # Reason - To add customization
        "embroider",
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # "embroider_price",
        "formatted_embroider_price",
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # Added by - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        # "after_customization_product_price",
        "formatted_after_customization_product_price",
        # End of code - Ashlekh on 17-01-2025
        # Reason - To add $ in price
        "customization_comment",
        # End of addition by Om Shrivastava on 05-12-2024
        # Reason : Add some fields 
    )
    # Code added by Unnati on 26-10-2024
    # Reason-To hide item status field

    fields = (
              ##Code added by Unnati on 19-01-2025
              ##Reason-Added user 
              'get_user',
               ##End of code addition by Unnati on 19-01-2025
              ##Reason-Added user 
              'order',
              'product',
              'size',
              'quantity',
              
              # Code commented by Unnati on 30-10-2024
              # Reason-To hide color from admin
              #   'color',
              # End of code comment by Unnati on 30-10-2024
              # Reason-To hide color from admin
              #Code commented by Unnati on 24-12-2024
              #Reason-To hide amount
            #   'amount',
            #End of code commented by Unnati on 24-12-2024
              #Reason-To hide amount
            #   Commented by - Ashlekh on 14-12-2024
            #   Reason - To hide has patch & has embroidery field
            #   'has_patch',
            #   'has_embroidery',
            # End of comment - Ashlekh on 14-12-2024
            # Reason - To hide has patch & has embroidery field
              # Code added by Unnati on 06-11-2024
              # Reason-Added cancelled at and restocking fee
              'cancelled_at',
               # Code added by Unnati on 11-11-2024
              # Reason-Added cancelled by
              'cancelled_by',
              # End of code addition by Unnati on 11-11-2024
              # Reason-Added cancelled by
              # Code added by Unnati on 10-11-2024
              # Reason-Added cancel_reason
              'cancel_reason',
              # End of code addition by Unnati on 10-11-2024
              # Reason-Added cancel_reason
            #   'restocking_fee',
              'item_status',
            # Code changed by - Ashlekh on 19-12-2024
            # Reason - To display formatted date of ordered_at
            # Added by - Ashish Dewangan on 24-11-2024
            # Reaspn - To show more fields in admin form
            "shipping_date",
            "delivery_date",
            # Commented by - Ashlekh on 17-01-2025
            # Reason - To change position of return date (to display it with return reason)
            #   'ordered_at',
            "formatted_ordered_at",
            # End of code - Ashlekh on 19-12-2024
            # Reason - To display formatted date of ordered_at
              # End of code addition by Unnati on 06-11-2024
              # Reason-Added cancelled at and restocking fee
              # Code added by Unnati on 18-11-2024
              # Reason-Added credit note number
              'credit_note_number',
              # End of code addition by Unnati on 18-11-2024
              # Reason-Added credit note number
              # Added by - Ashlekh on 21-11-2024
              # Reason - To display color
              'display_color',
              # End of code - Ashlekh on 21-11-2024
              # Reason - To display color
              # Added by - Ashish Dewangan on 30-11-2024
            # Reason - Showing more fields 
            # Modification and addition by Om Shrivastava on 05-12-2024
            # Reason : Show some fields  
            
            
            "customization_comment", 
            # "ordered_at",
                                                                                          
            # End of modification and addition by Om Shrivastava on 05-12-2024
            # Reason : Show some fields  
            # End of addition by - Ashish Dewangan on 30-11-2024
            # Reason - Showing more fields

            
            # "return_date",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To change position of return date (to display it with return reason)

            
            
           
            "returned_by",
            "return_initiated_date",
            "return_pickup_date",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add return date (display it with return reason)
            "return_date",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add return date (display it with return reason)
            "return_reason",
            "return_approval_reason",
            "return_rejection_reason",
            "returned_item_image1",
            "returned_item_image2",
            "return_authorization_no",
            'restocking_fee',
            "refund_transaction_id",
            "tracking_id",
            "refund_amount",
            "refund_date",
            # End of addition by - Ashish Dewangan on 24-11-2024
            # Reaspn - To show more fields in admin form
            # "exchange_reason",
            # "exchange_id",
            # Added by - Ashish Dewangan on 25-11-2024
            # Reason - to show courier_service_provider_name
            "courier_service_provider_name",
            # End of addition by - Ashish Dewangan on 25-11-2024
            # Reason - to show courier_service_provider_name
            "sales_rate",
            "sale_percentage",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "amount",
            "formatted_amount",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
             "logo",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "logo_price",
            "formatted_logo_price",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            "patches",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "patches_price",
            "formatted_patches_price",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            "security_batches",
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            # "security_id_on_back",
            # "printed_id",
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "security_batches_price",
            "formatted_security_batches_price",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            "embroider",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "embroider_price",
            "formatted_embroider_price",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # Added by - Ashlekh on 06-03-2025
            # Reason - To show customization
            "security_id_on_back",
            "formatted_security_id_on_back_price",
            "printed_id",
            "formatted_printed_id_price",
            # End of code - Ashlekh on 06-03-2025
            # Reason - To show customization
            "customization_price",
            # Added by - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            # "after_customization_product_price",
            "formatted_after_customization_product_price",
            # End of code - Ashlekh on 17-01-2025
            # Reason - To add $ in price
            "subtotal",
            "tax_percentage",
            "total_amount",
            "invoice_id",
            "type",
            "to_pay",
            "parent_id",
            "paypal_order_id",
            "paypal_access_token",
            "stripe_session_id",
            "payment_status",
            "exchange_initiated_date",
            "exchange_pickup_date",
            "exchange_shipping_date",
            "exchange_delivery_date",
            ##Code added by Unnati on 28-12-2024
            ##Reason-Added exchange item image1
            "exchanged_item_image1",
            "exchanged_item_image2",
            ##End of code addition by Unnati on 28-12-2024
            ##Reason-Added exchange item image1
            ##Code added by Unnati on 28-12-2024
            ##Reason-Added exchange reason
            "exchange_reason"
            ##End of code addition by Unnati on 28-12-2024
            ##Reason-Added exchange reason
              )
    # End of code addition by Unnati on 26-10-2024
    # Reason-To hide item status field
    # Added by - Ashlekh on 19-12-2024
    # Reason - To change date format of ordered_at
    def formatted_ordered_at(self, obj):
        if obj.ordered_at:
            return localtime(obj.ordered_at).strftime('%Y-%m-%d %I:%M %p')
        return "-"
    formatted_ordered_at.short_description = "Ordered At"
    # End of code - Ashlekh on 19-12-2024
    # Reason - To change date format of ordered_at
    # Code added by Unnati on 18-09-2024
    # Reason-To display order item in list format,added pagination and filteration

    def order_id(self, obj):
        return obj.order.id if obj.order else None
    order_id.short_description = 'Order ID'
    # Added by - Ashlekh on 21-11-2024
    # Reason - To display color
    def display_color(self, obj):
        color = obj.color
        if color:
            return format_html('<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #000;"></div>', color)
        return '-'
    display_color.short_description = 'Color'
    # End of code - Ashlekh on 21-11-2024
    # Reason - To display color 
    # Modified by Jhamman on 11-10-2024
    # Reason - Added new Field action
    # list_display = (
    #     'order',
    #     'product',
    #     'size',
    #     'quantity',
    #     'amount',
    #     'item_status',
    # )
    list_display = (
        'action',
        ##Code added by Unnati on 19-01-2025
          ##Reason-Added use
        'get_user',
        ##End of code addition by Unnati on 19-01-2025
        ##Reason-Added use
        'order',
        'product',
        'size',
        'quantity',
        # Code changed by - Ashlekh on 11-12-2024
        # Reason - To show amount with currency
        # 'amount',
        'amount_with_currency',
        # End of code - Ashlekh on 11-12-2024
        # Reason - To show amount with currency
        # Code added by Unnati on 08-11-2024
        # Reason-Not in use currently
        'item_status',
        # End of code addition by Unnati on 08-11-2024
        # Reason-Not in use currently
        # Added by - Ashlekh on 21-11-2024
        # Reason - To display color of order item
        'display_color',
        # End of code - Ashlekh on 21-11-2024
        # Reason - To display color of order item
        # Modification and addition by Om Shrivastava on 05-12-2024
        # Reason : Show some fields from order item table 
        "logo","patches","security_batches",
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        "security_id_on_back",
        "printed_id",
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        "embroider",
        # "after_customization_product_price",
        # "show_patches_and_embroider_on_UI",
        # 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
        # End of modification and addition by Om Shrivastava on 05-12-2024
        # Reason : Show some fields from order item table
        # Added by - Ashlekh on 15-01-2025
        # Reason - To display ordered_at
        "get_formatted_order_at_date",
        # End of code - Ashlekh on 15-01-2025
        # Reason - To display ordered_at
    )
    # End of modification by Jhamman on 11-10-2024
    # Reason - Added new Field action
    # Added by - Ashlekh on 11-12-2024
    # Reason - To apply filter
    list_filter=["item_status",]
    # End of code - Ashlekh on 11-12-2024
    # Reason - To apply filter
    ##Code added by Unnati on 19-01-2025
    ##Reason-Added user
    def get_user(self, obj):
     if obj.order and obj.order.user:
        return obj.order.user.username 
     return "No User"
    get_user.short_description ="User"
    ##End of code addition by Unnati on 19-01-2025
    ##Reason-Added user
    # Added by - Ashlekh on 11-12-2024
    # Reason - To show amount with currency
    def amount_with_currency(self, obj):
        return format_html(f"${obj.amount}")
    amount_with_currency.short_description = "Amount"
    # End of code - Ashlekh on 11-12-2024
    # Reason - To show amount with currency
    list_per_page = 10
    
    # Modification by jhamman on 16-10-2024
    # Reason - want to show newly added data in the top of the list
    # ordering = ('order',)
    sortable_by = ('order',
                #    Added by - Ashlekh on 11-12-2024
                #    Reason - To add sort
                   'item_status',
                   'logo',
                   'patches',
                   'security_batches',
                #    Added by - Ashlekh on 19-02-2025
                #     Reason - To add customization
                    'security_id_on_back',
                    'printed_id',
                #     End of code - Ashlekh on 19-02-2025
                #     Reason - To add customization
                   'embroider',
                   # End of code - Ashlekh on 11-12-2024
                   # Reason - To add sort
                   )
    # End of modification by jhamman on 16-10-2024
    # Reason - want to show newly added data in the top of the list
    # Code commented by Unnati on 30-09-2024
    # Reason-To remove filter from order item table
    # list_filter = (
    #     'order',
    #     'product',
    #     'size',
    #     'item_status',
    # )
    # End of code comment by Unnati on 30-09-2024
    # Reason-To remove filter from order item table

    # Added by - Ashlekh on 15-01-2025
    # Reason - To change format of date
    def get_formatted_order_at_date(self, obj):
        return obj.ordered_at.strftime('%m-%d-%Y') if obj.ordered_at else ""
    get_formatted_order_at_date.short_description = 'Order At'
    # End of code - Ashlekh on 15-01-2025
    # Reason - To change format of date

    def has_add_permission(self, request):
        return not OrderItem.objects.exists()
    # End of code addition by Unnati on 18-09-2024
    # Reason-To display order item in list format,added pagination and filteration
    # End of code addition by Unnati on 11-09-2024
    # Reason-To have readonly fields
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have order item
##Code added by Unnati on 10-01-2025
##Reason-Added condition to show payment status field
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if obj and not obj.to_pay:
            fields = [field for field in fields if field != "payment_status"]
        return fields
##End of code addition by Unnati on 10-01-2025
##Reason-Added condition to show payment status field    
# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have shipping address


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    # Code added by Unnati on 21-10-2024
    # Reason-To remove company from admin
    fields = ('order', 'user', 'first_name', 'last_name',
              'address', 'city', 'country', 'state', 'zipcode', 'contact_number')
    # End of code addition by Unnati on 21-10-2024
    # Reason-To remove company from admin
    readonly_fields = ['order', 'user', 'first_name', 'last_name',
                    #Code commented by Unnati on 01-12-2024
                    #Reason-To hide company 
                    #    'company', 
                    #End of code comment by Unnati on 01-12-2024
                    #Reason-To hide company 
                       'address', 'city', 'country', 'state', 'zipcode', 'contact_number']

    # Code added by Unnati on 18-10-2024
    # Reason-Added list display and view button
    list_display = ('action', 'order', 'user', 'first_name', 'address',
                    'city', 'country', 'state', 'zipcode', 'contact_number')

    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/shippingaddress/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by Unnati on 18-10-2024
    # Reason-Added list display and view button
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have shipping address
# Code added by Unnati Bajaj on 24-07-2024
# Reason -To have billing address


@admin.register(BillingAddress)
class BillingAdmin(admin.ModelAdmin):
    # Code added by Unnati on 21-10-2024
    # Reason-To remove company from admin
    fields = ('order', 'user', 'first_name', 'last_name',
              'address', 'city', 'country', 'state', 'zipcode', 'contact_number')
    # End of code addition by Unnati on 21-10-2024
    # Reason-To remove company from admin
    # Added by jhamman on 19-10-2024
    # Adding all fields to readonly_fields
    readonly_fields = (
        'order', 'user', 'first_name', 'last_name',
        #Code commented by Unnati on 01-12-2024
        #Reason-To hide company 
        #    'company', 
        #End of code comment by Unnati on 01-12-2024
        #Reason-To hide company 
         'address', 'city',
        'country', 'state', 'zipcode', 'contact_number', 'order_date'
    )
    # End of addition by jhamman on 19-10-2024
    # Adding all fields to readonly_fields

    # Added by jhamman on 19-10-2024
    # Reason - Adding field to list display
    #Code added by Unnati on 24-11-2024
    #Reason-Added action button
    list_display = [
        'action','order', 'user',
        # Code changed by - Ashlekh on 15-01-2025
        # Reason - To change format of date 
        # 'order_date'
        'get_formatted_order_date',
        # End of code - Ashlekh on 15-01-2025
        # Reason - To change format of date
    ]
    #End of code addition by Unnati on 24-11-2024
    #Reason-Added action button
    # End of addition by jhamman on 19-10-2024
    # Reason - Adding field to list display
    # pass

    # Code added by Unnati on 18-10-2024
    # Reason-Added list display and view button
    # COmmented by jhamman on 20-10-2024
    # Reason - added diff list display
    # list_display = ('action', 'order', 'first_name', 'address',
    #                 'city', 'country', 'state', 'zipcode', 'contact_number')
    # End of commentation by jhamman on 20-10-2024
    # Reason - added diff list display

    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/billingaddress/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    # End of code addition by Unnati on 18-10-2024
    # Reason-Added list display and view button

    # Added by - Ashlekh on 15-01-2025
    # Reason - To change format of date
    def get_formatted_order_date(self, obj):
        return obj.order_date.strftime('%m-%d-%Y') if obj.order_date else ""
    get_formatted_order_date.short_description = 'Order Date'
    # End of code - Ashlekh on 15-01-2025
    # Reason - To change format of date

    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 21-07-2024
# Reason -To have billing address
# Code added by Unnati Bajaj on 04-08-2024
# Reason -To have company information

# Commented by jhamman on 18-10-2024
# Reason - Dont want to show CompanyInfo
# @admin.register(CompanyInfo)
# class CompanyInfoAdmin(admin.ModelAdmin):
#     pass
# End of commentation by jhamman on 18-10-2024
# Reason - Dont want to show CompanyInfo

# End of code addition by Unnati Bajaj on 04-08-2024
# Reason -To have company information
# Code added by Unnati Bajaj on 05-08-2024
# Reason -To have home


# @admin.register(HomeBanner)
# class HomeBannerAdmin(admin.ModelAdmin):
#     # Code added by Unnati on 18-10-2024
#     # Reason-Added list display and view button
#     list_display = ('action', 'name', 'banner_image',
#                     'offer_percentage', 'banner_options')

#     def action(self, obj):
#         return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/homebanner/"+str(obj.id)+"/change/'>View</a>")
#     action.allow_tags = True
#     # End of code addition by Unnati on 18-10-2024
#     # Reason-Added list display and view button
#     pass
# # End of code addition by Unnati Bajaj on 05-08-2024
# # Reason -To have home
# # Code added by Unnati Bajaj on 11-08-2024
# # Reason -To have Shipping



# @admin.register(HomeBanner)
# class HomeBannerAdmin(admin.ModelAdmin):
#     # Code added by Unnati on 18-10-2024
#     # Reason-Added list display and view button
#     list_display = ('action', 'name', 'banner_image',
#                     'offer_percentage', 'banner_options')

#     def action(self, obj):
#         return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/homebanner/"+str(obj.id)+"/change/'>View</a>")
#     action.allow_tags = True
#     # End of code addition by Unnati on 18-10-2024
#     # Reason-Added list display and view button
#     pass
# # End of code addition by Unnati Bajaj on 05-08-2024
# # Reason -To have home
# # Code added by Unnati Bajaj on 11-08-2024
# # Reason -To have Shipping

@admin.register(Banner)
class HomeBannerAdmin(admin.ModelAdmin):
    list_display = ('action', 'name', 'banner_image',
                    )

    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/banner/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    pass


@admin.register(Shipping)
class ShippingAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Modified column name
    # list_display=('action','description')
    list_display=('action','Description')
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified column name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/shipping/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def has_add_permission(self, request):
        return not Shipping.objects.exists()
    pass
# End of code addition by Unnati Bajaj on 11-08-2024
# Reason -To have Shipping

# Code added by Unnati Bajaj on 16-08-2024
# Reason -To have big and tall inquiry


@admin.register(BigAndTallInquiry)
class BigAndTallInquiryAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    list_display=('action','item_name','first_name','last_name','email','contact_number')
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/bigandtallinquiry/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 16-08-2024
# Reason -To have big and tall inquiry
# Code added by Unnati Bajaj on 22-08-2024
# Reason -To have request catalog


@admin.register(RequestCatalog)
class RequestCatalogAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    list_display=('action','first_name','last_name','email','contact_number','company','address_line1','comments',
                    # Added by - Ashlekh on 22-01-2025
                    # Reason - To add created_at date
                    'formatted_created_at',
                    # End of code - Ashlekh on 22-01-2025
                    # Reason - To add created_at date
                )
    #Code added by Unnati on 01-12-2024
    #Reason-To have readonly fields
    readonly_fields=('first_name','last_name','email','contact_number','company','address_line1','address_line2','city','state','zipcode','comments')
    #End of code addition by Unnati on 01-12-2024
    #Reason-To have readonly fields
    # Added by - Ashlekh on 22-01-2025
    # Reason - To add created_at in MM-DD-YYYY
    def formatted_created_at(self, obj):
        if obj.created_at:
            return localtime(obj.created_at).strftime('%m-%d-%Y %I:%M %p')
        return "-"
    formatted_created_at.short_description = "Created at"
    # End of code - Ashlekh on 22-01-2025
    # Reason - To add created_at in MM-DD-YYYY
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/requestcatalog/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    pass
# End of code addition by Unnati Bajaj on 22-08-2024
# Reason -To have request catalog
# Code added by Unnati Bajaj on 22-08-2024
# Reason -To have Blog


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    #Code added by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/blog/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    #Code added by Unnati on 28-11-2024
    #Reason-To display description without tag
    def Description(self, obj):
        return truncatechars(strip_tags(obj.description), 50)
    #End of code addition by Unnati on 28-11-2024
    #Reason-To display description without tag
    #Code modified by Unnati on 28-11-2024
    #Reason-Modified column name
    # list_display=('action','title','date','description')
    list_display=('action','title',
                #   Code changed by - Ashlekh on 15-01-2025
                #   Reason - To change format of date
                #   'date',
                'get_formatted_date',
                # End of code - Ashlekh on 15-01-2025
                # Reason - To change format of date
                  'Description',
                )
    #End of code modification by Unnati on 28-11-2024
    #Reason-Modified column name
    #End of code addition by Unnati on 24-11-2024
    #Reason-To have view button in admin side
    # Added by - Ashlekh on 15-01-2025
    # Reason - To show format date in MM-DD-YYYY
    def get_formatted_date(self, obj):
        return obj.date.strftime('%m-%d-%Y') if obj.date else ""
    get_formatted_date.short_description = 'Date'
    # End of code - Ashlekh on 15-01-2025
    # Reason - To show format date in MM-DD-YYYY
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        # Modification and addition by Om shrivastava on 02-01-2025
        # Reason : Remove false 
        # return False
        return True
        # End of modification and addition by Om shrivastava on 02-01-2025
        # Reason : Remove false 
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    pass
# End of code addition by Unnati Bajaj on 22-08-2024
# Reason -To have Blog
# Code added by Unnati Bajaj on 23-10-2024
# Reason -To add leave feedback


@admin.register(LeaveFeedback)
class LeaveFeedbackAdmin(admin.ModelAdmin):
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/leavefeedback/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    list_display = ('action', 'name', 'email', 'phone_number', 'message',
                    # Added by - Ashlekh on 22-01-2025
                    # Reason - To add created_at date
                    'formatted_created_at',
                    # End of code - Ashlekh on 22-01-2025
                    # Reason - To add created_at date
                )

    # Added by - Ashlekh on 10-12-2024
    # Reason - To keep fields in read only
    readonly_fields = [
        "name",
        "email",
        "phone_number",
        "message",
    ]
    # End of code - Ashlekh on 10-12-2024
    # Reason - To keep fields in read only
    # Added by - Ashlekh on 22-01-2025
    # Reason - To change format of created_at date
    def formatted_created_at(self, obj):
        if obj.created_at:
            return localtime(obj.created_at).strftime('%m-%d-%Y %I:%M %p')
        return "-"
    formatted_created_at.short_description = "Created at"
    # End of code - Ashlekh on 22-01-2025
    # Reason - To change format of created_at date
    # Added by - Ashlekh on 05-12-2024
    # Reason - To hide Add button
    def has_add_permission(self, request, obj=None):
        return False
    # End of code - Ashlekh on 05-12-2024
    # Reason - To hide Add button
# End of code addition by Unnati Bajaj on 23-10-2024
# Reason -To add leave feedback

# Added by - Ashlekh on 04-11-2024
# Reason - To add WishList model
@admin.register(WishList)
class WishListAdmin(admin.ModelAdmin):
    # Added by - Ashlekh on 28-11-2024
    # Reason - To display color
    def color_display(self, obj):
        if obj.color:
            return format_html(
                '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #000;"></div>',
                obj.color
            )
        return "No color specified"
    color_display.short_description = 'Color'
    # End of code - Ashlekh on 28-11-2024
    # Reason - To display color
    # Added by - Ashlekh on 19-11-2024
    # Reason - To display short product name
    def product(self):
        return truncatechars(mark_safe(strip_tags(value=self.product)), 50)
    # End of code - Ashlekh on 19-11-2024
    # Reason - To display shortn product name
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/wishlist/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
    list_display = ("action", "user", 
                    # Code changed by - Ashlekh on 19-11-2024
                    # Reason - To display short product name
                    # "product",
                    product, 
                    # "color"
                    # End of code - Ashlekh on 19-11-2024
                    # Reason - To display short product name
                    # Added by - Ashlekh on 28-11-2024
                    # Reason - To display color
                    "color_display",
                    # End of code - Ashlekh on 28-11-2024
                    # Reason - To display color
                    )
    # Added by - Ashlekh on 19-11-2024
    # Reason - To keep all details in read only form
    readonly_fields = ["user", "product", 
                    #    Code changed by - Ashlekh on 28-11-2024
                    #    Reason - To display color
                    #    "color",
                       "color_display"
                    #    End of code - Ashlekh on 28-11-2024
                    #    Reason - To display color
                       ]
    # End of code - Ashlekh on 19-11-2024
    # Reason - To keep all details in read only form
    # Added by - Ashlekh on 28-11-2024
    # Reason - To remove color code when user clicks on view button
    exclude = ["color"]
    # End of code - Ashlekh on 28-11-2024
    # Reason - To remove color code when user clicks on view button
# End of code - Ashlekh on 04-11-2024
# Reason - To add WishList model
# Code commented by Unnati Bajaj on 26-12-2024
# Reason -This code is not in use


# @admin.register(ReturnExchangeRequest)
# class ReturnExchangeRequestAdmin(admin.ModelAdmin):
#     def action(self, obj):
#         return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/returnexchangerequest/"+str(obj.id)+"/change/'>View</a>")
#     action.allow_tags = True
#     list_display = ('action', 'order_id', 'item_id', 'quantity', 'exchange_id','linked_exchange_id','invoice_number','request_type','item_status')

# End of code comment by Unnati Bajaj on 26-12-2024
# Reason -This code is not in use

# Added by - Ashlekh on 01-01-2025
# Reason - To add FeedbackRequest model
@admin.register(FeedBackRequest)
class FeedBackRequestAdmin(admin.ModelAdmin):

    list_display = (
        "action",
        "product",
        # Commented by - Ashlekh on 04-01-2025
        # Reason - To hide name field
        # "name",
        # End of comment - Ashlekh on 04-01-2025
        # Reason - To hide name field
        "email",
        # Added by - Ashlekh on 13-02-2025
        # Reason - To add created_at date
        "created_at",
        # End of code - Ashlekh on 13-02-2025
        # Reason - To add created_at date
    )
    # Added by - Ashlekh on 04-01-2025
    # Reason - To hide name field
    exclude = (
        "name",
    )
    # End of code - Ashlekh on 04-01-2025
    # Reason - To hide name field
    def action(self, obj):
        return format_html("<a style='background-color:  #10b981;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.SITE_URL+"admin/uniform_app/feedbackrequest/"+str(obj.id)+"/change/'>View</a>")
    action.allow_tags = True
# End of code - Ashlekh on 01-01-2025
# Reason - To add FeedbackRequest model