from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # path('',home,name="home"),
    # path('contact/',contact,name="contact"),
    # path('about/',about,name="about"),
    # path('dynamic/<int:id>',dynamic,name="dynamic"),
    # path('todo/',todo,name="todo"),
    # path('delete/<id>',delete,name="delete"),
    # path('completemark/<id>',mark_as_completed,name="complete"),
    # path('login/',login_page,name="login"),
    # path('register/',register_page,name="register"),
    path('check/',User2API.as_view(),name="check2"),
    path('register/',UserRegistrationView.as_view(),name="register"),
    path('login/',UserLoginView.as_view(),name="login"),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('changePass/',UserChangePasswordView.as_view(),name='change'),
    path('send-reset-password-email/',SendPasswordResetEmailView.as_view(),name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/',UserPasswordResetView.as_view(),name="reset-password"),
    path('likedUpdate/',LikedUpdateView.as_view(),name="updateLike"),
    path('cartUpdate/',CartUpdateView.as_view(),name="updateLike"),
    path('getCategoryProduct/<category>/',ProductSetting.as_view()),
    path('car/',picget.as_view(),name="updateLike"),
    path('detail/<id>/',Givingdetail.as_view(),name="updateLike"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('refresh/',gettingAccess.as_view(), name='token_refresh'),
    path('buyAll/',cartBuyAll.as_view()),
    path('increament/',CartSetting.as_view()),
    path('cardimages/',cardImage.as_view()),
    path('invoice_post/',Invoice.as_view()),
    path('shpping_orderCheck/',shippingOrder.as_view()),
    path('billing_orderCheck/',billingOrder.as_view()),
    path('cart_delete/',CartDelete.as_view()),
    path('invoie_get/',Invoiceget.as_view()),
    path('invoiesingle/',InvoiceSingleget.as_view()),
    path('transaction_get/',transactionget.as_view()),
    path('shipping_get/',ShippingGetApi.as_view()),
    path('shipping_update/',ShippingUpdateApi.as_view()),
    path('shipping_delete/',ShippingDeleteApi.as_view()),
    path('getQR/',getQrDetails.as_view()),
    path('increament_stock_check/',IncrementCheck.as_view()),
    path('Coupon_check/',CouponCheck.as_view()),
    path('tax_get/',TaxGet.as_view()),
    path('important_rule_get/',ImportantTextGet.as_view()),
    path('cart_recheck/',CartRecheck.as_view()),
    path('shipping_tick/',ShippingTick.as_view()),
    path('User_update/',updateUser.as_view()),


    #Added by Ashish on 06-11-2022
    #Reason - To have FAQ functionality 
    path('faq/',FAQView.as_view()),
    #End of code addition
    
    #Added by Ashish on 09-11-2022
    #Reason - To send contact us details to front end
    path('contact-us/',ContactUsView.as_view()),
    #End of code addition

    #Added by Ashish on 13-11-2022
    #Reason - To send T&C details to front end
    path('terms-and-conditions/',TermAndConditionView.as_view()),
    #End of code addition

    #Added by Ashish on 13-11-2022
    #Reason - To send T&C details to front end
    path('privacy-policy/',PrivacyPolicyView.as_view()),
    #End of code addition

    #Added by Ashish on 13-11-2022
    #Reason - To send delivery and shipping policy details to front end
    path('delivery-and-shipping-policy/',DeliveryAndShippingPolicyView.as_view()),
    #End of code addition

    #Added by Ashish on 14-11-2022
    #Reason - To send refund policy details to front end
    path('refund-policy/',RefundPolicyView.as_view()),
    #End of code addition

    #Added by Ashish on 14-11-2022
    #Reason - To send cancelllation policy details to front end
    path('cancellation-policy/',CancellationPolicyView.as_view()),
    #End of code addition

    #Added by Ashish on 14-11-2022
    #Reason - To send Store locator details to front end
    path('store-locator/',StoreLocatorView.as_view()),
    #End of code addition

    #Added by Ashish on 16-11-2022
    #Reason - To send socail links to front end
    path('social-link/',SocialLinkView.as_view()),
    #End of code addition

    #Added by Ashish on 16-11-2022
    #Reason - To send bridal details to front end
    path('bridal/',BridalView.as_view()),
    #End of code addition

    #Added by Ashish on 17-11-2022
    #Reason - To get bridal from front end
    path('save-bridal-details/',BridalFormView.as_view()),
    #End of code addition

    #Added by Ashish on 17-11-2022
    #Reason - To send copyright details to front end
    path('copyright/',CopyrightView.as_view()),
    #End of code addition

    #Added by Ashish on 17-11-2022
    #Reason - To get email from front end
    path('save-email/',EmailSubscriptionView.as_view()),
    #End of code addition

    path('get-instagram-posts/',InstagrampostRetrive.as_view()),

    #Added by Ashish dewangan on 18-11-2022
    #Reason - to have search functionality
    #Jira issue no - RBYR -141
    path('search-products/<query>',SearchProductView.as_view()),
    #End of code addition

    #Added by Ashish on 19-11-2022
    #Reason - To send logo and cover images to front end
    path('logo-and-cover/',LogoAndCoverView.as_view()),
    #End of code addition

	#Added by Ashish on 21-11-2022
    #Reason - To send footer description to front end
    path('footer-description/',FooterDescriptionView.as_view()),
    #End of code addition

    #Added by Ashish Dewangan on 23-11-2022
    #Reason - To send size chart image to front end
    #Jira issue no - RBYR-193
    path('women-size-chart/',WomenClothSizeChartView.as_view()),
    #End of code addition

    #Added by Ashish Dewangan on 24-11-2022
    #Reason - To retrieve custom tailored details from front end
    #Jira issue no - RBYR-193
    path('save-custom-tailored-details/',CustomTailoredFormView.as_view()),
    #End of code addition
    
    #Added by Ashish Dewangan on 24-11-2022
    #Reason - To send whatsapp contact number to front end
    path('whatsapp-contact-number/',WhatsappContactView.as_view()),
    #End of code addition
    
    #Added by Rohan kansari on 24-11-2022
    #reason- To consist data for guest user
    #jira issue -RBYR-208
    path("cart_save_for_geust/",GeustCart.as_view()),
    #end of code Addition
    
     #Added By Rohan kansari
    #reason- Pagination functionality where it give one by one page data in each call
    #jira issue-RBYR233
    path("page_indexing/",pageIndex.as_view()),
    #end of code Addition


]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)   