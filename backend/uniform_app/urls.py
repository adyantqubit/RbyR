from django.urls import path

from .views import *
urlpatterns = [
    path('signup/', SignupAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('refresh/', TokenAPIVIew.as_view()),
    path('user/', UserAPIView.as_view()),
    # Added by - Unnati on 26-05-2024
    # Reason - Path for save otp, updatepassword,verifyOtp
    path('send-otp/', ForgotPasswordAPIView.as_view(), name='send_otp'),
    path('update-password/', ForgotPasswordAPIView.as_view(), name='update_password'),
    path('verify-otp/', ForgotPasswordAPIView.as_view(), name='verify_otp'),
    # End of code addition by - Unnati on 26-05-2024
    # Reason - Path for save otp, updatepassword,verifyOtp

    # Added by - Unnati on 29-05-2024
    # Reason - Path for contact us
    path('contactus/', ContactRequestAPIView.as_view()),
    # End of code addition by - Unnati on 29-05-2024
    # Reason -  Path for contact us
    # Added by - Unnati on 12-07-2024
    # Reason - Path for update user details
    path('update-user-details/', UserAPIView.as_view(),
         name='update_user_details'),
    # End of code addition - Unnati on 12-07-2024
    # Reason - Path for update user details
    # Added by - Unnati on 02-06-2024
    # Reason - Path for get-social-link,faq,store locator and category
    path('get-social-links/', SocialAPIView.as_view()),
    path('faq/', FaqAPIView.as_view()),
    path('storelocator/', StoreLocatorAPIView.as_view()),
    path('category/', CategoryAPIView.as_view()),
    # End of code addition by - Unnati on 02-06-2024
    # Reason -  Path for footer,faq,store locator and category
    # Added by - Unnati on 10-06-2024
    # Reason - Path for about us,tems and conditions and ourpolicies
    path('aboutus/', AboutUsAPIView.as_view()),
    path('terms-and-conditions/', TermsAndConditionsAPIView.as_view()),
    path('ourpolicies/', PoliciesAPIView.as_view()),
    # End of code addition by - Unnati on 10-06-2024
    # Reason - Path for about us,tems and conditions and ourpolicies
    # Added by - Unnati on 19-06-2024
    # Reason - Path for product detail
    # Code modified by Unnati on 11-11-2024
    # Reason-changed identifier data type as string
    path('productdetail/<str:identifier>/', ProductDetailAPIView.as_view()),
    # End of code addition by Unnati on 11-11-2024
    # Reason-changed identifier data type as string
    # Code commented by Unnati on 27-06-2024
    # Reason-This URL is not in use
    # path('products/',ProductDetailAPIView.as_view()),
    # End of code comment by Unnati on 27-06-2024
    # Reason-This URL is not in use
    # End of code addition by - Unnati on 19-06-2024
    # Reason - Path for product detail
    # Added by - Unnati on 19-06-2024
    # Reason - Path for filtered products
    path('products/', FilteredProductListAPIView.as_view()),
    # End of code addition by - Unnati on 19-06-2024
    # Reason - Path for filtered products
    # Added by - Unnati on 21-06-2024
    # Reason - Path for filtered options
    path('filter-options/', FilterOptionAPIView.as_view()),
    # End of code addition by - Unnati on 21-06-2024
    # Reason - Path for filtered options
    # Code commented by - Unnati on 06-10-2024
    # Reason - To remove brand path
    #     path('brand/', BrandAPIView.as_view()),
    # End of code addition by - Unnati on 06-10-2024
    # Reason - To remove brand path
    # Added by - Unnati on 03-07-2024
    # Reason - Path for Email subscription request
    path('email-subscription-request/',
         EmailSubscriptionRequestAPIView.as_view()),
    # End of code addition by - Unnati on 03-07-2024
    # Reason -Path for Email subscription request
    # Added by - Unnati on 04-07-2024
    # Reason - Path for add to cart
    path('add-to-cart/', CartAPIView.as_view()),
    # End of code addition by - Unnati on 04-07-2024
    # Reason -Path for add to cart
    # Added by - Unnati on 10-07-2024
    # Reason - Path for check if product exists
    path('check-if-product-exists-incart/',
         CheckProductInTheCartAPIView.as_view()),
    # End of code addition - Unnati on 10-07-2024
    # Reason - Path for check if product exists
    # Added by - Unnati on 10-07-2024
    # Reason - Path for update cart details
    path('update-cart/', UpdateCartAPIView.as_view()),
    # End of code addition by - Unnati on 10-07-2024
    # Reason - Path for update cart details
    # Added by - Unnati on 11-07-2024
    # Reason - Path for product list
    path('product-list/', ProductListAPIView.as_view()),
    # End of code addition by - Unnati on 11-07-2024
    # Reason - Path for product list
    # Added by - Unnati on 15-07-2024
    # Reason - Path for return and exchange
    path('returns-and-exchanges/', ReturnsAndExchangesAPIView.as_view()),
    # End of code addition by - Unnati on 15-07-2024
    # Reason - Path for return and exchange
    # Added by - Unnati on 21-07-2024
    # Reason - Path for Shipping details
    path('place-order/', OrderAPIView.as_view()),
    # End of code addition by - Unnati on 21-07-2024
    # Reason - Path for Shipping details
    # Added by - Unnati on 24-07-2024
    # Reason- Path for searching a product
    path('searched-products/', SearchProductAPIView.as_view()),
    # End of code addition by - Unnati on 24-07-2024
    # Reason- Path for searching a product
    # Added by - Unnati on 25-07-2024
    # Reason- Path for payment details
    path('payment-details/', PaymentDetailsAPIView.as_view()),
    # End of code addition by - Unnati on 25-07-2024
    # Reason- Path for payment details
    # Added by - Unnati on 25-07-2024
    # Reason- Path for cart items
    path('cart-item/', CartItemAPIView.as_view()),
    # End of code addition by - Unnati on 25-07-2024
    # Reason- Path for cart items
    # Added by - Unnati on 27-07-2024
    # Reason- Path for remove product
    path('remove-product/', RemoveProductAPIView.as_view()),
    # End of code addition by - Unnati on 27-07-2024
    # Reason- Path for remove product
    # Added by - Unnati on 28-07-2024
    # Reason-Path for fetching cart item
    path('fetch-cart-item/', CartAPIView.as_view()),
    # End of code addition by - Unnati on 28-07-2024
    # Reason-Path for fetching cart item
    # Added by - Unnati on 29-07-2024
    # Reason-Path for updating backend cart
    path('update-backend-cart/', UpdateCartDataAPIView.as_view()),
    # End of code addition by - Unnati on 29-07-2024
    # Reason-Path for updating backend cart
    # Added by - Unnati on 01-08-2024
    # Reason-Path to check for active discount
    path('is-discount-active/', DiscountAPIView.as_view()),
    # End of code addition by - Unnati on 01-08-2024
    # Reason-Path to check for active discount
    # Added by - Unnati on 02-08-2024
    # Reason-Path to get order history
    path('get-order-history/', OrderHistoryAPIView.as_view()),
    # End of code addition by - Unnati on 02-08-2024
    # Reason-Path to get order history
    # Added by - Unnati on 03-08-2024
    # Reason-Path to get order details
    path('order-detail/<int:id>/', OrderDetailAPIView.as_view()),
    # End of code addition by - Unnati on 03-08-2024
    # Reason-Path to get order details
    # Added by - Unnati on 03-08-2024
    # Reason-Path to get user address
    path('get-user-address/', UserAddressAPIView.as_view()),
    # End of code addition by - Unnati on 03-08-2024
    # Reason-Path to get user address
    # Added by - Unnati on 05-08-2024
    # Reason-Path to get bestseller
    path('get-home-page/', HomeBannerAPIView.as_view()),
    # End of code addition by - Unnati on 05-08-2024
    # Reason-Path to get bestseller
    # Added by - Unnati on 06-10-2024
    # Reason-To remove Path to get brand item according to id
    #     path('brandItem/<int:brandId>/', BrandItemAPIView.as_view()),
    # End of code addition by - Unnati on 06-10-2024
    # Reason-To remove Path to get brand item according to id
    # Added by - Unnati on 11-08-2024
    # Reason-Path to get shipping details
    path('shipping/', ShippingAPIView.as_view()),
    # End of code addition by - Unnati on 11-08-2024
    # Reason-Path to get shipping details
    # Added by - Unnati on 16-08-2024
    # Reason-Path to get big and tall inquiry
    path('big-and-tall-inquiry/', BigAndTallInquiryAPIView.as_view()),
    # End of code addition by - Unnati on 16-08-2024
    # Reason-Path to get big and tall inquiry
    # Added by - Unnati on 22-08-2024
    # Reason-Path to request catalog
    path('request-catalog/', RequestCatalogAPIView.as_view()),
    # End of code additon by - Unnati on 22-08-2024
    # Reason-Path to request catalog
    # Added by - Unnati on 22-08-2024
    # Reason-Path to get blog
    path('blog/', BlogAPIView.as_view()),
    # End of code addition by - Unnati on 22-08-2024
    # Reason-Path to get blog
    # Added by - Unnati on 22-08-2024
    # Reason-Path to get each blog
    path('blog/<int:id>/', BlogAPIView.as_view()),
    # End of code addition by - Unnati on 22-08-2024
    # Reason-Path to get each blog
    # Added by Unnati on 30-08-2024
    # Reason- Path to claer cart
    path('clear-cart/<int:user_id>/', ClearCartAPIView.as_view()),
    # End of code addition by Unnati on 30-08-2024
    # Reason- Path to claer cart
    # Code added by Unnati on 15-09-2024
    # Reason-Path to update user address
    path('update-user-address/', UpdateUserAddressAPIView.as_view()),
    # End of code addition by Unnati on 15-09-2024
    # Reason-Path to update user address
    # Code added by Unnati on 15-09-2024
    # Reason-Path to get primary user address
    path('get-primary-user-address/', UserPrimaryAddressAPIView.as_view()),
    # End of code addition by Unnati on 15-09-2024
    # Reason-Path to get primary user address
    # Code added by Unnati on 15-09-2024
    # Reason-Path to remove address
    path('remove-address/', RemoveAddressAPIView.as_view()),
    # End of code addition by Unnati on 15-09-2024
    # Reason-Path to remove address
    # Code added by Unnati on 16-09-2024
    # Reason-Path to update user address
    path('update-shipping-address/', UpdateShippingAddressAPIView.as_view()),
    # End of code addition by Unnati on 16-09-2024
    # Reason-Path to update user address
    # Code commented by Unnati on 28-09-2024
    # Reason-Path to edit product in cart
    # path('edit-product/<int:identifier>/',EditProductAPIView.as_view()),
    # End of code addition by Unnati on 28-09-2024
    # Reason-Path to edit product in cart
    # Added by - Unnati on 03-10-2024
    # Reason- Path for searching a order
    path('searched-orders/', SearchOrderAPIView.as_view()),
    # End of code addition by - Unnati on 24-07-2024
    # Reason- Path for searching a order
    # Added by - Unnati on 05-10-2024
    # Reason- Path for sale products
    path('sale-products/', SaleProductAPIView.as_view()),
    # End of code addition by - Unnati on 05-10-2024
    # Reason- Path for sale products
    # Added by - Ashlekh on 08-10-2024
    # Reason - path for privacy policy
    path('privacy_policy/', PrivacyPolicyAPIView.as_view()),
    # End of code - Ashlekh on 08-10-2024
    # Reason - path for privacy policy
    ##Code added by Unnati on 19-10-2024
    ##Reason-To get userAddress
    path('user-address/', UserAddressDetailAPIView.as_view()),
    ##End of code addition by Unnati on 19-10-2024
    ##Reason-To get userAddress
    # Added by - Ashlekh on 16-10-2024
    # Reason - To add path for capturing payment
    path("capture_payment/", PayPalCaptureView.as_view()),
    # End of code - Ashlekh on 16-10-2024
    # Reason - To add path for capturing payment
    # Added by - Ashlekh on 17-10-2024
    # Reason - To add path for creating order
    path("create_paypal_order/", CreatePayPalOrderView.as_view()),
    # End of code - Ashlekh on 17-10-2024
    # Reason - To add path for creating order
    path("webhook/", paypal_webhook),
      ##Code added by Unnati on 23-10-2024
    ##Reason-To post leave feedback
    path('leave-feedback/', LeaveFeedbackAPIView.as_view()),
    ##End of code addition by Unnati on 23-10-2024
    ##Reason-To post leave feedback
    # Added by - Ashlekh on 23-10-2024
    # Reason - To add path for checking quantity in product
     path("check_stock/", CheckStockAPIView.as_view()),
    # End of code - Ashlekh on 23-10-2024
    # Reason - To add path for checking quantity in product
    # Added by - Unnati on 06-11-2024
    # Reason - To add path for updating cancellation time
    path('update-cancellation-time/',UpdateCancellationTimeAPIView.as_view()),
    # End of code addition by - Unnati on 06-11-2024
    # Reason - To add path for updating cancellation time
    # Added by - Unnati on 07-11-2024
    # Reason - To add path for Credit note
    path('credit-note/<int:id>/',CreditNoteAPIView.as_view()),
    # End of code addition by - Unnati on 07-11-2024
    # Reason - To add path for Credit note
    # Added by - Ashlekh on 28-10-2024
    # Reason - To add path for checking quantity (when +/- is clicked from CheckOut.jsx)
    path("update_cart_quantity/", UpdateCartQuantityAPIView.as_view()),
    # End of code - Ashlekh on 28-10-2024
    # Reason - To add path for checking quantity (when +/- is clicked from CheckOut.jsx)
    # Added by - Ashlekh on 30-10-2024
    # Reason - To add path for storing details in WishList
     path("add_to_wishlist/", WishListAPIView.as_view()),
    # End of code - Ashlekh on 30-10-2024
    # Reason - To add path for storing details in WishList
    # Added by - Ashlekh on 05-11-2024
    # Reason - To add path for storing details in WishList (will use when user will login)
    path('update-wishlist/', UpdateWishListAPIView.as_view()),
    path('wishlist_details/', WishListDetailsAPIView.as_view()),
    # End of code - Ashlekh on 05-11-2024
    # Reason - To add path for storign details in WishList (will use when user will login)
    # Added by - Ashlekh on 07-11-2024
    # Reason - To add path for storing product in Cart and to remove product from wishlist
     path("add-product-to-cart/", CartDetailsAPIView.as_view()),
     path("remove-wishlist-product/", RemoveWishListProductAPIView.as_view()),
    # End of code - Ashlekh on 07-11-2024
    # Reason - To add path for storing product in Cart and to remove product from wishlist
    # Added by- Unnati on 13-11-2024
    # Reason-To add path for dashboard
    path("dashboard/", DashboardAPIView.as_view()),
    # End of code addition by- Unnati on 13-11-2024
    # Reason-To add path for dashboard
    # Added by - Ashlekh on 18-11-2024
    # Reason - To add path for sorting in SaleProduct
    #Code commented by Unnati on 06-12-2024
    #Reason -This code is not in use
     # path("sorted_products/", FilterProductAPIView.as_view()),
     #End of code comment by Unnati on 06-12-2024
     #Reason -This code is not in use
    # End of code - Ashlekh on 18-11-2024
    # Reason - To add path for sorting in SaleProduct

     # // Addition by Om Shrivastava on 20-11-2024
     # // Reason : Add the path for post the comment and customized price 
     path('update-customization-comment/', UpdateCustomizationComment.as_view(), name='update_customization_comment'),
     # // Addition by Om Shrivastava on 20-11-2024
     # // Reason : Add the path for post the comment and customized price 

    # Added by - Ashish Dewangan on 24-11-2024
    # Reason - defined API endpoint for return and item
    path('return-item/',ReturnItemAPIView.as_view()),
    # End of addition by - Ashish Dewangan on 24-11-2024
    # Reason - defined API endpoint for return and item

    # Added by - Ashish Dewangan on 24-11-2024
    # Reason - defined API endpoint for return and item
    path('add-tracking-details/',AddTrackingDetailsAPIView.as_view()),
    # End of addition by - Ashish Dewangan on 24-11-2024
    # Reason - defined API endpoint for return and item

    # Added by - Ashish Dewangan on 27-11-2024
    # Reason - Added endpoint for handling order using stripe  
    path("create-stripe-checkout-session/", CreateStripeSessionIdView.as_view()),
    path("create-order-from-stripe/", CreateOrderFromStripeView.as_view()),
    path("stripe-session-status/<sessionId>/", CheckStripeSession.as_view()),
    # End of addition by - Ashish Dewangan on 27-11-2024
    # Reason - Added endpoint for handling order using stripe  

    # Added by - Ashish Dewangan on 28-11-2024
    # Reason - Added endpoint handling stripe's webhook events 
    path("stripe-webhook/", my_webhook_view),
    # End of addition by - Ashish Dewangan on 28-11-2024
    # Reason - Added endpoint handling stripe's webhook events
         
    # Added by - Ashish Dewangan on 09-12-2024
    # Reason - Added endpoint to get latest details of products
    # Modified by - Ashish Dewangan on 16-12-2024
    # Reason - Renamed the class
    # path('latest-details-of-items-in-cart/', CartItemForGuestAPIView.as_view()), 
     path('latest-details-of-items-in-cart/', LatestDetailsOfCartItemsAPIView.as_view()),
    # End of modification by - Ashish Dewangan on 16-12-2024
    # Reason - Renamed the class    
    # End of addition by - Ashish Dewangan on 09-12-2024
    # Reason - Added endpoint to get latest details of products

    # Added by - Ashish Dewangan on 18-12-2024
    # Reason - Added endpoint to get availability of a product
    path('check-product-availability/', CheckProductAvailability.as_view()),
    # End of addition by - Ashish Dewangan on 18-12-2024
    # Reason - Added endpoint to get availability of a product
    # Added by - Ashlekh on 18-12-2024
    # Reason - To add path for increasing/decreasing quantity (for guest user in viewcart)
    path("update_viewcart_quantity/", UpdateQuantityInViewCartAPIView.as_view()),
    # End of code - Ashlekh on 18-12-2024
    # Reason - To add path for increasing/decreasing quantity (for guest user in viewcart)
    #Code added by Unnati on 20-12-2024
    #Reason-To get endpoint for product size and color
    path('get-product-size-and-color/',GetProductSizeAndColorAPIView.as_view()),
    #End of code addition by Unnati on 20-12-2024
    #Reason-To get endpoint for product size and color
    # Added by - Unnati Bajaj on 29-11-2024
    # Reason - defined API endpoint for exchange item
     path('exchange-item/',ExchangeItemAPIView.as_view()),
    # End of addition by - Unnati Bajaj on 29-11-2024
    # Reason - defined API endpoint for exchange item
    # Added by - Unnati Bajaj on 22-11-2024
    # Reason - defined API endpoint for paypal exchange payments
    path("create_paypal_order_exchange_item/", CreatePayPalOrderExchangeItemView.as_view()),
    path('capture_paypal_payment_exchange_item/',PayPalOrderExchangeCaptureView.as_view()),
    # End of code addition by - Unnati Bajaj on 22-11-2024
    # Reason - defined API endpoint for paypal exchange payments
    #Code added by Unnati on 22-12-2024
    #Reason-To have endpoints for stripe payment for exchange
    path("create-stripe-session-for-exchange/", CreateStripeSessionIdForExchangeAPI.as_view()),
    path("create-exchange-item-from-stripe/", CreateExchangeFromStripeView.as_view()),
    path("stripe-session-status-exchange/<sessionId>/", CheckStripeSessionForExchange.as_view()),
    #End of code addition by Unnati on 22-12-2024
    #Reason-To have endpoints for stripe payment for exchange
    #Code added by Unnati on 20-12-2024
    #Reason-To get endpoint for exchange tracking id
    path('add-exchange-tracking-details/',AddExchangeTrackingDetailsAPIView.as_view()),
    #End of code addition by Unnati on 20-12-2024
    #Reason-To get endpoint for exchange tracking id
    #Code added by Unnati on 26-12-2024
    #Reason-To get cancelItem endpoint
    path('cancel-item/',CancelItemAPIView.as_view()),
    #End of code addition by Unnati on 26-12-2024
    #Reason-To get cancelItem endpoint
    # Added by - Ashlekh on 01-01-2025
    # Reason - To add path for storing feedback requests
     path('post-feedback/', FeedBackRequestAPIView.as_view()),
    # End of code - Ashlekh on 01-01-2025
    # Reason - To add path for storing feedback requests
    # Added by - Unnati on 05-01-2025
    # Reason - To add path for getting product detail
     path('get-product-details/', GetProductDetailsAPIView.as_view()),
    # End of code -  Unnati on 05-01-2025
    # Reason - To add path for getting product detail
    # Added by - Unnati on 09-01-2025
    # Reason - To add path for order items
     path('order-items/', OrderItemsAPIView.as_view()),
     #End of code addition by - Unnati on 09-01-2025
    # Reason - To add path for order items
    path('banners/', BannerListAPIView.as_view(), name='banner-list'),

]
