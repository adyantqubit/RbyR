from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
# Code added by Unnati on 30-05-2024
# Reason-To have contact us serializer


class ContactUsSerializer(ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = '__all__'
# End of code addition by Unnati on 30-05-2024
# Reason-To have contact us serializer

# Code added by Unnati on 30-05-2024
# Reason-To have Setting serializer


class SettingSerializer(ModelSerializer):
    class Meta:
        model = Setting
        fields = ['name', 'address', 'pincode', 'contact_number', 'email', 'opening_hours', 'closing_hours', 'map_link',
                  'logo',
                  # Commented by jhamman on 18-10-2024
                  # Reason - remove these field
                  # 'faqBanner', 'aboutUsBanner', 'faqBannerTitle', 'storeLocatorBanner', 'storeLocatorBannerTitle',
                  # End of commentation by jhamman on 18-10-2024
                  # Reason - remove these field
                  # Added by - Ashlekh on 05-10-2024
                  # Reason - To serialize size chart
                  'size_chart',
                  # End of code - Ashlekh on 05-10-2024
                  # Reason - To serialize size chart

                  # Added by - Ashish Dewangan on 29-11-2024
                  # Reason - serializing more fields
                  'max_return_days',
                  'max_exchange_days',
                  'max_cancellation_days',
                  # End of addition by - Ashish Dewangan on 29-11-2024
                  # Reason - serializing more fields
                  ]
# End of code addition by Unnati on 30-05-2024
# Reason-To have setting serializer

# Code added by Unnati on 01-05-2024
# Reason-To have social links serializer


class SocialSerializer(ModelSerializer):
    class Meta:
        model = Social
        fields = '__all__'
# End of code addition by Unnati on 01-05-2024
# Reason-To have social links serializer

# Code added by Unnati on 02-05-2024
# Reason-To have FAQ serializer


class FaqSerializer(ModelSerializer):
    class Meta:
        model = Faq
        fields = '__all__'
# End of code addition by Unnati on 02-05-2024
# Reason-To have FAQ serializer

# Code added by Unnati on 04-05-2024
# Reason-To have Store Locator serializer


class StoreLocatorSerializer(ModelSerializer):
    class Meta:
        model = StoreLocator
        fields = '__all__'

# End of code addition by Unnati on 04-05-2024
# Reason-To have Store Locator serializer

# Code added by Unnati on 05-08-2024
# Reason-To have Home serializer


class HomeBannerSerializer(ModelSerializer):
    class Meta:
        model = HomeBanner
        fields = '__all__'
# End of code addition by Unnati on 05-08-2024
# Reason-To have Home serializer

# Code added by Unnati on 03-05-2024
# Reason-To have Category serializer


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category

        # Modified by jhamman on 10-10-2024
        # Reason - remove fielf banner, because we dont want to apply banner on category
        # fields = ["id", "name", "parent_id", "is_active", "image", "banner"]
        fields = ["id", "name", "parent_id", "is_active", "image",
                  # Code added by Unnati on 16-11-2024
                  # Reason-Added coming soon
                  "is_coming_soon",]
                  # End of code addition by Unnati on 16-11-2024
                  # Reason-Added coming soon
        # End of modification by jhamman on 10-10-2024
        # Reason - remove fielf banner, because we dont want to apply banner on category
# End of code addition by Unnati on 03-05-2024
# Reason-To have Category serializer


class CategoryImageSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ["image",]

# Code added by Unnati on 10-05-2024
# Reason-To have About us serializer
# class Section1AboutUsSerializer(ModelSerializer):
#     class Meta:
#         model = AboutUsSection1
#         fields = ['heading', 'description']

# class Section2AboutUsSerializer(ModelSerializer):
#     class Meta:
#         model = AboutUsSection2
#         fields = ['heading','description','image']

# class Section3AboutUsSerializer(ModelSerializer):
#     class Meta:
#         model = AboutUsSection3
#         fields = ['section3']

# class Section4AboutUsSerializer(ModelSerializer):
#     class Meta:
#         model = AboutUsSection4
#         fields = ['heading', 'description','video']
# End of code addition by Unnati on 10-05-2024
# Reason-To have about us serializer

# Code added by Unnati on 11-05-2024
# Reason-To have Our policies serializer


class PoliciesSerializer(ModelSerializer):
    class Meta:
        model = Policies
        fields = ['privacyPolicy', 'shippingPolicy',
                  'returnPolicy', 'cancellationPolicy']

# End of code addition by Unnati on 11-05-2024
# Reason-To have Our policies serializer

# Code added by Unnati on 11-05-2024
# Reason-To have terms and conditions serializer


class TermsAndConditionsSerializer(ModelSerializer):
    class Meta:
        model = TermsAndConditions
        fields = ['heading', 'description']
# End of code addition by Unnati on 11-05-2024
# Reason-To have terms and conditions serializer

# Code added by Unnati on 19-06-2024
# Reason-To have Product serializer


class ProductSerializer(ModelSerializer):
    # Code added by Unnati on 12-09-2024
    # Reason-Added category and brand
    category = serializers.CharField(source='category.name', read_only=True)

    # Added by Jhamman on 10-10-2024
    # Reason - to get banner details
    banner = HomeBannerSerializer()
    # End of addition by Jhamman on 10-10-2024
    # Reason - to get banner details

    # offer_percentage = serializers.SerializerMethodField()
    # Code commented by Unnati on 06-10-2024
    # Reason-To remove brand
    # brand = serializers.CharField(source='brand.text', read_only=True)
    # End of code comment by Unnati on 06-10-2024
    # Reason-To remove brand
    # End of code addition by Unnati on 12-09-2024
    # Reason-Added category and brand

    class Meta:
        model = Product

        # Modified by Jhamman on 07-10-2024
        # Reason - have to add home_banner along with product field
        # Modified by Jhamman on 10-10-2024
        # reason - remove is_on_sale
        # fields = '__all__'
        # fields = [
        #     'id', 'product_id', 'name', 'description', 'category', 'menu', 'mrp', 'sales_rate',
        #     'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'image1', 'image2', 'image3', 'image4',
        #     'image5', 'color', 'is_active', 'shipping_days', 'is_best_seller', 'is_featured_product',
        #     'is_on_sale',  'sale_percentage', 'is_ready_to_ship', 'details',
        #     'created_at', 'banner','banner_percentage'
        # ]

        # Modified by Jhamman on 14-10-2024
        # Reason - have to remove mrp and add patches field
        # fields = [
        #     'id', 'product_id', 'name', 'description', 'category','mrp', 'sales_rate',
        #     'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'image1', 'image2', 'image3', 'image4',
        #     'image5', 'color', 'is_active', 'shipping_days', 'is_best_seller', 'is_featured_product',
        #     'sale_percentage', 'is_ready_to_ship', 'details', 'created_at', 'banner'
        # ]
        fields = [
            'id', 'product_id', 'name', 'description', 'category', 'sales_rate',
            'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
            #Code added by Unnati on 30-12-2024
            #Reason-Added free size
            "is_free_size",
            'free_size',
            #End of code addition by Unnati on 30-12-2024
            #Reason-Added free size
            'image1', 'image2', 'image3', 'image4',
            'image5', 'color', 'show_patches_and_embroider_on_UI', 'is_active', 'shipping_days', 'is_best_seller', 'is_featured_product',
            'sale_percentage', 'is_ready_to_ship', 'details', 'created_at', 'banner',
            # Code added by Unnati on 17-10-2024
            # Reason-Added rating
            'rating',
            # End of code addition by Unnati on 17-10-2024
            # Reason-Added rating
            # Code addition by Om Shrivastava on 20-11-2024
            # Reason - Added customization prices field
            'logo_price',"patches_price","security_batches_price","embroider_price","customization_comment","after_customization_product_price",
            # End of code addition by Om Shrivastava on 20-11-2024
            # Reason - Added customization prices field
            # Added by - Ashlekh on 16-01-2025
            # Reason - To add customization fields
            "logo", "patches", "security_batches", "embroider",
            # End of code - Ashlekh on 16-01-2025
            # Reason - To add customization fields
            # Added by - Ashlekh on 18-02-2025
            # Reason - To add customization fields
            "security_id_on_back", "printed_id", "security_id_on_back_price", "printed_id_price",
            # End of code - Ashlekh on 18-02-2025
            # Reason - To add customization fields

        ]
        # End of modification by Jhamman on 14-10-2024
        # Reason - have to remove mrp and add patches field
        # End of modification by Jhamman on 10-10-2024
        # reason - remove is_on_sale
        # End of modification by Jhamman on 07-10-2024
        # Reason - have to add home_banner along with product field

# End of code addition by Unnati on 19-06-2024
# Reason-To have Product serializer
# Code commented by Unnati on 06-10-2024
# Reason-To remove brand serializer


# class BrandSerializer(ModelSerializer):
#     class Meta:
#         model = Brand
#         fields = '__all__'
# End of code addition by Unnati on 06-10-2024
# Reason-To remove brand serializer
# Code added by Unnati on 03-07-2024
# Reason-To have Email Subscription request serializer


class EmailSubscriptionRequestSerializer(ModelSerializer):
    class Meta:
        model = EmailSubscriptionRequest
        fields = '__all__'
# End of code addition by Unnati on 03-07-2024
# Reason-To have Email Subscription request serializer
# Code added by Unnati on 04-07-2024
# Reason-To have Cart serializer


class CartSerializer(ModelSerializer):
    product_id = serializers.SerializerMethodField()
    # Added by jhamman on 08-10-2024
    # Reason - Added sale percentage in serializer
    # product = ProductSerializer()
    # banner_percentage = serializers.SerializerMethodField()
    sale_percentage = serializers.SerializerMethodField()
    # is_on_sale = serializers.SerializerMethodField()
    # End of addition by jhamman on 08-10-2024
    # Reason - Added sale percentage in serializer
    # Addition by Om Shrivastava on 21-11-2024
    # Reason : Add the customization price 
    show_patches_and_embroider_on_UI = serializers.SerializerMethodField()
    # Commented by Om Shrivastava on 01-12-2024
    # Reason : No need to get the value directly from the product table 
    # after_customization_product_price = serializers.SerializerMethodField()
    # End of commented by Om Shrivastava on 01-12-2024
    # Reason : No need to get the value directly from the product table
    # Ebd of addition by Om Shrivastava on 21-11-2024
    # Reason : Add the customization price 
    is_active = serializers.SerializerMethodField()
    # Added by - Ashlekh on 12-12-2024
    # Reason - To add product description in serializer
    description = serializers.SerializerMethodField()
    # End of code - Ashlekh on 12-12-2024
    # Reason - To add product description in serializer

    class Meta:
        model = Cart
        fields = ['id', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
                  'free_size',
                   'color',
                  'sales_rate', 'image1', 'name', 'created_at', 'updated_at',
                  'xs_patches', 's_patches', 'm_patches', 'l_patches',
                  'xl_patches', 'xxl_patches', 'xxxl_patches',
                  'xs_embroider', 's_embroider', 'm_embroider', 'l_embroider',
                  'xl_embroider', 'xxl_embroider', 'xxxl_embroider',
                  'user', 'product', 'product_id', 'sale_percentage',
                #   Modification and addition by Om Shrivastava on 21-11-2024
                #   Reasohn : Add customization key 
                # Addition by Om Shrivastava on 01-12-2024
                # Reason : Add all customisation keys 
                  "show_patches_and_embroider_on_UI", "after_customization_product_price",
                  "logo","patches","security_batches","embroider","logo_price","patches_price","security_batches_price","embroider_price","customization_comment",
                  "size","quantity",'is_active',
                # End of addition by Om Shrivastava on 01-12-2024
                # Reason : Add all customisation keys
                #   End of modification and addition by Om Shrivastava on 21-11-2024
                #   Reasohn : Add customization key 
                # Added by - Ashlekh on 12-12-2024
                # Reason - To add description in serializer
                "description",
                # End of code - Ashlekh on 12-12-2024
                # Reason - To add description in serializer
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization details
                "security_id_on_back", "printed_id", "security_id_on_back_price", "printed_id_price",
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization details
                  ]

    def get_product_id(self, obj):
        return obj.product.product_id

    # Added by jhamman on 08-10-2024
    # Reason - Added sale percentage in serializer
    # def get_is_on_sale(self, obj):
    #     return obj.product.is_on_sale

    def get_sale_percentage(self, obj):
        return obj.product.sale_percentage
    
    # Modification and addition by Om Shrivastava on 21-11-2024
    # Reasohn : Add customization key 
    def get_show_patches_and_embroider_on_UI(self, obj):
        return obj.product.show_patches_and_embroider_on_UI
    
    def get_is_active(self, obj):
        return obj.product.is_active

    # Commented by Om Shrivastava on 01-12-2024
    # Reason : No need to get the value directly from the product table
    # def get_after_customization_product_price(self, obj):
    #     return obj.product.after_customization_product_price
    #   End of modification and addition by Om Shrivastava on 21-11-2024
    #   Reasohn : Add customization key 
    # End of commented by Om Shrivastava on 01-12-2024
    # Reason : No need to get the value directly from the product table
    #   End of modification and addition by Om Shrivastava on 21-11-2024
    #   Reasohn : Add customization key 

    # End of addition by jhamman on 08-10-2024
    # Reason - Added sale percentage in serializer
    # Added by - Ashlekh on 12-12-2024
    # Reason - Method to get description from Product table
    def get_description(self, obj):
        return obj.product.description
    # End of code - Ashlekh on 12-12-2024
    # Reason - Method to get description from Product table
# End of code addition by Unnati on 04-07-2024
# Reason-To have Cart serializer
# Code added by Unnati on 15-07-2024
# Reason-To have Return and exchange serializer


class ReturnsAndExchangesSerializer(ModelSerializer):
    class Meta:
        model = ReturnsAndExchanges
        fields = '__all__'
# End of code addition by Unnati on 15-07-2024
# Reason-To have Return and exchange serializer
# Code added by Unnati on 17-07-2024
# Reason-To have About Us serializer


class AboutUsSerializer(ModelSerializer):
    class Meta:
        model = AboutUs
        fields = '__all__'
# End of code addition by Unnati on 17-07-2024
# Reason-To have About Us serializer

# Code added by Unnati on 21-07-2024
# Reason-To have Shipping Details serializer


class OrderSerializer(ModelSerializer):
    # Code added by Unnati on 26-08-2024
    # Reason-To change date format
    # Modified by jhamman on 20-10-2024
    # Reason format modified
    # date = serializers.DateField(
    #     format='%d-%m-%y', input_formats=['%d-%m-%Y'], required=False)
    date = serializers.DateField(
        format='%Y-%m-%d', input_formats=['%d-%m-%Y'], required=False)
    # End of modification by jhamman on 20-10-2024
    # Reason format modified
    # End of code addition by Unnati on 26-08-2024
    # Reason-To change date format

    class Meta:
        model = Order
        fields = '__all__'
# End of Code addition by Unnati on 21-07-2024
# Reason-To have Shipping Details serializer
# Code added by Unnati on 25-07-2024
# Reason-To have payment details serializer


class PaymentDetailsSerializer(ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = '__all__'

# End of code addition by Unnati on 25-07-2024
# Reason-To have payment details serializer
# Code added by Unnati on 31-07-2024
# Reason-To have user address serializer


class UserAddressDetailsSerializer(ModelSerializer):
    class Meta:
        model = UserAddressDetails
        fields = '__all__'
# End of code addition by Unnati on 31-07-2024
# Reason-To have user address serializer
# Code added by Unnati on 02-08-2024
# Reason-To have user address serializer


class OrderItemSerializer(serializers.ModelSerializer):
    # Code added by Unnati on 18-09-2024
    # Reason-Added product_id
    product_id = serializers.ReadOnlyField(source='product.product_id')
    # End of code addition by Unnati on 18-09-2024
    # Reason-Added product_id
    # Code added by Unnati on 30-09-2024
    # Reason-To have is_active from product table
    is_active = serializers.ReadOnlyField(source='product.is_active')
    # End of code adiditon by Unnati on 30-09-2024
    # Reason-To have is_active from product table

    product_name = serializers.SerializerMethodField()
    product_image1 = serializers.SerializerMethodField()
    # Code added by Unnati on 07-11-2024
    # Reason-added is_cancellable and order_date
    product_is_cancellable = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    # End of code addition by Unnati on 07-11-2024
    # Reason-added is_cancellable and order_date
    # Code added by Unnati on 09-11-2024
    # Reason-added is_returnable
    product_is_returnable = serializers.SerializerMethodField()
    # End of code addition by Unnati on 09-11-2024
    # Reason-added is_returnable
    # Added by - Ashlekh on 14-12-2024
    # Reason - To add sale percentage from Product table
    sale_percentage = serializers.ReadOnlyField(source='product.sale_percentage')
    # End of code - Ashlekh on 14-12-2024
    # Reason - To add sale percentage from Product table
    # Code added by Unnati on 29-11-2024
    # Reason-added is_exchangeable
    product_is_exchangeable = serializers.SerializerMethodField()
    # End of code addition by Unnati on 29-11-2024
    # Reason-added is_exchangeable
    ##Code added by Unnati on 09-01-2025
    ##Reason-Added order id
    order_id = serializers.SerializerMethodField()
    ##End of code addition by Unnati on 09-01-2025
    ##Reason-Added order id

    class Meta:
        model = OrderItem
        # Code added by Unnati on 30-09-2024
        # Reason-Added is_active column in orderItem
        fields = ['id', 'size', 'quantity', 'color', 'sales_rate', 'amount',
                  'item_status', 'order', 'product', 'product_id', 'is_active',
                  'product_name', 'product_image1',
                  # Code added by Unnati on 07-11-2024
                  # Reason-Added is_cancellable,order_date
                  'product_is_cancellable', 'order_date',
                  # End of code addition by Unnati on 07-11-2024
                  # Reason-Added is_cancellable,order_date
                  # Code added by Unnati on 09-11-2024
                  # Reason-Added is_returnable
                  'product_is_returnable',
                  # End of code addition by Unnati on 09-11-2024
                  # Reason-Added is_returnable
                  # Code added by Unnati on 29-11-2024
                  # Reason-Added is_exchangeable
                  'product_is_exchangeable',
                  # End of code addition by Unnati on 29-11-2024
                  # Reason-Added is_exchangeable
                  'has_patch', 'has_embroidery', 'cancel_reason',
                  # Code added by Unnati on 11-11-2024
                  # Reason-Added cancelled_by
                  'cancelled_by',
                  # End of code addition by Unnati on 11-11-2024
                  # Reason-Added cancelled_by
                  # Code added by Unnati on 17-11-2024
                  # Reason-Added cancelled_at
                  'cancelled_at',
                  # End of code addition by Unnati on 17-11-2024
                  # Reason-Added cancelled_at
                  # Code added by Unnati on 18-11-2024
                  # Reason-Added credit note number
                  'credit_note_number',
                  # End of code addition by Unnati on 18-11-2024
                  # Reason-Added credit note number

                  # Added by - Ashish Dewangan on 24-11-2024
                  # Reason - To serialize more fields
                    "shipping_date",
                    "delivery_date",
                    "return_initiated_date",
                    "return_pickup_date",
                    "return_date",
                    "refund_date",
                    "exchange_initiated_date",
                    "exchange_pickup_date",
                    "exchange_shipping_date",
                    "exchange_delivery_date",
                    "returned_by",
                    "return_reason",
                    "return_approval_reason",
                    "return_rejection_reason",
                    "returned_item_image1",
                    "returned_item_image2",
                    "return_authorization_no",
                    "restocking_fee",
                    "refund_amount",
                    "refund_transaction_id",
                    "tracking_id", 
                  # End of addition by - Ashish Dewangan on 24-11-2024
                  # Reason - To serialize more fields

                # Added by - Ashish Dewangan on 25-11-2024
                # Reason - serialized courier_service_provider_name
                "courier_service_provider_name",
                # End of addition by - Ashish Dewangan on 25-11-2024
                # Reason - serialized courier_service_provider_name
                # Modification and addition by Om Shrivastava on 21-11-2024
                # Reasohn : Add customization key
                "after_customization_product_price","show_patches_and_embroider_on_UI",
                "logo","patches","security_batches","embroider" ,
                # Addition by Om Shrivastava on 04-12-2024
                # Reason : Add the customization all prices 
                "logo_price",
                "patches_price",
                "security_batches_price",
                "embroider_price",
                # End of addition by Om Shrivastava on 04-12-2024
                # Reason : Add the customization all prices 
                # End of modification and addition by Om Shrivastava on 21-11-2024
                # Reasohn : Add customization key
                # "exchange_reason","exchange_id",
                # Added by - Ashlekh on 14-12-2024
                # Reason - To add sale percentage
                "sale_percentage",
                # End of code - Ashlekh on 14-12-2024
                # Reason - To add sale percentage
                #Code added by Unnati on 22-12-20424
                #Reason-Added fields in serializer
                "customization_price",
                "subtotal",
                "tax_percentage",
                "total_amount",
                "invoice_id",
                "type",
                "parent_id",
                "paypal_order_id",
                "paypal_access_token",
                "payment_status",
                "to_pay",
                #End of code addition by Unnati on 22-12-20424
                #Reason-Added fields in serializer
                ##Code added by Unnati on 09-01-2025
                ##Reason-Added order id
                "order_id",
                ##End of code addition by Unnati on 09-01-2025
                ##Reason-Added order id
                # Added by - Ashlekh on 18-02-2025
                # Reason - To add customization details
                "security_id_on_back", "printed_id", "security_id_on_back_price", "printed_id_price",
                # End of code - Ashlekh on 18-02-2025
                # Reason - To add customization details
                  ]
        # End of code addition by Unnati on 30-09-2024
        # Reason-Added is_active column in orderItem

    def get_product_name(self, obj):
        return obj.product.name

    def get_product_image1(self, obj):
        return obj.product.image1.url if obj.product.image1 else None
    # Code added by Unnati on 07-11-2024
    # Reason-Added product cancellable field

    def get_product_is_cancellable(self, obj):
        return obj.product.is_cancellable

    def get_order_date(self, obj):
        return obj.order.order_date
    # End of code addition by Unnati on 07-11-2024
    # Reason-Added product cancellable field
    ##Code added by Unnati on 09-01-2025
    ##Reason-Added order id
    def get_order_id(self, obj):
        return obj.order.order_id
    ##End of code addition by Unnati on 09-01-2025
    ##Reason-Added order id
    # Code added by Unnati on 09-11-2024
    # Reason-Added product returnable field
    def get_product_is_returnable(self, obj):
        return obj.product.is_returnable
    # End of code addition by Unnati on 09-11-2024
    # Reason-Added product returnable field
    # Code added by Unnati on 29-11-2024
    # Reason-Added product exchangeable field
    def get_product_is_exchangeable(self, obj):
        return obj.product.is_exchangeable
    # End of code addition by Unnati on 29-11-2024
    # Reason-Added product exchangeable field
# End of code addition by Unnati on 02-08-2024
# Reason-To have user address serializer

# Code added by Unnati on 04-08-2024
# Reason-To have comapny info serializer


class CompanyInfoSerializer(ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'
# End of code addition by Unnati on 04-08-2024
# Reason-To have comapny info serializer


# Code added by Unnati on 11-08-2024
# Reason-To have Shipping serializer


class ShippingSerializer(ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'
# End of code addition by Unnati on 11-08-2024
# Reason-To have Shipping serializer
# Code added by Unnati on 16-08-2024
# Reason-To have big and tall inquiry serializer


class BigAndTallInquirySerializer(ModelSerializer):
    class Meta:
        model = BigAndTallInquiry
        fields = '__all__'
# End of code addition by Unnati on 16-08-2024
# Reason-To have big and tall inquiry serializer
# Code added by Unnati on 22-08-2024
# Reason-To have request catalog serializer


class RequestCatalogSerializer(ModelSerializer):
    class Meta:
        model = RequestCatalog
        fields = '__all__'
# End of code addition by Unnati on 22-08-2024
# Reason-To have request catalog serializer
# Code added by Unnati on 22-08-2024
# Reason-To have blog serializer


class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'
# Ed of code addition by Unnati on 22-08-2024
# Reason-To have request catalog serializer
# Code added by Unnati on 15-09-2024
# Reason-To have billing address serializer


class BillingAddressSerializer(ModelSerializer):
    class Meta:
        model = BillingAddress
        fields = '__all__'
# End of code addition by Unnati on 15-09-2024
# Reason-To have billing address serializer
# Code added by Unnati on 16-09-2024
# Reason-To add shipping address serializer


class ShippingAddressSerializer(ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
# End of code addition by Unnati on 16-09-2024
# Reason-To add shipping address serializer
# Code added by Unnati on 23-10-2024
# Reason-To have leave feedback serializer


class LeaveFeedbackSerializer(ModelSerializer):
    class Meta:
        model = LeaveFeedback
        fields = '__all__'
# End of code addition by Unnati on 23-10-2024
# Reason-To have leave feedback serializer

# Added by - Ashlekh on 04-11-2024
# Reason - To add WishList Serializer
class WishListSerializer(ModelSerializer):
    product_id = serializers.SerializerMethodField()
    class Meta:
        model = WishList
        # fields = "__all__"
        fields = ["user", "product", "product_id", "color"]

    def get_product_id(self, obj):
        return obj.product.product_id
# End of code - Ashlekh on 04-11-2024
# Reason - To add WishList Serializer
# Code added by Unnati on 05-12-2024
# Reason-To have return exchange request serializer


# class ReturnExchangeRequestSerializer(ModelSerializer):
#     product_id = serializers.SerializerMethodField()
#     class Meta:
#         model = ReturnExchangeRequest
#         exchange_shipping_date = models.DateTimeField(null=True, blank=True)
#         fields = ['order_id','item_id','quantity','exchange_id','linked_exchange_id','invoice_number','request_type',
#                   'item_status','product','product_id','size','color','sales_rate','amount','logo','patches','security_batches',
#                   'embroider','logo_price','patches_price','security_batches_price','embroider_price','after_customization_product_price',
#                   'customization_comment','exchange_initiated_date','exchange_pickup_date','exchange_shipping_date','exchange_delivery_date',
#                   'tracking_id','courier_service_provider_name','image1','exchange_reason','grand_total']
#     def get_product_id(self, obj):
#         return obj.product.product_id
# End of code addition by Unnati on 23-10-2024
# Reason-To have return exchange request serializer

# Added by - Ashlekh on 01-01-2025
# Reason - To serialize FeedBackRequest model
class FeedBackRequestSerializer(ModelSerializer):
    product_id = serializers.SerializerMethodField()
    class Meta:
        model = FeedBackRequest
        fields = ["product", "rating", "content", "name", "email", "product_id", "created_at"]
    
    def get_product_id(self, obj):
        return obj.product.product_id
# End of code - Ashlekh on 01-01-2025
# Reason - To serialize FeedBackRequest model

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'
