from distutils.command.config import config
from logging import raiseExceptions
from multiprocessing import context
from urllib import request, response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework import status
from django.contrib.auth import authenticate
from back_site.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import IsAuthenticated
import random
import string
from django.core import serializers
import jwt
from site_setup.settings import SIMPLE_JWT
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Avg
from django.core.files.base import ContentFile


def specific_string():
    sample_string = 'pqrstuvwxydjlkfdsjk'
    result = ''.join((random.choice(sample_string)) for x in range(10))


# generating token for auth by jwt
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# Create your views here.


class User2API(APIView,):
    def get(self, request):
        datap = product_detail.objects.all()
        datai = image.objects.all()
        serializers1 = product_serializer(datap, many=True) 
        serializers2 = image_serializer(datai, many=True)
        menus= Menus.objects.all().order_by("id")
        submenus=subMenu.objects.all().order_by("id")
        
        
        # Added by Rohan -28/12/22
        # Reason - Sending all menu and submenu in organize form
        Header_menus=[]
        i=0
        for menu in menus:
            i+=1
            #added by rohan-on-17/2/23
            #Reason- To also send image data in organize way
            Header_menus.append({menu.menu:[],"shownMenuNImg":menu.Show_subMenu_with_image,"shownInstFilter":menu.show_instant_filter_for_subMenu})
            for submenu in submenus:
                if(submenu.Menu.menu==menu.menu):
                  serializer=submenuImage(submenu) 
                  Header_menus[i-1][menu.menu].append({"category":submenu.sub,"img":serializer.data['image']})
                      
        return Response({"product": serializers1.data, "image": serializers2.data,"menus":Header_menus})
        # End of the code

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Registration successfully done'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email, password=password)
            
            # if User.objects.exists(email=email,is_active=False) is not None:
            #     return Response({'errors': {'none_field_errors': ['This user is blocked, <br/> For more details']}}, status=status.HTTP_404_NOT_FOUND)
            
            try:
                active=User.objects.get(email=email)
                if active.is_active==False:
                   return Response({'errors': {'none_field_errors': ['This user is blocked , for more detail']}}, status=status.HTTP_404_NOT_FOUND)
                
            except:
                 D=None   

            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'msg': 'login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'none_field_errors': ['Email or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserChangePasswordSerializer(data=request.data, context={
                                                  'user': request.user, 'oldPass': request.data['oldPass']})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'password change successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_)


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serailizer = SendPasswordResetEmailSerializer(data=request.data)
        if serailizer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset Link send. Please check your email'}, status=status.HTTP_200_OK)
        return Response({"error": serailizer.errors})


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_)


class LikedUpdateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serialize = LikeUpdateSerializer(
            data=request.data, context={"user": request.user})
        if serialize.is_valid(raise_exception=True):
            return Response({'msg': "Successful"})

    def get(self, request):
        data = giveLikedDataSerializer(
            Liked.objects.filter(user_no=request.user), many=True)
        return Response({"liked": data.data})
    
    
class likeDelete(APIView):
      def post(self, request):
          pro=product_detail.objects.get(id=request.data['id'])
        # Modified by - Ashish Dewangan on 20-12-2023
        # Reason - To remove item from wishlist of logged in user only  
        # like=Liked.objects.filter(item=pro)
          like=Liked.objects.filter(item=pro,user_no=request.user)
        # End of modification by - Ashish Dewangan on 20-12-2023
        # Reason - To remove item from wishlist of logged in user only
          for singleInstance in like:
              singleInstance.delete()
          return Response({"like"}) 


class CartUpdateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serialize = CartUpdateSerializer(
            data=request.data, context={"user": request.user})
        if serialize.is_valid(raise_exception=True):
            return Response({'msg': "Successful"})

    def get(self, request):
        data = giveCartdDataSerializer(
            Cart.objects.filter(user_no=request.user), many=True)
        return Response({"cart": data.data})


class ProductSetting(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request, category):
        cart = product_detail.objects.filter(category=category)
        serializers1 = product_serializer(cart, many=True)
        return Response({"category": serializers1.data})

# Changes on Rohan -31/12/22

class picget(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request):
       try: 
        ser = getPictureSer(Head_img.objects.filter(display_on="window"), many=True)
        ser2 = getPictureSer(Head_img.objects.filter(display_on="Mobile"), many=True)
        iamges = HomeGifImages.objects.all()
        serialize = getCardSer(iamges,many=True)
        iamges2 = HomeNormalImages.objects.all()
        serialize2 = getcard2ser(iamges2,many=True)
        video=Home_video.objects.all()
        serialize3=getVideoser(video,many=True)
        return Response({"j": ser.data,"h":ser2.data,"Gif": serialize.data,"Normal":serialize2.data,"video":serialize3.data})
       except:
        return Response({"j":None,"h":None,"Gif": None,"Normal":None,"video":None})   


class Givingdetail(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request, id):
        ser = product_serializer(product_detail.objects.get(id=id))
        return Response(ser.data)


