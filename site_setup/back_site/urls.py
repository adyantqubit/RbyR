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
    path('getCategoryProduct/<category>/',ProductSetting.as_view(),name="updateLike"),
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
    
    
]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)   