class gettingAccess(APIView):
    def post(self, request):
        try:
            tokens = jwt.decode(
                request.data['refresh'], SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
            return Response(get_tokens_for_user(User.objects.get(id=tokens['user_id'])))
        except:
            return Response({"error": "expired"})


class cartBuyAll(APIView):
    def post(self, request):
        return Response(request.data)


class CartSetting(APIView):
    def post(self, request):
        car = Cart.objects.get(user_no=request.user, product_no=product_detail.objects.get(
            id=request.data["id"]), size=request.data['size'])
        car.quantity = request.data['quantity']
        car.save()
        return Response({"success": car.quantity})


class cardImage(APIView):
    def get(self, request):
        # iamges = HomeCard_img.objects.all()
        # serialize = getCardSer(iamges.last())
        # return Response({"response": serialize.data})
        # try:
            iamges = HomeGifImages.objects.all()
            serialize = getCardSer(iamges,many=True)
            iamges2 = HomeNormalImages.objects.all()
            serialize2 = getcard2ser(iamges2,many=True)
            video=Home_video.objects.all()
            serialize3=getVideoser(video,many=True)
            return Response({"Gif": serialize.data,"Normal":serialize2.data,"video":serialize3.data})
        # except:
        #     return Response({"response":0})


class shippingOrder(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shippingData = request.data
        shippingData['user_id'] = request.user.id

        user=User.objects.get(id=shippingData['user_id'])

        # Modified by - Ashish Dewangan on 17-12-2023
        # Reason - To handle shipping details properly
        # if userbillingDetail.objects.filter(user_id=user).count()>0:
        #     serialize2 = shippingSerializer(data=shippingData)
        # else:
        #     shippingData['isSelected']=True    
        #     serialize2 = shippingSerializer(data=shippingData)
        # # Commented and modified by - Ashish Dewangan on 02-12-2023
        # # Reason - If no shipping address is found then create it and make it default shipping address    
        # try:
        #     if serialize2.is_valid(raise_exception=True):
        #         ship = serialize2.save()
        #         return Response({"shipping_id": ship.id})
        # except:
        #     ship = usershippingDetail.objects.get(lastname=request.data['lastname'],firstname=request.data['firstname'],
        #                                  street=request.data['street'],city=request.data['city'],
        #                                  houseno=request.data['houseno'],state=request.data["state"],
        #                                  zipcode=request.data['zipcode'],country=request.data["country"],
        #                                  number=request.data['number'],user_id=request.data['user_id'])
        #     return Response({"shipping_id": ship.id})

        if usershippingDetail.objects.filter(user_id=user).count()==0:
            shippingData['isSelected']=True    

        try:
            existing_address = usershippingDetail.objects.get(lastname=request.data['lastname'],firstname=request.data['firstname'],
                                            street=request.data['street'],city=request.data['city'],
                                            houseno=request.data['houseno'],state=request.data["state"],
                                            zipcode=request.data['zipcode'],country=request.data["country"],
                                            number=request.data['number'],user_id=request.data['user_id'])    
            return Response({"shipping_id": existing_address.id})
        except Exception as ex:
            serialize2 = shippingSerializer(data=shippingData)
            try:
                if serialize2.is_valid(raise_exception=True):
                    ship = serialize2.save()
                    return Response({"shipping_id": ship.id})
            except Exception as e:
                print("An exception occured while saving the shipping address",e)
                ship = usershippingDetail.objects.get(lastname=request.data['lastname'],firstname=request.data['firstname'],
                                            street=request.data['street'],city=request.data['city'],
                                            houseno=request.data['houseno'],state=request.data["state"],
                                            zipcode=request.data['zipcode'],country=request.data["country"],
                                            number=request.data['number'],user_id=request.data['user_id'])
                return Response({"shipping_id": ship.id})
        # Modified by - Ashish Dewangan on 17-12-2023
        # Reason - To handle shipping details properly    
        return Response(request.data)


class billingOrder(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # print(request.data)
        billingData = request.data
        billingData['user_id'] = request.user.id
        serialize2 = billingSerializer(data=billingData)

        # try:
        #     if serialize2.is_valid(raise_exception=True):
        #         bill = serialize2.save()
        #         return Response({"billing_id": bill.id})
        # except:
        #     bill = userbillingDetail.objects.get(lastname=request.data['lastname'],firstname=request.data['firstname'],
        #                                  street=request.data['street'],city=request.data['city'],
        #                                  houseno=request.data['houseno'],state=request.data["state"],
        #                                  zipcode=request.data['zipcode'],country=request.data["country"],
        #                                  number=request.data['number'],user_id=request.data['user_id'])
        #     return Response({"billing_id": bill.id})
        # return Response(request.data)

        try:
            bill = userbillingDetail.objects.get(lastname=request.data['lastname'],firstname=request.data['firstname'],
                                            street=request.data['street'],city=request.data['city'],
                                            houseno=request.data['houseno'],state=request.data["state"],
                                            zipcode=request.data['zipcode'],country=request.data["country"],
                                            number=request.data['number'],user_id=request.data['user_id'])
            
            return Response({"billing_id": bill.id})
        except Exception as e:
            serialize2 = billingSerializer(data=billingData)
            
            if serialize2.is_valid(raise_exception=True):
                bill = serialize2.save()
                return Response({"billing_id": bill.id})
            return Response(request.data)


class Invoice(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            instanceshipping = usershippingDetail.objects.get(
                id=request.data['shipping_id'])
            instancebilling = userbillingDetail.objects.get(
                id=request.data['billing_id'])

            num = 40000
            if Transaction_history.objects.all().last() is not None:
                num = Transaction_history.objects.all().last().order_no+1

            date = 45
            cartdata = []
            # Modification and addition by Om Shrivastava on 25-06-2024
            # Reason : Set the total amount, discounted price 
            # for cart in request.data['cart']:

            #     price = float(cart['price'])
            #     quantity = cart['quantity']
            #     sale_discount_percentage = cart['sale_discount_percentage']
            #     is_sale = cart['is_sale']
            #     print(price,quantity,sale_discount_percentage,is_sale,'checkkkk')
            #     if is_sale:
            #         discount = sale_discount_percentage / 100
            #         product_price_after_sale = price * (1 - discount) * quantity
            #         product_discount_price = price * (1 - discount) 
            #     else:
            #         product_price_after_sale = price * quantity
            #         product_discount_price = 0.0
            #     print(product_price_after_sale,product_discount_price,'checkkkk')
                
            #     cartdata.append(cart)

            #     print(cart,'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
            #     data = {
            #         "order_no": num,
            #         "user_no": request.user.id,
            #         "billing_id": instancebilling.id,
            #         "shipping_id": instanceshipping.id,
            #         "product_id": cart['id'],
            #         "quantity": cart['quantity'],
            #         "price": cart['price'] ,
            #         # "total_price":float(cart['price'])*cart['quantity'],
            #         "total_price": product_price_after_sale if is_sale else price * quantity,
            #         "size": cart['size'],
            #         "payment_mode": request.data['payment'],
            #         "selected_currency_sign": request.data['currency_sign'],
            #         "selected_currency_value": request.data['currency_value'], 
            #         # Added by - Ashish Dewangan on 27-11-2023
            #         # Reason - To add Shipping charges details in purchased items
            #         "shipping_charges":request.data['ShippingCharges'],
            #         # End of code addition by - Ashish Dewangan on 27-11-2023
            #         # Reason - To add Shipping charges details in purchased items
                    
            #         # Added by - Ashish Dewangan on 29-11-2023
            #         # Reason - To save item's name in product orders table
            #         "product_name":cart["title"],
            #         # End of code addition by - Ashish Dewangan on 29-11-2023
            #         # Reason - To save item's name in product orders table

            #         # Added by - Om shrivastasva on 21-06-2024
            #         # Reason - To save product sale discount amount in product orders table
            #         "sale_discount_percentage":cart["sale_discount_percentage"],
            #         "product_price_after_sale":product_price_after_sale,
            #         'product_discount_price' : product_discount_price,
            #         "is_sale": cart["is_sale"]
            #         # End of code addition by - Om shrivastasva on 21-06-2024
            #         # Reason - To save product sale discount amount in product orders table

                    
            #     }
            for cart in request.data['cart']:

                price = float(cart['price'])
                quantity = cart['quantity']
                sale_discount_percentage = cart['sale_discount_percentage']
                is_sale = cart['is_sale']
                # Addition by Om 
                shipping_charge = request.data['ShippingCharges']

                print(quantity, 'quanitity checkkkk')
                print(price, quantity, sale_discount_percentage, is_sale, 'checkkkk')

                # Calculate the product price and discount based on sale status
                if is_sale:
                    discount = sale_discount_percentage / 100
                    product_price_after_sale = price * (1 - discount) * quantity
                    product_discount_price = price * (1 - discount)
                else:
                    product_price_after_sale = price * quantity
                    product_discount_price = 0.0
                print(product_price_after_sale,product_discount_price,'checkkkk')

                grand_total = product_price_after_sale + shipping_charge
                print(grand_total)
                
                cartdata.append(cart)
                data = {
                    "order_no": num,
                    "user_no": request.user.id,
                    "billing_id": instancebilling.id,
                    "shipping_id": instanceshipping.id,
                    "product_id": cart['id'],
                    "quantity": cart['quantity'],
                    "price": cart['price'] ,
                    # "total_price":float(cart['price'])*cart['quantity'],
                    # "total_price": product_price_after_sale if is_sale else price * quantity,
                    "total_price": int(product_price_after_sale),
                    "size": cart['size'],
                    "payment_mode": request.data['payment'],
                    "selected_currency_sign": request.data['currency_sign'],
                    "selected_currency_value": request.data['currency_value'], 
                    # Added by - Ashish Dewangan on 27-11-2023
                    # Reason - To add Shipping charges details in purchased items
                    "shipping_charges":request.data['ShippingCharges'],
                    # End of code addition by - Ashish Dewangan on 27-11-2023
                    # Reason - To add Shipping charges details in purchased items
                    
                    # Added by - Ashish Dewangan on 29-11-2023
                    # Reason - To save item's name in product orders table
                    "product_name":cart["title"], 
                    # End of code addition by - Ashish Dewangan on 29-11-2023
                    # Reason - To save item's name in product orders table

                    # Added by - Om shrivastasva on 21-06-2024
                    # Reason - To save product sale discount amount in product orders table
                    "sale_discount_percentage":cart["sale_discount_percentage"],
                    "product_price_after_sale":product_price_after_sale,
                    'product_discount_price' : product_discount_price,
                    "is_sale": cart["is_sale"],
                    "grand_total": grand_total
                    # End of code addition by - Om shrivastasva on 21-06-2024
                    # Reason - To save product sale discount amount in product orders table

                    
                }
                # End of modification and addition by Om Shrivastava on 25-06-2024
                # Reason : Set the total amount, discounted price 
                
                # Commented and modified by - Ashish Dewangan on 29-11-2023
                # Reason - To copy image of product to product orders table
                # serialize3 = invoiceSerializer(data=data)
                # if serialize3.is_valid(raise_exception=True):
                #     serialize3.save()
                serialize3 = invoiceSerializer(data=data)
                saved_product=None
                if serialize3.is_valid(raise_exception=True):
                    saved_product=serialize3.save()

                try:
                    if saved_product:
                        ordered_product =product_orders.objects.get(id=saved_product.id)
                        product=product_detail.objects.get(id=cart['id'])
                        copied_image=ContentFile(product.img_main.read())
                        copied_name=product.img_main.name.split("/")[-1]+str(datetime.datetime.now())+".jpg"
                        ordered_product.product_image.save(copied_name,copied_image)
                except Exception as e:
                    print(e)
                # End of code modification by - Ashish Dewangan on 29-11-2023
                # Reason - To copy image of product to product orders table        
                    

                # if (cart['size'] == "Short"):
                if (cart['size'] == "Small"):
                
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.S = pro.S-cart['quantity']
                    pro.save()
                elif (cart['size'] == "Extra Short"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.XS = pro.XS-cart['quantity']
                    pro.save()
                        
                elif (cart['size'] == "Medium"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.M = pro.M-cart['quantity']
                    pro.save()
                elif (cart['size'] == "Large"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.L = pro.L-cart['quantity']
                    pro.save()
                elif (cart['size'] == "Extra Large"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.XL = pro.XL-cart['quantity']
                    pro.save()
                elif (cart['size'] == "Extra Extra Large"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.XXL = pro.XXL-cart['quantity']
                    pro.save()
                    
                elif (cart['size'] == "Extra Extra Extra Large"):
                    pro = product_detail.objects.get(id=cart['id'])
                    pro.XXXL = pro.XXXL-cart['quantity']
                    pro.save()    

                
            
            # commented by Rohan - 21/12/22
            # Reason- storing coupon 
            # Commented by - Ashish Dewangan on 17-12-2023
            # Reason - Commented discount because it was not being used
            # if(request.data['CouponDiscount']>0):
            #    used= couponUsed.objects.create(user=request.user,used=request.data['promocode'])
            #    used.save()
            # End of comment - Ashish Dewangan on 17-12-2023
            # Reason - Commented discount because it was not being used 
            # end of the code

            # Commented and modified by - Ashish Dewangan on 29-11-2023
            # Reason - To save shipping details in transaction history
            # tran = Transaction_history.objects.create(order_no=num, payment_status="pending", user_no=request.user, 
            #                                         #   coupon_discount=request.data['CouponDiscount'], 
            #                                           shipping_price=request.data[
            #                                           'ShippingCharges'], subtotal_price=request.data['SubTotal'], 
            #                                         #   tax=request.data['tax'],
            #                                           grand_total=request.data['grand'])
                
            tran = Transaction_history.objects.create(order_no=num, payment_status="pending", user_no=request.user, 
                                                    #   coupon_discount=request.data['CouponDiscount'], 
                                                      shipping_price=request.data[
                                                      'ShippingCharges'], subtotal_price=request.data['SubTotal'], 
                                                    #   tax=request.data['tax'],
                                                      grand_total=request.data['grand'],
                                                      firstname=instanceshipping.firstname,
                                                      lastname=instanceshipping.lastname,
                                                      street=instanceshipping.street,
                                                      houseno=instanceshipping.houseno,
                                                      city=instanceshipping.city,
                                                      state=instanceshipping.state,
                                                      zipcode=instanceshipping.zipcode,
                                                      country=instanceshipping.country,
                                                      number=instanceshipping.number)
            # End of code modification by - Ashish Dewangan on 29-11-2023
            # Reason - To save shipping details in transaction history

            
            tran.save()

            # Commented and modified by - Ashish Dewangan on 27-11-2023
            # Reason - To send purchased items to frontend
            # return Response({"order_no": tran.order_no, 'cart': cartdata})
            purchased_products=product_orders.objects.filter(order_no=tran.order_no)
            purchased_products_serializer=invoiceSerializer(purchased_products,many=True)

            # Modified by - Ashish Dewangan on 11-12-2023
            # Reason - To send payment details to front end
            # return Response({"order_no": tran.order_no, 'cart': cartdata,'purchased_products':purchased_products_serializer.data})
            try:
                payment_details=Payment_Details.objects.get(order_no=tran.order_no)
                payment_details_serializer=PaymentDetailsSerializer(payment_details)
                payment_details_object=payment_details_serializer.data
            except Exception as e:
                payment_details_object=None

            # Modified by - Ashish Dewangan on 15-12-2023
            # Reason - To send payment status to frontend
            # return Response({"order_no": tran.order_no, 'cart': cartdata,'purchased_products':purchased_products_serializer.data
            #                  ,"payment_details":payment_details_object})
            return Response({"order_no": tran.order_no, 'cart': cartdata,'purchased_products':purchased_products_serializer.data
                             ,"payment_details":payment_details_object,"payment_status":tran.payment_status})
            # End of modfication by - Ashish Dewangan on 15-12-2023
            # Reason - To send payment status to frontend

            # Modified by - Ashish Dewangan on 11-12-2023
            # Reason - To send payment details to front end

            # End of code modification by - Ashish Dewangan on 27-11-2023
            # Reason - To send purchased items to frontend
        except Exception as ee:
            print("Error reason = ",ee)
            return Response({"error": "Facing issue on generating bill please contact to Admin"})


class CartDelete(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if Cart.objects.filter(user_no=request.user) is not None:
            Cart.objects.filter(user_no=request.user).delete()
        else:
            return Response("nothing is listed")
        return Response({"done": "successfully"})


class Invoiceget(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serialize = 6
        if product_orders.objects.filter(user_no=request.user) is not None:
            serialize = invoiceSerializer(
                product_orders.objects.filter(user_no=request.user), many=True)
        else:
            return Response({})
        return Response(serialize.data)


class InvoiceSingleget(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serialize = 6
        if product_orders.objects.filter(user_no=request.user) is not None:
            serialize = invoiceSerializer(product_orders.objects.filter(
                user_no=request.user, order_no=request.data['order']), many=True)
        else:
            return Response({})

        shipping = serialize.data[0]['shipping_id']
        billing = serialize.data[0]['billing_id']
        orderno = serialize.data[0]['order_no']

        shippingSeri = shippingSerializer(
            usershippingDetail.objects.get(id=shipping))
        billingSeri = billingSerializer(
            userbillingDetail.objects.get(id=billing))
        transactionSeri = transactionHistorySerialize(
            Transaction_history.objects.get(order_no=orderno)) 
        
        # Modified by - Ashish Dewangan on 11-12-2023
        # Reason - To send payment details to frontend
        # return Response({"history": serialize.data, "shipping": shippingSeri.data, "billing": billingSeri.data, "transaction": transactionSeri.data})
        try:
            payment_details=Payment_Details.objects.get(order_no=orderno)
            payment_details_serializer=PaymentDetailsSerializer(payment_details)
            payment_details_object=payment_details_serializer.data
        except Exception as e:
            payment_details_object=None   

        return Response({"history": serialize.data, "shipping": shippingSeri.data, "billing": billingSeri.data
                         , "transaction": transactionSeri.data
                         , "payment_details":payment_details_object})
        # End of code modification by - Ashish Dewangan on 11-12-2023
        # Reason - To send payment details to frontend


class transactionget(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serialize = 6
        pro = 7
        prodata = []
        if Transaction_history.objects.filter(user_no=request.user) is not None:
            serialize = transactionHistorySerialize(
                Transaction_history.objects.filter(user_no=request.user), many=True)
            for data in serialize.data:
                pro = product_orders.objects.filter(
                    user_no=request.user, order_no=data['order_no']).last()
                data['firstname'] = pro.billing_id.firstname
                data['lastname'] = pro.billing_id.lastname
                prodata.append(data)
        else:
            return Response({})

        return Response({"response": prodata})


class ShippingGetApi(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serialize = 6
        if usershippingDetail.objects.filter(user_id=request.user) is not None:
            serialize = shippingSerializer(
                usershippingDetail.objects.filter(user_id=request.user).order_by("id"), many=True)
        else:
            return Response({})
        return Response(serialize.data)


class ShippingUpdateApi(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serialize = 6
        ship = request.data

        # Added by - Ashish Dewangan on 14-12-2023
        # Reason - If address being saved is same as user's other address then return error response
        existing_shipping_address = usershippingDetail.objects.filter(lastname=ship['lastname'],firstname=ship['firstname'],
                                         street=ship['street'],city=ship['city'],
                                         houseno=ship['houseno'],state=ship["state"],
                                         zipcode=ship['zipcode'],country=ship["country"],
                                         number=ship['number'])
        if(existing_shipping_address.count()>0):
            return Response({"error": "Shipping address already exists."})
        # End of code addition by - Ashish Dewangan on 14-12-2023
        # Reason - If address being saved is same as user's other address then return error response
    
        ship_instance = usershippingDetail.objects.get(id=ship['id'])
        ship_instance.firstname = ship['firstname']
        ship_instance.lastname = ship['lastname']
        ship_instance.state = ship['state']
        ship_instance.city = ship['city']
        ship_instance.houseno = ship['houseno']
        ship_instance.street = ship['street']
        ship_instance.zipcode = ship['zipcode']
        ship_instance.country = ship['country']
        ship_instance.number = ship['number']
        ship_instance.save()
        # if usershippingDetail.objects.filter(user_id=request.user) is not None:
        #     serialize=shippingSerializer(,usershippingDetail.objects.filter(user_id=request.user),many=True)
        # else:
        #     return Response({})
        return Response({"msg": "successFully"})


class ShippingDeleteApi(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        usershippingDetail.objects.get(id=request.data).delete()
        return Response({"msg": "successfully"})


class getQrDetails(APIView):
    def get(self, request):
        try:
            serialize = QrDetailSerializer(Online_Qr.objects.all().last())
            return Response(serialize.data)
        except:
            return Response({"error": "something went wrong"})


class IncrementCheck(APIView):
    def post(self, request):
        try:
            size = request.data['size']
            quantity = request.data['quantity']+1
            product_instance = product_detail.objects.get(
                id=request.data['id'])
            from django.forms.models import model_to_dict
            ff = model_to_dict(product_instance)
            if quantity > ff.get(size):
                return Response({"error": True})
            else:
                return Response({"success": True})
        except:
            return Response({"error": True})


class CouponCheck(APIView):
    def post(self, request):
        
        # Commented by Rohan- 21/12/22
        # Reason- I re-implement coupon logic becuase new requirement occur , Only login user can able to
        # apply coupon
            if request.data['usertoken'] is not None:
                try: 
                    tokens = jwt.decode(
                        request.data['usertoken'], SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                    user=User.objects.get(id=tokens['user_id'])
                except:
                   return Response({"error":"Something went wrong."}) 
                
                try:
                  if couponUsed.objects.filter(user=user,used=request.data['promochar']).count()==0:
                    if coupon.objects.get(promocode=request.data['promochar']) is not None:
                        # print(couponUsed.objects.exists(user=request.user,used=request.data))
                        if coupon.objects.get(promocode=request.data['promochar']).expiry_date < datetime.date.today():
                            return Response({"error": "This coupon is expired."})
                        if coupon.objects.get(promocode=request.data['promochar']).isActive == False:
                            return Response({"error": "This coupon is not active."})
                        serialize = promocodeSerilizer(
                            coupon.objects.get(promocode=request.data['promochar']))
                        
                        return Response(serialize.data)
                  else:
                       return Response({"error":"You already used this coupon."}) 
                except:
                        return Response({"error": "Coupon you entered is not exist."})
            else:
                return Response({"error": "Please login to apply coupon."})
            # End of the code
               


class TaxGet(APIView):
    def get(self, request):
        if Tax.objects.last() is not None:
            serialize = TaxSerilizer(Tax.objects.last())
            return Response(serialize.data)
        return Response({"tax_rate": 1})


class ImportantTextGet(APIView):
    def get(self, request):
        try:
            if ImportantNoticeToBuy.objects.last() is not None:
                serialize = ImportantNoticeSerilizer(
                    ImportantNoticeToBuy.objects.last())
                return Response(serialize.data)
        except:
            return Response({"error": "nothing Found"})


class CartRecheck(APIView):
   
    def post(self, request):
        # print(request.data)
        user=User.objects.get(email=request.data['email'])
        if user.is_active==False:
           return Response({"error_user": True})
        
        # Commented and modified by - Ashish Dewangan on 09-12-2023
        # Reason - To check if product is inactive or out of stock and also if user is active or not. 
        
        # car = []
        # for cart in request.data['cart']:
        #     if (cart['size'] == "Short"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.S:
        #             car.append(
        #                 {"id": pro.id, "size": "Short", "name": pro.title})
        #     elif (cart['size'] == "Medium"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.M:
        #             car.append(
        #                 {"id": pro.id, "size": "Medium", "name": pro.title})
        #     elif (cart['size'] == "Extra Short"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.XS:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Short", "name": pro.title})        
        #     elif (cart['size'] == "Large"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.L:
        #             car.append(
        #                 {"id": pro.id, "size": "Large", "name": pro.title})
        #     elif (cart['size'] == "Extra Large"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.XL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Large", "name": pro.title})
        #     elif (cart['size'] == "Extra Extra Large"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.XXL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Extra Large", "name": pro.title})
            
        #     elif (cart['size'] == "Extra Extra Extra Large"):
        #         pro = product_detail.objects.get(id=cart['id'])
        #         if cart['quantity'] > pro.XXXL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Extra Extra Large", "name": pro.title})        

        # if len(car) > 0:
        #     return Response({"error_cart": car})
        # else:
        #     return Response({"Success": "go ahead"})

        inactive_products = []
        car = []
        # Modification and addition by Om Shrivastava on 03-07-2024
        # Reason : If the quantity of product is not available then I need to pass the value 0
        # for cart in request.data['cart']:
        #     pro = product_detail.objects.get(id=cart['id'])
        #     if pro.is_active == False:
        #         inactive_products.append({"id": pro.id, "name" : pro.title})
        #     # if (cart['size'] == "Short"):
        #     if (cart['size'] == "Small"):
            
        #         if cart['quantity'] > pro.S:
        #             car.append(
        #                 # {"id": pro.id, "size": "Short", "name": pro.title})
        #                 {"id": pro.id, "size": "Small", "name": pro.title})
                    
        #     elif (cart['size'] == "Medium"):
        #         if cart['quantity'] > pro.M:
        #             car.append(
        #                 {"id": pro.id, "size": "Medium", "name": pro.title})
        #     elif (cart['size'] == "Extra Short"):
        #         if cart['quantity'] > pro.XS:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Short", "name": pro.title})        
        #     elif (cart['size'] == "Large"):
        #         if cart['quantity'] > pro.L:
        #             car.append(
        #                 {"id": pro.id, "size": "Large", "name": pro.title})
        #     elif (cart['size'] == "Extra Large"):
        #         if cart['quantity'] > pro.XL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Large", "name": pro.title})
        #     elif (cart['size'] == "Extra Extra Large"):
        #         if cart['quantity'] > pro.XXL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Extra Large", "name": pro.title})
            
        #     elif (cart['size'] == "Extra Extra Extra Large"):
        #         if cart['quantity'] > pro.XXXL:
        #             car.append(
        #                 {"id": pro.id, "size": "Extra Extra Extra Large", "name": pro.title})        

        # if len(inactive_products)>0:
        #     return Response({"error_inactive": inactive_products})
        # else:
        #     if len(car) > 0:
        #         return Response({"error_cart": car})
        #     else:
        #         return Response({"Success": "go ahead"})

        for cart in request.data['cart']:
            pro = product_detail.objects.get(id=cart['id'])

            # Check if the product is inactive
            if not pro.is_active:
                inactive_products.append({"id": pro.id, "name": pro.title})

            # Define a dictionary to map sizes to their corresponding product attributes
            size_to_attribute = {
                "Small": pro.S if pro.S is not None else 0,
                "Medium": pro.M if pro.M is not None else 0,
                "Extra Short": pro.XS if pro.XS is not None else 0,
                "Large": pro.L if pro.L is not None else 0,
                "Extra Large": pro.XL if pro.XL is not None else 0,
                "Extra Extra Large": pro.XXL if pro.XXL is not None else 0,
                "Extra Extra Extra Large": pro.XXXL if pro.XXXL is not None else 0
            }

            # Get the size and quantity from the cart
            size = cart.get('size')
            quantity = cart.get('quantity', 0)

            # Check if the quantity exceeds the available stock for the size
            if size in size_to_attribute and quantity > size_to_attribute[size]:
                car.append({"id": pro.id, "size": size, "name": pro.title})

        # Check for inactive products or products with insufficient stock
        if inactive_products:
            return Response({"error_inactive": inactive_products})
        elif car:
            return Response({"error_cart": car})
        else:
            return Response({"Success": "go ahead"})
        
        # End of modification and addition by Om Shrivastava on 03-07-2024
        # Reason : If the quantity of product is not available then I need to pass the value 0

            
        # End of code modification by - Ashish Dewangan on 09-12-2023
        # Reason - To check if product is inactive or out of stock and also if user is active or not.

class ShippingTick(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user).order_by("firstname"), many=True).data)
        except:
            return Response({"error": "Nothing Found"})

    def post(self, request):
        try:
            # if usershippingDetail.objects.get(id=request.data,user_id=request.user).isSelected==True:
            #     data=usershippingDetail.objects.get(id=request.data)
            #     data.isSelected=False
            #     data.save()
            #     return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user),many=True).data)
            if usershippingDetail.objects.get(id=request.data, user_id=request.user).isSelected == False:
                data2 = usershippingDetail.objects.filter(user_id=request.user)
                for element in data2:
                    element.isSelected = False
                    element.save()
                data = usershippingDetail.objects.get(id=request.data)
                data.isSelected = True
                data.save()
                return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user), many=True).data)
            return Response(shippingSerializer(usershippingDetail.objects.filter(user_id=request.user), many=True).data)
        except:
            return Response({"error": "you are facing error on shipping"})


class updateUser(APIView):
    def post(self, request):
        user = User.objects.get(id=request.user.id)
        user.email = request.data['email']
        user.name = request.data['firstname']+" "+request.data["lastname"]
        user.contact_number=request.data['contact']
        user.save()

        data = {"name": user.name, "email": user.email,"contact":user.contact_number}
        return Response(data)


# Added by Ashish on 06-11-2022
# Reason - To have FAQ functionality
class FAQView(APIView):
    def get(self, request):
        faqs = FAQ.objects.all().order_by("qno").values()
        faqList = {}
        faqList['faqs'] = faqs
        return Response(faqList)
# End of code addition

# Added by Ashish on 09-11-2022
# Reason - To send contact us details to front end


class ContactUsView(APIView):
    def get(self, request):
        contactUsDetail = ContactUs.objects.all().values()
        contactUsResponse = {}
        contactUsResponse['contactUsDetail'] = contactUsDetail
        return Response(contactUsDetail)
# End of code addition

# Added by Ashish on 13-11-2022
# Reason - To send T&C details to front end


class TermAndConditionView(APIView):
    def get(self, request):
        TermAndConditionDetail = TermAndCondition.objects.all().values()
        TermAndConditionResponse = {}
        TermAndConditionResponse['TermAndConditionDetail'] = TermAndConditionDetail
        return Response(TermAndConditionDetail)
# End of code addition

# Added by Ashish on 13-11-2022
# Reason - To send Privacy policy details to front end


class PrivacyPolicyView(APIView):
    def get(self, request):
        PrivacyPolicyDetail = PrivacyPolicy.objects.all().values()
        PrivacyPolicyResponse = {}
        PrivacyPolicyResponse['PrivacyPolicyDetail'] = PrivacyPolicyDetail
        return Response(PrivacyPolicyDetail)
# End of code addition

# Added by Ashish on 13-11-2022
# Reason - To send delivery and shipping policy details to front end


class DeliveryAndShippingPolicyView(APIView):
    def get(self, request):
        DeliveryAndShippingPolicyDetail = DeliveryAndShippingPolicy.objects.all().values()
        DeliveryAndShippingPolicyResponse = {}
        DeliveryAndShippingPolicyResponse['DeliveryAndShippingPolicyDetail'] = DeliveryAndShippingPolicyDetail
        return Response(DeliveryAndShippingPolicyDetail)
# End of code addition

# Added by Ashish on 14-11-2022
# Reason - To send refund policy details to front end


class RefundPolicyView(APIView):
    def get(self, request):
        RefundPolicyDetail = ReturnPolicy.objects.all().values()
        RefundPolicyResponse = {}
        RefundPolicyResponse['RefundPolicyDetail'] = RefundPolicyDetail
        return Response(RefundPolicyDetail)
# End of code addition

# Added by Ashish on 14-11-2022
# Reason - To send cancellation policy details to front end


class CancellationPolicyView(APIView):
    def get(self, request):
        CancellationPolicyDetail = CancellationPolicy.objects.all().values()
        CancellationPolicyResponse = {}
        CancellationPolicyResponse['CancellationPolicyDetail'] = CancellationPolicyDetail
        return Response(CancellationPolicyDetail)
# End of code addition

# Added by Ashish on 14-11-2022
# Reason - To send Store locator details to front end


class StoreLocatorView(APIView):
    def get(self, request):
        # Modified by - Ashish Dewangan on 23-12-2023
        # Reason - To sort list by id
        # StoreLocatorDetail = StoreLocator.objects.all().values()
        StoreLocatorDetail = StoreLocator.objects.all().order_by("id").values()
        # End of modification by - Ashish Dewangan on 23-12-2023
        # Reason - To sort list by id
        StoreLocatorResponse = {}
        StoreLocatorResponse['StoreLocatorDetail'] = StoreLocatorDetail
        return Response(StoreLocatorDetail)
# End of code addition

# Added by Ashish on 16-11-2022
# Reason - To send social links to front end


class SocialLinkView(APIView):
    def get(self, request):
        SocialLinkDetail = SocialLink.objects.all().values()
        SocialLinkResponse = {}
        SocialLinkResponse['SocialLinkDetail'] = SocialLinkDetail
        return Response(SocialLinkDetail)
# End of code addition

# Added by Ashish on 16-11-2022
# Reason - To send bridal to front end


class BridalView(APIView):
    def get(self, request):
        BridalDetail = Bridal.objects.all().values()
        BridalResponse = {}
        BridalResponse['BridalDetail'] = BridalDetail
        return Response(BridalDetail)
# End of code addition

# Added by Ashish on 17-11-2022
# Reason - To send bridal form details to front end


class BridalFormView(APIView):
    def post(self, request, format=None):
        serializer = BridalFormSerializer(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'msg': 'bridal details posted'}, status=status.HTTP_200_OK)
# End of code addition

# Added by Ashish on 17-11-2022
# Reason - To send copyright text to front end


class CopyrightView(APIView):
    def get(self, request):
        CopyrightDetail = Copyright.objects.all().values()
        return Response(CopyrightDetail)
# End of code addition

# Added by Ashish on 17-11-2022
# Reason - To get EmailSubscription details  from ui end


class EmailSubscriptionView(APIView):
    def post(self, request, format=None):
        email = EmailSubscription.objects.filter(
            email=request.data.get("email"))
        if (email):
            return Response({'error': 'You have already subscribed to updates'}, status=status.HTTP_200_OK)
        else:
            serializer = EmailSubscriptionSerializer(data=request.data)
            if (serializer.is_valid(raise_exception=True)):
                serializer.save()
                return Response({'msg': 'You have successfully subscribed to email updates'}, status=status.HTTP_200_OK)
# End of code addition


# Added by Rohan on 17-11-2022
# Reason-To Get instagram collections in ui

class InstagrampostRetrive(APIView):
    def get(self, request):
        try:
            if InstagramCollection.objects.last() is not None:
                instagram = InstagramCollection.objects.last()
                serialize = InstagramCollectionSerializer(instagram)
                return Response(serialize.data)
        except:
            return Response({"error": "Nothing Found"})
# End of code addition

# Added by Ashish dewangan on 18-11-2022
# Reason - to have search functionality
# Jira issue no - RBYR -141


class SearchProductView(APIView):
    def get(self, request, query):
        # print("query----------------------",query.replace(" ",""))
        
        # AllProduct = product_detail.objects.all()
        AllProduct = product_detail.objects.filter(is_active=True)

        wordsArray = query.split()
        import itertools
        permutations = list(itertools.permutations(wordsArray))

        combinationArray = []
        combinationArrayOfHighestWordLength = []
        length = len(query.replace(" ", ""))
        # print("len--------------------------",length)
        for permutation in permutations:
            combination = ""
            for word in permutation:
                combination = combination+word
                combinationArray.append(combination)

        # print("combinationArray--------------------------",combinationArray)
        for w in combinationArray:
            if (len(w) == length):
                combinationArrayOfHighestWordLength.append(w)

        # print("combinationArraywit len--------------------------",combinationArrayOfHighestWordLength)
        resultSet = {}
        for data in combinationArrayOfHighestWordLength:
            # print("data--------------------------",data)
            if (AllProduct.filter(search_key__icontains=data)):
                resultSet = AllProduct.filter(search_key__icontains=data)
        # print("product........",AllProduct)
        # print("result---------------",resultSet)
        if (len(resultSet) == 0):
            for data in combinationArray:
                # print("data--------------------------",data)
                if (AllProduct.filter(search_key__icontains=data)):
                    resultSet = AllProduct.filter(search_key__icontains=data)
                    
        #Added by Rohan on- 11/1/23 
        # Reason - getting all unique category of result
        categories=[]
        for product in resultSet:
            if product.category in categories:   
                print("")
            else:
                categories.append(product.category)
                
            if product.menu in categories:   
                print("")
            else:
                categories.append(product.menu)     
                
        # End of Code

        serializedData = product_serializer(resultSet, many=True)
        return Response({"result":serializedData.data,"categories":categories})
# End of code addition

# Added by Ashish on 19-11-2022
# Reason-To send logo and cover images to frontend


class LogoAndCoverView(APIView):
    def get(self, request):
        LogoAndCoverDetail = LogoAndCover.objects.all().values()
        LogoAndCoverResponse = {}
        LogoAndCoverResponse['BLogoAndCoverDetail'] = LogoAndCoverDetail
        return Response(LogoAndCoverDetail)
# End of code addition

# Added by Ashish on 21-11-2022
# Reason-To have footer text in the table


class FooterDescriptionView(APIView):
    def get(self, request):
        footerDescriptionDetail = FooterDescription.objects.all().values()
        return Response(footerDescriptionDetail)
# End of code addition

# Added by Ashish Dewangan on 23-11-2022
# Reason - To save size chart image
# Jira issue no - RBYR-193


class WomenClothSizeChartView(APIView):
    def get(self, request):
        womenClothSizeChartDetail = WomenClothSizeChart.objects.all().values()
        return Response(womenClothSizeChartDetail)
# End of code addition

# Added by Ashish on 24-11-2022
# Reason - To save custom tailored details


class CustomTailoredFormView(APIView):
    def post(self, request, format=None):
        serializer = CustomTailoredFormSerializer(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'msg': 'custom tailored details posted'}, status=status.HTTP_200_OK)
# End of code addition

# Added by Ashish on 24-11-2022
# Reason - To send whatsapp contact number to frontend


class LogoAndNumberView(APIView):
    def get(self, request):
        WhatsappContactDetail = LogoAndNumber.objects.all().values()
        return Response(WhatsappContactDetail)
# End of code addition


# Added by Rohan kansari on 25-11-2022
    # reason- To consist data for guest user
    # jira issue -RBYR-208
class GeustCart(APIView):
    def post(self, request):
        for data in request.data:
            availability=Cart.objects.filter(product_no=product_detail.objects.get(id=data['id']), size=data['size']).count()==0
            # if (data['size'] == "Short" and availability):
            if (data['size'] == "Small" and availability):

                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()
            elif (data['size'] == "Medium" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()
            
            elif (data['size'] == "Extra Short" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()

            elif (data['size'] == "Large" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()

            elif (data['size'] == "Extra Large" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()

            elif (data['size'] == "Extra Extra Large" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()
            
            elif (data['size'] == "Extra Extra Extra Large" and availability):
                pro = product_detail.objects.get(id=data['id'])
                Cart.objects.create(
                    product_no=pro, size=data['size'], quantity=data['quantity'], user_no=request.user).save()

        return Response(request.data)
    # end of code Addition

    # Added By Rohan kansari
    # reason- Pagination functionality where it give one by one page data in each call
    # jira issue-RBYR233


class pageIndex(APIView):
    def post(self, request):
        try:
            products = []
            # Add by Rohan - 30/12/22
            # Reason - Changing view all functionality becuase for requirement of sending header menu from backend
            if (request.data['category']=="0" and request.data['parent']!="ready to ship" and request.data['parent']!="best seller"):
                # products = product_detail.objects.filter(category="partywear") | product_detail.objects.filter(category="kurti") | product_detail.objects.filter(
                #     category="casual") | product_detail.objects.filter(category="wedding_wear") | product_detail.objects.filter(category="formal")
                menu=Menus.objects.get(menu=request.data['parent'])
                # Modification and addition by Om Shrivastava on 03-11-23
                # Reason : When the product is_active then it show on frontendside
                # products=product_detail.objects.filter(upper_menu=menu).order_by("id")
                products=product_detail.objects.filter(upper_menu=menu,is_active=True).order_by("id")

                # print(products.count(),'product count if parttttttttttt')
                # End of Modification and addition by Om Shrivastava on 03-11-23
                # Reason : When the product is_active then it show on frontendside
            # End of code
            
            # Added by Rohan -5/1/22
            # Reason- Adding ready to wear functionality where all ready to ship product shown on this link
            elif (request.data['parent']=="ready to ship" and request.data['category']=="0"):
                products=product_detail.objects.filter(ready_to_ship=True,is_active=True).order_by("-id")
                
            elif(request.data['parent']=="best seller" and request.data['category']=="0"):
                products=product_detail.objects.filter(bestSeller=True,is_active=True).order_by("-id")
  
            # End of code
            else:
                products = product_detail.objects.filter(
                    category=request.data['category'],is_active=True)
                

            if (request.data['lth'] and request.data['availablity']):
                products = products.filter(available=True).order_by("price").order_by("id")
            elif (request.data['htl'] and request.data['availablity']):
                products = products.filter(available=True).order_by("-price").order_by("id")
            elif (request.data['latest'] and request.data['availablity']):
                products = products.filter(available=True).order_by('-date').order_by("id")
            elif (request.data['htl']):
                products = products.order_by("-price").order_by("id")
            elif (request.data['lth']):
                products = products.order_by("price").order_by("id")
            elif (request.data['latest']):
                products = products.order_by("-date").order_by("id")
            elif (request.data['availablity']):
                products = products.filter(available=True).order_by("id")

            # print(products.count(),'producttttttttttt count')
            # productCount = products.count()
            # productsCount = products.filter(is_active=True)
            productCount = products.count()
            # print(productCount,'product counttttttttttttttt')
            
            
            colors = []
            for product in products:
                if product.color in colors:
                    print("")
                else:
                    colors.append(product.color)
                    
            categories=[]
            for product in products:
                if product.category in categories:   
                    print("")
                else:
                    categories.append(product.category)         

            from django.core.paginator import Paginator
            p = Paginator(products, 8)

            pageno = request.data['pageIndex']
            serialize = product_serializer(
                p.page(pageno).object_list, many=True)
            
            return Response({"products": serialize.data, "colors": colors,"categories":categories,
                            #  'productCount':productCount,
                             'productsCount':productCount,
                            #  'productCount':productCount,

                             })
        except:
            return Response({"error": True}) 
    # end of code Addition


# Added By Rohan kansari
# reason- Adding Currency saver
# jira issue-RBYR233
class Currency(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        user = User.objects.get(id=request.user.id)
        try:
            serialize =CurrencySerializer(CurrencySelected.objects.get(user=user))
            return Response(serialize.data)
        except:
            CurrencySelected.objects.create(
                user=user,currency="INR", currency_sign="₹", currency_value="1.0").save()
        return Response(request.data)

    def post(self, request):
        user = User.objects.get(id=request.user.id)

        try:
            currency = CurrencySelected.objects.get(user=user)
            currency.currency=request.data['name']
            currency.currency_sign = request.data['sign']
            currency.currency_value = request.data['value']
            currency.save()
            # print(currency.currency_sign)
        except:
            CurrencySelected.objects.create(
                user=user,currency=request.data['currency'],currency_sign=request.data['sign'], currency_value=request.data['value']).save()
        return Response(request.data)    

# end of code Addition

# Added by Rohan on 30/12/22
#Reason- sending worldofrr page data
class WorldofRRApi(APIView):
    renderer_classes = [UserRenderer]
    
    def get(self,request):
     Whole_data={}
     Design=0   
     try:   
        serialize=ItDesignSerializer(ItDesignContent.objects.last())
        Design=serialize.data
     except:
        Design=None  
        
     Whole_data["ItDesign"]=Design 
     
     
    #  Added by Rohan - on 4/1/22
    # Reason-Sending all celebrity data
     celebrity=0
     try:
        serialize=celebritySerializer(Celebrity.objects.all(),many=True)
        celebrity=serialize.data
     except:    
        celebrity={"blank":0} 
     Whole_data['celebrity']=celebrity
    # End of the code  
    
    #  Added by Rohan - on 5/1/22
    # Reason-Sending all editorial data and about us content
     editorial=0
     try:
        serialize=editorialSerializer(Editorial.objects.all(),many=True)
        editorial=serialize.data
     except:    
        editorial={"blank":0} 
     Whole_data['editorial']=editorial
     
     about={}
     try:
        serialize=worldOfrbyRContentSerializer(WorldOfRByRContent.objects.last())
        about['content']=serialize.data

        # Commented and modified by - Ashish Dewangan on 15-12-2023
        # Reason - To show latest data after old data
        # serializer2=worldOfrbyRRowSerializer(worldOfRByRRow.objects.all(),many=True)
        serializer2=worldOfrbyRRowSerializer(worldOfRByRRow.objects.all().order_by("id"),many=True)
        # End of code modification by - Ashish Dewangan on 15-12-2023
        # Reason - To show latest data after old data
        about['row']=serializer2.data

     except:    
        about=None 
     Whole_data['about']=about
     
     feature=0
     try:
        serialize=featureSerializer(Feature.objects.all(),many=True)
        feature=serialize.data
     except:    
        feature=None 
     Whole_data['feature']=feature
    # End of the code  
     return Response(Whole_data)
#End of code




# Commented by Ashish on 04-12-2022
# Reason - Put these code in single method in template
# #Added by Ashish on 01-12-2022
# #Reason - To send todays orders to admin panel
# class todaysOrdersView(APIView):
#     def get(self,request):
#         today=datetime.date.today()
#         if Transaction_history.objects.filter(date=today) is not None:
#             serialize=transactionHistorySerialize(Transaction_history.objects.filter(date=today).order_by("-payment_status"),many=True)
#         else:
#             return Response({})
#         return Response(serialize.data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send todays orders summary to admin panel
# class todaysOrdersSummaryView(APIView):
#     def get(self,request):
#         today=datetime.date.today()
#         totalOrders = Transaction_history.objects.filter(date=today).count()
#         totalPendingOrders = Transaction_history.objects.filter(date=today,payment_status='pending').count()
#         totalPaidOrders = Transaction_history.objects.filter(date=today,payment_status='paid').count()
#         totalCancelledOrders = Transaction_history.objects.filter(date=today,payment_status='cancel').count()
#         totalIncome = Transaction_history.objects.filter(date=today,payment_status='paid').aggregate(Sum("grand_total"))
#         data=dict()
#         data["totalOrders"]=totalOrders
#         data["totalPendingOrders"]=totalPendingOrders
#         data["totalPaidOrders"]=totalPaidOrders
#         data["totalCancelledOrders"]=totalCancelledOrders
#         data["totalRevenue"]=totalIncome["grand_total__sum"]
#         return Response(data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send weekly orders to admin panel
# class weeklyOrdersView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         weekDay=today.weekday()
#         startOfTheWeek=today - timedelta(days=weekDay)
#         serialize=transactionHistorySerialize(Transaction_history.objects.filter(date__gte=startOfTheWeek).order_by("-payment_status"),many=True)
#         return Response(serialize.data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send weekly orders summary to admin panel
# class weeklyOrdersSummaryView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         weekDay=today.weekday()
#         startOfTheWeek=today - timedelta(days=weekDay)
#         totalOrders=Transaction_history.objects.filter(date__gte=startOfTheWeek).count()
#         totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='pending').count()
#         totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='paid').count()
#         totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='cancel').count()
#         totalIncome=Transaction_history.objects.filter(date__gte=startOfTheWeek,payment_status='paid').aggregate(Sum("grand_total"))
#         data=dict()
#         data["totalOrders"]=totalOrders
#         data["totalPendingOrders"]=totalPendingOrders
#         data["totalPaidOrders"]=totalPaidOrders
#         data["totalCancelledOrders"]=totalCancelledOrders
#         data["totalRevenue"]=totalIncome["grand_total__sum"]
#         return Response(data)
# #End of code addition


# #Added by Ashish on 01-12-2022
# #Reason - To send monthly orders to admin panel
# class monthlyOrdersView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         dayOfMonth=today.day
#         startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
#         serialize=transactionHistorySerialize(Transaction_history.objects.filter(date__gte=startOfTheMonth).order_by("-payment_status"),many=True)
#         return Response(serialize.data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send monthly orders summary to admin panel
# class monthlyOrdersSummaryView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         dayOfMonth=today.day
#         startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
#         totalOrders=Transaction_history.objects.filter(date__gte=startOfTheMonth).count()
#         totalPendingOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='pending').count()
#         totalPaidOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='paid').count()
#         totalCancelledOrders = Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='cancel').count()
#         totalIncome=Transaction_history.objects.filter(date__gte=startOfTheMonth,payment_status='paid').aggregate(Sum("grand_total"))
#         data=dict()
#         data["totalOrders"]=totalOrders
#         data["totalPendingOrders"]=totalPendingOrders
#         data["totalPaidOrders"]=totalPaidOrders
#         data["totalCancelledOrders"]=totalCancelledOrders
#         data["totalRevenue"]=totalIncome["grand_total__sum"]
#         return Response(data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send yearly orders to admin panel
# class yearlyOrdersView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         thisYear=today.year
#         serialize=transactionHistorySerialize(Transaction_history.objects.filter(date__year=thisYear).order_by("-payment_status"),many=True)
#         return Response(serialize.data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send yearly orders summary to admin panel
# class yearlyOrdersSummaryView(APIView):
#     def get(self,request):
#         today = datetime.date.today()
#         thisYear=today.year
#         totalOrders=Transaction_history.objects.filter(date__year=thisYear).count()
#         totalPendingOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='pending').count()
#         totalPaidOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='pending').count()
#         totalCancelledOrders = Transaction_history.objects.filter(date__year=thisYear,payment_status='pending').count()
#         totalIncome=Transaction_history.objects.filter(date__year=thisYear,payment_status='paid').aggregate(Sum("grand_total"))
#         data=dict()
#         data["totalOrders"]=totalOrders
#         data["totalPendingOrders"]=totalPendingOrders
#         data["totalPaidOrders"]=totalPaidOrders
#         data["totalCancelledOrders"]=totalCancelledOrders
#         data["totalRevenue"]=totalIncome["grand_total__sum"]
#         return Response(data)
# #End of code addition

# #Added by Ashish on 01-12-2022
# #Reason - To send pengin orders to admin panel
# class pendingOrdersView(APIView):
#     def get(self,request):
#         serialize=transactionHistorySerialize(Transaction_history.objects.filter(payment_status='pending'),many=True)
#         return Response(serialize.data)
# #End of code addition

# # # @authenticate
# # def whatPage(request):
# #     from django.shortcuts import render
# #     return render(request,"what.html",{"name":"ddd"})
# # def somePage(request):
# #     from django.shortcuts import render
# #     return render(request,"some.html")
# End of comment


# #Added by Ashish on 07-12-2022
# #Reason - To send details of recently viewed products
class RecentlyViewedProductsView(APIView):
    def post(self,request):
        ids=request.data
        if len(ids)>0:
            
            products = product_detail.objects.filter(id__in=ids)
            serializer = product_serializer(products,many=True)
            return Response({"products":serializer.data})
        else:
            return Response({"products":[]})
# #End of code addition by Ashish on 07-12-2022
# #Reason - To send details of recently viewed products