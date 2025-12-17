
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
from django.db.models import Max
from django.db.models import Min
from django.core.paginator import Paginator
from django.db.models import Q
import logging
from datetime import datetime
from django.db.models import Sum
from django.db.models import OuterRef, Subquery, Max
from django.utils.dateparse import parse_datetime
from django.db.models import Count
import re
from decimal import Decimal, InvalidOperation
from django.db.models.functions import Cast
from django.db.models import Q, F, Sum, FloatField
"""
Added by - Unnati Bajaj on 26-05-2024
Reason -To import default token generator,send_mail
"""
from django.contrib.auth.tokens import default_token_generator
from .utils.emailUtils import *
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from decimal import Decimal
from datetime import datetime, timedelta
import re
import base64
from django.core.files.base import ContentFile
import imghdr

logger = logging.getLogger("custom_logger")
"""
End of code addition by - Unnati Bajaj on 26-05-2024
Reason -To import default token generator
"""
import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv
load_dotenv()
import json
from django.views.decorators.csrf import csrf_exempt
"""
Added by - Ashish Dewangan on 23-05-2024
Reason - Created API to post user details/sign up
"""
from django.utils.timezone import now
from rest_framework import status
from backend.config import *
import stripe
from django.http import HttpResponse
from django.conf import settings
from django.db.models import F, Window
from django.db.models.functions import RowNumber
class SignupAPIView(APIView):
    def post(self, request):

        data = {
            "username": request.data["first_name"],

            # Modified by jhamman on 26-10-2024
            # Reason - convert Email in lowercase
            # "email": request.data["email"],
            "email": request.data["email"].lower(),
            # End of modification by jhamman on 26-10-2024
            # Reason - convert Email in lowercase

            "password": make_password(request.data["password"]),
            "confirm_password": request.data["confirm_password"],

            # Uncommented by jhamman on 18-10-2024
            # Reason added this field now
            "contact_number": request.data["contact_number"],
            "gender": request.data["gender"],
            # End of uncommentation by jhamman on 18-10-2024
            # Reason added this field now
            "first_name": request.data["first_name"],
            "last_name": request.data["last_name"],
        }
        userSerializer = UserSerializer(data=data)

        try:
            if userSerializer.is_valid(raise_exception=True):
                userSerializer.save()
                return Response({"success": "Registration done successfully"}, 200)
        except Exception as e:

            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            if "email" in userSerializer.errors.keys():
                return Response({"error": "Email already registered"}, 500)
            return Response(userSerializer.errors, 500)


"""
End of code addition by - Ashish Dewangan on 23-05-2024
Reason - Created API to post user details/sign up
"""

"""
Added by - Ashish Dewangan on 22-05-2024
Reason - Created login API
"""


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data["email"]

        # Added by jhamman on 19-10-2024
        # Reason - if we get email in upper case then it will convert in lower case
        email = email.lower()
        # End of addition by jhamman on 19-10-2024
        # Reason - if we get email in upper case then it will convert in lower case

        password = request.data["password"]
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({"error": "User account is inactive"}, 403)
            if check_password(password, user.password):

                refresh = RefreshToken.for_user(user)

                return Response({
                    'success': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {"id": user.id,
                             "first_name": user.first_name,
                             "last_name": user.last_name,
                             "email": user.email,
                             # Added by - Ashlekh on 06-12-2024
                             # Reason - To send gender in response
                             "gender": user.gender,
                             # End of code - Ashlekh on 06-12-2024
                             # Reason - To send gender in response
                             }
                    #  "contact_number": user.contact_number}
                }, 200)
            else:
                return Response({"error": "Invalid username or password"}, 401)
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({"error": "User not found"}, 404)


"""
End of code addition by - Ashish Dewangan on 22-05-2024
Reason - Created login API
"""

"""
Added by - Ashish Dewangan on 22-05-2024
Reason - Created API to generate new access token from refresh token
"""


class TokenAPIVIew(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            refresh = RefreshToken(refresh_token)

            return Response({
                'refresh':     str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({
                "message": "Token expired"
            }, 500)


"""
End of code addition by - Ashish Dewangan on 22-05-2024
Reason - Created API to generate new access token from refresh token
"""

"""
Added by - Ashish Dewangan on 22-05-2024
Reason - Created user APIs
"""


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        userSerializer = UserSerializer(request.user)
        return Response({
            "user": {"id": userSerializer.data['id'],
                     "first_name": userSerializer.data['first_name'],
                     "last_name": userSerializer.data['last_name'],
                     "email": userSerializer.data['email'],
                     "contact_number": userSerializer.data['contact_number'],
                     # Code added by Unnati on 26-09-2024
                     # Reason-To get gender and date of birth in user details
                     "gender": userSerializer.data['gender'],
                     "date_of_birth": userSerializer.data['date_of_birth'],
                     # End of code addition by Unnati on 26-09-2024
                     # Reason-To get gender and date of birth in user details
                     # Code added by Unnati on 25-10-2024
                     # Reason-To get is active
                     "is_active": userSerializer.data['is_active']}
            # End of code addition Unnati on 25-10-2024
            # Reason-To get is active
        }, 200)

    def put(self, request):
        user_data = request.data

        if 'first_name' in user_data:
            user_data['username'] = user_data['first_name']

        userSerializer = UserSerializer(
            request.user, data=user_data, partial=True)

        if userSerializer.is_valid():
            userSerializer.save()
            return Response({
                "user": {
                    "username": userSerializer.data['first_name'],
                    "first_name": userSerializer.data['first_name'],
                    "last_name": userSerializer.data['last_name'],
                    "email": userSerializer.data['email'],
                    "contact_number": userSerializer.data['contact_number'],
                    "gender": userSerializer.data['gender'],
                    "date_of_birth": userSerializer.data['date_of_birth'],
                    "id": userSerializer.data["id"],
                }
            }, 200)

        else:
            return Response(userSerializer.errors, 400)


"""
End of code addition by - Ashish Dewangan on 22-05-2024
Reason - Created user APIs
"""

"""
Added by - Unnati on 26-05-2024
Reason - Created forgotPassword APIs
"""


class ForgotPasswordAPIView(APIView):
    def post(self, request):
        if request.data["postFor"] == "email":
            email = request.data["data"]["email"]
            try:
                user = User.objects.get(email=email)
                otp = generate_otp()
                user.otp = otp
                # Added by - Ashlekh on 18-11-2024
                # Reason - To add expiration time in otp
                user.otp_creation_time = now()
                # End of code - Ashlekh on 18-11-2024
                # Reason - To add expiration time in otp
                user.save()
                send_otp(email, otp)
                return Response({'msg': 'OTP sent successfully'})
            except ObjectDoesNotExist:
                return Response({'error': 'User not found'}, 404)
        else:
            otp = request.data["data"]['otp']
            email = request.data["data"]['email']
            user = User.objects.filter(email=email, otp=otp).first()
            if not user:
                return Response({"error": "Invalid OTP or User not found"}, 400)
            
            # Added by - Ashlekh on 18-11-2024
            # Reason - To add expiration time in otp
            expiration_time = user.otp_creation_time + timedelta(minutes=10)
            if now() > expiration_time:
                return Response({"error": "OTP has expired"}, 200)
            # End of code - Ashlekh on 18-11-2024
            # Reason - To add expiration time in otp

            user.otp = None
            user.save()
            return Response({"msg": "OTP verified successfully"}, 200)

    def put(self, request):
        email = request.data['email']
        password = request.data['password']

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return Response({'msg': 'Password updated successfully'})
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({'error': 'Invalid OTP'}, 400)


"""
End of code addition by - Unnati Bajaj on 26-05-2024
Reason - Created forgot password APIs
"""

"""
Added by - Unnati on 29-05-2024
Reason - Created contactUs APIs
"""


class ContactRequestAPIView(APIView):

    def post(self, request):

        data = {
            "name": request.data["name"],
            "email": request.data["email"],
            "phone_number": request.data["phone_number"],
            "message": request.data["message"],
        }
        contactUsSerializer = ContactUsSerializer(data=data)
        if contactUsSerializer.is_valid():
            contactUsSerializer.save()
            return Response({"success": "Request sent successfully"}, 200)
        else:
            return Response({"error": "Something went wrong"}, 500)

    def get(self, request):
        setting = Setting.objects.first()
        settingSerializer = SettingSerializer(setting)
        settingData = settingSerializer.data
        return Response({"msg": "success", "setting": settingData}, 200)


"""
End of code addition by - Unnati on 29-05-2024
Reason - Created contactUs APIs
"""

"""
Added by - Unnati on 02-06-2024
Reason - Created footer APIs
"""


class SocialAPIView(APIView):
    def get(self, request):
        # Modified by jhamman on 17-10-2024
        # Reason - Social media icon place is channging when admin edit social media details
        # social = Social.objects.all()
        social = Social.objects.all().order_by('id')
        # Modified by jhamman on 17-10-2024
        # Reason - Social media icon place is channging when admin edit social media details
        social_infoSerializer = SocialSerializer(social, many=True)
        socialData = social_infoSerializer.data
        return Response({"msg": "success", "social": socialData}, 200)


"""
End of code addition by - Unnati on 02-06-2024
Reason - Created contactUs APIs
"""
"""
Code modified by  - Unnati on 12-08-2024
Reason - Created FAQ APIs
"""


class FaqAPIView(APIView):
    def get(self, request):
        try:
            faq = Faq.objects.all()
            faqSerializer = FaqSerializer(faq, many=True)
            faqData = faqSerializer.data
            return Response({"msg": "success", "faq": faqData}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 12-08-2024
Reason - Created FAQ APIs
"""
"""
Added by - Unnati on 02-06-2024
Reason - Created store locator APIs
"""


class StoreLocatorAPIView(APIView):
    def get(self, request):
        store = StoreLocator.objects.all()
        storeSerializer = StoreLocatorSerializer(store, many=True)
        storeData = storeSerializer.data
        return Response({"msg": "success", "store": storeData}, 200)


"""
End of code addition by - Unnati on 02-06-2024
Reason - Created Storelocator APIs
"""
"""
Added by - Unnati on 04-06-2024
Reason - Created Category APIs
"""


def getCategoryHierarchy(category):

    data = dict()
    data["id"] = category.id
    data['name'] = category.name
    data["is_active"] = category.is_active
    # Code added by Unnati on 16-11-2024
    # Reason-To add is coming soon
    data["is_coming_soon"] =category.is_coming_soon
    # End of code addition by Unnati on 16-11-2024
    # Reason-To add is coming soon
    # Code added by Om Shrivastava on 09-11-2025
    # Reason-To add is coming soon
    data["description"] =category.description
    # End of code addition by Om Shrivastava on 09-11-2025
    # Reason-To add is coming soon
    # Code added by Unnati on 05-10-2024
    # Reason-To add image field
    category_image_serializer = CategoryImageSerializer(category)
    data["image"] = category_image_serializer.data['image']
    # End of code addition by Unnati on 05-10-2024
    # Reason-To add image field
    if category.parent_id is not None:
        data["parent_id"] = category.parent_id.id
    else:
        data["parent_id"] = None

    if category.parent_id is not None:
        data["parent_name"] = category.parent_id.name
    else:
        data["parent_name"] = None

    children = category.nodes.all()

    if children:
        data['children'] = [getCategoryHierarchy(child) for child in children]
    else:
        data['children'] = []
    return data


class CategoryAPIView(APIView):
    def get(self, request):
        # Code added by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        # Code modified by Unnati on 13-10-2024
        # Reason-Added order by according to id
        ##Code modified by Unnati on 16-01-2025
        ##Reason-Modified order by id
        # category_list = Category.objects.filter(is_active=True).order_by('-id')
        category_list = Category.objects.filter(is_active=True).order_by('id')
        ##End of code modification by Unnati on 16-01-2025
        ##Reason-Modified order by id
        # End of code modification by Unnati on 13-10-2024
        # Reason-Added order by according to id
        # End of code addition by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        root_categories = [
            category for category in category_list if category.parent_id is None]
        direct_parent_categories = [
            category for category in category_list if category.parent_id is not None]
        direct_parent_categories = [category for category in direct_parent_categories if category not in [
            child for child in category_list if child.parent_id is not None]]
        display_categories = root_categories + direct_parent_categories
        hierarchical_data = [getCategoryHierarchy(
            category) for category in display_categories]
        # Code added by Unnati on 10-08-2024
        # Reason-Filter item type police
        # Code added by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # product_police_type = Product.objects.filter(
        #     menu="police", is_active=True)
        # End of code addition by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # police_categories = set()
        # for product in product_police_type:
        #     police_categories.add(product.category)
        # End of code addition by Unnati on 10-08-2024
        # Reason-Filter item type police
        # Code added by Unnati on 10-08-2024
        # Reason-Filter item type security
        # Code added by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # product_security_type = Product.objects.filter(
        #     menu="security", is_active=True)
        # End of code addition by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # security_categories = set()
        # for product in product_security_type:
        #     security_categories.add(product.category)
        # End of code addition by Unnati on 10-08-2024
        # Reason-Filter item type security
        # Code added by Unnati on 10-08-2024
        # Reason-Filter item type sheriff
        # Code added by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # product_sheriff_type = Product.objects.filter(
        #     menu="sheriff", is_active=True)
        # End of code addition by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # sheriff_categories = set()
        # for product in product_sheriff_type:
        #     sheriff_categories.add(product.category)
        # End of code addition by Unnati on 10-08-2024
        # Reason-Filter item type sheriff
        # Code added by Unnati on 10-08-2024
        # Reason-Filter item type fire
        # Code added by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # product_fire_type = Product.objects.filter(menu="fire", is_active=True)
        # End of code addition by Unnati on 30-08-2024
        # Reason- Modified item type to menu
        # fire_categories = set()
        # for product in product_fire_type:
        #     fire_categories.add(product.category)
        # End of code addition by Unnati on 10-08-2024
        # Reason-Filter item type fire
        # police_categories = CategorySerializer(
        #     police_categories, many=True).data
        # security_categories = CategorySerializer(
        #     security_categories, many=True).data
        # sheriff_categories = CategorySerializer(
        #     sheriff_categories, many=True).data
        # fire_categories = CategorySerializer(fire_categories, many=True).data

       # Code added by Unnati on 10-08-2024
       # Reason-Added police,security,sheriff and fire in dropdown
        # dropdown_data = {
        #     "police": police_categories,
        #     "security": security_categories,
        #     "sheriff": sheriff_categories,
        #     "fire": fire_categories
        # }
        # End of code addition by Unnati on 10-08-2024
       # Reason-Added police,security,sheriff and fire in dropdown
        return Response({"msg": "success", "categoryList": hierarchical_data}, 200)


"""
End of code addition by - Unnati on 04-06-2024
Reason - Created Category APIs
"""


"""
Added by - Unnati on 10-06-2024
Reason - Created our policies APIs
"""


class PoliciesAPIView(APIView):
    def get(self, request):
        policies = Policies.objects.first()
        policiesSerializer = PoliciesSerializer(policies)
        policiesData = policiesSerializer.data
        return Response({"msg": "success", "Policies": policiesData}, 200)


"""
End of code addition  by - Unnati on 10-06-2024
Reason - Created our policies APIs
"""


"""
Added by - Unnati on 10-06-2024
Reason - Created terms and conditions APIs
"""


class TermsAndConditionsAPIView(APIView):
    def get(self, request):
        termsAndConditions = TermsAndConditions.objects.all()
        termsAndConditionsSerializer = TermsAndConditionsSerializer(
            termsAndConditions, many=True)
        termsAndConditionsData = termsAndConditionsSerializer.data
        return Response({"msg": "success", "TermsAndConditions": termsAndConditionsData}, 200)


"""
End of code addition  by - Unnati on 10-06-2024
Reason - Created terms and conditions APIs
"""
"""
Code commented by - Unnati on 10-06-2024
Reason - This code is not in use,only one about us section is made
"""


# class AboutUsAPIView(APIView):
#     def get(self, request):
#         section1 = AboutUsSection1.objects.all()
#         section1_serializer = Section1AboutUsSerializer(section1, many=True)

#         section2 = AboutUsSection2.objects.all()
#         section2_serializer = Section2AboutUsSerializer(section2, many=True)

#         section3 = AboutUsSection3.objects.all()
#         section3_serializer = Section3AboutUsSerializer(section3, many=True)

#         section4 = AboutUsSection4.objects.all()
#         section4_serializer = Section4AboutUsSerializer(section4, many=True)
#         about_us_data = {
#             "section1": section1_serializer.data,
#             "section2": section2_serializer.data,
#             "section3": section3_serializer.data,
#             "section4": section4_serializer.data,
#         }

#         return Response({"msg": "success", "section1": section1_serializer.data, "section2": section2_serializer.data, "section3": section3_serializer.data, "section4": section4_serializer.data}, 200)


"""
End of code addition- Unnati on 10-06-2024
Reason - This code is not in use,only one about us section is made
"""
"""
Code commented by - Unnati on 19-06-2024
Reason - Created product detail APIs
"""


class ProductDetailAPIView(APIView):
    def get(self, request, identifier):
        # Code added by Unnati on 30-08-2024
        # Reason-Product filter according to row id and product_id
        # Code added by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        # Code added by Unnati on 16-11-2024
        # Reason-Added order by
        #Code added by Unnati on 28-11-2024
        #Reason-To handle product sequence when user selects a color
        # products = Product.objects.filter(
        #     product_id=identifier, is_active=True).order_by('id')
        product_data = {} 
        products = None
        color = request.query_params.get("color")
        
        # Addition by Om Shrivastava on 23-12-2024
        # Reason : Show the similar products 
        allProducts = Product.objects.filter(
                product_id=identifier, is_active=True).order_by('id')
        categories = allProducts.first().category if allProducts and allProducts.exists() else None
        similarProduct = Product.objects.filter(
            category=categories, is_active=True).exclude(product_id=identifier)
        # Added by - Ashlekh on 27-12-2024
        # Reason - To display only one color of multi color product
        similarProduct = similarProduct.order_by('product_id', '-id').distinct('product_id') 
        # End of code - Ashlekh on 27-12-2024
        # Reason - To display only one color of multi color product
        similarProductsSerializer = ProductSerializer(
            similarProduct, many=True)
        # End of addition by Om Shrivastava on 23-12-2024
        # Reason : Show the similar products 
        
        if color:
            selected_color = Product.objects.filter(
                product_id=identifier, is_active=True,color=color).order_by('id')
            other_color_products = Product.objects.filter(
            product_id=identifier, is_active=True
            ).exclude(color=color)
            selected_color_serializer = ProductSerializer(selected_color, many=True)
            other_color_products_serializer = ProductSerializer(other_color_products, many=True)
            product_data["product_list"] = (
                selected_color_serializer.data + other_color_products_serializer.data
            )
        else:
            #End of code addition by Unnati on 28-11-2024
            #Reason-To handle product sequence when user selects a color
            products = Product.objects.filter(
                product_id=identifier, is_active=True).order_by('id')    
        # End of code addition by Unnati on 16-11-2024
        # Reason-Added order by
        # End of code addition by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        # End of code addition by Unnati on 30-08-2024
        # Reason-Product filter according to row id and product_id
            productSerializer = ProductSerializer(products, many=True)
            #Code Modified by Unnati on 28-11-2024
            #Reason-Added product list
            # productData = productSerializer.data
            product_data["product_list"] = productSerializer.data  
             #End of code modification by Unnati on 28-11-2024
            #Reason-Added product list
        # Added by - Ashlekh on 05-10-2024
        # Reason - To filter similar product
        # # category = productData["category"] if productData else None
        #Code added by Unnati on 28-11-2024
        #Reason-Added condition
        category = products.first().category if products and products.exists() else None
        #End of code addition by Unnati on 28-11-2024
        #Reason-Added condition

        # Commented by Om Shrivastava on 23-12-2024
        # Reason : This code is not working 
        # similarProducts = Product.objects.filter(
        #     category=category, is_active=True).exclude(product_id=identifier)
        # similarProductsSerializer = ProductSerializer(
        #     similarProducts, many=True)
        # End of commented by Om Shrivastava on 23-12-2024
        # Reason : This code is not working 

        # End of code - Ashlekh on 05-10-2024
        # Reason - To filter similar product

        # Added by - Ashlekh on 02-01-2025
        # Reason - To calculate average rating and to send feedback data
        # Added by - Ashlekh on 14-01-2025
        # Reason - To track count of each rating (1 to 5)
        total_five_star_rating = 0
        total_four_star_rating = 0
        total_three_star_rating = 0
        total_two_star_rating = 0
        total_one_star_rating = 0
        # End of code - Ashlekh on 14-01-2025
        # Reason - To track count of each rating (1 to 5)
        total_rating = 0
        total_count = 0
        average_rating = 0
        feedback_data = []
        all_feedback_products = FeedBackRequest.objects.all()
        for feedback_product in all_feedback_products:
            product_id = feedback_product.product.product_id if feedback_product.product else None
            if product_id == identifier:
                total_rating = total_rating + feedback_product.rating
                total_count = total_count + 1
                feedback_data.append({
                    "rating": feedback_product.rating,
                    "content": feedback_product.content,
                    "name": feedback_product.name,
                    "email": feedback_product.email,
                    # Added by - Ashlekh on 13-02-2025
                    # Reason - To add created_at date
                    "created_at": feedback_product.created_at,
                    # End of code - Ashlekh on 13-02-2025
                    # Reason - To add created_at date
                })
                # Added by - Ashlekh on 14-01-2025
                # Reason - To increase count of rating
                if feedback_product.rating == 5.00:
                    total_five_star_rating = total_five_star_rating + 1
                elif feedback_product.rating == 4.00:
                    total_four_star_rating = total_four_star_rating + 1
                elif feedback_product.rating == 3.00:
                    total_three_star_rating = total_three_star_rating + 1
                elif feedback_product.rating == 2.00:
                    total_two_star_rating = total_two_star_rating + 1
                elif feedback_product.rating == 1.00:
                    total_one_star_rating = total_one_star_rating + 1
                # End of code - Ashlekh on 14-01-2025
                # Reason - To increase count of rating
        
        if total_count > 0:
            average_rating = total_rating / total_count
            # Added by - Ashlekh on 07-01-2025
            # Reason - To round off average rating upto 1 digit after decimal
            average_rating = round(average_rating, 1)
            # End of code - Ashlekh on 07-01-2025
            # Reason - To round off average rating upto 1 digit after decimal
        
        feedback_data_count = len(feedback_data)
        # End of code - Ashlekh on 02-01-2025
        # Reason - To calculate average rating and to send feedback data
        return Response({"msg": "success",
                         #Code modified by Unnati on 28-11-2024
                         #Reason-Modified productData to product_data
                         #  "product": productData,
                          "product": product_data,
                          #End of code addition by Unnati on 28-11-2024
                         #Reason-Modified productData to product_data
                         # Added by - Ashlekh on 05-10-2024
                         # Reason - To send similar product in response
                         "similar_product": similarProductsSerializer.data,
                        #  End of code - Ashlekh on 05-10-2024
                        #  Reason - To send similar product in response
                        # Added by - Ashlekh on 02-01-2025
                        # Reason - To send average rating, feedback_data and feedback_data_count in response
                        "average_rating": average_rating,
                        "feedback_data": feedback_data,
                        "feedback_data_count": feedback_data_count,
                        # End of code - Ashlekh on 02-01-2025
                        # Reason - To send average rating, feedback_data and feedback_data_count in response
                        # Added by - Ashlekh on 14-01-2025
                        # Reason - To send rating_count in response
                        "total_five_star_rating": total_five_star_rating,
                        "total_four_star_rating": total_four_star_rating,
                        "total_three_star_rating": total_three_star_rating,
                        "total_two_star_rating": total_two_star_rating,
                        "total_one_star_rating": total_one_star_rating,
                        # End of code - Ashlekh on 14-01-2025
                        # Reason - To send rating_count in response
                       }, 200)


"""
End of code addition by - Unnati on 19-06-2024
Reason - Created Product detail APIs
"""
"""
Code commented by Unnati on 23-09-2024
Reason-Created edit product API
"""

# class EditProductAPIView(APIView):
#     def get(self, request, identifier):
#         try:

#             product = Product.objects.get(id=identifier, is_active=True)
#             productSerializer = ProductSerializer(product)
#             productData = productSerializer.data

#             return Response({"msg": "success", "product": productData}, 200)

#         except Product.DoesNotExist:
#             return Response({"msg": "Product not found"}, 404)
#         except Exception as e:
#             return Response({"msg": str(e)}, 500)
"""
End of code comment by Unnati on 23-09-2024
Reason-Created edit product API
"""

"""
Code added by - Unnati on 11-07-2024
Reason - Created product list APIs
"""


class ProductListAPIView(APIView):
    def get(self, request):
        # Code added by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        product = Product.objects.filter(is_active=True)
        # End of code addition by Unnati on 03-09-2024
        # Reason-Added is_active functionality
        productSerializer = ProductSerializer(product, many=True)
        productData = productSerializer.data
        return Response({"msg": "success", "product": productData}, 200)


"""
End of code addition by - Unnati on 11-07-2024
Reason - Created Product list APIs
"""
"""
Code added by - Unnati on 20-06-2024
Reason - Created filtered product list APIs
"""
# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     page_size_query_param = 'page_size'
#     max_page_size = 100


class FilteredProductListAPIView(APIView):
    def get(self, request):
        try:
            # Code added by Unnati on 29-09-2024
            # Reason-Initialise categoryIds
            categoryIds = []
            # End of code addition by Unnati on 29-09-2024
            # Reason-Initialise categoryIds
            cid = request.query_params.get('category_id')

            colors = request.query_params.getlist('color[]')

            # Code commented by Unnati on 06-10-2024
            # Reason-To get brand list
            # brands = request.query_params.getlist('brand[]')
            # End of code comment by Unnati on 06-10-2024
            # Reason-To get brand list

            # End of code addition by Unnati on 25-07-2024
            # Reason-To get brand list
            minPrice = request.query_params.get('min_price')

            maxPrice = request.query_params.get('max_price')

            sort_order = request.query_params.get('sort_order', 'asc')
            # currentPage = request.query_params.get('current_page', 1)
            # listPerPage = request.query_params.get('list_per_page', 10)
            # Code added by Unnati on 30-08-2024
            # Reason-Added selected menu
            # selectedItemType = request.query_params.getlist('menu')
            # End of code addition by Unnati on 30-08-2024
            # Reason-Added selected menu
            # Code added by Unnati on 03-09-2024
            # Reason-Added is_active functionality

            cat = Category.objects.get(id=cid, is_active=True)
            # Code added by Unnati on 29-09-2024
            # Reason-To get all the category id
            category_ids = getCategoryId(cat, categoryIds)
            #Code added by Unnati on 05-12-2024
            #Reason-Added order by
            products = Product.objects.filter(
                category_id__in=category_ids, is_active=True).order_by('-id')
            #End of code addition by Unnati on 05-12-2024
            #Reason-Added order by
            # End of code addition by Unnati on 29-09-2024
            # Reason-To get all the category id
            # End of code addition by Unnati on 03-09-2024
            # Reason-Added is_active functionality
            if colors:
                products = products.filter(color__in=colors)
            # Code commented by Unnati on 06-10-2024
            # Reason-To filter brand list
            # if brands:
            #     products = products.filter(brand__text__in=brands)
            # End of code addition by Unnati on 06-10-2024
            # Reason-To filter brand list
            # Code commented by Unnati on 11-10-2024
            # Reason-To comment filter according to selected item type
            # if selectedItemType:
            #     products = products.filter(menu__in=selectedItemType)
            # End of code addition by Unnati on 11-10-2024
            # Reason-To comment filter according to selected item type

            if minPrice and maxPrice:
                products = products.filter(
                    sales_rate__gte=minPrice, sales_rate__lte=maxPrice)  
            #Code modified by Unnati on 05-12-2024
            #Reason-Added order by    
            # products = products.distinct()
            # products = products.order_by('product_id', '-id').distinct('product_id') 
            #End of code modification by Unnati on 05-12-2024
            #Reason-Added order by  
# Code modified by - Unnati on 24-08-2024
# Reason - To add sorting order for sales rate
            #Code modified by Unnati on 05-12-2024
            #Reason-Added product_id in order_by 
            # if sort_order == 'highToLow':
            #     products = products.order_by('product_id','-sales_rate')
            # elif sort_order == 'lowToHigh':
            #     products = products.order_by('product_id','sales_rate')
            # else:
            #     products = products.order_by('product_id','-id')
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added order by 
            if sort_order == 'highToLow':
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('sales_rate').desc()]  
                    )
                ).filter(row_number=1).order_by('-sales_rate', 'product_id')
            elif sort_order == 'lowToHigh':
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('sales_rate')] 
                    )
                ).filter(row_number=1).order_by('sales_rate', 'product_id')
            else:
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('id').desc()] 
                    )
                ).filter(row_number=1).order_by('-id', 'product_id')
            ##End of code modification by Unnati on 15-01-2025
            ##Reason-Added order by     
            #End of code modification by Unnati on 05-12-2024
            #Reason-Added product_id in order_by 

# End of code modified by - Unnati on 24-08-2024
# Reason - To add sorting order for sales rate
# Code commented by - Unnati on 12-10-2024
# Reason - Remove pagination

            # paginator = Paginator(products, listPerPage)
            # paginated_products = paginator.page(currentPage)


# End of code commented by - Unnati on 27-06-2024
# Reason - Remove pagination


# Code commented by - Unnati on 11-10-2024
# Reason - Remove pagination

            # paginator = Pagina
            # paginated_products = paginator.paginate_queryset(products, request)

            # if not paginated_products:
            #     return Response({"msg": "No products found"}, status=204)

# End of code commented by -  Unnati on 11-10-2024
# Reason -  Remove pagination

            productSerializer = ProductSerializer(
                products, many=True)

            total_products = products.count()
            return Response({"msg": "success", "product": productSerializer.data, "total": total_products}, 200)
        except Exception as e:
            print(e)
            return Response({"error": "Something went wrong", }, 400)


"""
End of code addition by - Unnati on 20-06-2024
Reason - Created filtered product list APIs
"""
"""
Code commented by - Unnati on 29-09-2024
Reason - Created API to get category hierarchy
"""
# categoryArr = []


# def getCategory(category):
#     try:
#         data = dict()
#         data["id"] = category.id
#         data['name'] = category.name
#         data["is_active"] = category.is_active

#         if category.parent_id is not None:
#             data["parent_id"] = category.parent_id.id
#         else:
#             data["parent_id"] = None

#         if category.parent_id is not None:
#             data["parent_name"] = category.parent_id.name
#         else:
#             data["parent_name"] = None

#         children = Category.objects.filter(parent_id=category)

#         if children.exists():
#             data['children'] = [getCategory(child) for child in children]
#         else:
#             data['children'] = []

#         categoryArr.append(data)

#         return categoryArr
#     except Exception as e:
#         print(e)
#         return Response({"error": "something went wrong"}, 400)


"""
End of code commented by - Unnati on 29-09-2024
Reason - Created API to get category hierarchy
"""
"""
Code addition by - Unnati on 29-09-2024
Reason - Created  API to get category id for the hierarchy
"""


def getCategoryId(category, categoryIds):
    try:
        if category.is_active == True:
            categoryIds.append(category.id)

        children = Category.objects.filter(parent_id=category)
        if children.exists():
            for child in children:
                getCategoryId(child, categoryIds)

        return categoryIds
    except Exception as e:
        print(e)
        logger.error(f"{e}")
        return Response({"error": "something went wrong"}, 400)


"""
End of code addition by - Unnati on 29-09-2024
Reason - Created  API to get category id for the hierarchy
"""
# Code commented by Unnati on 29-09-2024
# Reason-To get category id
# def getChildrenId(category):
#     try:
#         print("catgeory>>>>>>>>>", category)


#         for childArray in category:
#             print("inside>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
#             for child in childArray:
#                 print("/////////////",child)
#                 id.append(child['id'])
#         print("id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id)
#         return id
#     except Exception as e:
#         print(e)
#         return Response({"error": "dfdf", }, 400)
# End of code comment by Unnati on 29-09-2024
# Reason-To get category id
"""
Code added by - Unnati on 21-06-2024
Reason - Created filtered option APIs
"""


class FilterOptionAPIView(APIView):

    def get(self, request):
        try:
            # Code added by Unnati on 29-09-2024
            # Reason-To initialise category id
            categoryIds = []
            # End of code addition by Unnati on 29-09-2024
            # Reason-To initialise category id
            category_id = request.query_params.get('categoryId')

            category = Category.objects.get(id=category_id)

            category_ids = getCategoryId(category, categoryIds)
            # Added by - Ashlekh on 22-01-2025
            # Reason - To filter out sub category
            filtered_categories = []
            for category_id in category_ids:
                try:
                    matched_category = Category.objects.get(id=category_id)
                    filtered_categories.append(matched_category)
                except Category.DoesNotExist:
                    pass
            
            filtered_categories_serializer = CategorySerializer(filtered_categories, many=True)
            # End of code - Ashlekh on 22-01-2025
            # Reason - To filter out sub category
            min_price = Product.objects.filter(is_active=True, category_id__in=category_ids).aggregate(
                min_price=Min('sales_rate'))['min_price']

            max_price = Product.objects.filter(is_active=True, category_id__in=category_ids).aggregate(
                max_price=Max('sales_rate'))['max_price']

            distinct_colors = Product.objects.filter(is_active=True, category_id__in=category_ids).values_list(
                'color', flat=True).distinct().exclude(color__isnull=True)
            distinct_colors = list(filter(None, distinct_colors))
            # Code commented by Unnati on 06-10-2024
            # Reason-Removing brand
            # distinct_brands = Product.objects.filter(is_active=True, category_id__in=category_ids).select_related('brand').values_list(
            #     'brand__text', flat=True).distinct().exclude(brand__text__isnull=True)
            # distinct_brands = list(filter(None, distinct_brands))
            # End of code addition by Unnati on 06-10-2024
            # Reason-Removing brand
            # Code added by Unnati on 05-10-2024
            # Reason-To get direct parent categories
            direct_parent_categories = Category.objects.filter(
                parent_id=category_id)
            direct_parent_categories_serializer = CategorySerializer(
                direct_parent_categories, many=True)
            # End of code addition by Unnati on 05-10-2024
            # Reason-To get direct parent categories
            response_data = {
                'msg': 'success',
                'min_price': min_price,
                'max_price': max_price,
                'distinct_colors': distinct_colors,
                # Code commented by Unnati on 06-10-2024
                # Reason-Removing brand
                # 'distinct_brands': distinct_brands,
                # End of code addition by Unnati on 06-10-2024
                # Reason-Removing brand
                'category_ids': category_ids,
                # Code added by Unnati on 05-10-2024
                # Reason-To get direct parent categories
                'direct_parent_categories': direct_parent_categories_serializer.data,
                # End of code addition by Unnati on 05-10-2024
                # Reason-To get direct parent categories
                # Added by - Ashlekh on 22-01-2025
                # Reason - To send sub category in response
                'filtered_categories': filtered_categories_serializer.data,
                # End of code - Ashlekh on 22-01-2025
                # Reason - To send sub category in response
            }
            return Response({"msg": "success", "response": response_data}, status=200)
        except Exception as e:
            print(e)
            return Response({"error": "dfdf", }, 400)


"""
End of code addition by - Unnati on 21-06-2024
Reason - Created filtered option APIs
"""
"""
Code commented by - Unnati on 06-10-2024
Reason - To remove brand API
"""


# class BrandAPIView(APIView):
#     def get(self, request):
#         brand = Brand.objects.all()
#         brandSerializer = BrandSerializer(brand, many=True)
#         brandData = brandSerializer.data
#         return Response({"msg": "success", "brand": brandData}, 200)


"""
End of code comment by - Unnati on 06-10-2024
Reason -  To remove brand API
"""
"""
Code added by - Unnati on 03-07-2024
Reason - Created Email subscription request APIs
"""


class EmailSubscriptionRequestAPIView(APIView):
    def post(self, request):
        try:
            data = {
                "email": request.data["email"],
            }
            emailSubscriptionRequestSerializer = EmailSubscriptionRequestSerializer(
                data=data)
            if emailSubscriptionRequestSerializer.is_valid():
                emailSubscriptionRequestSerializer.save()
                return Response({"success": "Request sent successfully"}, 200)
            else:
                return Response({"error": emailSubscriptionRequestSerializer.errors}, 400)
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({"error": "Something went wrong", "details": str(e)}, 500)


"""
Code added by - Unnati on 03-07-2024
Reason - Created Email subscription request APIs
"""
"""
Code added by - Unnati on 04-07-2024
Reason - Created Add to cart for posting cart details APIView
"""


class CartAPIView(APIView):
    # Code commented by Unnati on 28-07-2024
    # Reason-To get all the data in add to cart table
    # def get(self,request):
    #     cartItem = Cart.objects.all()
    #     cartItemSerializer = CartSerializer(cartItem, many=True)
    #     cartItemData = cartItemSerializer.data
    #     return Response({"cartItem": cartItemData}, 200)
    # End of code commented by Unnati on 28-07-2024
    # Reason-To get all the data in add to cart table

    def post(self, request):
        product_id = request.data.get("product")
        user_id = request.data.get("user")
        # Modified by - Ashish Dewangan on 19-12-2024
        # Reason - inactive product can be added to cart, but should not be purchased
        # try:
        #     product = Product.objects.get(id=product_id, is_active=True)
        # except Product.DoesNotExist:
        #     return Response({"error": f"Product with id {product_id} does not exist"}, 404)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": f"Product with id {product_id} does not exist"}, 404)
        # End of modification by - Ashish Dewangan on 19-12-2024
        # Reason - inactive product can be added to cart, but should not be purchased

        data = {
            "user": user_id,
            "product": product.id,
            "XS": request.data.get("XS", 0),
            "S": request.data.get("S", 0),
            "M": request.data.get("M", 0),
            "L": request.data.get("L", 0),
            "XL": request.data.get("XL", 0),
            "XXL": request.data.get("XXL", 0),
            "XXXL": request.data.get("XXXL", 0),
            #Code added by Unnati on 02-01-2024
            #Reason-Added free size
            "free_size": request.data.get("free_size", 0),
            #End of code addition by Unnati on 02-01-2024
            #Reason-Added free size
            "color": request.data.get("color"),
            # Code added by Unnati on 26-07-2024
            # Reason-To add sales rate,image and name
            "sales_rate": request.data.get("sales_rate"),
            "image1": request.data.get("image1"),
            "name": request.data.get("name"),
            # End of code addition by Unnati on 26-07-2024
            # Reason-To add sales rate,image and name
            # Code modified by Unnati on 12-09-2024
            # Reason-To add patches and embroided for each size
            "xs_patches": request.data.get("xs_patches"),
            "s_patches": request.data.get("s_patches"),
            "m_patches": request.data.get("m_patches"),
            "l_patches": request.data.get("l_patches"),
            "xl_patches": request.data.get("xl_patches"),
            "xxl_patches": request.data.get("xxl_patches"),
            "xxxl_patches": request.data.get("xxxl_patches"),

            "xs_embroider": request.data.get("xs_embroider"),
            "s_embroider": request.data.get("s_embroider"),
            "m_embroider": request.data.get("m_embroider"),
            "l_embroider": request.data.get("l_embroider"),
            "xl_embroider": request.data.get("xl_embroider"),
            "xxl_embroider": request.data.get("xxl_embroider"),
            "xxxl_embroider": request.data.get("xxxl_embroider"),
            # End of code modification by Unnati on 12-09-2024
            # Reason-To add patches and embroided for each size

            # Addition by Om Shrivastava on 01-12-2024
            # Reason : Add some Customization field 
            "after_customization_product_price": request.data.get("after_customization_product_price"),
            "customization_comment": request.data.get("customization_comment"),
            "logo": request.data.get("logo"),
            "patches": request.data.get("patches"),
            "security_batches": request.data.get("security_batches"),
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            "security_id_on_back": request.data.get("security_id_on_back"),
            "printed_id": request.data.get("printed_id"),
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            "embroider": request.data.get("embroider"),
            "logo_price": request.data.get("logo_price"),
            "patches_price": request.data.get("patches_price"),
            "security_batches_price": request.data.get("security_batches_price"),
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            "security_id_on_back_price": request.data.get("security_id_on_back_price"),
            "printed_id_price": request.data.get("printed_id_price"),
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            "embroider_price": request.data.get("embroider_price"),
            "size": request.data.get("size"),
            "quantity": request.data.get("quantity"),
            "is_active": request.data.get("is_active"),
            # End of addition by Om Shrivastava on 01-12-2024
            # Reason : Add some Customization field

        }

        cart_serializer = CartSerializer(data=data)

        try:
            if cart_serializer.is_valid(raise_exception=True):
                cart_serializer.save()
                # Code added by Unnati on 26-07-2024
                # Reason-To get all the products
                all_cart_items = Cart.objects.filter(user=user_id)
                all_cart_serializer = CartSerializer(all_cart_items, many=True)
                # End of code addition by Unnati on 26-07-2024
                # Reason-To get all the products
                return Response({
                    "success": "successfully added to cart",
                    "cartData": all_cart_serializer.data,
                }, 200)

        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)


"""
End of code addition by - Unnati on 04-07-2024
Reason - Created Add to cart for posting cart details APIView
"""
"""
Code added by - Unnati on 10-07-2024
Reason - Created updateCart Api for updating cart details APIView
"""


class UpdateCartAPIView(APIView):
    # Addition by Ashish on 01-12-2024
    # Reason : Modify the code 
    # def put(self, request):
    #     product_id = request.data.get('product')
    #     user_id = request.data.get('user')
    #     if not product_id:
    #         return Response({"error": "Product ID is required"}, 400)
    #     if not user_id:
    #         return Response({"error": "User ID is required"}, 400)
    #     product = None
    #     try:
    #         product = Cart.objects.get(
    #             product_id=product_id, user_id=user_id)
    #     # Code added by Unnati on 25-08-2024
    #     # Reason-Updating the size instead of replacing it
    #         if product.XS is not None and request.data.get("XS") is not None:
    #             product.XS += request.data["XS"]
    #         elif request.data.get("XS") is not None:
    #             product.XS = request.data["XS"]

    #         if product.S is not None and request.data.get("S") is not None:
    #             product.S += request.data["S"]
    #         elif request.data.get("S") is not None:
    #             product.S = request.data["S"]

    #         if product.M is not None and request.data.get("M") is not None:
    #             product.M += request.data["M"]
    #         elif request.data.get("M") is not None:
    #             product.M = request.data["M"]

    #         if product.L is not None and request.data.get("L") is not None:
    #             product.L += request.data["L"]
    #         elif request.data.get("L") is not None:
    #             product.L = request.data["L"]

    #         if product.XL is not None and request.data.get("XL") is not None:
    #             product.XL += request.data["XL"]
    #         elif request.data.get("XL") is not None:
    #             product.XL = request.data["XL"]

    #         if product.XXL is not None and request.data.get("XXL") is not None:
    #             product.XXL += request.data["XXL"]
    #         elif request.data.get("XXL") is not None:
    #             product.XXL = request.data["XXL"]

    #         if product.XXXL is not None and request.data.get("XXXL") is not None:
    #             product.XXXL += request.data["XXXL"]
    #         elif request.data.get("XXXL") is not None:
    #             product.XXXL = request.data["XXXL"]
    #     # End of code addition by Unnati on 25-08-2024
    #     # Reason-Updating the size instead of replacing it
    #     # Code modified by Unnati on 12-09-2024
    #     # Reason-To add patches and embroided for each size
    #         if request.data.get("xs_patches") is not None:
    #             product.xs_patches = request.data["xs_patches"]
    #         if request.data.get("s_patches") is not None:
    #             product.s_patches = request.data["s_patches"]
    #         if request.data.get("m_patches") is not None:
    #             product.m_patches = request.data["m_patches"]
    #         if request.data.get("l_patches") is not None:
    #             product.l_patches = request.data["l_patches"]
    #         if request.data.get("xl_patches") is not None:
    #             product.xl_patches = request.data["xl_patches"]
    #         if request.data.get("xxl_patches") is not None:
    #             product.xxl_patches = request.data["xxl_patches"]
    #         if request.data.get("xxxl_patches") is not None:
    #             product.xxxl_patches = request.data["xxxl_patches"]

    #         if request.data.get("xs_embroider") is not None:
    #             product.xs_embroider = request.data["xs_embroider"]
    #         if request.data.get("s_embroider") is not None:
    #             product.s_embroider = request.data["s_embroider"]
    #         if request.data.get("m_embroider") is not None:
    #             product.m_embroider = request.data["m_embroider"]
    #         if request.data.get("l_embroider") is not None:
    #             product.l_embroider = request.data["l_embroider"]
    #         if request.data.get("xl_embroider") is not None:
    #             product.xl_embroider = request.data["xl_embroider"]
    #         if request.data.get("xxl_embroider") is not None:
    #             product.xxl_embroider = request.data["xxl_embroider"]
    #         if request.data.get("xxxl_embroider") is not None:
    #             product.xxxl_embroider = request.data["xxxl_embroider"]
    #     # End of code modification by Unnati on 12-09-2024
    #     # Reason-To add patches and embroided for each size
    #     # End of code addition by Unnati on 26-07-204
    #     # Reason-To update sizes
    #     except Cart.DoesNotExist:
    #         return Response({"error": "Product not found in cart"}, 404)
    #     # Code commented by Unnati on 26-07-2024
    #     # Reason-This code is not in use currently
    #     # size_fields = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    #     # for size in size_fields:
    #     #     if size in request.data:
    #     #         new_value = request.data[size]
    #     #         old_value = getattr(product, size)
    #     #         if old_value is not None and new_value is not None:
    #     #             merged_value = old_value + new_value
    #     #         elif old_value is not None:
    #     #             merged_value = old_value
    #     #         elif new_value is not None:
    #     #             merged_value = new_value
    #     #         else:
    #     #             merged_value = None
    #     #         setattr(product, size, merged_value)
    #     # End of code comment by Unnati on 26-07-2024
    #     # Reason-This code is not in use currently
    #     product.save()
    #     all_cart_items = Cart.objects.filter(user_id=user_id)
    #     cart_serializer = CartSerializer(all_cart_items, many=True)
    #     return Response({
    #         "cartData": cart_serializer.data
    #     }, 200)
    def put(self, request):
        product_id = request.data.get("product")
        user_id = request.data.get("user")

        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)
        if not user_id:
            return Response({"error": "User ID is required"}, status=400)

        try:
            def get_valid_decimal(value, default=0.0):
                try:
                    return float(value) if value else default
                except ValueError:
                    return default

            decimal_fields = [
                "after_customization_product_price", "logo_price", "patches_price",
                "security_batches_price", 
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                "security_id_on_back_price",
                "printed_id_price",
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                "embroider_price"
            ]
            validated_data = {field: get_valid_decimal(request.data.get(field)) for field in decimal_fields}

            
            try:
                cart_item = Cart.objects.get(
                    product_id=product_id, user_id=user_id,
                        logo=request.data.get("logo"),
                        patches=request.data.get("patches"),
                        security_batches=request.data.get("security_batches"),
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back=request.data.get("security_id_on_back"),
                        printed_id=request.data.get("printed_id"),
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider=request.data.get("embroider"),
                        size=request.data.get("size"),
                        color=request.data.get("color"),

                        )
                # Added by - Ashish Dewangan on 12-12-2024
                # Reason - To update customization comment also
                cart_item.customization_comment = request.data.get("customization_comment")
                # End of addition by - Ashish Dewangan on 12-12-2024
                # Reason - To update customization comment also
                cart_item.quantity += request.data.get("quantity")
                cart_item.save()
            except Cart.DoesNotExist as e:
                logger.error("Could not find cart cart with ",e)  

            all_cart_items = Cart.objects.filter(user_id=user_id)
            cart_serializer = CartSerializer(all_cart_items, many=True)
            return Response({"cartData": cart_serializer.data}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
    # End of addition by Ashish on 01-12-2024
    # Reason : Modify the code 

    # Code commented by Unnati on 11-07-2024
    # Reason -To get the updated products
    # def get(self, request):
    # cart = Cart.objects.all()
    # cart_Serializer = CartSerializer(cart, many=True)
    # cartData = cart_Serializer.data
    # return Response({"msg": "success", "cartData": cartData}, 200)
    # End of code comment by Unnati on 11-07-2024
    # Reason -To get the updated products
"""
End of code addition by - Unnati on 10-07-2024
Reason - Created updateCart Api for updating cart details APIView
"""
"""
Code added by - Unnati on 10-07-2024
Reason - Created checkProductInTheCart Api for checking if productId already exists
"""

# Modification and addition by Ashish on 01-12-2024
# Reaason  : Change the method 
class CheckProductInTheCartAPIView(APIView):
    def post(self, request):
        productId = request.query_params.get('product')
        user_id = request.query_params.get('userId')
        logo = request.data.get('logo')
        patches = request.data.get('patches')
        security_batches = request.data.get('security_batches')
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        security_id_on_back=request.data.get("security_id_on_back")
        printed_id=request.data.get("printed_id")
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        embroider = request.data.get('embroider')
        size = request.data.get('size')
        color=request.data.get("color")
        if productId is not None:
            try:
                cart_item = Cart.objects.filter(
                    product_id=productId, user_id=user_id,
                    logo=logo,
                    patches=patches,
                    security_batches=security_batches,
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    security_id_on_back=security_id_on_back,
                    printed_id=printed_id,
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    embroider=embroider,
                    size=size,
                    color=color,
                    )

                if cart_item.exists():
                    cartSerializer = CartSerializer(cart_item, many=True)
                # Code added by Unnati on 26-07-2024
                # Reason-Added boolean response
                    return Response({"msg": "success", "exists": True, "cartData": cartSerializer.data}, 200)
                else:
                    return Response({"msg": "success", "exists": False}, 200)
                # End of code addition by Unnati on 26-07-2024
                # Reason-Added boolean response
            except Exception as e:
                # Code added by Unnati on 24-07-2024
                # Reason-To add logger error
                logger.error(f"{e}")
                # End of code addition by Unnati on 24-07-2024
                # Reason-To add logger error
                return Response({"error": "Something went wrong"}, 500)
        else:
            return Response({"error": "productId parameter is required"}, 400)

# End of modification and addition by Ashish on 01-12-2024
# Reaason  : Change the method 
"""
End of code by - Unnati on 10-07-2024
Reason - Created checkProductInTheCart Api for checking if productId already exists
"""
"""
Code added by - Unnati on 15-07-2024
Reason - Created Return and Exchange Api
"""


class ReturnsAndExchangesAPIView(APIView):
    def get(self, request):
        try:
            returnsAndExchanges = ReturnsAndExchanges.objects.first()
            returnsAndExchangesSerializer = ReturnsAndExchangesSerializer(
                returnsAndExchanges)
            returnsAndExchangesData = returnsAndExchangesSerializer.data
            return Response({"msg": "success", "returnsAndExchanges": returnsAndExchangesData}, 200)
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({"error": "Something went wrong"}, 400)


"""
End of code addition by - Unnati on 15-07-2024
Reason - Created Return and Exchange Api
"""

"""
Code added by - Unnati on 17-07-2024
Reason - Created About Us API
"""


class AboutUsAPIView(APIView):
    def get(self, request):
        try:
            aboutUs = AboutUs.objects.first()
            aboutUsSerializer = AboutUsSerializer(aboutUs)
            aboutUsData = aboutUsSerializer.data
            return Response({"msg": "success", "aboutUs": aboutUsData}, 200)
        except Exception as e:
            # Code added by Unnati on 24-07-2024
            # Reason-To add logger error
            logger.error(f"{e}")
            # End of code addition by Unnati on 24-07-2024
            # Reason-To add logger error
            return Response({"error": "Something went wrong"}, 500)


"""
End of code additon by - Unnati on 17-07-2024
Reason - Created About Us APIView
"""
"""
Code modified by - Unnati on 31-07-2024
Reason - Created Order Summary API view
"""
# Code added by Unnati on 02-08-2024
# Reason-To generate order id


def generate_order_id():
    now = datetime.now()
    month = now.strftime("%m")
    year = now.strftime("%Y")
    last_order = Order.objects.aggregate(Max('order_id'))
    last_order_id = last_order['order_id__max']
    if last_order_id:
        last_order_number = int(last_order_id[-5:])
        new_order_number = last_order_number + 1
    else:
        new_order_number = 1
    new_order_number_formatted = f"{new_order_number:05d}"
    order_id = f"GP{month}{year}{new_order_number_formatted}"
    return order_id
# End of code addition by Unnati on 02-08-2024
# Reason-To generate order id



class OrderAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.data.get("user")
            userObject = User.objects.get(id=user)
            cart = Cart.objects.filter(user=userObject)
            # Code added by Unnati on 01-08-2024
            # Reason-To check for the quatity selected for any sizes
            subtotal = 0
            for item in cart:
                item_total = 0
                if (item.XS or 0) > 0:
                    item_total += item.XS * item.sales_rate

                if (item.S or 0) > 0:
                    item_total += item.S * item.sales_rate
                if (item.M or 0) > 0:
                    item_total += item.M * item.sales_rate
                if (item.L or 0) > 0:
                    item_total += item.L * item.sales_rate
                if (item.XL or 0) > 0:
                    item_total += item.XL * item.sales_rate
                if (item.XXL or 0) > 0:
                    item_total += item.XXL * item.sales_rate
                if (item.XXXL or 0) > 0:
                    item_total += item.XXXL * item.sales_rate

                subtotal = subtotal+item_total

            # End of code addition by Unnati on 01-08-2024
            # Reason-To check for the quatity selected for any sizes
            discount_id = request.data.get("discount")
            # Code added by Unnati on 01-08-2024
            # Reason-To deduct discount amount if discount code is active
            if discount_id:
                discount = Discount.objects.filter(
                    id=discount_id, is_active=True).first()
                discount_amount = discount.discount_amount
                taxable_amount = Decimal(subtotal) - discount_amount

            else:
                discount_amount = Decimal('0.00')
                taxable_amount = Decimal(subtotal)
            # End of code addition by Unnati on 01-08-2024
            # Reason-To deduct discount amount if discount code is active
            #Code modified by Unnati on 25-11-2024
            #Reason-Added sales_tax from config
            # tax_percentage = Decimal('5.0')
            tax_percentage = Decimal(sales_tax)
            #End of code modification by Unnati on 25-11-2024
            #Reason-Added sales_tax from config
            tax = (tax_percentage / Decimal('100')) * taxable_amount
            grand_total = taxable_amount + tax
            # Code added by Unnati on 02-08-2024
            # Reason-To generaye order id
            order_id = generate_order_id()

            # End of code addition by Unnati on 02-08-2024
            # Reason-To generaye order id
            order_summary_data = {
                "order_id": order_id,
                "user": userObject.pk,
                "subtotal": subtotal,
                "is_discount_applied": discount_id is not None,
                "discount_amount": discount_amount if discount_id else Decimal('0.00'),
                "discount_code": "",
                "total_amount": subtotal,
                "shipping_amount": Decimal('0.00'),
                "taxable_amount": taxable_amount,
                "tax_percentage": str(tax_percentage),
                "tax_amount": round(tax, 2),
                "grand_total": round(grand_total, 2),
                "order_status": "Process",
                "payment_status": "Pending",
                "shipping_status": "",
                # "payment_details": payment_mode,
                "discount_code": "",
                # Code added by Unnati on 03-10-2024
                # Reason-Added date field
                "date": datetime.now().strftime('%d-%m-%Y'),
                # End of code addition by Unnati on 03-10-2024
                # Reason-Added date field
            }

            orderSerializer = OrderSerializer(data=order_summary_data)

            if orderSerializer.is_valid():
                order_summary = orderSerializer.save()
                order_row_id = order_summary.pk
            else:
                print(orderSerializer.errors)

            # Code added by Unnati on 01-08-2024
            # Reason-To create order item
            for cart_item in cart:
                for size in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                    quantity = getattr(cart_item, size) or 0
                    # Code modified by Unnati on 12-09-2024
                    # Reason-To add patches and embroided for each size
                    has_patch = False
                    has_embroidery = False

                    if quantity > 0:
                        size_field_patch = f"{size.lower()}_patches"
                        has_patch = getattr(
                            cart_item, size_field_patch, False) or False

                        size_field_embroidery = f"{size.lower()}_embroider"
                        has_embroidery = getattr(
                            cart_item, size_field_embroidery, False) or False
                    # End of code modification by Unnati on 12-09-2024
                    # Reason-To add patches and embroided for each size
                    if quantity > 0:
                        OrderItem.objects.create(
                            order=order_summary,
                            product=cart_item.product,
                            size=size,
                            quantity=quantity,
                            color=cart_item.color,
                            # Code added by Unnati on 18-09-2024
                            # Reason-Commented customization field
                            # customization="",
                            # End of code addition by Unnati on 18-09-2024
                            # Reason-Commented customization field
                            sales_rate=cart_item.sales_rate,
                            amount=quantity * cart_item.sales_rate,
                            # Code changed by - Ashlekh on 12-12-2024
                            # Reason - To change default item status
                            # item_status="Pending",
                            item_status="Order Placed",
                            # End of code - Ashlekh on 12-12-2024
                            # Reason - To change default item status
                            # Code modified by Unnati on 12-09-2024
                            # Reason-To add patches and embroided for each size
                            has_patch=has_patch,
                            has_embroidery=has_embroidery
                            # End of code modification by Unnati on 12-09-2024
                            # Reason-To add patches and embroided for each size
                        )
            # End of code addition by Unnati on 01-08-2024
            # Reason-To create order item

            # Code added by Unnati on 01-08-2024
            # Reason-To add payment details
            # payment_details_data = request.data.get("paymentDetails")
            # Code added by Unnati on 10-08-2024
            # Reason-Link payment details with order
            # payment_details_data["order"] = order_row_id
            # End of code addition by Unnati on 10-08-2024
            # Reason-Link payment details with order
            # paymentDetailsSerializer = PaymentDetailsSerializer(
            #     data=payment_details_data)
            # if paymentDetailsSerializer.is_valid():
            #     paymentDetailsSerializer.save()
            # else:
            #     return Response(paymentDetailsSerializer.errors, 400)
            # End of code addition by Unnati on 01-08-2024
            # Reason-To add payment details
            # Code added by Unnati on 01-08-2024
            # Reason-To add shipping address
            user_address = request.data.get("shippingAddress")

            # user_address["order"] = order_row_id
            # Code added by Unnati on 13-09-2024
            # Reason-To check whether shipping address already exists or not

            first_name = user_address["first_name"]
            last_name = user_address["last_name"]
            address = user_address["address"]
            city = user_address["city"]
            country = user_address["country"]
            state = user_address["state"]
            zipcode = user_address["zipcode"]
            contact_number = user_address["contact_number"]
            company = user_address["company"]
            existing_address = UserAddressDetails.objects.filter(
                user=userObject,
                first_name=first_name,
                last_name=last_name,
                address=address,
                city=city,
                country=country,
                state=state,
                zipcode=zipcode,
                contact_number=contact_number,
                company=company,
            ).first()
            if existing_address is not None:
                pass
            else:
                try:
                    user_address["user"] = userObject.id
                    userAddressSerializer = UserAddressDetailsSerializer(
                        data=user_address
                    )
                    if userAddressSerializer.is_valid():
                        userAddressSerializer.save()

                    else:
                        print("Validation errors user address:",
                              userAddressSerializer.errors)
                except Exception as e:
                    print("Exception occured", e)
            # End of code addition by Unnati on 13-09-2024
            # Reason-To check whether shipping address already exists or not

            # End of code addition by Unnati on 01-08-2024
            # Reason-To add payment details
            # Code added by Unnati on 14-09-2024
            # Reason-To add billing addres

            shipping_address_data = request.data.get("shippingAddress")
            shippingAddress = {
                "first_name": shipping_address_data["first_name"],
                "last_name": shipping_address_data["last_name"],
                "address": shipping_address_data["address"],
                "city": shipping_address_data["city"],
                "country": shipping_address_data["country"],
                "state": shipping_address_data["state"],
                "zipcode": shipping_address_data["zipcode"],
                "contact_number": shipping_address_data["contact_number"],
                "company": shipping_address_data["company"],
                "order": order_row_id,
            }

            try:
                shippingAddressSerializer = ShippingAddressSerializer(
                    data=shippingAddress)

                if shippingAddressSerializer.is_valid(raise_exception=True):
                    shippingAddressSerializer.save()
                else:
                    print("Validation errors1:",
                          shippingAddressSerializer.errors)
            except Exception as e:
                print("Exception occured", e)

            try:
                if request.data.get("shipToSameAddress"):
                    billingAddress = shippingAddress
                else:
                    billing_address_data = request.data.get("billingAddress")
                    billingAddress = {
                        "first_name": billing_address_data["first_name"],
                        "last_name": billing_address_data["last_name"],
                        "address": billing_address_data["address"],
                        "city": billing_address_data["city"],
                        "country": billing_address_data["country"],
                        "state": billing_address_data["state"],
                        "zipcode": billing_address_data["zipcode"],
                        "contact_number": billing_address_data["contact_number"],
                        "company": billing_address_data["company"],
                        "order": order_row_id,
                    }
                billingAddressSerializer = BillingAddressSerializer(
                    data=billingAddress)

                if billingAddressSerializer.is_valid(raise_exception=True):
                    billingAddressSerializer.save()
                else:
                    print("Validation errors2:",
                          billingAddressSerializer.errors)
            except Exception as e:
                print("Exception Occured in billingAddress", e)

            # End of code addition by Unnati on 14-09-2024
            # Reason-To add billing address
            # Code added by Unnati on 04-08-2024
            # Reason -To store company information in company info table
            setting = Setting.objects.first()
            if setting is not None:
                companyInfo = CompanyInfo.objects.create(
                    order=order_summary,
                    name=setting.name,
                    address=setting.address,
                    pincode=setting.pincode,
                    contact_number=setting.contact_number,
                    email=setting.email)
            # End of code addition by Unnati on 04-08-2024
            # Reason -To store company information in company info table
            # Code added by Unnati on 26-08-2024
            # Reason-To delete cart products when clicked on place order button
            cart.delete()
            # End of code addition by Unnati on 26-08-2024
            # Reason-To delete cart products when clicked on place order button

            return Response({"success": "Order processed successfully",
                             "orderSummary": orderSerializer.data,
                             "shippingAddress": shippingAddressSerializer.data,
                             # Code added by Unnati on 15-09-2024
                             # Reason-Added billing address
                             "billingAddress": billingAddressSerializer.data,
                             # End of code addition by Unnati on 15-09-2024
                             # Reason-Added billing address
                             }, 200)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)

        # Code commented by Unnati on 01-08-2024
        # Reason-This code is not in use currently
        # print("Processed data:", data)
        # print("User ID:", data.get("user"))
        #     userAddressDetailsSerializer = UserAddressDetailsSerializer(data=data)

        #     if userAddressDetailsSerializer.is_valid():
        #         userAddressDetailsSerializer.save()
        #         print("Saved data:", userAddressDetailsSerializer.data)
        #         return Response({"success": "Request sent successfully", "userData": userAddressDetailsSerializer.data}, 200)
        #     else:

        #         print("Serializer errors:", userAddressDetailsSerializer.errors)
        #         return Response({"error": "Bad request error", "details": userAddressDetailsSerializer.errors}, 400)
        # End of code commented by Unnati on 01-08-2024
        # Reason-This code is not in use currently


"""
End of code addition by - Unnati on 01-07-2024
Reason - Created Order Summary API view
"""
"""
Code added by - Unnati on 24-07-2024
Reason - Created search product API view
"""
"""
Code added by - Unnati on 24-11-2024
Reason - Created method to get active category
"""
def getActiveCategory(category, category_ids):
    if not category.is_active:
        logger.info(f"Category {category.name} (ID: {category.id}) is inactive. Skipping its subcategories.")
        return category_ids 
    if category.id not in category_ids:
        category_ids.append(category.id)
    subcategories = Category.objects.filter(parent_id=category.id)
    for subcategory in subcategories:
        getActiveCategory(subcategory, category_ids)
    return category_ids
"""
End of code addition by - Unnati on 24-11-2024
Reason - Created method to get active category
"""



class SearchProductAPIView(APIView):
    def get(self, request):
        try:
            # Code added by Unnati on 29-09-2024
            # Reason-To initialise category id
            categoryIds = []
            # End of code addition by Unnati on 29-09-2024
            # Reason-To initialise category id
            cid = request.query_params.get('category_id')
            searchTerm = request.query_params.get('search_term')
            # Code added by Unnati on 20-09-2024
            # Reason-To trim spaces from search term
            if searchTerm:
                searchTerm = searchTerm.rstrip()

            # End of code addition by Unnati on 20-09-2024
            # Reason-To trim spaces from search term
            # Code added by Unnati on 18-09-2024
            # Reason-To get isEnter key
            isEnter = request.query_params.get('is_enter', 'false') == 'true'

            # End of code addition by Unnati on 18-09-2024
            # Reason-To get isEnter key
            if isEnter or (searchTerm and len(searchTerm) >= 3):
                if cid == '0' and searchTerm:
                    # Code added by Unnati on 03-09-2024
                    # Reason-Added is_active functionality
                    # Code added by Unnati on 27-10-2024
                    # Reason-Added distinct
                    # Code added by Unnati on 24-11-2024
                    # Reason-To handle parent active category and no parent category for searching
                    parent_active_cat = Category.objects.filter(is_active=True).filter(parent_id__is_active=True)
                    no_parent_cat = Category.objects.filter(is_active=True,parent_id=None)
                    cat=parent_active_cat | no_parent_cat
                    for category in cat:
                        category_ids = getActiveCategory(category, categoryIds)  
                    # End of code addition by Unnati on 24-11-2024
                    # Reason-To handle parent active category and no parent category for searching    
                    products = Product.objects.filter(
                            is_active=True,
                            #Code added by Unnati on 24-11-2024
                            #Reason-Added category id condition
                            category_id__in=category_ids
                            #End of code addition by Unnati on 24-11-2024
                            #Reason-Added category id condition
                        ).filter(
                            Q(name__icontains=searchTerm) |
                            Q(description__icontains=searchTerm)
                            #Code modified by Unnati on 05-12-2024
                            #Reason-Added orderby 
                            # ).distinct('product_id')
                        ).order_by('-id')
                            #End of code modification by Unnati on 05-12-2024
                            #Reason-Added orderby 
                    # End of code by Unnati on 27-10-2024
                    # Reason-Added distinct
                    # End of code addition by Unnati on 03-09-2024
                    # Reason-Added is_active functionality
                else:
                    cat = Category.objects.get(id=cid, is_active=True)
                    # Code added by Unnati on 29-09-2024
                    # Reason-To call getcategory
                    category_ids = getCategoryId(cat, categoryIds)
                    # End of code addition by Unnati on 29-09-2024
                    # Reason-To call getcategory
                    # Code added by Unnati on 27-10-2024
                    # Reason-Added distinct
                    #Code modified by Unnati on 05-12-2024
                    #Reason-Commented distinct
                    products = Product.objects.filter(
                        category_id__in=category_ids, is_active=True)
                    # .distinct('product_id')
                    #End of code modification by Unnati on 05-12-2024
                    #Reason-Commented distinct
                    # End of code by Unnati on 27-10-2024
                    # Reason-Added distinct
                    # Code added by Unnati on 27-10-2024
                    # Reason-Added distinct
                    if searchTerm:
                        products = products.filter(
                            is_active=True
                        ).filter(
                            Q(name__icontains=searchTerm) |
                            Q(description__icontains=searchTerm)
                            #Code modification by Unnati on 05-12-2024
                             #Reason-Commented distinct and added order by
                             # .distinct('product_id')
                        ).order_by('-id')
                    #End of code modification by Unnati on 05-12-2024
                    #Reason-Commented distinct  and added order by
                    # End of code by Unnati on 27-10-2024
                    # Reason-Added distinct
            # Code added by Unnati on 23-08-2024
            # Reason-To count number of products
            product_count = products.count()
            # End of code addition by Unnati on 23-08-2024
            # Reason-To count number of products
            #Code added by Unnati on 06-12-2024 
            #Reason-Added orderby and distinct
            products = products.order_by('product_id','-id').distinct('product_id') 
            #End of code addition by Unnati on 06-12-2024 
            #Reason-Added orderby and distinct
            productSerializer = ProductSerializer(products, many=True)
            productData = productSerializer.data
            return Response({"msg": "success", "products": productData, "product_count": product_count}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"})


"""
End of code addition by - Unnati on 24-07-2024
Reason - Created search product API view
"""
"""
Code added by - Unnati on 25-07-2024
Reason - Created payment details API view
"""


class PaymentDetailsAPIView(APIView):
    def post(self, request):
        try:
            data = {
                "payment_mode": request.data["payment_mode"],
                "credit_card_number": request.data["credit_card_number"],
                "expiration_date": request.data["expiration_date"],
                "card_verification_number": request.data["card_verification_number"],
            }
            paymentDetailsSerializer = PaymentDetailsSerializer(data=data)
            if paymentDetailsSerializer.is_valid():
                paymentDetailsSerializer.save()
                return Response({"success": "Request sent successfully", "paymentDetails": paymentDetailsSerializer.data}, 200)
            else:

                return Response({"error": "Bad request error"}, 400)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 25-07-2024
Reason - Created payment details API view
"""
"""
Code added by - Unnati on 25-07-2024
Reason - Created cart item API view
"""


class CartItemAPIView(APIView):
    def get(self, request):
        # Modified by - Ashish Dewangan on 01-12-2024
        # Reason - To get details from cart rather than from product
        # try:
        #     product_ids = request.query_params.getlist('product_id[]')
        #     product_id = [int(pid) for pid in product_ids]
        #     products = Product.objects.filter(
        #         id__in=product_id)
        #     productSerializer = ProductSerializer(products, many=True)
        #     productData = productSerializer.data
        #     return Response({"msg": "success", "products": productData}, 200)
        # except Exception as e:
        #     logger.error(f"{e}")
        #     return Response({"error": "Something went wrong"})
        try:
            # Modified by - Ashish Dewangan on 12-12-2024
            # Reason - To filter out items from card according to user id
            # product_ids = request.query_params.getlist('product_id[]')
            # product_id = [int(pid) for pid in product_ids]
            # cart = Cart.objects.filter(product__in=product_id)
            # cartSerializer = CartSerializer(cart, many=True)
    
            # return Response({"msg": "success", "products": cartSerializer.data}, 200)
        
            product_ids = request.query_params.getlist('product_id[]')
            user_id = request.query_params.get('userid')
            product_id = [int(pid) for pid in product_ids]
            # Code changed by - Ashlekh on 14-12-2024
            # Reason - To send cart data in ascending order
            # cart = Cart.objects.filter(product__in=product_id,user=user_id)
            cart = Cart.objects.filter(product__in=product_id,user=user_id).order_by("id")
            # End of code - Ashlekh on 14-12-2024
            # Reason - To send cart data in ascending order
            cartSerializer = CartSerializer(cart, many=True)
    
            return Response({"msg": "success", "products": cartSerializer.data}, 200)
            # End of modification by - Ashish Dewangan on 12-12-2024
            # Reason - To filter out items from card according to user id
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"})
        # End of modification by - Ashish Dewangan on 01-12-2024
        # Reason - To get details from cart rather than from product


"""
End of code addition by - Unnati on 25-07-2024
Reason - Created cart item API view
"""

"""
Code added by - Unnati on 27-07-2024
Reason - Created remove product API view
"""


class RemoveProductAPIView(APIView):
    def delete(self, request):
        user_id = request.query_params.get('user_id')
        product_id = request.query_params.get('product_id')
        size = request.query_params.get('size')
        color = request.query_params.get('color')


        # Modified by - Ashish Dewangan on 01-12-2024
        # Reason - To delete item from cart after checking customization condition
        # try:
        #     cart_item = Cart.objects.get(
        #         user_id=user_id, product_id=product_id)
        #     if size == 'XS':
        #         cart_item.XS = None
        #     elif size == 'S':
        #         cart_item.S = None
        #     elif size == 'M':
        #         cart_item.M = None
        #     elif size == 'L':
        #         cart_item.L = None
        #     elif size == 'XL':
        #         cart_item.XL = None
        #     elif size == 'XXL':
        #         cart_item.XXL = None
        #     elif size == 'XXXL':
        #         cart_item.XXXL = None
        #     else:
        #         return Response({"error": "Invalid size or no items left to remove"}, 400)
        #     # Code added by Unnati on 11-09-2024
        #     # Reason-To remove the row if no quantity is present
        #     if all([
        #         cart_item.XS is None,
        #         cart_item.S is None,
        #         cart_item.M is None,
        #         cart_item.L is None,
        #         cart_item.XL is None,
        #         cart_item.XXL is None,
        #         cart_item.XXXL is None
        #     ]):
        #         cart_item.delete()
        #     # End of code addition by Unnati on 11-09-2024
        #     # Reason-To remove the row if no quantity is present

        #     else:
        #         cart_item.save()

        logo = True if request.query_params.get('logo') == 'true' else False
        patches = True if request.query_params.get('patches') == 'true' else False
        security_batches = True if request.query_params.get('security_batches') == 'true' else False
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        security_id_on_back = True if request.query_params.get('security_id_on_back') == 'true' else False
        printed_id = True if request.query_params.get('printed_id') == 'true' else False
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        embroider = True if request.query_params.get('embroider') == 'true' else False

        try:
            cart_item = Cart.objects.get(
                user_id=user_id, product_id=product_id,
                size=size,
                logo=logo,
                patches=patches,
                security_batches=security_batches,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back=security_id_on_back,
                printed_id=printed_id,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider=embroider,
                color=color
                )
            
            cart_item.delete()
            # End of modification by - Ashish Dewangan on 01-12-2024
            # Reason - To delete item from cart after checking customization condition

            all_cart_items = Cart.objects.filter(user_id=user_id)
            cart_serializer = CartSerializer(all_cart_items, many=True)
            return Response({"message": "Product size quantity updated successfully.", "cartItem": cart_serializer.data}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": str(e)}, 500)


"""
End of code addition by - Unnati on 27-07-2024
Reason - Created remove product API view
"""


class UpdateCartDataAPIView(APIView):
    # Modified by - Ashish Dewangan on 01-12-2024
    # Reason - To sync cart with customization
    # def put(self, request):
    #     try:
    #         cart_items = request.data.get("cart", [])
    #         user_id = request.data.get("user")

    #         user = User.objects.get(id=user_id)

    #         for cart_item in cart_items:

    #             if not isinstance(cart_item, dict):

    #                 continue

    #             product_id = cart_item.get("product")
    #             if not product_id:

    #                 continue

    #             try:

    #                 cart_object = Cart.objects.get(
    #                     user=user, product_id=product_id)

    #                 cart_item_updated_at = cart_item.get("updated_at")
    #                 # Code modified by Unnati on 25-08-2024
    #                 # Reason-Because string and integer values cant be compared
    #                 if isinstance(cart_item_updated_at, str):
    #                     cart_item_updated_at = datetime.fromisoformat(
    #                         cart_item_updated_at)
    #                 if cart_item_updated_at and isinstance(cart_item_updated_at, datetime) and cart_item_updated_at > cart_object.updated_at:
    #                     # End of code modification by Unnati on 25-08-2024
    #                     # Reason-Because string and integer values cant be compared
    #                     cart_object.XS = cart_item.get("XS", cart_object.XS)
    #                     cart_object.S = cart_item.get("S", cart_object.S)
    #                     cart_object.M = cart_item.get("M", cart_object.M)
    #                     cart_object.L = cart_item.get("L", cart_object.L)
    #                     cart_object.XL = cart_item.get("XL", cart_object.XL)
    #                     cart_object.XXL = cart_item.get("XXL", cart_object.XXL)
    #                     cart_object.XXXL = cart_item.get(
    #                         "XXXL", cart_object.XXXL)
    #                     cart_object.save()

    #             except Cart.DoesNotExist:
    #                 p = Product.objects.get(id=product_id)
    #                 # Code added by Unnati on 20-10-2024
    #                 # Reason-Added a condition to check if sales_percentage exists or not
    #                 # sale_rate_after_discount = float(
    #                 #     p.sales_rate) - (float(p.sales_rate) * (p.sale_percentage/100))
    #                 sale_percentage = p.sale_percentage if p.sale_percentage is not None else 0
    #                 sale_rate_after_discount = float(
    #                     p.sales_rate) - (float(p.sales_rate) * (sale_percentage/100))
    #                 # End of code addition by Unnati on 20-10-2024
    #                 # Reason-Added a condition to check if sales_percentage exists or not
    #                 Cart.objects.create(
    #                     product_id=product_id,
    #                     XS=cart_item.get("XS", 0),
    #                     S=cart_item.get("S", 0),
    #                     M=cart_item.get("M", 0),
    #                     L=cart_item.get("L", 0),
    #                     XL=cart_item.get("XL", 0),
    #                     XXL=cart_item.get("XXL", 0),
    #                     XXXL=cart_item.get("XXXL", 0),
    #                     color=cart_item.get("color", ""),
    #                     # sales_rate=cart_item.get("sales_rate", 0.0),
    #                     sales_rate=sale_rate_after_discount,
    #                     image1=cart_item.get("image1", ""),
    #                     name=cart_item.get("name", ""),
    #                     user=user,
    #                 )

    #         all_cart_items = Cart.objects.filter(user=user)
    #         cart_serializer = CartSerializer(all_cart_items, many=True)
    #         return Response({"message": "Cart synchronized successfully", "cartData": cart_serializer.data}, 200)
    #     except Exception as e:
    #         logger.error(f"Error occurred: {e}")
    #         return Response({"error": str(e)}, 500)
    def put(self, request):
        try:
            cart_items = request.data.get("cart", [])
            user_id = request.data.get("user")
            user = User.objects.get(id=user_id)
            for cart_item in cart_items:

                if not isinstance(cart_item, dict):

                    continue

                product = cart_item.get("product")
                if not product:

                    continue
                try:

                    cart_object = Cart.objects.get(
                        user=user,
                          product_id=product,
                        size=cart_item.get("size"),
                        logo=cart_item.get("logo"),
                        patches=cart_item.get("patches"),
                        security_batches=cart_item.get("security_batches"),
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back=cart_item.get("security_id_on_back"),
                        printed_id=cart_item.get("printed_id"),
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider=cart_item.get("embroider"),
                        color=cart_item.get("color"),

                        )

                    p = Product.objects.get(id=product)
                   
                    cart_object.quantity += cart_item.get("quantity")

                    cart_object.logo_price=p.logo_price
                    cart_object.patches_price=p.patches_price
                    cart_object.security_batches_price=p.security_batches_price
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    cart_object.security_id_on_back_price=p.security_id_on_back_price
                    cart_object.printed_id_price=p.printed_id_price
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    cart_object.embroider_price=p.embroider_price
                    cart_object.customization_comment=cart_item.get("customization_comment")


                    sale_percentage = p.sale_percentage if p.sale_percentage is not None else 0
                    sale_rate_after_discount = float(
                        p.sales_rate) - (float(p.sales_rate) * (sale_percentage/100))

                    after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else p.sales_rate
                    if cart_item.get("logo")==True:
                        after_customization_product_price +=float( p.logo_price)
                    if cart_item.get("patches")==True:
                        after_customization_product_price +=float( p.patches_price)
                    if cart_item.get("security_batches")==True:
                        after_customization_product_price +=float( p.security_batches_price)
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.get("security_id_on_back")==True:
                        after_customization_product_price +=float( p.security_id_on_back_price)
                    if cart_item.get("printed_id")==True:
                        after_customization_product_price +=float( p.printed_id_price)
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.get("embroider")==True:
                        after_customization_product_price +=float( p.embroider_price )

                    cart_object.after_customization_product_price = after_customization_product_price    
                    
                    cart_object.save()

                except Exception as e:
                    print(e)
                    
                    p = Product.objects.get(id=product)
                
                    sale_percentage = p.sale_percentage if p.sale_percentage is not None else 0
                    sale_rate_after_discount = float(
                        p.sales_rate) - (float(p.sales_rate) * (sale_percentage/100))

                    after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else p.sales_rate
                    if cart_item.get("logo")==True:
                        after_customization_product_price += float(p.logo_price)
                    if cart_item.get("patches")==True:
                        after_customization_product_price +=float( p.patches_price)
                    if cart_item.get("security_batches")==True:
                        after_customization_product_price += float(p.security_batches_price)
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.get("security_id_on_back")==True:
                        after_customization_product_price += float(p.security_id_on_back_price)
                    if cart_item.get("printed_id")==True:
                        after_customization_product_price += float(p.printed_id_price)
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.get("embroider")==True:
                        after_customization_product_price += float(p.embroider_price )
                    
                    Cart.objects.create(
                        product_id=product,
                        XS=cart_item.get("XS", 0),
                        S=cart_item.get("S", 0),
                        M=cart_item.get("M", 0),
                        L=cart_item.get("L", 0),
                        XL=cart_item.get("XL", 0),
                        XXL=cart_item.get("XXL", 0),
                        XXXL=cart_item.get("XXXL", 0),
                        color=cart_item.get("color", ""),
                        sales_rate=p.sales_rate,
                        image1=cart_item.get("image1", ""),
                        name=cart_item.get("name", ""),
                        user=user,
                        
                        logo=cart_item.get("logo"),
                        patches=cart_item.get("patches"),
                        security_batches=cart_item.get("security_batches"),
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back=cart_item.get("security_id_on_back"),
                        printed_id=cart_item.get("printed_id"),
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider=cart_item.get("embroider"),
                        size=cart_item.get("size"),
                        quantity=cart_item.get("quantity"),
                        logo_price=p.logo_price,
                        patches_price=p.patches_price,
                        security_batches_price=p.security_batches_price,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back_price=p.security_id_on_back_price,
                        printed_id_price=p.printed_id_price,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider_price=p.embroider_price,
                        after_customization_product_price=after_customization_product_price,
                        customization_comment=cart_item.get("customization_comment"),
                    )


            all_cart_items = Cart.objects.filter(user=user)
            cart_serializer = CartSerializer(all_cart_items, many=True)
            return Response({"message": "Cart synchronized successfully", "cartData": cart_serializer.data}, 200)
        except Exception as e:
            logger.error(f"Error occurred: {e}")
            return Response({"error": str(e)}, 500)
    # End of modification by - Ashish Dewangan on 01-12-2024
    # Reason - To sync cart with customization


"""
End of code addition by - Unnati on 29-07-2024
Reason - Created update cart data API view
"""

"""
Code added by - Unnati on 01-08-2024
Reason - Created discount API view
"""


class DiscountAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            discount_code = request.query_params.get('discountCode')
            if discount_code:
                discount = Discount.objects.filter(
                    discount_code=discount_code, is_active=True).first()
                if discount:
                    # Code added by Unnati on 19-09-2024
                    # Reason-Added discount amount in response
                    return Response({'message': 'success', 'is_active': True, 'id': discount.id, "discount_amount": discount.discount_amount}, 200)
                    # End of code addition by Unnati on 19-09-2024
                    # Reason-Added discount amount in response
                else:
                    return Response({'message': 'error', 'is_active': False}, 404)
            else:
                return Response({'message': 'success', 'error': 'No discount code can be seen'}, 404)
        except Exception as e:
            return Response({'message': 'success', 'error': str(e)}, 500)


"""
End of code addition by - Unnati on 01-08-2024
Reason - Created discount API view
"""

"""
Code added by - Unnati on 02-08-2024
Reason - Created order history API view to get orders
"""


class OrderHistoryAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user')
        # Code added by Unnati on 03-10-2024
        # Reason-To get current page and list per page
        currentPage = request.query_params.get('current_page', 1)
        listPerPage = request.query_params.get('list_per_page', 8)
        # End of code addition by Unnati on 03-10-2024
        # Reason-To get current page and list per page
        if user_id is not None:
            try:
                # Added by - Jhamman on 11-10-2024
                # Reason - we get order by -id
                # order_history = Order.objects.filter(user_id=user_id)
                order_history = Order.objects.filter(
                    user_id=user_id).order_by('-id')
                # End of addition by - Jhamman on 11-10-2024
                # Reason - we get order by -id
                if order_history.count() > 0:
                    # Code added by Unnati on 03-10-2024
                    # Reason-To add pagination
                    paginator = Paginator(order_history, listPerPage)
                    paginated_order_history = paginator.page(currentPage)
                    # End of code addition by Unnati on 03-10-2024
                    # Reason-To add pagination
                    # Code added by Unnati on 03-10-2024
                    # Reason-To add pagination and orderHistoryCount
                    orderSerializer = OrderSerializer(
                        paginated_order_history, many=True)
                    total_orders = paginator.count
                    # End of code addition by Unnati on 03-10-2024
                    # Reason-To add pagination and orderHistoryCount
                    return Response({
                        "msg": "success",
                        "orderSummary": orderSerializer.data,
                        "total": total_orders,
                    }, 200)
                else:
                    return Response({"error": "Something went wrong"}, 200)
            except Exception as e:
                logger.error(f"{e}")
                return Response({"error": "Something went wrong"}, 500)
        else:
            return Response({"error": "order summary parameter is required"}, 400)


"""
End of code addition by - Unnati on 02-08-2024
Reason - Created order history API view to get orders
"""
"""
Code added by - Unnati on 03-08-2024
Reason - Created order details API view to get orders details of each order
"""


class OrderDetailAPIView(APIView):
    def get(self, request, id):
        user_id = request.query_params.get('user')
        #Code added by Unnati on 26-12-2024
        #Reason-To get type 
        type=request.query_params.get("type")
        #End of code addition by Unnati on 26-12-2024
        #Reason-To get type 
        
        if user_id is not None:
            try:
                #Code added by Unnati on 26-12-2024
                #Reason-Added condition for type exchange
                if type=="Exchange":
                    ##Code modified by Unnati on 20-01-2025
                    ##Reason-Modified code and added order by
                    order_item = OrderItem.objects.get(id=id)
                    # order_item = OrderItem.objects.get(id=id).order_by('id')
                    ##End of code modification by Unnati on 20-01-2025
                    ##Reason-Modified code and added order by
                    order_id = order_item.order_id
                    order_summary = Order.objects.get(id=order_id)
                    orderSerializer = OrderSerializer(order_summary)
                    orderItemSerializer = OrderItemSerializer(
                        order_item)
                    company_info = CompanyInfo.objects.filter(order_id=order_id)
                    companyInfoSerializer = CompanyInfoSerializer(
                        company_info, many=True)
                    shippingAddress = ShippingAddress.objects.get(
                        order=order_id)
                    billingAddress = BillingAddress.objects.get(
                        order=order_id)
                    shippingAddressSerializer = ShippingAddressSerializer(
                        shippingAddress)
                    billingAddressSerializer = BillingAddressSerializer(
                        billingAddress)
                    return Response({
                        "msg": "success",
                        "orderItems": orderItemSerializer.data,
                        "orderSummary": orderSerializer.data,
                        "companyInfo": companyInfoSerializer.data,
                        "shippingAddress": shippingAddressSerializer.data,
                        "billingAddress": billingAddressSerializer.data,
                    }, 200)
                #End of code addition by Unnati on 26-12-2024
                #Reason-Added condition for type exchange
                #Code added by Unnati on 26-12-2024
                #Reason-Added condition for type sold
                elif type=="Sold":
                    order_summary = Order.objects.get(id=id)
                    orderSerializer = OrderSerializer(order_summary)
                    ##Code modified by Unnati on 20-01-2025
                    ##Reaso-Modified order by
                    # order_items = OrderItem.objects.filter(order_id=id,type="Sold").order_by('-id')
                    order_items = OrderItem.objects.filter(order_id=id,type="Sold").order_by('id')
                    ##End of code modification by Unnati on 20-01-2025
                    ##Reaso-Modified order by
                    orderItemSerializer = OrderItemSerializer(
                        order_items, many=True)
                    company_info = CompanyInfo.objects.filter(order_id=id)
                    companyInfoSerializer = CompanyInfoSerializer(
                        company_info, many=True)
                    shippingAddress = ShippingAddress.objects.get(
                        order=order_summary)
                    billingAddress = BillingAddress.objects.get(
                        order=order_summary)
                    shippingAddressSerializer = ShippingAddressSerializer(
                        shippingAddress)
                    billingAddressSerializer = BillingAddressSerializer(
                        billingAddress)
                    setting = Setting.objects.first()
                    settingSerializer = SettingSerializer(setting)
         
                    return Response({
                        "msg": "success",
                        "orderItems": orderItemSerializer.data,
                        "orderSummary": orderSerializer.data,
                        "companyInfo": companyInfoSerializer.data,
                        "shippingAddress": shippingAddressSerializer.data,
                        "billingAddress": billingAddressSerializer.data,
                        "settings":settingSerializer.data,
                    }, 200)
                #End of code adddition by Unnati on 26-12-2024
                #Reason-Added condition for type sold
                else: 
                    # Code added by Unnati on 04-08-2024
                    # Reason-To have order details
                    order_summary = Order.objects.get(id=id)

                    # Code added by Unnati on 13-09-2024
                    # Reason-To get shippingAddressId

                    # End of code addition by Unnati on 13-09-2024
                    # Reason-To get shippingAddressId
                    orderSerializer = OrderSerializer(order_summary)
                    # End of code addition by Unnati on 04-08-2024
                    # Reason-To have order details
                    # Code added by Unnati on 04-08-2024
                    # Reason-To have order items
                    #Code modified by Unnati on 28-11-2024
                    #Reason-Added order by id
                    ##Code added by Unnati on 20-01-2025
                    ##Reason-Modified order by id
                    # order_items = OrderItem.objects.filter(order_id=id).order_by('-id')
                    order_items = OrderItem.objects.filter(order_id=id).order_by('id')
                    ##End of code addition by Unnati on 20-01-2025
                    ##Reason-Modified order by id
                    #End of code modification by Unnati on 28-11-2024
                    #Reason-Added order by id
                    orderItemSerializer = OrderItemSerializer(
                        order_items, many=True)
                    # End of code addition by Unnati on 04-08-2024
                    # Reason-To have order items
                    # Code added by Unnati on 04-08-2024
                    # Reason-To have company information
                    company_info = CompanyInfo.objects.filter(order_id=id)
                    companyInfoSerializer = CompanyInfoSerializer(
                        company_info, many=True)
                    # End of code addition by Unnati on 04-08-2024
                    # Reason-To have company information
                    # Code added by Unnati on 04-08-2024
                    # Reason-To have user address

                    shippingAddress = ShippingAddress.objects.get(
                        order=order_summary)
                    billingAddress = BillingAddress.objects.get(
                        order=order_summary)

                    shippingAddressSerializer = ShippingAddressSerializer(
                        shippingAddress)
                    billingAddressSerializer = BillingAddressSerializer(
                        billingAddress)
                    #Code added by Unnati on 24-11-2024
                    #Reason-To generate credit note number when order is cancelled by admin
                    # for item in order_items:
                    #     
                    #     if item.cancelled_by == 'Admin' and not item.credit_note_number:
                    #         credit_note_number = generate_credit_note_number()
                    #         item.credit_note_number = credit_note_number
                    #         
                    #         item.save()
                    #End of code addition by Unnati on 24-11-2024
                    #Reason-To generate credit note number when order is cancelled by admin            

                    # Added by - Ashish Dewangan on 25-11-2024
                    # Reason - TO return setting details
                    setting = Setting.objects.first()
                    settingSerializer = SettingSerializer(setting)
                    # End of addition by - Ashish Dewangan on 25-11-2024
                    # Reason - TO return setting details  

                    # ShippingAddress = request.query_params.get('shippingAddressId')

                    # userAddress = UserAddressDetails.objects.filter(
                    #     id=ShippingAddress)

                    # if not userAddress.exists():
                    #     userAddress = UserAddressDetails.objects.filter(
                    #         order_id=id)
                    # userAddressDetailsSerializer = UserAddressDetailsSerializer(
                    #     userAddress, many=True)
                    # if userAddress:
                    #     shipping=ShippingAddress.objects.create(
                    #         order_id=id,
                    #         defaults={
                    #             'user': user_id,
                    #             'first_name': userAddress.first_name,
                    #             'last_name': userAddress.last_name,
                    #             'company': userAddress.company,
                    #             'address': userAddress.address,
                    #             'city': userAddress.city,
                    #             'country': userAddress.country,
                    #             'state': userAddress.state,
                    #             'zipcode': userAddress.zipcode,
                    #             'contact_number': userAddress.contact_number
                    #         }
                    #     )

                    # # End of code addition by Unnati on 04-08-2024
                    # # Reason-To have user address
                    # billingAddress = BillingAddress.objects.filter(order_id=id)
                    # billingAddressSerializer = BillingAddressSerializer(
                    #     billingAddress, many=True)

                    # Code commented by Unnati on 21-10-2024
                    # Reason-To maintain stock management
                    # for item in order_items:
                    #     product = Product.objects.filter(
                    #         id=item.product.id,
                    #         is_active=True
                    #     ).first()
                    #     print("......item",product)
                    #     if product:

                    #         size_field = item.size
                    #         if hasattr(product, size_field):
                    #             current_stock = getattr(product, size_field)
                    #             if current_stock is not None:
                    #                 new_stock = current_stock - item.quantity
                    #                 print("new stock",new_stock)
                    #                 # if new_stock < 0:
                    #                 #     return Response({"error": f"Not enough stock for product {product.id} and size {item.size}"}, 400)
                    #                 Product.objects.filter(
                    #                     id=product.id,
                    #                     is_active=True
                    #                 ).update(**{size_field: new_stock})

                    #             else:
                    #                 return Response({"error": f"Stock field {size_field} not found for product {product.id}"}, 400)
                    #         else:
                    #             return Response({"error": f"Size field {size_field} not present in product {product.id}"}, 400)
                    # End of code addition by Unnati on 21-10-2024
                    # Reason-To maintain stock management
                return Response({
                    "msg": "success",
                    "orderItems": orderItemSerializer.data,
                    "orderSummary": orderSerializer.data,
                    "companyInfo": companyInfoSerializer.data,
                    "shippingAddress": shippingAddressSerializer.data,
                    # Code added by Unnati on 15-09-2024
                    # Reason-Added biling address
                    "billingAddress": billingAddressSerializer.data,
                    # End of code addition by Unnati on 15-09-2024
                    # Reason-Added biling address
                    # Added by - Ashish Dewangan on 25-11-2024
                    # Reason - TO return setting details
                    "settings":settingSerializer.data,
                    # End of addition by - Ashish Dewangan on 25-11-2024
                    # Reason - TO return setting details
                }, 200)
            except Exception as e:
                logger.error(f"{e}")
                return Response({"error": "Something went wrong"}, 500)

        return Response({"error": "User ID not provided"}, 400)


"""
End of code addition by - Unnati on 03-08-2024
Reason - Created order details API view to get orders details of each order
"""

"""
Code added by - Unnati on 03-08-2024
Reason - Created user address API view to get user details and address
"""


class UserAddressAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user')
        try:
            # Code added by Unnati on 17-07-2024
            # Reason-Added order_by
            user_address = UserAddressDetails.objects.filter(
                user_id=user_id).order_by('-id')
            # End of code addition by Unnati on 17-07-2024
            # Reason-Added order_by
            # Code added by Unnati on 20-10-2024
            # Reason-To get row id of primary address
            primary_address_id = UserAddressDetails.objects.filter(
                is_primary=True,
                #Code added by Unnati on 14-12-2024
                #Reason-Added user id in filter
                user_id=user_id
                #End of code addition by Unnati on 14-12-2024
                #Reason-Added user id in filter
                ).values_list('id', flat=True).first()
            # End of code addition by Unnati on 20-10-2024
            # Reason-To get row id of primary address
            userAddressDetailsSerializer = UserAddressDetailsSerializer(
                user_address, many=True)
            return Response({
                "userAddress": userAddressDetailsSerializer.data,
                # Code added by Unnati on 20-10-2024
                # Reason-To get row id of primary address
                "primaryAddressId": primary_address_id
                # End of code addition by Unnati on 20-10-2024
                # Reason-To get row id of primary address
            }, 200)

        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 03-08-2024
Reason - Created user address API view to get user details and address
"""
"""
Code added by - Unnati on 05-08-2024
Reason - Created home page APIView
"""

# Code added by Unnati on 31-08-2024
# Reason-Changed home to home banner


class HomeBannerAPIView(APIView):
    def get(self, request):
        try:
            ##Code added by unnati on 27-11-2024
            #Reason-To initialize category id
            categoryIds = []
            ##End of code addition by unnati on 27-11-2024
            #Reason-To initialize category id
            ##Code added by Unnati on 08-11-2024
            ##Reason-Added order by id
            banners = HomeBanner.objects.all().order_by('-id')
            ##End of code addition by Unnati on 08-11-2024
            ##Reason-Added order by id
            homeSerializer = HomeBannerSerializer(banners, many=True)
            # Code added by Unnati on 03-09-2024
            # Reason-Added is_active functionality
            # Code added by Unnati on 05-09-2024
            # Reason-To arrange bestseller and featured products accoridng to created at
            # Code commented by Unnati on 27-10-2024
            # Reason-This code is not in use currently
            # best_selling_products = Product.objects.filter(

            #     is_best_seller=True,
            #     is_active=True
            # ).order_by('-created_at')
            # End of code commented by Unnati on 27-10-2024
            # Reason-This code is not in use currently
            # Code added by Unnati on 27-10-2024
            # Reason-To filter products according to product_id
            # Code added by Unnati on 27-11-2024
            # Reason-To get parent active and no parent category
            parent_active_cat = Category.objects.filter(is_active=True).filter(parent_id__is_active=True)
            no_parent_cat = Category.objects.filter(is_active=True,parent_id=None)
            cat=parent_active_cat | no_parent_cat
            for category in cat:
                    category_ids = getActiveCategory(category, categoryIds)
            # End of code addition by Unnati on 27-11-2024
            # Reason-To get parent active and no parent category       
            all_best_selling_product = Product.objects.filter(
                product_id=OuterRef('product_id'),
                is_best_seller=True,
                is_active=True,
                 #Code added by Unnati on 27-11-2024
                 #Reason-Added category id condition
                category_id__in=category_ids
                 #End of code addition by Unnati on 27-11-2024
                 #Reason-Added category id condition
            #Code added by Unnati on 06-12-2024
                 #Reason-Added order by id
            ).order_by('-id')
            #End of code addition by Unnati on 06-12-2024
                 #Reason-Added order by id
            best_selling_products = Product.objects.filter(
                is_best_seller=True,
                is_active=True,
                id=Subquery(all_best_selling_product.values('id')[:1]),
                 #Code added by Unnati on 27-11-2024
                 #Reason-Added category id condition
                category_id__in=category_ids
                 #End of code addition by Unnati on 27-11-2024
                 #Reason-Added category id condition
                 #Code added by Unnati on 06-12-2024
                 #Reason-Added order by id
            ).order_by('-id')
            #End of code addition by Unnati on 06-12-2024
                 #Reason-Added order by id
            best_selling_serializer = ProductSerializer(
                best_selling_products, many=True)
            # End of code addition by Unnati on 27-10-2024
            # Reason-To filter products according to product_id
            # Code commented by Unnati on 19-10-2024
            # Reason-This code is not in use currently
            # featured_products = Product.objects.filter(
            #     is_featured_product=True,
            #     is_active=True
            # ).order_by('-created_at')
            # End of code commented by Unnati on 19-10-2024
            # Reason-This code is not in use currently
            # Code added by Unnati on 19-10-2024
            # Reason-To filter products according to product_id
            all_featured_product = Product.objects.filter(
                product_id=OuterRef('product_id'),
                is_featured_product=True,
                is_active=True,
                 #Code added by Unnati on 27-11-2024
                 #Reason-Added category id condition
                category_id__in=category_ids
                 #End of code addition by Unnati on 27-11-2024
                 #Reason-Added category id condition
             #Code added by Unnati on 06-12-2024
                 #Reason-Added order by id
            ).order_by('-id')
            #End of code addition by Unnati on 06-12-2024
                 #Reason-Added order by id
            featured_products = Product.objects.filter(
                is_featured_product=True,
                is_active=True,
                id=Subquery(all_featured_product.values('id')[:1]),
                 #Code added by Unnati on 27-11-2024
                 #Reason-Added category id condition
                category_id__in=category_ids
                 #End of code addition by Unnati on 27-11-2024
                 #Reason-Added category id condition
             #Code added by Unnati on 06-12-2024
                 #Reason-Added order by id
            ).order_by('-id')
            #End of code addition by Unnati on 06-12-2024
                 #Reason-Added order by id
            # End of code addition by Unnati on 19-10-2024
            # Reason-To filter products according to product_id
            # End of code addition by Unnati on 05-09-2024
            # Reason-To arrange bestseller and featured products accoridng to created at
            featured_product_serializer = ProductSerializer(
                featured_products, many=True)
            # Code added by Unnati on 03-09-2024
            # Reason-Added is_active functionality
            response_data = {
                'banner': homeSerializer.data,
                'best_selling_products': best_selling_serializer.data,
                'featured_products': featured_product_serializer.data,
            }

            return Response(response_data, 200)
        except Exception as e:
            return Response({'error': str(e)}, 500)
# End of code addition by Unnati on 31-08-2024
# Reason-Changed home to home banner


"""
End of code addition by - Unnati on 05-08-2024
Reason - Created home page APIView
"""
"""
Code commented by - Unnati on 06-10-2024
Reason - To remove brand item API View
"""


# class BrandItemAPIView(APIView):
#     def get(self, request, brandId):
#         try:
#             # Code added by Unnati on 24-08-2024
#             # Reason-Added sort order functionality for brand
#             sort_order = request.query_params.get('sort_order', 'default')

#             products = Product.objects.filter(brand_id=brandId, is_active=True)

#             if sort_order == 'highToLow':
#                 products = products.order_by('-sales_rate', '-id')
#             elif sort_order == 'lowToHigh':
#                 products = products.order_by('sales_rate', 'id')
#             else:
#                 products = products.order_by('id')
#             # End of code addition by Unnati on 24-08-2024
#             # Reason-Added sort order functionality for brand
#             productSerializer = ProductSerializer(products, many=True)

#             return Response({"msg": "success", "product": productSerializer.data}, status=200)

#         except Exception as e:

#             return Response({'error': "Something went wrong", "details": str(e)}, status=500)


"""
End of code addition by - Unnati on 06-10-2024
Reason - To remove brand item API View
"""
"""
Code added by - Unnati on 11-08-2024
Reason - Created Shipping API
"""


class ShippingAPIView(APIView):
    def get(self, request):
        try:
            shipping = Shipping.objects.first()
            shippingSerializer = ShippingSerializer(shipping)
            shippingData = shippingSerializer.data
            return Response({"msg": "success", "shipping": shippingData}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code additon by - Unnati on 11-08-2024
Reason - Created Shipping API
"""

"""
Code added by - Unnati on 16-08-2024
Reason - Created big and tall inquiry API
"""


class BigAndTallInquiryAPIView(APIView):
    def post(self, request):

        data = {
            "item_name": request.data["item_name"],
            "size_and_dimension": request.data["size_and_dimension"],
            "first_name": request.data["first_name"],
            "last_name": request.data["last_name"],
            "email": request.data["email"],
            "contact_number": request.data["contact_number"],
            "additional_information": request.data["additional_information"],
        }
        bigAndTallInquirySerailizer = BigAndTallInquirySerializer(data=data)

        try:
            if bigAndTallInquirySerailizer.is_valid(raise_exception=True):
                bigAndTallInquirySerailizer.save()
                return Response({"success": "Registration done successfully"}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response(bigAndTallInquirySerailizer.errors, 500)


"""
End of code addition by - Unnati on 16-08-2024
Reason - Created big and tall inquiry API
"""
"""
Code added by - Unnati on 22-08-2024
Reason - Created Request catalog API
"""


class RequestCatalogAPIView(APIView):
    def post(self, request):

        data = {
            "first_name": request.data["first_name"],
            "last_name": request.data["last_name"],
            "email": request.data["email"],
            "contact_number": request.data["contact_number"],
            "company": request.data["company"],
            "address_line1": request.data["address_line1"],
            "address_line2": request.data["address_line2"],
            "city": request.data["city"],
            "state": request.data["state"],
            "zipcode": request.data["zipcode"],
            "comments": request.data["comments"],
        }
        requestCatalogSerailizer = RequestCatalogSerializer(data=data)

        try:
            if requestCatalogSerailizer.is_valid(raise_exception=True):
                requestCatalogSerailizer.save()
                return Response({"success": "Registration done successfully"}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response(requestCatalogSerailizer.errors, 500)


"""
End of code addition by - Unnati on 22-08-2024
Reason - Created Request catalog API
"""
"""
Code added by - Unnati on 22-08-2024
Reason - Created Blog API
"""


class BlogAPIView(APIView):
    def get(self, request, id=None):
        try:
            if id:
                blog = Blog.objects.get(id=id)
                blogSerializer = BlogSerializer(blog)
            else:
                blog = Blog.objects.all()
                blogSerializer = BlogSerializer(blog, many=True)

            return Response({"msg": "success", "blog": blogSerializer.data}, 200)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, 404)
        except Exception as e:
            logger.error(f"Error fetching blog(s): {e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 22-08-2024
Reason - Created Blog API
"""
"""
Code added by - Unnati on 30-08-2024
Reason - Created clear cart API
"""


class ClearCartAPIView(APIView):
    def post(self, request, user_id):
        try:
            cartItem = Cart.objects.filter(user_id=user_id)
            cartItem.delete()
            return Response({"success": "Cart cleared successfully"})
        except Exception as e:
            logger.error(f"Error fetching blog(s): {e}")
            return Response({"error": "User does not exist"}, 400)


"""
End of code addition by - Unnati on 30-08-2024
Reason - Created clear cart API
"""
"""
Code added by - Unnati on 15-09-2024
Reason - Created Update user address for primary address API
"""


class UpdateUserAddressAPIView(APIView):
    def put(self, request):
        try:
            address_id = request.query_params.get('addressId')

            user_id = request.query_params.get('userId')
            userAddress = UserAddressDetails.objects.get(id=address_id)

            UserAddressDetails.objects.filter(
                user=user_id).update(is_primary=False)

            userAddress.is_primary = True
            userAddress.save()

            userAddressSerializer = UserAddressDetailsSerializer(
                UserAddressDetails.objects.filter(user=user_id), many=True)

            return Response({"message": "Set as Primary", "updatedAddress": userAddressSerializer.data}, 200)
        except Exception as e:
            logger.error(f"Error fetching blog(s): {e}")
            return Response({"error": "Address not found"}, 404)


"""
End of code addition by - Unnati on 15-09-2024
Reason - Created Update user address for primary address API
"""
"""
Code added by - Unnati on 15-09-2024
Reason - Created API to get user primary address
"""


class UserPrimaryAddressAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user')

        try:
            user_address = UserAddressDetails.objects.filter(
                user_id=user_id, is_primary=True)

            userAddressDetailsSerializer = UserAddressDetailsSerializer(
                user_address, many=True)
            return Response({
                "userAddress": userAddressDetailsSerializer.data,
            }, 200)

        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 15-09-2024
Reason - Created API to get user primary address
"""
"""
Code added by - Unnati on 15-09-2024
Reason - Created API to remove address
"""


class RemoveAddressAPIView(APIView):
    def put(self, request):
        try:
            address_id = request.query_params.get("addressId")
            user_id = request.query_params.get("userId")
            address = UserAddressDetails.objects.get(id=address_id)
            address.delete()
            remaining_addresses = UserAddressDetails.objects.filter(
                user=user_id)
            remaining_addresses_serializer = UserAddressDetailsSerializer(
                remaining_addresses, many=True)
            return Response({"message": "Deleted successfully", "remainingAddresses": remaining_addresses_serializer.data}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 15-09-2024
Reason - Created API to get user primary user address
"""
"""
Code added by - Unnati on 16-09-2024
Reason - Created API to update shipping address
"""


class UpdateShippingAddressAPIView(APIView):
    def put(self, request):
        try:
            address_id = request.query_params.get("addressId")
            user_id = request.query_params.get("userId")
            user_address = UserAddressDetails.objects.get(id=address_id)
            userAddressSerializer = UserAddressDetailsSerializer(
                user_address, data=request.data, partial=True)
            if userAddressSerializer.is_valid():
                userAddressSerializer.save()
                all_addresses = UserAddressDetails.objects.filter(
                    user_id=user_id)
                all_addresses_serializer = UserAddressDetailsSerializer(
                    all_addresses, many=True)
                return Response({"message": "updated successfully", "updatedUserAddress": all_addresses_serializer.data}, 200)
            else:
                return Response({"error": "Address not found"}, 404)
        # Code added by Unnati on 30-09-2024
        # Reason-Added try and exception block
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)
        # End of code addition by Unnati on 30-09-2024
        # Reason-Added try and exception block


"""
End of code addition by - Unnati on 16-09-2024
Reason - Created API to update shipping address
"""

"""
Code added by - Unnati on 03-10-2024
Reason - Created API search order on basis of date and orderId
"""


class SearchOrderAPIView(APIView):
    def get(self, request):
        try:
            searchTerm = request.query_params.get('search_term')
            selectedDate = request.query_params.get('selected_date')
            currentPage = request.query_params.get('current_page', 1)
            listPerPage = request.query_params.get('list_per_page', 8)
            # Added by - Ashlekh on 15-11-2024
            # Reason - To get user_id from fontend
            user_id = request.query_params.get('user_id')
            # End of code - Ashlekh on 15-11-2024
            # Reason - To get user_id from frontend
            # Code commented by Unnati on 04-10-2024
            # Reason-This code is not in use
            # query = Q()
            # if searchTerm:
            #     searchTerm = searchTerm.rstrip()
            #     query &= Q(order_id__icontains=searchTerm)
            # if selectedDate:
            #     query &= Q(date=selectedDate)
            # order_history = Order.objects.filter(query)
            # End of code addition by Unnati on 04-10-2024
            # Reason-This code is not in use
            # Code changed by - Ashlekh on 15-11-2024
            # Reason - To apply filter using user id
            # order_history = Order.objects.filter(
            #     order_id__icontains=searchTerm, date=selectedDate).order_by('-id')
            #Code modified by Unnati on 23-11-2024
            #Reason-Modified date to order date
            order_history = Order.objects.filter(user=user_id,
                order_id__icontains=searchTerm, order_date__date=selectedDate).order_by('-id')
            #End of code addition by Unnati on 23-11-2024
            #Reason-Modified date to order date
            # End of code - Ashlekh on 15-11-2024
            # Reason - To apply filter using user id
            paginator = Paginator(order_history, listPerPage)
            paginated_order_history = paginator.page(currentPage)
            orderSerializer = OrderSerializer(
                paginated_order_history, many=True)
            orderData = orderSerializer.data
            order_history_count = order_history.count()

            return Response({"msg": "success", "order": orderData, "searched_order_count": order_history_count}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"})


"""
End of code addition by - Unnati on 03-10-2024
Reason - Created API search order on basis of date and orderId
"""

"""
Code added by - Unnati on 05-10-2024
Reason - Created API to get sale products
"""


class SaleProductAPIView(APIView):
    def get(self, request):
        try:
            categoryIds = []
            # Code added by Unnati on 07-10-2024
            # Reason-To define category_ids
            category_ids = []
            # End of code addition by Unnati on 07-10-2024
            # Reason-To define category_ids
            banner_id = request.query_params.get('id')
            homeBanner = HomeBanner.objects.get(id=banner_id)
            #Code added by Unnati on 06-12-2024
            #Reason-To get sortorder
            sort_order =request.query_params.get('sortOrder')
             #End of code additon by Unnati on 06-12-2024
            #Reason-To get sortorder
            # Modified by Jhamman on 10-10-2024
            # Reason - Added condition to check that banner have offer percentage or not
            # category_sale = Category.objects.filter(banner_id=banner_id)
            # for c in category_sale:
            #     category_ids = getCategoryId(c, categoryIds)

            # Code added by Unnati on 06-10-2024
            # Reason-To check whether discount is applied in amount or percentage
            # Code added by Unnati on 07-10-2024
            # Reason-Added a condition
            # if len(category_ids)>0:

            #     category_products = Product.objects.filter(
            #         Q(category_id__in=category_ids) &  Q(is_on_sale=True) & (Q(sale_percentage__lte=homeBanner.offer_percentage) | Q(sale_percentage=None)))
            # else:
            #     category_products = Product.objects.none()
            # End of code addition by Unnati on 07-10-2024
            # Reason-Added a condition
            # End of code addition by Unnati on 06-10-2024
            # Reason-To check whether discount is applied in amount or percentage
            # Code added by Unnati on 07-10-2024
            # Reason-Added query
            # products = Product.objects.filter(Q(banner_id=banner_id) & (Q(sale_percentage__lte=homeBanner.offer_percentage) | Q(sale_percentage=None)))
            # products = Product.objects.filter(banner_id=banner_id)

            # End of code addition  by Unnati on 07-10-2024
            # Reason-Added query
            # combined_products = category_products | products
            # unique_products = combined_products.distinct()

            # Modified by Jhamman on 14-10-2024
            # Reason - Changed comparison
            # if homeBanner.offer_percentage is not None and homeBanner.offer_percentage > '0':
            if homeBanner.offer_percentage is not None and homeBanner.offer_percentage > 0:
                # End of modification by Jhamman on 14-10-2024
                # Reason - Changed comparison
                # Code added by Unnati on 20-10-2024
                # Reason-Added is_active condition
                # Code commented by Unnati on 06-12-2024
                # Reason-commented distinct and added order by
                products = Product.objects.filter(Q(banner_id=banner_id, is_active=True) & (
                    Q(sale_percentage__lte=homeBanner.offer_percentage))).order_by('-id')
                #End of code addition by Unnati on 06-12-2024
                # Reason-commented distinct and added order by
            else:
                # Code added by Unnati on 27-10-2024
                # Reason-Added distinct
                 # Code commented by Unnati on 06-12-2024
                # Reason-commented distinct and added order by
                products = Product.objects.filter(
                    banner_id=banner_id, is_active=True).order_by('-id')
                #End of code addition by Unnati on 06-12-2024
                # Reason-commented distinct and added order by
                # End of code addition by Unnati on 27-10-2024
                # Reason-Added distinct
                # End of code addition by Unnati on 20-10-2024
                # Reason-Added is_active condition

               
            # Added by - Ashish Dewangan on 19-12-2024
            # Reason - To remove unavailable products from banner       
            unavailable_product_ids=[]
            for product in products:
                hierarchy=[] 
                category = product.category
                hierarchy=get_inactive_parent_category_hierarchy(category,hierarchy)
                if category.is_active == False or len(hierarchy)>0:
                    unavailable_product_ids.append(product.id)
            products = products.filter(~Q(id__in=unavailable_product_ids))  
            # End of addition by - Ashish Dewangan on 19-12-2024
            # Reason - To remove unavailable products from banner      
                
            #Code added by Unnati on 06-12-2024
            #Reason-Added order by and distinct   
            # products = products.order_by('product_id', '-id').distinct('product_id') 
            #End of code addition by Unnati on 06-12-2024
            #Reason-Added order by and distinct   
            # End of modification by Jhamman on 10-10-2024
            # Reason - Added condition to check that banner have offer percentage or not
             #Code added by Unnati on 06-12-2024
            #Reason-Added sort order
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added order by 
            if sort_order == 'highToLow':
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('sales_rate').desc()] 
                    )
                ).filter(row_number=1).order_by('-sales_rate', 'product_id')
            elif sort_order == 'lowToHigh':
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('sales_rate')] 
                    )
                ).filter(row_number=1).order_by('sales_rate', 'product_id')
            else:
                products = products.annotate(
                    row_number=Window(
                        expression=RowNumber(),
                        partition_by=[F('product_id')],
                        order_by=[F('id').desc()] 
                    )
                ).filter(row_number=1).order_by('-id', 'product_id')
            ##End of code modification by Unnati on 15-01-2025
            ##Reason-Added order by
             #End of code addition by Unnati on 06-12-2024
            #Reason-Added sort order
            productSerializer = ProductSerializer(
                products, many=True).data
            return Response({"msg": "success", "sale_product": productSerializer}, 200)
        except Exception as e:
            logger.error(f"{e}")
            print(e)
            return Response({"error": "Something went wrong"})


"""
End of code addition by - Unnati on 05-10-2024
Reason - Created API to get sale products
"""
"""
Added by - Ashlekh on 08-10-2024
Reason - To have privacy policy API
"""


class PrivacyPolicyAPIView(APIView):
    def get(self, request):
        try:
            policyData = Policies.objects.first()
            policyDataSerializer = PoliciesSerializer(policyData)
            privacyPolicyData = policyDataSerializer.data
            return Response({"msg": "success", "policy": privacyPolicyData}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code - Ashlekh on 08-10-2024
Reason - To have privacy policy API
"""
"""
Added by - Unnati on 19-10-2024
Reason - To UserAddressDetail API
"""


class UserAddressDetailAPIView(APIView):
    def post(self, request):
        try:
            user = request.data["user"]
            # Code added by Unnati on 21-10-2024
            # Reason-To check if userAddress is only one then set it as primary
            make_primary = False
            #Code added by Unnati on 14-12-2024
            #Reason-Added filter by user
            # if UserAddressDetails.objects.count() == 0:
            if UserAddressDetails.objects.filter(user=user).count() == 0:
            #End of code addition by Unnati on 14-12-2024
            #Reason-Added filter by user
                make_primary = True
            # End of code addition by Unnati on 21-10-2024
            # Reason-To check if userAddress is only one then set it as primary
            data = {
                "user": request.data["user"],
                "first_name": request.data["first_name"],
                "last_name": request.data["last_name"],
                "address": request.data["address"],
                "city": request.data["city"],
                "country": request.data["country"],
                "state": request.data["state"],
                "zipcode": request.data["zipcode"],
                "contact_number": request.data["contact_number"],
                "company": request.data["company"],
                # Code added by Unnati on 21-10-2024
                # Reason-To set first address as primary
                "is_primary": make_primary,
                # End of code addition by Unnati on 21-10-2024
                # Reason-To set first address as primary
            }
           # Code added by Unnati on 21-10-2024
           # Reason-To check whether userAddress already exists or not

            existing_address = UserAddressDetails.objects.filter(
                user=user,
                first_name=data["first_name"],
                last_name=data["last_name"],
                address=data["address"],
                city=data["city"],
                country=data["country"],
                state=data["state"],
                zipcode=data["zipcode"],
                contact_number=data["contact_number"],
                company=data["company"]
            ).first()

            if existing_address:

                allAddresses = UserAddressDetails.objects.filter(
                    user=user).order_by('-id')
                serializedAddresses = UserAddressDetailsSerializer(
                    allAddresses, many=True)
                return Response({
                    "success": "Address already exists",
                    "userAddress": serializedAddresses.data,
                    "id": existing_address.id
                }, 200)

           # End of code addition by Unnati on 21-10-2024
           # Reason-To check whether userAddress already exists or not
            userAddressSerializer = UserAddressDetailsSerializer(data=data)
            if userAddressSerializer.is_valid():
                userAddressSerializer.save()

                allAddresses = UserAddressDetails.objects.filter(
                    user=user).order_by('-id')
                maxAddressId = allAddresses.first().id if allAddresses.exists() else None
                serializedAddresses = UserAddressDetailsSerializer(
                    allAddresses, many=True)
                return Response({
                    "success": "Address created successfully",
                    "userAddress": serializedAddresses.data,
                    "id": maxAddressId
                }, 200)
            else:
                return Response({"error": "Something went wrong"}, 400)

        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 19-10-2024
Reason - To UserAddressDetail API
"""

"""
# Added by - Ashlekh on 16-10-2024
# Reason - To add paypal capture view
"""


class PayPalCaptureView(APIView):
    def post(self, request):
        try:
            billing_address = request.data.get('billingAddress')
            shipping_address = request.data.get('shippingAddress')
            ##Code added by Unnati on 07-11-2024
            ##Reason-To get order time and convert its format
            order_time = request.data.get('localOrderTime')
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_order_time = datetime.strptime(
                order_time, datetime_format)
            ##End of code addition by Unnati on 07-11-2024
            ##Reason-To get order time and convert its format
            paypalOrderIdFrontend = request.data.get('paypalOrderId')
            paypalAccessTokenFrontend = request.data.get('paypalAccessToken')
            PAYPAL_API_BASE_FOR_PAYMENT_VERIFICATION = os.getenv(
                "PAYPAL_BASE_URL")
            url = f"{PAYPAL_API_BASE_FOR_PAYMENT_VERIFICATION}/v2/checkout/orders/{paypalOrderIdFrontend}/capture"
            headers = {
                "Authorization": f"Bearer {paypalAccessTokenFrontend}",
                "Content-Type": "application/json",
            }
            response = requests.post(url, headers=headers)
            status = response.json().get('purchase_units', [{}])[0].get(
                'payments', {}).get('captures', [{}])[0].get('status')
            paypal_response = response.json().get('status')
            # if response.status_code == 201:
            #     response = OrderAPI(self, request)
            #     return response
            # else:
            #     return Response({"status": "error"}, status=200)

            if paypal_response == "COMPLETED":
                ##Code added by Unnati on 07-11-2024
                ##Reason-To pass converted_order_time
                response = OrderAPI(self, request, paypal_response,
                                    paypalOrderIdFrontend, paypalAccessTokenFrontend, converted_order_time)
                ##End of code addition by Unnati on 07-11-2024
                ##Reason-To pass converted_order_time
                return response
            elif status == "PENDING":
                # order.payment_status = "Pending"
                # order.save()
                ##Code added by Unnati on 07-11-2024
                ##Reason-To pass converted_order_time
                response = OrderAPI(self, request, paypal_response,
                                    paypalOrderIdFrontend, paypalAccessTokenFrontend, converted_order_time)
                ##End of code addition by Unnati on 07-11-2024
                ##Reason-To pass converted_order_time
                return response
                # return Response({"status": "pending", "message": "pending"}, status=200) #status=202
            # elif status in ["DENIED", "FAILED"]:
            #     # order.payment_status = "Failed"
            #     # order.save()
            #     return Response({"status": "denied or failed", "message": "payment denied or failed"}, status=200) #status=403
            else:
                # order.payment_status = "Error occured while verifying payment"
                # order.save()
                return Response({"status": "error", "message": "Something went wrong"}, status=500)
        except Exception as e:
            print("Error in PayPalCaptureView ", e)
            return Response({"status": "error", }, status=500)


"""
# End of code - Ashlekh on 16-10-2024
# Reason - To add paypal capture view
"""
"""
# Added by - Ashlekh on 16-10-2024
# Reason - To create paypal order id
"""


def create_paypal_order(access_token, order_data):
    try:
        # PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"
        PAYPAL_API_BASE = os.getenv("PAYPAL_BASE_URL")
        url = f"{PAYPAL_API_BASE}/v2/checkout/orders"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.post(url, headers=headers, json=order_data)
        if response.status_code == 201:
            return response.json()
        else:
            return Response({"error": "error"}, status=200)
    except Exception as e:
        print("Error in creating PayPal order", e)
        return Response({"Error in create_paypal_order": str(e)}, status=200)


"""
# End of code - Ashlekh on 16-10-2024
# Reason - To create paypal order id
"""

"""
# Added by - Ashlekh on 17-10-2024
# Reason - To create paypal order (using userId we will get details from cart)
"""


class CreatePayPalOrderView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get("userId")
            cartData = Cart.objects.filter(user=user_id)
            subtotal = 0
            # Code changed by - Ashlekh on 21-02-2025
            # Reason - To calculate price of customization
            # for item in cartData:
            #     item_total = 0
            #     if (item.XS or 0) > 0:
            #         item_total += item.XS * item.sales_rate
            #     if (item.S or 0) > 0:
            #         item_total += item.S * item.sales_rate
            #     if (item.M or 0) > 0:
            #         item_total += item.M * item.sales_rate
            #     if (item.L or 0) > 0:
            #         item_total += item.L * item.sales_rate
            #     if (item.XL or 0) > 0:
            #         item_total += item.XL * item.sales_rate
            #     if (item.XXL or 0) > 0:
            #         item_total += item.XXL * item.sales_rate
            #     if (item.XXXL or 0) > 0:
            #         item_total += item.XXXL * item.sales_rate
            #     #Code added by Unnati on 02-01-2025
            #     #Reason-Added free size condition  
            #     if (item.free_size or 0) > 0:
            #         item_total += item.free_size * item.sales_rate
            #     #End of code addition by Unnati on 02-01-2025
            #     #Reason-Added free size condition     
            #     subtotal = subtotal+item_total
            # discount_id = request.data.get("discount")
            # if discount_id:
            #     discount = Discount.objects.filter(
            #         id=discount_id, is_active=True).first()
            #     discount_amount = discount.discount_amount
            #     taxable_amount = Decimal(subtotal) - discount_amount
            #     print("aaaaaaaaa", taxable_amount)
            # else:
            #     discount_amount = Decimal("0.00")
            #     taxable_amount = Decimal(subtotal)
            #     print("bbbbbbbb", taxable_amount)
            for item in cartData:
                item_total = 0
              
                product = item.product 
                
                sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                sale_rate_after_discount = float(
                            item.sales_rate) - (float(item.sales_rate) * (sale_percentage/100))
                after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else item.sales_rate

                if item.logo==True:
                            after_customization_product_price +=float( item.logo_price)
                if item.patches==True:
                            after_customization_product_price +=float( item.patches_price)
                if item.security_batches==True:
                            after_customization_product_price +=float( item.security_batches_price)
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                if item.security_id_on_back==True:
                            after_customization_product_price +=float( item.security_id_on_back_price)
                if item.printed_id==True:
                            after_customization_product_price +=float( item.printed_id_price)
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                if item.embroider==True:
                            after_customization_product_price +=float( item.embroider_price )

                customization_price = after_customization_product_price 

                if (item.quantity or 0) > 0:
                    item_total += item.quantity * customization_price
                subtotal += item_total
 
                subtotal=round(subtotal,2)

            discount_id = request.data.get("discount")

            if discount_id:
                discount = Discount.objects.filter(
                    id=discount_id, is_active=True).first()
                discount_amount = discount.discount_amount
                taxable_amount = Decimal(subtotal) - discount_amount

            else:
                discount_amount = Decimal('0.00')
                taxable_amount = Decimal(subtotal)
            # End of code - Ashlekh on 21-02-2025
            # Reason - To calculate price of customization
  
            taxable_amount = round(taxable_amount, 2) 
            #Code modified by Unnati on 25-11-2024
            #Reason-Added sales_tax from config
            # tax_percentage = Decimal('5.0')    
            tax_percentage = Decimal(sales_tax)
            #End of code addition by Unnati on 25-11-2024
            #Reason-Added sales_tax from config
            tax = (tax_percentage / Decimal('100')) * taxable_amount
            grand_total = taxable_amount + tax

            # Added by - Ashlekh on 17-10-2024
            # Reason - To create paypal access token & to create paypal order
            PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
            PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
            PAYPAL_API_BASE = os.getenv("PAYPAL_BASE_URL")
            url = f"{PAYPAL_API_BASE}/v1/oauth2/token"
            auth = HTTPBasicAuth(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            }
            data = {
                "grant_type": "client_credentials"
            }
            response = requests.post(
                url, headers=headers, auth=auth, data=data)
            if response.status_code != 200:
                return Response({"Error in generating paypal access token ": {response.text}}, status=200)
            access_token = response.json().get("access_token")
            order_data = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{round(grand_total, 2):.2f}"
                    }
                }]
            }
            paypal_order = create_paypal_order(access_token, order_data)
            paypal_order_id = paypal_order.get('id')
            return Response({"success": "PayPal order created successfully",
                             "paypal_order_id": paypal_order_id,
                             "paypal_access_token": access_token
                             }, status=200)
            # End of code - Ashlekh on 17-10-2024
            # Reason - To create paypal access token & to create paypal order
        except Exception as e:
            print("Error in create paypal order view", e)
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)


"""     
# End of code - Ashlekh on 17-10-2024
# Reason - To create paypal order (using userId we will get details from cart)
"""

"""
# Added by - Ashlekh on 18-10-2024
# Reason - Method to save details in Order table (according to PayPal payment status)
"""


##Added by - Unnati on 07-11-2024
##Reason-Added converted_order_time
def OrderAPI(self, request, paypal_response, paypalOrderIdFrontend, paypalAccessTokenFrontend, converted_order_time):
##End of code addition by - Unnati on 07-11-2024
##Reason-Added converted_order_time
   
    try:
        user = request.data.get("userId")
        userObject = User.objects.get(id=user)
        cart = Cart.objects.filter(user=userObject)

        subtotal = 0
        for item in cart:
            item_total = 0
            # Modification and addition by Om Shrivastava on 25-11-2024
            # Reason : Add customization price 

            # if (item.XS or 0) > 0:
            #     item_total += item.XS * item.sales_rate

            # if (item.S or 0) > 0:
            #     item_total += item.S * item.sales_rate
            # if (item.M or 0) > 0:
            #     item_total += item.M * item.sales_rate
            # if (item.L or 0) > 0:
            #     item_total += item.L * item.sales_rate
            # if (item.XL or 0) > 0:
            #     item_total += item.XL * item.sales_rate
            # if (item.XXL or 0) > 0:
            #     item_total += item.XXL * item.sales_rate
            # if (item.XXXL or 0) > 0:
            #     item_total += item.XXXL * item.sales_rate
            # Modification and addition by Om Shrivastava on 03-12-2024
            # Reason : Add proper customization price calculation 
            product = item.product  # Assuming each cart item has a product relation

            # Fetch customization details from the product table
            # show_patches_and_embroider_on_UI = product.show_patches_and_embroider_on_UI
             
            # Calculate the base price
            # customization_price = item.sales_rate
            # if product.sale_percentage:
            #     customization_price -= (customization_price * product.sale_percentage) / 100

            # Add customization prices if applicable
            # if show_patches_and_embroider_on_UI:
            #     customization_price = after_customization_product_price
            # print(customization_price,'check customization price')

            # if (item.XS or 0) > 0:
            #     item_total += item.XS * customization_price
            # if (item.S or 0) > 0:
            #     item_total += item.S * customization_price
            # if (item.M or 0) > 0:
            #     item_total += item.M * customization_price
            # if (item.L or 0) > 0:
            #     item_total += item.L * customization_price
            # if (item.XL or 0) > 0:
            #     item_total += item.XL * customization_price
            # if (item.XXL or 0) > 0:
            #     item_total += item.XXL * customization_price
            # if (item.XXXL or 0) > 0:
            #     item_total += item.XXXL * customization_price
            
            # print(item_total,'items total')
            # after_customization_product_price = item.after_customization_product_price
            
            sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
            sale_rate_after_discount = float(
                        item.sales_rate) - (float(item.sales_rate) * (sale_percentage/100))
            after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else item.sales_rate
            if item.logo==True:
                        after_customization_product_price +=float( item.logo_price)
            if item.patches==True:
                        after_customization_product_price +=float( item.patches_price)
            if item.security_batches==True:
                        after_customization_product_price +=float( item.security_batches_price)
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            if item.security_id_on_back==True:
                        after_customization_product_price +=float( item.security_id_on_back_price)
            if item.printed_id==True:
                        after_customization_product_price +=float( item.printed_id_price)
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            if item.embroider==True:
                        after_customization_product_price +=float( item.embroider_price )

            customization_price = after_customization_product_price 

            if (item.quantity or 0) > 0:
                item_total += item.quantity * customization_price
            # subtotal = subtotal+item_total
            subtotal += item_total
            #Code added by Unnati on 04-12-2024
            #Reason-Added round for subtotal
            subtotal=round(subtotal,2)
            #End of code addition by Unnati on 04-12-2024
            #Reason-Added round for subtotal

        discount_id = request.data.get("discount")

        if discount_id:
            discount = Discount.objects.filter(
                id=discount_id, is_active=True).first()
            discount_amount = discount.discount_amount
            taxable_amount = Decimal(subtotal) - discount_amount

        else:
            discount_amount = Decimal('0.00')
            taxable_amount = Decimal(subtotal)
         #Code added by Unnati on 04-12-2024
         #Reason-Added round for taxable amount   
        taxable_amount = round(taxable_amount, 2)    
         #End of code addition by Unnati on 04-12-2024
         #Reason-Added round for taxable amount  
        #Code modified by Unnati on 25-11-2024
        #Reason-Added sales_tax from config
        # tax_percentage = Decimal('5.0')
        tax_percentage = Decimal(sales_tax)
        #End of code modification by Unnati on 25-11-2024
        #Reason-Added sales_tax from config
        tax = (tax_percentage / Decimal('100')) * taxable_amount
        grand_total = taxable_amount + tax

        order_id = generate_order_id()

        if paypal_response == "COMPLETED":
            payment_status = "Completed"
        else:
            payment_status = "Pending"

        order_summary_data = {
            "order_id": order_id,
            "user": userObject.pk,
            "subtotal": subtotal,
            "is_discount_applied": discount_id is not None,
            "discount_amount": discount_amount if discount_id else Decimal('0.00'),
            "discount_code": "",
            "total_amount": subtotal,
            "shipping_amount": Decimal('0.00'),
            "taxable_amount": taxable_amount,
            "tax_percentage": str(tax_percentage),
            "tax_amount": round(tax, 2),
            "grand_total": round(grand_total, 2),
            "order_status": "Process",
            "payment_status": payment_status,
            "shipping_status": "",
            "discount_code": "",
            "date": datetime.now().strftime('%d-%m-%Y'),
            ##Code added by Unnati on 07-11-2024
            ##Reason-Added order_date
            "order_date": converted_order_time,
            ##End of code addition by Unnati on 07-11-2024
            ##Reason-Added order_date
        }

        orderSerializer = OrderSerializer(data=order_summary_data)
        order_row_id = None
        order_summary = None
        if orderSerializer.is_valid():
            order_summary = orderSerializer.save()
            order_row_id = order_summary.pk
            order_summary.paypal_order_id = paypalOrderIdFrontend
            order_summary.paypal_access_token = paypalAccessTokenFrontend
            order_summary.save()
        else:
            print(orderSerializer.errors)
        for cart_item in cart:
            # for size in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                # quantity = getattr(cart_item, size) or 0
                quantity = getattr(cart_item,cart_item.size) or 0
                has_patch = False
                has_embroidery = False

                # Modified by - Ashish Dewangan on 12-12-2024
                # Reason - To use quantity from cart directly
                # if quantity > 0:
                if cart_item.quantity > 0:
                # End of modification by - Ashish Dewangan on 12-12-2024
                # Reason - To use quantity from cart directly    
                    size_field_patch = f"{cart_item.size.lower()}_patches"

                    has_patch = getattr(
                        cart_item, size_field_patch, False) or False
                        # cart_item, False) or False

                    size_field_embroidery = f"{cart_item.size.lower()}_embroider"
                    has_embroidery = getattr(
                        cart_item, size_field_embroidery, False) or False
                        # cart_item, False) or False

                if cart_item.quantity > 0:
                    # Addition by Om Shrivastava on 26-11-2024
                    # Reason : Get the customization price 
                    product = cart_item.product
                    # show_patches_and_embroider_on_UI = product.show_patches_and_embroider_on_UI
                    # after_customization_product_price = product.after_customization_product_price

                    # Calculate the sales rate
                    # customization_price = product.sales_rate
                    # if product.sale_percentage:
                    #     customization_price -= (customization_price * product.sale_percentage) / 100

                    # if show_patches_and_embroider_on_UI:
                    #     customization_price = after_customization_product_price

                    # amount = (
                    #     quantity * customization_price
                    #     if show_patches_and_embroider_on_UI
                    #     else quantity * cart_item.sales_rate
                    # )
                    sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                    sale_rate_after_discount = float(
                        cart_item.sales_rate) - (float(cart_item.sales_rate) * (sale_percentage/100))
                    after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else cart_item.sales_rate

                    if cart_item.logo==True:
                        after_customization_product_price +=float( cart_item.logo_price)
                    if cart_item.patches==True:
                        after_customization_product_price +=float( cart_item.patches_price)
                    if cart_item.security_batches==True:
                        after_customization_product_price +=float( cart_item.security_batches_price)
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if item.security_id_on_back==True:
                        after_customization_product_price +=float( item.security_id_on_back_price)
                    if item.printed_id==True:
                        after_customization_product_price +=float( item.printed_id_price)
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.embroider==True:
                        after_customization_product_price +=float( cart_item.embroider_price )

                    customization_price = after_customization_product_price
                    
                    amount = (
                        cart_item.quantity * customization_price
                    )
                    #Code added by Unnati on 22-12-2024
                    #Reason-To check if invoice exists or not
                    existing_invoice = OrderItem.objects.filter(
                        order=order_summary,
                        type="Sold"
                    ).values_list('invoice_id', flat=True).first()
                    invoice_id = existing_invoice if existing_invoice else generate_invoice_number()
                    #End of code addition by Unnati on 22-12-2024
                    #Reason-To check if invoice exists or not
                    # End of addition by Om Shrivastava on 26-11-2024
                    # Reason : Get the customization price
                    #Code added by Unnati on 22-12-2024
                    #Reason-Calculation for each item row like amount,subtotal and grandtotal
                    sales_rate = float(cart_item.sales_rate)
                    # sales_tax = float(sales_tax)
                    sale_percentage = float(sale_percentage) if sale_percentage else 0.0
                    quantity = float(quantity)
                    after_customization_product_price = float(after_customization_product_price)

                    # Calculate amount
                    if sale_percentage:
                        amount = sales_rate - ((sale_percentage / 100) * sales_rate)
                    else:
                        amount = sales_rate

                    # Calculate item subtotal and tax
                    #Code modified by Unnati on 02-01-2025
                    #Reason -modified quantity
                    # item_subtotal = quantity * after_customization_product_price
                    item_subtotal = cart_item.quantity * after_customization_product_price
                    #End of code modification by Unnati on 02-01-2025
                    #Reason -modified quantity
                    tax_percentage = float(sales_tax)
                    ##Code modified by unnati on 15-01-2025
                    ##Reason-Added round off
                    tax_amount = round((tax_percentage / 100) * item_subtotal, 2)
                    total_amount =  round(item_subtotal+tax_amount, 2)
                    ##End of code modification by unnati on 15-01-2025
                    ##Reason-Added round off
                    #End of code addition by Unnati on 22-12-2024
                    #Reason-Calculation for each item row like amount,subtotal and grandtotal
                    OrderItem.objects.create(
                        order=order_summary,
                        product=cart_item.product,
                        # size=size,
                        size=cart_item.size,
                        # Modified by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        # quantity=quantity,
                        quantity=cart_item.quantity,
                        # End of modification by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        color=cart_item.color,
                        sales_rate=cart_item.sales_rate,
                        # Modification and addition by Om Shrivastava on 26-11-2024
                        # Reason : Set the amount 
                        # amount=quantity * cart_item.sales_rate,
                        amount=amount,
                        # End of modification and addition by Om Shrivastava on 26-11-2024
                        # Reason : Set the amount 
                        # Code changed by - Ashlekh on 12-12-2024
                        # Reason - To change default item status
                        # item_status="Pending",
                        item_status="Order Placed",
                        # End of code - Ashlekh on 12-12-2024
                        # Reason - To change default item status
                        has_patch=has_patch,
                        has_embroidery=has_embroidery,
                        ##Code added by Unnati on 07-11-2024
                        ##Reason-Added ordered_at
                        ordered_at=converted_order_time,
                        ##End of code addition by Unnati on 07-11-2024
                        ##Reason-Added ordered_at
                        # Modification and addition by Om Shrivastava on 21-11-2024
                        # Reasohn : Add customization key
                        # show_patches_and_embroider_on_UI=show_patches_and_embroider_on_UI,
                        after_customization_product_price=customization_price,
                        # End of modification and addition by Om Shrivastava on 21-11-2024
                        # Reasohn : Add customization key
                        # Addiiton by Om Shrivastava on 03-12-2024
                        # Reason : Add customization keys
                        logo = cart_item.logo,
                        patches = cart_item.patches,
                        security_batches = cart_item.security_batches,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back = cart_item.security_id_on_back,
                        printed_id = cart_item.printed_id,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider = cart_item.embroider,
                        # Addition by Om Shrivastava on 04-12-2024
                        # Reason : Add the customization all prices 
                        logo_price= cart_item.logo_price,
                        patches_price = cart_item.patches_price,
                        security_batches_price = cart_item.security_batches_price,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back_price = cart_item.security_id_on_back_price,
                        printed_id_price = cart_item.printed_id_price,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider_price = cart_item.embroider_price,
                        # End of addition by Om Shrivastava on 04-12-2024
                        # Reason : Add the customization all prices 
                        #Code added by Unnati on 04-12-2024
                        #Reason-Added invoice number
                        # invoice_number=invoice,
                        #End of code addition by Unnati on 04-12-2024
                        #Reason-Added invoice number
                        # Added by - Ashlekh on 16-12-2024
                        # Reason - To save customization comment in OrderItem
                        customization_comment = cart_item.customization_comment,
                        # End of code - Ashlekh on 16-12-2024
                        # Reason - To save customization comment in OrderItem
                        #Code added by Unnati on 22-12-2024
                        #Reason-Added invoice id,sale percentage,subtotal and total amount
                        invoice_id=invoice_id,
                        sale_percentage=sale_percentage,
                        subtotal=item_subtotal,
                        total_amount=total_amount,
                        #End of code addition by Unnati on 22-12-2024
                        #Reason-Added invoice id,sale percentage,subtotal and total amount
                        ##Code added by Unnati on 15-01-2025
                        ##Reason-Added tax amount
                        tax_percentage=tax_amount,
                        ##End of code addition by Unnati on 15-01-2025
                        ##Reason-Added tax amount
                    )
                    # Added by - Ashlekh on 22-10-2024
                    # Reason - To decrease quantity of different size from Product table
                    product_color = cart_item.color.lstrip('#')
                    product = Product.objects.filter(
                        id=cart_item.product.id,
                        color__icontains=product_color
                    ).first()

                    if product:
                        # current_size_quantity = getattr(product, size) or 0
                        current_size_quantity = getattr(product, cart_item.size) or 0

                        # Modified by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        # if current_size_quantity >= quantity:
                        if current_size_quantity >= cart_item.quantity:
                        # End of modification by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                            # setattr(product, size,
                            setattr(product, cart_item.size,
                                    # current_size_quantity - quantity)
                                    current_size_quantity - cart_item.quantity)


                        product.save()
                    # End of code - Ashlekh on 22-10-2024
                    # Reason - To decrease quantity of different size from Product table

        user_address = request.data.get("shippingAddress")

        first_name = user_address["first_name"]
        last_name = user_address["last_name"]
        address = user_address["address"]
        city = user_address["city"]
        country = user_address["country"]
        state = user_address["state"]
        zipcode = user_address["zipcode"]
        contact_number = user_address["contact_number"]
        company = user_address["company"]
        existing_address = UserAddressDetails.objects.filter(
            user=userObject,
            first_name=first_name,
            last_name=last_name,
            address=address,
            city=city,
            country=country,
            state=state,
            zipcode=zipcode,
            contact_number=contact_number,
            company=company,
        ).first()
        if existing_address is not None:
            pass
        else:
            try:
                user_address["user"] = userObject.id
                userAddressSerializer = UserAddressDetailsSerializer(
                    data=user_address
                )
                if userAddressSerializer.is_valid():
                    userAddressSerializer.save()

                else:
                    print("Validation errors user address:",
                          userAddressSerializer.errors)
            except Exception as e:
                print("Exception occured", e)

        shipping_address_data = request.data.get("shippingAddress")
        shippingAddress = {
            # Added by - Ashlekh on 23-11-2024
            # Reason - To save user in Shipping Address table
            "user": userObject.pk,
            # End of code - Ashlekh on 23-11-2024
            # Reason - To save user in Shipping Address table
            "first_name": shipping_address_data["first_name"],
            "last_name": shipping_address_data["last_name"],
            "address": shipping_address_data["address"],
            "city": shipping_address_data["city"],
            "country": shipping_address_data["country"],
            "state": shipping_address_data["state"],
            "zipcode": shipping_address_data["zipcode"],
            "contact_number": shipping_address_data["contact_number"],
            "company": shipping_address_data["company"],
            "order": order_row_id,
        }

        try:
            shippingAddressSerializer = ShippingAddressSerializer(
                data=shippingAddress)

            if shippingAddressSerializer.is_valid(raise_exception=True):
                shippingAddressSerializer.save()
            else:
                print("Validation errors1:",
                      shippingAddressSerializer.errors)
        except Exception as e:
            print("Exception occured", e)

        try:
            if request.data.get("shipToSameAddress"):
                billingAddress = shippingAddress
            else:
                billing_address_data = request.data.get("billingAddress")
                billingAddress = {
                    # Added by - Unnati on 24-11-2024
                    # Reason - To save user in Shipping Address table
                    "user": userObject.pk,
                    # End of code - Unnati on 24-11-2024
                    # Reason - To save user in Shipping Address table
                    "first_name": billing_address_data["first_name"],
                    "last_name": billing_address_data["last_name"],
                    "address": billing_address_data["address"],
                    "city": billing_address_data["city"],
                    "country": billing_address_data["country"],
                    "state": billing_address_data["state"],
                    "zipcode": billing_address_data["zipcode"],
                    "contact_number": billing_address_data["contact_number"],
                    "company": billing_address_data["company"],
                    "order": order_row_id,
                }
            billingAddressSerializer = BillingAddressSerializer(
                data=billingAddress)

            if billingAddressSerializer.is_valid(raise_exception=True):
                billingAddressSerializer.save()
            else:
                print("Validation errors2:",
                      billingAddressSerializer.errors)
        except Exception as e:
            print("Exception Occured in billingAddress", e)

        setting = Setting.objects.first()
        if setting is not None:
            companyInfo = CompanyInfo.objects.create(
                order=order_summary,
                name=setting.name,
                address=setting.address,
                pincode=setting.pincode,
                contact_number=setting.contact_number,
                email=setting.email)

        order_items = OrderItem.objects.filter(order=order_summary)
        company_info = CompanyInfo.objects.filter(order=order_summary)
        orderItemSerializer = OrderItemSerializer(order_items, many=True)
        companyInfoSerializer = CompanyInfoSerializer(company_info, many=True)

        cart.delete()
        return Response({"success": "Order processed successfully",
                         "orderSummary": orderSerializer.data,
                         "shippingAddress": shippingAddressSerializer.data,
                         "billingAddress": billingAddressSerializer.data,
                         "payment_status": payment_status,
                         "orderItems": orderItemSerializer.data,
                         "companyInfo": companyInfoSerializer.data,
                         }, 200)
    except Exception as e:
        print("Error in OrderAPI", e)
        logger.error(f"{e}")
        return Response({"error": f"Something went wrong: {str(e)}"}, 500)


"""
# End of code - Ashlekh on 18-10-2024
# Reason - Method to save details in Order table (according to PayPal payment status)
"""

"""
# Added by - Ashlekh on 19-10-2024
# Reason - To add paypal webhook
"""
# import json
# from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def paypal_webhook(request):
    if request.method == "POST":
        webhook_data = json.loads(request.body)
        # webhook_order_id = webhook_data["resource"]["id"]
        # amount = webhook_data["resource"]["amount"]["value"]
        # status = webhook_data["resource"]["status"]
        try:
            event_type = webhook_data["event_type"]
            if event_type == "PAYMENT.CAPTURE.COMPLETED":
                try:
                    webhook_order_id = webhook_data["resource"]["supplementary_data"]["related_ids"]["order_id"]
                    orderRequest = Order.objects.get(
                        paypal_order_id=webhook_order_id)
                    orderRequest.payment_status = "Completed"
                    orderRequest.save()
                    return Response(status=200)
                except Exception as e:
                    print("Error in PAYMENT CAPTURE COMPLETED", e)
                    return Response(status=200)
            elif event_type == "PAYMENT.CAPTURE.DECLINED":
                try:
                    webhook_order_id = webhook_data["resource"]["supplementary_data"]["related_ids"]["order_id"]
                    # orderRequest = Order.objects.get(paypal_order_id="48R416400V564864N")
                    orderRequest = Order.objects.get(
                        paypal_order_id=webhook_order_id)
                    # Modified by - Ashish Dewangan on 30-11-2024
                    # Reason - Below code was working differently
                    # orderRequest.payment_status = "Failed"
                    # orderRequest.order_status = "Failed"
                    # # orderItems = OrderItem.objects.filter(order=orderRequest.order_id)
                    # orderItems = OrderItem.objects.filter(
                    #     order=orderRequest.id)
                    # orderItemsSerializer = OrderItemSerializer(
                    #     orderItems, many=True)
                    # for item in orderItemsSerializer.data:
                    #     size = item['size']
                    #     quantity = item['quantity']
                    #     has_patch = item['has_patch']
                    #     has_embroidery = item['has_embroidery']
                    #     size_field_map = {
                    #         'XS': ('XS', 'xs_patches', 'xs_embroider'),
                    #         'S': ('S', 's_patches', 's_embroider'),
                    #         'M': ('M', 'm_patches', 'm_embroider'),
                    #         'L': ('L', 'l_patches', 'l_embroider'),
                    #         'XL': ('XL', 'xl_patches', 'xl_embroider'),
                    #         'XXL': ('XXL', 'xxl_patches', 'xxl_embroider'),
                    #         'XXXL': ('XXXL', 'xxxl_patches', 'xxxl_embroider'),
                    #     }
                    #     cart_data = {
                    #         'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0,
                    #         'xs_patches': False, 's_patches': False, 'm_patches': False, 'l_patches': False, 'xl_patches': False,
                    #         'xxl_patches': False, 'xxxl_patches': False,
                    #         'xs_embroider': False, 's_embroider': False, 'm_embroider': False, 'l_embroider': False, 'xl_embroider': False,
                    #         'xxl_embroider': False, 'xxxl_embroider': False
                    #     }
                    #     if size in size_field_map:
                    #         quantity_field, patches_field, embroidery_field = size_field_map[size]
                    #         cart_data[quantity_field] = quantity
                    #         cart_data[patches_field] = has_patch
                    #         cart_data[embroidery_field] = has_embroidery

                    #     filter_conditions = {
                    #         'user': orderRequest.user,
                    #         'product_id': item['product'],
                    #         'color': item['color'],
                    #         quantity_field: cart_data[quantity_field],
                    #     }
                    #     existing_cart_item = Cart.objects.filter(
                    #         **filter_conditions).first()
                    #     if existing_cart_item:
                    #         existing_cart_item.sales_rate = item['sales_rate']
                    #         existing_cart_item.image1 = item.get(
                    #             'product_image1', '')
                    #         existing_cart_item.name = item.get(
                    #             'product_name', '')
                    #         existing_cart_item.__dict__.update(cart_data)
                    #         existing_cart_item.save()
                    #     else:
                    #         Cart.objects.create(
                    #             user=orderRequest.user,
                    #             product_id=item['product'],
                    #             color=item['color'],
                    #             sales_rate=item['sales_rate'],
                    #             image1=item.get('product_image1', ''),
                    #             name=item.get('product_name', ''),
                    #             **cart_data
                    #         )

                    # orderRequest.save()
                    # return Response(status=200)
                    return return_order_items_to_cart(orderRequest)
                    # End of modification by - Ashish Dewangan on 30-11-2024
                    # Reason - Below code was working differently
                except Exception as e:
                    print("Error in PAYMENT CAPTURE DECLINED", e)
                    return Response(status=200)
            # orderRequest.save()
            return Response(status=200)
        except Exception as e:
            print("Error in paypal webhook response ", e)
            return Response(status=200)


"""
# End of code - Ashlekh on 19-10-2024
# Reason - To add paypal webhook
"""
"""
Added by - Unnati on 23-10-2024
Reason - To have LeaveFeedback API
"""


class LeaveFeedbackAPIView(APIView):

    def post(self, request):

        data = {
            "name": request.data["name"],
            "email": request.data["email"],
            "phone_number": request.data["phone_number"],
            "message": request.data["message"],
        }
        leaveFeedbackSerializer = LeaveFeedbackSerializer(data=data)
        if leaveFeedbackSerializer.is_valid():
            leaveFeedbackSerializer.save()
            return Response({"success": "Request sent successfully"}, 200)
        else:
            return Response({"error": "Something went wrong"}, 500)


"""
End of code addition by - Unnati on 23-10-2024
Reason - To have LeaveFeedback API
"""


"""
# Added by - Ashlekh on 23-10-2024
# Reason - To have API for checking quantity in Product table (using Cart)
"""


class CheckStockAPIView(APIView):
    def post(self, request):
        try:
            cart_data = request.data.get('cartData')
            if not cart_data:
                return Response({"message": "Cart is empty"}, status=200)

            stock_check = False
            stock_issue_details = []
            # Added by - Ashlekh on 24-10-2024
            # Reason - To check for inactive products
            inactive_products = []

            for item in cart_data:
                product_id = item.get('product_id')
                requested_color = item.get('color')
                # Added by - Ashlekh on 26-12-2024
                # Reason - To store quantity received from frontend
                requested_quantity = item.get('quantity')
                # End of code - Ashlekh on 26-12-2024
                # Reason - To store quantity received from frontend

                try:
                    product = Product.objects.get(
                        product_id=product_id, color=requested_color)
                    if product.is_active == False:
                        inactive_products.append({
                            "product_id": product_id,
                                "product_name": product.name,
                            })

                except Product.DoesNotExist:
                    # Added by - Ashlekh on 17-01-2025
                    # Reason - To get product details
                    product = Product.objects.filter(product_id=product_id).first()
                    # End of code - Ashlekh on 17-01-2025
                    # Reason - To get product details
                    # print(f"Product with ID {product_id} does not exist.")
                    # Added by - Ashlekh on 06-12-2024
                    # Reason - If color doesnot matches then send message in response
                    return Response({
                        "message": "Requested color is not available",
                        "details": {
                            "product_id": product_id,
                            "requested_color": requested_color,
                            # Added by - Ashlekh on 17-01-2025
                            # Reason - To send product name in response
                            "product_name": product.name,
                            # End of code - Ashlekh on 17-01-2025
                            # Reason - To send product name in response
                        }
                    }, status=200)
                    # End of code - Ashlekh on 06-12-2024
                    # Reason - If color doesnot matches then send message in response
            if len(inactive_products) > 0:
                return Response({
                    # "message": "Inactive product",
                    "message": "Product is inactive",
                    "inactive_products": inactive_products
                }, status=200)
            # End of code - Ashlekh on 24-10-2024
            # Reason - To check for inactive product
            for item in cart_data:
                product_id = item.get('product_id')
                requested_color = item.get('color')

                sizes = {
                    'XS': item.get('XS'),
                    'S': item.get('S'),
                    'M': item.get('M'),
                    'L': item.get('L'),
                    'XL': item.get('XL'),
                    'XXL': item.get('XXL'),
                    'XXXL': item.get('XXXL'),
                    ##Code added by Unnati on 12-01-2025
                    ##Reason-Added free size
                    'free_size': item.get('free_size')
                    ##end of code by Unnati on 12-01-2025
                    ##Reason-Added free size
                }

                try:
                    product = Product.objects.get(
                        product_id=product_id, color=requested_color)

                    # product_color = product.color.strip().lower().lstrip('#')
                    # request_color = requested_color.strip().lower().lstrip('#')

                    # if product_color != request_color:
                    #     print(f"Product with ID {product_id} does not have requested color {request_color}. Product color: {product.color}")
                    #     continue

                    productSerializer = ProductSerializer(product)
                    product_data = productSerializer.data

                    for size, cart_qty in sizes.items():
                        if cart_qty:
                            product_qty = product_data.get(size)
                            # Added by - Ashlekh on 07-12-2024
                            # Reason - If product_qty is None then to set 0 in product_qty
                            if product_qty is None:
                                product_qty = 0
                            # End of code - Ashlekh on 07-12-2024
                            # Reason - If product_qty is None then to set 0 in product_qty

                            # Added by - Ashlekh on 26-12-2024
                            # Reason - If quantity (received from frontend) exceeds product quantity (stock) then a message will be added in stock_issue_details
                            if requested_quantity > product_qty:
                                stock_check = True
                                stock_issue_details.append({
                                    "product_id": product_id,
                                    "product_name": product.name,
                                    "requested_size": size,
                                    "requested_qty": cart_qty,
                                    "available_qty": product_qty,
                                    "color": requested_color,
                                })
                                break
                            # End of code - Ashlekh on 26-12-2024
                            # Reason - If quantity (received from frontend) exceeds product quantity (stock) then a message will be added in stock_issue_details
                            
                            if cart_qty > product_qty:
                                stock_check = True
                                stock_issue_details.append({
                                    "product_id": product_id,
                                    "product_name": product.name,
                                    "requested_size": size,
                                    "requested_qty": cart_qty,
                                    "available_qty": product_qty,
                                    "color": requested_color,
                                })
                                # print(f"Stock issue with {size}: Requested {
                                #       cart_qty}, Available {product_qty}")
                                break

                    # if stock_check:
                    #     break

                except Product.DoesNotExist:
                    print(f"Product with ID {product_id} does not exist.")
                    stock_check = True
                    stock_issue_details.append({
                        "product_id": product_id,
                        "product_name": "",
                        "requested_size": None,
                        "requested_qty": None,
                        "available_qty": None
                    })
                    break
                except Exception as e:
                    # print(f"Error while processing product ID {
                    #       product_id}: {str(e)}")
                    stock_check = True
                    break

            if stock_check:
                return Response({
                    "message": "Stock not available",
                    "stock_issues": stock_issue_details
                }, status=200)
            else:
                return Response({"message": "Stock available"}, status=200)

        except Exception as e:
            print("Error in CheckStockAPIView: ", e)
            return Response({"message": "Error occurred while checking stock."}, status=500)


"""
# End of code - Ashlekh on 23-10-2024
# Reason - To have API for checking quantity in Product table (using Cart)
"""
# Code added by Unnati on 02-08-2024
# Reason-To generate order id


def generate_credit_note_number():
    now = datetime.now()
    month = now.strftime("%m")
    year = now.strftime("%Y")

    prefix = f"CN{month}{year}"

    last_credit_note = OrderItem.objects.filter(
        credit_note_number__startswith=prefix
    ).aggregate(Max('credit_note_number'))
    
    last_number = last_credit_note['credit_note_number__max']
    
    if last_number:
        match = re.search(rf"{prefix}(\d+)", last_number)
        if match:
            last_sequence = int(match.group(1))
            new_sequence = last_sequence + 1
        else:
            new_sequence = 1
    else:
        new_sequence = 1
    new_sequence_formatted = f"{new_sequence:05d}"
    credit_note_number = f"{prefix}{new_sequence_formatted}"
    
    return credit_note_number
# End of code addition by Unnati on 02-08-2024
# Reason-To generate order id
"""
Code added by-Unnati on 09-11-2024
Reason-To have updateCancellationTime API
"""

class UpdateCancellationTimeAPIView(APIView):
    def patch(self, request):
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("order")
            order_item_cancellation_time = request.data.get("OrderItemCancellationTime")
            #Code added by Unnati on 11-11-2024
            #Reason-Added cancellation reason
            order_cancellation_reason = request.data.get("cancellationReason")
            #End of code addition by Unnati on 11-11-2024
            #Reason-Added cancellation reason
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_cancellation_time = datetime.strptime(
                order_item_cancellation_time, datetime_format)
            order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            # Code added by Unnati on 18-11-2024
            # Reason-Added credit note number

            # Commented by - Ashish Dewangan on 24-11-2024
            # Reason - Credit note should be generated after refund
            # credit_note_number = generate_credit_note_number()
            # order_item.credit_note_number=credit_note_number
            # End of comment by - Ashish Dewangan on 24-11-2024
            # Reason - Credit note should be generated after refund

            # End of code addition by Unnati on 18-11-2024
            # Reason-Added credit note number
            order_item.cancelled_at = converted_cancellation_time
            # Code added by Unnati on 11-11-2024
            # Reason- Added cancel reason
            order_item.cancel_reason = order_cancellation_reason
            # End of code addition by Unnati on 11-11-2024
            # Reason- Added cancel reason
            # Added by - Ashlekh on 23-11-2024
            # Reason - To update cancelled_by in OrderItem
            order_item.cancelled_by = "User"
            # End of code - Ashlekh on 23-11-2024
            # Reason - To update cancelled_by in OrderItem
            order_item.save()
            ##Code commented by Unnati on 09-11-2024
            ##Reason-This code is not in use
            # order = Order.objects.get(id=order_id)
            # order_time = order.order_date
            # time_difference = converted_cancellation_time - order_time
            # if time_difference <= timedelta(hours=24):
            #     print("Yes")
            # else:
            #     print("No")
            ##End of code commented by Unnati on 09-11-2024
            ##Reason-This code is not in use
            order_item.item_status = "Cancelled"
            order_item.save()
            #Code modified by Unnati on 23-11-2024
            #Reason-Added cancellation reason and item status in response
            return Response({"message": "Cancellation time updated successfully.","cancellationReason":order_item.cancel_reason,"orderStatus":order_item.item_status}, 200)
            #End of code modification by Unnati on 23-11-2024
            #Reason-Added cancellation reason and item status in response
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)
"""
End of code addition by-Unnati on 09-11-2024
Reason-To have updateCancellationTime API
"""  

"""
Added by-Unnati on 09-11-2024
Reason-To have CreditNote API
"""      
class CreditNoteAPIView(APIView):
    def get(self, request, id):
        user_id = request.query_params.get('user')
        if user_id is not None:
            try:
                #code commented by Unnati n 27-12-2024
                #Reason-This code is not in use
                # order_summary = Order.objects.get(id=id)
                # orderSerializer = OrderSerializer(order_summary)
                #End of code commented by Unnati n 27-12-2024
                #Reason-This code is not in use
                # Modified by - Ashish Dewangan on 24-11-2024
                # Reason - Credit note is generated on refund so filtering it according ro refund status
                # order_items = OrderItem.objects.filter(order_id=id,item_status="Cancelled")
                #Code commented by Unnati on 27-12-2024
                #Reason-This code is not in use currently
                # order_items = OrderItem.objects.filter(order_id=id,item_status="Refunded")
                #End of code commented by Unnati on 27-12-2024
                #Reason-This code is not in use currently
                #Code added by Unnati on 27-12-2024
                #Reason-Modified code
                order_id=request.query_params.get("order")
                order_items = OrderItem.objects.filter(id=id,item_status="Refunded")
                order_summary=Order.objects.get(id=order_id)
                orderSerializer = OrderSerializer(order_summary)
                #End of code addition by Unnati on 27-12-2024
                #Reason-Modified code
                # End of modification by - Ashish Dewangan on 24-11-2024
                # Reason - Credit note is generated on refund so filtering it according ro refund status
                orderItemSerializer = OrderItemSerializer(
                    order_items, many=True)
                #Code modified by Unnati on 28-12-2024
                #Reason-Changed id to order_id
                # company_info = CompanyInfo.objects.filter(order_id=id)
                company_info = CompanyInfo.objects.filter(order_id=order_id)
                #End of code modification by Unnati on 28-12-2024
                #Reason-Changed id to order_id
                companyInfoSerializer = CompanyInfoSerializer(
                    company_info, many=True)
                shippingAddress = ShippingAddress.objects.get(
                    order=order_summary)
                billingAddress = BillingAddress.objects.get(
                    order=order_summary)
                shippingAddressSerializer = ShippingAddressSerializer(
                    shippingAddress)
                billingAddressSerializer = BillingAddressSerializer(
                    billingAddress)
                return Response({
                    "msg": "success",
                    "orderItems": orderItemSerializer.data,
                    "orderSummary": orderSerializer.data,
                    "companyInfo": companyInfoSerializer.data,
                    "shippingAddress": shippingAddressSerializer.data,
                    "billingAddress": billingAddressSerializer.data,
                }, 200)
            except Exception as e:
                logger.error(f"{e}")
                return Response({"error": "Something went wrong"}, 500)
        return Response({"error": "User ID not provided"}, 400)


"""
End of code addition by-Unnati on 09-11-2024
Reason-To have CreditNote API
""" 

"""
# Added by - Ashlekh on 28-10-2024
# Reason - To have API for quantity check (when +/- clicked from CheckOut)
"""
class UpdateCartQuantityAPIView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('userId')
            product_id = request.data.get('productId')
            quantity = request.data.get('quantity')
            size = request.data.get('size')
            color = request.data.get('color')
            # Addiition by Om Shrivastava on 03-12-2024
            # Reason : Add the customized condition 
            logo= request.data.get("logo")
            patches= request.data.get("patches")
            security_batches= request.data.get("security_batches")
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back= request.data.get("security_id_on_back")
            printed_id= request.data.get("printed_id")
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider= request.data.get("embroider")

            user = User.objects.get(id=user_id)

            # Modified by - Ashish Dewangan on 06-12-2024
            # Reason - Filteration conditions were not required on product
            # product = Product.objects.get(id=product_id, color=color,
            #                               logo=logo,patches=patches,security_batches=security_batches,embroider=embroider
            #                               )
            product = Product.objects.get(id=product_id, color=color)
            # End of modification by - Ashish Dewangan on 06-12-2024
            # Reason - Filteration conditions were not required on product
            # Added by - Ashlekh on 07-12-2024
            # Reason - If quantity is zero then to send message in response
            if quantity == 0:
                return Response({
                    "message": "Quantity cannot be less than one",
                }, status=200)
            # End of code - Ashlekh on 07-12-2024
            # Reason - If quantity is zero then to send message in response
            # print(product,'product id or name')
            productSerializer = ProductSerializer(product)
            available_quantity = 0
            product_data = productSerializer.data
            if size in product_data:
                available_quantity = product_data[size]
            
            # # Added by - Ashlekh on 30-11-2024
            # # Reason - If quantity for product size is None
            if available_quantity is None:
                return Response({
                    "message": "quantity_exceeds",
                    # Code changed by - Ashlekh on 16-12-2024
                    # Reason - To change message in available quantity
                    # "available_quantity": "Stock Not available",
                    "available_quantity": "0",
                    # End of code - Ashlekh on 16-12-2024
                    # Reason - To change message in available quantity
                }, status=200)
            # # End of code - Ashlekh on 30-11-2024
            # # Reason - If quantity for product size is None
            if quantity <= available_quantity:
                cartData2 = Cart.objects.get(user_id=user, product_id=product_id, color=color,size=size,
                                             logo=logo,patches=patches,security_batches=security_batches,
                                            #  Added by - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                            security_id_on_back=security_id_on_back, printed_id=printed_id,
                                            # End of code - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                             embroider=embroider)
                # print(cartData2,quantity,'1============')
                cartData2Serializer = CartSerializer(cartData2)
                if size in cartData2Serializer.data:
                    setattr(cartData2, size, quantity)
                    cartData2.save()
                    # print(cartData2,'check quanitity')

                cartData2.quantity = quantity  # Increment existing quantity
                cartData2.save()

                updatedCartData = Cart.objects.filter(user=user_id).order_by("id")
                updatedCartDataSerializer = CartSerializer(updatedCartData, many=True)
                    
                return Response({
                        "message": "success", 
                        "new_quantity": quantity, 
                        "updated_cart_data": updatedCartDataSerializer.data
                }, status=200)
            elif quantity>available_quantity:
                # # Added by - Ashlekh on 30-11-2024
                # # Reason - To get cart data and send in response with available quantity
                cartData2 = Cart.objects.get(user=user, product_id=product, color=color,size=size,
                                            #  Addition by Om Shrivastava on 04-12-2024
                                            #  Reason : Add the customization filter condition 
                                              logo=logo,patches=patches,security_batches=security_batches,
                                            #   Added by - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                            security_id_on_back=security_id_on_back, printed_id=printed_id,
                                            # End of code - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                              embroider=embroider)
                                            #  End of addition by Om Shrivastava on 04-12-2024
                                            #  Reason : Add the customization filter condition 
                # print(cartData2,'elifffffff checkkkkkk')
                # Modification and addition by Om Shrivastava on 04-12-2024
                # Reason : No need to use this code 
                cartData2Serializer = CartSerializer(cartData2)
                # if size in cartData2Serializer.data:
                #     setattr(cartData2, size, available_quantity)
                #     cartData2.save()
                updatedCartData = Cart.objects.filter(user=user_id).order_by("id")
                updatedCartDataSerializer = CartSerializer(updatedCartData, many=True)
                # End of modification and addition by Om Shrivastava on 04-12-2024
                # Reason : No need to use this code 
                # End of code - Ashlekh on 30-11-2024
                # Reason - To get cart data and send in response with available quantity
                return Response({"message": "quantity_exceeds", 
                                 "available_quantity": available_quantity,
                                # Added by - Ashlekh on 30-11-2024
                                # Reason - To send cart data
                                 "updated_cart_data": updatedCartDataSerializer.data,
                                # End of code - Ashlekh on 30-11-2024
                                # Reason - To send cart data
                                 }, status=200)

            
        except Exception as e:
            print("Error in UpdateCartQuantityAPIView ", e)
            return Response({"message": "Error occurred while updating cart quantity"}, status=500)
"""
# End of code - Ashlekh on 28-10-2024
# Reason - To have API for quantity check (when +/- clicked from CheckOut)
"""

"""
# Added by - Ashlekh on 30-10-2024
# Reason - To have API for storing details in WishList
"""
class WishListAPIView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('userId')
            color = request.data.get('color')
            product_id = request.data.get('productId')
            product = Product.objects.get(product_id=product_id, color=color)
            productSerializer = ProductSerializer(product)
            product_color = productSerializer.data.get('color')
            user = User.objects.get(id=user_id)
            if WishList.objects.filter(user=user, product=product, color=color).exists():
                wishList = WishList.objects.filter(user=user)
                wishListSerializer = WishListSerializer(wishList, many=True)
                return Response({"message": "Product Already in Wishlist", "wishlist_data": wishListSerializer.data}, status=200)
            else:
                WishList.objects.create(user=user, product=product, color=color)
                wishList = WishList.objects.filter(user=user)
                wishListSerializer = WishListSerializer(wishList, many=True)
                return Response({"message": "Success", "wishlist_data": wishListSerializer.data}, status=200)
        except Exception as e:
            print("Error in WishListAPIView ", e)
            return Response({"message": "Error Occured",}, status=500)
"""
# End of code - Ashlekh on 30-10-2024
# Reason - To have API for storing details in WishList
"""

"""
# Added by - Ashlekh on 05-11-2024
# Reason - API for updating details in WishList
"""
class UpdateWishListAPIView(APIView):
    def put(self, request):
        try:
            user_id = request.data.get('userId')
            user = User.objects.get(id=user_id)
            wish_list_items = request.data.get('wishList', [])
            for item in wish_list_items:
                product_id = item.get('product_id')
                color = item.get('color')
                # if product_id:
                #     product = Product.objects.get(product_id=product_id, color=color)
                #     # WishList.objects.create(user=user, product=product, color=color)
                #     WishList.objects.get_or_create(
                #     user=user,
                #     product=product,
                #     color=color
                # )
                if product_id:
                    product = Product.objects.get(product_id=product_id, color=color)
                    if not WishList.objects.filter(user=user, product=product, color=color).exists():
                        WishList.objects.create(user=user, product=product, color=color)
            
            wishList = WishList.objects.filter(user=user)
            wishListSerializer = WishListSerializer(wishList, many=True)
            return Response({"message": "Saved successfully", "wishList": wishListSerializer.data}, status=200)
        except Exception as e:
            print("Error in UpdateWishListAPIView ", e)
            return Response({"message": "Error Occured",}, status=500)
"""
# End of code - Ashlekh on 05-11-2024
# Reason - API for updating details in WishList
"""

"""
# Added by - Ashlekh on 05-11-2024
# Reason - API for getting details of product (used in WishList page)
"""
class WishListDetailsAPIView(APIView):
    def post(self, request):
        try:
            wishlist_data = request.data.get('wishListData', [])
            matched_products = []
            for item in wishlist_data:
                product_id = item.get('product_id')
                color = item.get('color')
                product = Product.objects.filter(product_id=product_id, color=color).first()
                productSerializer = ProductSerializer(product)
                # Added by - Ashlekh on 04-12-2024
                # Reason - If product is not empty or none then only append will execute
                if product:
                    matched_products.append(productSerializer.data)    
                # End of code - Ashlekh on 04-12-2024
                # Reason - If product is not empty or none then only append will execute
            return Response({"message": "Success", "matched_products": matched_products}, status=200)
        except Exception as e:
            print("Error in WishListDetailsAPIView ", e)
            return Response({"message": "Error in WishListDetailsAPI View",}, status=500)
"""
# End of code - Ashlekh on 05-11-2024
# Reason - API for getting details of product (used in WishList page)
"""

"""
# Added by - Ashlekh on 07-11-2024
# Reason - API to save product in cart
"""
class CartDetailsAPIView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('userId')
            user = User.objects.get(id=user_id)
            product_row_id = request.data.get('product_id')
            color = request.data.get('color')
            size = request.data.get('size')
            quantity = request.data.get('quantity')
            # Commented by - Ashlekh on 04-12-2024
            # Reason - after customization no need to store quantity in particular size
            # product = Product.objects.get(product_id=product_id, color=color)
            cart_fields = {
                'XS': None, 'S': None, 'M': None, 'L': None, 'XL': None, 'XXL': None, 'XXXL': None,
                ##Code added by Unnati on 10-01-2025
                ##Reason-Added free size
                'free_size': None
                ##End of code addition by Unnati on 10-01-2025
                ##Reason-Added free size
            }
            if size in cart_fields:
                cart_fields[size] = quantity
            # End of comment - Ashlekh on 04-12-2024
            # Reason - after customization no need to store quantity in particular size
            # Added by - Ashlekh on 03-12-2024
            # Reason - To get customization details from frontend
            logo = request.data.get("logo")
            patches = request.data.get("patches")
            security_batches = request.data.get("security_batches")
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back= request.data.get("security_id_on_back")
            printed_id= request.data.get("printed_id")
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider")
            customization_comment = request.data.get("customization_comment")
            after_customization_product_price = request.data.get("after_customization_product_price")
            # End of code - Ashlekh on 03-12-2024
            # Reason - To get customization details from frontend
            # Added by - Ashlekh on 04-12-2024
            # Reason - To check product is active or not
            try:
                product = Product.objects.get(id=product_row_id, is_active=True,)
                productSerializer = ProductSerializer(product)
            except:
                return Response({"error": f"Product with id {product_row_id} does not exist"}, 200)
            
            try:
                # Code changed by - Ashlekh on 04-12-2024
                # Reason - To apply customization filter
                # cart = Cart.objects.get(user=user, product=product, color=color)
                cart = Cart.objects.get(user=user, product_id=product_row_id, color=color,
                                        logo=logo, patches=patches, security_batches=security_batches,
                                        # Added by - Ashlekh on 19-02-2025
                                        # Reason - To add customization
                                        security_id_on_back=security_id_on_back, printed_id=printed_id,
                                        # End of code - Ashlekh on 19-02-2025
                                        # Reason - To add customization
                                        embroider=embroider)
                # End of code - Ashlekh on 04-12-2024
                # Reason - To apply customization filter
                # Commented by - Ashlekh on 04-12-2024
                # Reason - No need to set size in cart. Now we are using quantity
                if size == "XS":
                    cart.XS = cart.XS + 1
                if size == "S":
                    cart.S == cart.S + 1
                if size == "M":
                    cart.M = cart.M + 1
                if size == "L":
                    cart.L = cart.L + 1
                if size == "XL":
                    cart.XL = cart.XL + 1
                if size == "XXL":
                    cart.XXL = cart.XXL + 1
                if size == "XXXL":
                    cart.XXXL = cart.XXXL + 1
                ##Code added by Unnati on 10-01-2025
                ##Reason-Added free size
                if size == "free_size":
                    cart.free_size = cart.free_size +1    
                ##End of code addition by Unnati on 10-01-2025
                ##Reason-Added free size    
                # End of comment - Ashlekh on 04-12-2024
                # Reason - No need to set size in cart. Now we are using quantity
                # Added by - Ashlekh on 03-12-2024
                # Reason - To add customization details in cart
                cart.logo = logo
                cart.logo_price = productSerializer.data['logo_price']
                cart.patches = patches
                cart.patches_price = productSerializer.data['patches_price']
                cart.security_batches = security_batches
                cart.security_batches_price = productSerializer.data['security_batches_price']
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                cart.security_id_on_back = security_id_on_back
                cart.security_id_on_back_price = productSerializer.data['security_id_on_back_price']
                cart.printed_id = printed_id
                cart.printed_id_price = productSerializer.data['printed_id_price']
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                cart.embroider = embroider
                cart.embroider_price = productSerializer.data['embroider_price']
                cart.customization_comment = customization_comment
                cart.after_customization_product_price = after_customization_product_price
                cart.quantity += quantity
                cart.image1 = productSerializer.data['image1']
                # End of code - Ashlekh on 03-12-2024
                # Reason - To add customization details in cart
                
                cart.save()
                wishlist_item = WishList.objects.filter(user=user, product=product, color=color,)
                if wishlist_item.exists():
                    wishlist_item.delete()
            except:
                Cart.objects.create(
                    user=user,
                    product=product,
                    color=color,
                    # Commented by - Ashlekh on 04-12-2024
                    # Reason - No need to set size in cart. Now we are using quantity
                    XS=cart_fields['XS'],
                    S=cart_fields['S'],
                    M=cart_fields['M'],
                    L=cart_fields['L'],
                    XL=cart_fields['XL'],
                    XXL=cart_fields['XXL'],
                    XXXL=cart_fields['XXXL'],
                    # End of comment - Ashlekh on 04-12-2024
                    # Reason - No need to set size in cart. Now we are using quantity
                    sales_rate=product.sales_rate,
                    # image1=product.image1,
                    image1=productSerializer.data['image1'],
                    name=product.name,
                    # Added by - Ashlekh on 03-12-2024
                    # Reason - To add customization details in cart
                    after_customization_product_price=after_customization_product_price,
                    customization_comment=customization_comment,
                    logo=logo,
                    patches=patches,
                    security_batches=security_batches,
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    security_id_on_back=security_id_on_back,
                    printed_id=printed_id,
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    embroider=embroider,
                    logo_price=productSerializer.data['logo_price'],
                    patches_price=productSerializer.data['patches_price'],
                    security_batches_price=productSerializer.data['security_batches_price'],
                    embroider_price=productSerializer.data['embroider_price'],
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    security_id_on_back_price=productSerializer.data['security_id_on_back_price'],
                    printed_id_price=productSerializer.data['printed_id_price'],
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    size=size,
                    quantity=quantity,
                    # End of code - Ashlekh on 03-12-2024
                    # Reason - To add customization details in cart
                    ##Code added by Unnati on 10-01-2025
                    ##Reason-Added free size
                    free_size=cart_fields['free_size']
                    ##End of code addition by Unnati on 10-01-2025
                    ##Reason-Added free size
                )
                wishlist_item = WishList.objects.filter(user=user, product=product, color=color)
                if wishlist_item.exists():
                    wishlist_item.delete()
        
            cartData = Cart.objects.filter(user=user)
            cartDataSerializer = CartSerializer(cartData, many=True)
            wishList = WishList.objects.filter(user=user)
            wishListSerializer = WishListSerializer(wishList, many=True)
            return Response({"message": "Success", "cartData": cartDataSerializer.data, "wishlist": wishListSerializer.data}, status=200)
        except Exception as e:
            print("Error in CartDetailsAPIView ", e)
            return Response({"message": "Error occured",}, status=500)
"""
# End of code - Ashlekh on 07-11-2024
# Reason - API to save product in cart
"""

"""
# Added by - Ashlekh on 07-11-2024
# Reason - API to remove product from wishlist
"""
class RemoveWishListProductAPIView(APIView):
    def delete(self, request):
        try:
            user_id = request.query_params.get('user_id')
            product_id = request.query_params.get('product_id')
            color = request.query_params.get('color')
            user = User.objects.get(id=user_id)
            product = Product.objects.get(product_id=product_id, color=color)
            wishlist_item = WishList.objects.filter(user=user, product=product, color=color)
            if wishlist_item.exists():
                wishlist_item.delete()
            
            wishList = WishList.objects.filter(user=user)
            wishListSerializer = WishListSerializer(wishList, many=True)
            return Response({"message": "Success", "wishlist": wishListSerializer.data}, status=200)
        except Exception as e:
            print("Error in RemoveWishListProductAPIView ", e)
            return Response({"message": "Error occured",}, status=500)
"""
# End of code - Ashlekh on 07-11-2024
# Reason - API to remove product from wishlist
"""
"""
# Added by - Unnati on 14-11-2024
# Reason - To have dashboard API
"""
class DashboardAPIView(APIView):
    def get(self,request):
        try:
            ##Code added by Unnati on 14-11-2024
            ##Reason-To have total category,subcategory and total items
            category_list = Category.objects.filter(is_active=True).order_by('-id')
            
            root_categories = [
                category for category in category_list if category.parent_id is None
            ]
            main_category_count = len(root_categories)
            # direct_parent_categories = [
            #     category for category in category_list 
            #     if category.parent_id is not None and category.parent_id not in [cat.id for cat in category_list]
            # ]
            # display_categories = root_categories + direct_parent_categories
            # hierarchical_data = []
           
            # total_children_count = 0
            # def getCategoryHierarchy(category):
            #     children = Category.objects.filter(parent_id=category.id, is_active=True)
            #     child_hierarchy = []
            #     for child in children:
             
            #         child_hierarchy.append(getCategoryHierarchy(child))
            #     return {
            #         "id": category.id,
            #         "name": category.name,
            #         "children": child_hierarchy
            #     }
            

            # unique_subcategories = set()
            
            # for category in display_categories:
            #     category_hierarchy = getCategoryHierarchy(category)
            #     hierarchical_data.append(category_hierarchy)
                
 
            #     def collectSubcategories(node):
            #         for child in node.get('children', []):
            #             unique_subcategories.add(child['id'])
            #             collectSubcategories(child)
                
            #     collectSubcategories(category_hierarchy)

            # total_children_count = len(unique_subcategories)
            # Code changed by - Ashlekh on 14-12-2024
            # Reason - To filter only active Product
            # total_product_count = Product.objects.count()
            total_product_count = Product.objects.filter(is_active=True).count()
            # End of code - Ashlekh on 14-12-2024
            # Reason - To filter only active Product
            ##End of code addition by Unnati on 14-11-2024
            ##Reason-To have total category,subcategory and total items
            currentTime = request.query_params.get("currentTime")
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            current_time = datetime.strptime(currentTime, datetime_format)
            ##Code added by Unnati on 14-11-2024
            ##Reason-To have today's revenue,weekly revenue,monthly revenue and yearly revenue
            today_start = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
            week_start = today_start - timedelta(days=(today_start.weekday() + 1) % 7)
            month_start = current_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            year_start = current_time.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            today_orders_count = Order.objects.filter(order_date__gte=today_start).count()
            today_completed_orders_count = Order.objects.filter(order_date__gte=today_start,payment_status="Completed").count()
            today_pending_orders_count = Order.objects.filter(order_date__gte=today_start,payment_status="Pending").count()
            today_failed_orders_count = Order.objects.filter(order_date__gte=today_start,payment_status="Failed").count()
            weekly_orders_count = Order.objects.filter(order_date__gte=week_start).count()
            weekly_completed_orders_count = Order.objects.filter(order_date__gte=week_start,payment_status="Completed").count()
            weekly_pending_orders_count = Order.objects.filter(order_date__gte=week_start,payment_status="Pending").count()
            weekly_failed_orders_count = Order.objects.filter(order_date__gte=week_start,payment_status="Failed").count()
            monthly_orders_count = Order.objects.filter(order_date__gte=month_start).count()
            monthly_completed_orders_count = Order.objects.filter(order_date__gte=month_start,payment_status="Completed").count()
            monthy_pending_orders_count = Order.objects.filter(order_date__gte=month_start,payment_status="Pending").count()
            monthy_failed_orders_count = Order.objects.filter(order_date__gte=month_start,payment_status="Failed").count()
            yearly_orders_count = Order.objects.filter(order_date__gte=year_start).count()
            yearly_completed_orders_count = Order.objects.filter(order_date__gte=year_start,payment_status="Completed").count()
            yearly_pending_orders_count = Order.objects.filter(order_date__gte=year_start,payment_status="Pending").count()
            yearly_failed_orders_count = Order.objects.filter(order_date__gte=year_start,payment_status="Failed").count()
            today_completed_orders = Order.objects.filter(order_date__gte=today_start,payment_status="Completed").values_list('id',flat=True)
            # Code added by unnati on 21-11-2024
            #Reason-To get total order items
            today_order_items = OrderItem.objects.filter(
                ordered_at__gte=today_start,
                order_id__in=today_completed_orders
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            #End of code addition by unnati on 21-11-2024
            #Reason-To get total order items
            today_completed_order_items = OrderItem.objects.filter(
                ordered_at__gte=today_start,
                order_id__in=today_completed_orders, 
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            ##Code added by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            today_returned_order_items = OrderItem.objects.filter(
                return_initiated_date__gte=today_start,
                order_id__in=today_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Return Initiated","Return Approved","Return Rejected","Parcel Pickup Initiated for Return","Parcel Picked Up for Return","Returned"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            today_refund_due_to_return = OrderItem.objects.filter(
                return_initiated_date__gte=today_start,
                order_id__in=today_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            today_cancelled_order_items = OrderItem.objects.filter(
                cancelled_at__gte=today_start,
                order_id__in=today_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=['Cancelled']
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            today_refund_due_to_cancel = OrderItem.objects.filter(
                cancelled_at__gte=today_start,
                order_id__in=today_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            today_exchanged_order_items = OrderItem.objects.filter(
                exchange_initiated_date__gte=today_start,
                order_id__in=today_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Exchange Initiated","Exchange Approved","Exchange Rejected","Parcel Pickup Initiated for Exchange","Parcel Picked Up for Exchange","Exchanged"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            today_refund_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=today_start,
                order_id__in=today_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            today_total_refunded_amount = (
                (today_refund_due_to_cancel or 0) +
                (today_refund_due_to_exchange or 0) +
                (today_refund_due_to_return or 0)
            )
            ##Code added by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            today_extra_amount_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=today_start,
                order_id__in=today_completed_orders
            ).aggregate(total_extra_amount=Sum('to_pay'))['total_extra_amount'] or 0
            ##End of code addition by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            today_aggregated_data = OrderItem.objects.filter(
                ordered_at__gte=today_start,
                order_id__in=today_completed_orders
            ).aggregate(
                completed_quantity=Sum('quantity', filter=~Q(item_status__in=['Cancelled', 'Returned', 'Refunded'])),
                returned_quantity=Sum('quantity', filter=Q(item_status__in=["Return Initiated", "Returned"])),
                cancelled_quantity=Sum('quantity', filter=Q(item_status="Cancelled")),
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                #Code added by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                # total_completed_amount=Sum('amount', filter=~Q(item_status__in=['Refunded'])),
                total_completed_amount=Sum('total_amount', filter=~Q(item_status__in=['Refunded'])),
                #End of code addition by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                total_refunded_amount=Sum('amount', filter=Q(item_status="Refunded"))
            )
            ##Code added by Unnati on 19-01-2025
            ##Reason-To get total qty for refunded items
            today_data = OrderItem.objects.filter(
                Q(ordered_at__gte=today_start) | 
                Q(exchange_initiated_date__gte=today_start) |
               Q(cancelled_at__gte=today_start)
            ).filter(
                order_id__in=today_completed_orders  
            ).aggregate(
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                total_quantity=Sum('quantity')  
            )
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-To get total qty for refunded items
            ##Code added by Unnati on 19-01-2025
            ##Reason-To get today total tax
            today_total_tax = OrderItem.objects.filter(
                Q(type="Exchanged", exchange_initiated_date__gte=today_start) |  
                Q(type="Returned", return_initiated_date__gte=today_start) |  
                Q(type="Cancelled", cancelled_at__gte=today_start) |  
                (Q(type="Sold") & ~Q(
                    id__in=OrderItem.objects.filter(parent_id__isnull=False)
                    .annotate(parent_id_int=Cast(F("parent_id"), output_field=models.BigIntegerField()))
                    .values_list("parent_id_int", flat=True)
                ) & Q(ordered_at__gte=today_start)), 
                order_id__in=today_completed_orders
            ).annotate(
                tax_numeric=Cast("tax_percentage", output_field=FloatField())
            ).aggregate(total_tax=Sum("tax_numeric"))
            today_total_tax = today_total_tax.get("total_tax") or 0
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-To get today total tax
            today_completed_order_items = today_aggregated_data['completed_quantity'] or 0
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # today_returned_order_items = today_aggregated_data['returned_quantity'] or 0
            # today_cancelled_order_items = today_aggregated_data['cancelled_quantity'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            ##Code modified by Unnati on 19-01-2025
            ##Reason-Changed refunded qty
            today_refunded_order_items = today_data['refunded_quantity'] or 0
            ##End of code modification by Unnati on 19-01-2025
            ##Reason-Changed refunded qty
            today_completed_order_amount = today_aggregated_data['total_completed_amount'] or 0
            today_net_amount=today_completed_order_amount+today_extra_amount_due_to_exchange
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # today_refunded_order_amount = today_aggregated_data['total_refunded_amount'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            weekly_completed_orders = Order.objects.filter(order_date__gte=week_start,payment_status="Completed").values_list('id',flat=True)
            weekly_order_items = OrderItem.objects.filter(
                ordered_at__gte=week_start,
                order_id__in=weekly_completed_orders
            )
            weekly_order_items = OrderItem.objects.filter(
                ordered_at__gte=week_start,
                order_id__in=weekly_completed_orders
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            ##code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            weekly_returned_order_items = OrderItem.objects.filter(
                return_initiated_date__gte=week_start,
                order_id__in=weekly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Return Initiated","Return Approved","Return Rejected","Parcel Pickup Initiated for Return","Parcel Picked Up for Return","Returned"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            weekly_refund_due_to_return = (
                OrderItem.objects.filter(
                    return_initiated_date__gte=week_start,
                    order_id__in=weekly_completed_orders, 
                ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
                or 0
            )
            weekly_cancelled_order_items = OrderItem.objects.filter(
                cancelled_at__gte=week_start,
                order_id__in=weekly_completed_orders,
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status 
                item_status__in=['Cancelled']
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            weekly_refund_due_to_cancel = OrderItem.objects.filter(
                cancelled_at__gte=week_start,
                order_id__in=weekly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            weekly_exchanged_order_items = OrderItem.objects.filter(
                exchange_initiated_date__gte=week_start,
                order_id__in=weekly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Exchange Initiated","Exchange Approved","Exchange Rejected","Parcel Pickup Initiated for Exchange","Parcel Picked Up for Exchange","Exchanged"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            weekly_refund_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=week_start,
                order_id__in=weekly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            weekly_total_refunded_amount = (
                (weekly_refund_due_to_cancel or 0) +
                (weekly_refund_due_to_return or 0) +
                (weekly_refund_due_to_exchange or 0)
            )
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            ##Code added by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            weekly_extra_amount_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=week_start,
                order_id__in=weekly_completed_orders, 
            ).aggregate(total_extra_amount=Sum('to_pay'))['total_extra_amount'] or 0
            ##End of code addition by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            weekly_aggregated_data = OrderItem.objects.filter(
                ordered_at__gte=week_start,
                order_id__in=weekly_completed_orders
            ).aggregate(
                completed_quantity=Sum('quantity', filter=~Q(item_status__in=['Cancelled', 'Returned', 'Refunded'])),
                returned_quantity=Sum('quantity', filter=Q(item_status__in=["Return Initiated", "Returned"])),
                cancelled_quantity=Sum('quantity', filter=Q(item_status="Cancelled")),
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                #Code added by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                # total_completed_amount=Sum('amount', filter=~Q(item_status__in=['Refunded'])),
                total_completed_amount=Sum('total_amount', filter=~Q(item_status__in=['Refunded'])),
                #End of code addition by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                total_refunded_amount=Sum('amount', filter=Q(item_status="Refunded"))
            )
            ##Code added by Unnati on 19-01-2025
            ##Reason-To get total items that is refunded
            week_data = OrderItem.objects.filter(
                Q(ordered_at__gte=week_start) | 
                Q(exchange_initiated_date__gte=week_start) |
               Q(cancelled_at__gte=week_start)
            ).filter(
                order_id__in=weekly_completed_orders  
            ).aggregate(
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                total_quantity=Sum('quantity')  
            )
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-To get total items that is refunded
            ##Code added by Unnati on 19-01-2025
            ##Reason-To get total tax
            weekly_total_tax = OrderItem.objects.filter(
                Q(type="Exchanged", exchange_initiated_date__gte=week_start) |  
                Q(type="Returned", return_initiated_date__gte=week_start) |  
                Q(type="Cancelled", cancelled_at__gte=week_start) |  
                (Q(type="Sold") & ~Q(
                    id__in=OrderItem.objects.filter(parent_id__isnull=False)
                    .annotate(parent_id_int=Cast(F("parent_id"), output_field=models.BigIntegerField()))
                    .values_list("parent_id_int", flat=True)
                ) & Q(ordered_at__gte=week_start)), 
                order_id__in=weekly_completed_orders
            ).annotate(
                tax_numeric=Cast("tax_percentage", output_field=FloatField())
            ).aggregate(total_tax=Sum("tax_numeric"))
            week_total_tax = weekly_total_tax.get("total_tax") or 0
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-To get total tax
            weekly_completed_order_items = weekly_aggregated_data['completed_quantity'] or 0
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # weekly_returned_order_items = weekly_aggregated_data['returned_quantity'] or 0
            # weekly_cancelled_order_items = weekly_aggregated_data['cancelled_quantity'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            ##Code mdofied by Unnati on 19-01-2025
            ##Reason-To get refunded qty
            weekly_refunded_order_items = week_data['refunded_quantity'] or 0
            ##End of code modification by Unnati on 19-01-2025
            ##Reason-To get refunded qty
            weekly_completed_order_amount = weekly_aggregated_data['total_completed_amount'] or 0
            weekly_net_amount=weekly_completed_order_amount+weekly_extra_amount_due_to_exchange
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # weekly_refunded_order_amount = weekly_aggregated_data['total_refunded_amount'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use

       
            monthly_completed_orders = Order.objects.filter(order_date__gte=month_start,payment_status="Completed").values_list('id',flat=True)

            monthly_order_items = OrderItem.objects.filter(
                ordered_at__gte=month_start,
                order_id__in=monthly_completed_orders
            )

            monthly_order_items = OrderItem.objects.filter(
                ordered_at__gte=month_start,
                order_id__in=monthly_completed_orders
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity'] 
            ##code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            monthly_returned_order_items = OrderItem.objects.filter(
                return_initiated_date__gte=month_start,
                order_id__in=monthly_completed_orders,
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status 
                item_status__in=["Return Initiated","Return Approved","Return Rejected","Parcel Pickup Initiated for Return","Parcel Picked Up for Return","Returned"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            monthly_refund_due_to_return = OrderItem.objects.filter(
                return_initiated_date__gte=month_start,
                order_id__in=monthly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            monthly_cancelled_order_items = OrderItem.objects.filter(
                cancelled_at__gte=month_start,
                order_id__in=monthly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=['Cancelled']
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            monthly_refund_due_to_cancel = OrderItem.objects.filter(
                cancelled_at__gte=month_start,
                order_id__in=monthly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            monthly_exchanged_order_items = OrderItem.objects.filter(
                exchange_initiated_date__gte=month_start,
                order_id__in=monthly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Exchange Initiated","Exchange Approved","Exchange Rejected","Parcel Pickup Initiated for Exchange","Parcel Picked Up for Exchange","Exchanged"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            monthly_refund_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=month_start,
                order_id__in=monthly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']   
            monthly_total_refunded_amount = (
                (monthly_refund_due_to_cancel or 0) +
                (monthly_refund_due_to_return or 0) +
                (monthly_refund_due_to_exchange or 0)
            )
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            ##Code added by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            monthly_extra_amount_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=month_start,
                order_id__in=monthly_completed_orders, 
            ).aggregate(total_extra_amount=Sum('to_pay'))['total_extra_amount'] or 0
            ##End of code addition by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            aggregated_data = OrderItem.objects.filter(
                ordered_at__gte=month_start,
                order_id__in=monthly_completed_orders
            ).aggregate(
                completed_quantity=Sum('quantity', filter=~Q(item_status__in=['Cancelled', 'Returned', 'Refunded'])),
                returned_quantity=Sum('quantity', filter=Q(item_status__in=["Return Initiated", "Returned"])),
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                # Code added by Unnati on 17-11-2024
                # Reason-Added cancelled quantity
                cancelled_quantity=Sum('quantity', filter=Q(item_status="Cancelled")),
                # End of code addition by Unnati on 17-11-2024
                # Reason-Added cancelled quantity
                #Code added by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                # total_completed_amount=Sum('amount', filter=~Q(item_status__in=['Refunded'])),
                total_completed_amount=Sum('total_amount', filter=~Q(item_status__in=['Refunded'])),
                #End of code modification by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                total_refunded_amount=Sum('amount', filter=Q(item_status="Refunded"))
            )
            ##Code added by Unnati on 19-01-2025
            ##Reason-Added refund qty
            month_data = OrderItem.objects.filter(
                Q(ordered_at__gte=month_start) | 
                Q(exchange_initiated_date__gte=month_start) |
               Q(cancelled_at__gte=month_start)
            ).filter(
                order_id__in=monthly_completed_orders  
            ).aggregate(
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                total_quantity=Sum('quantity')  
            )
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-Added refund qty
            ##Code added by Unnati on 19-01-2025
            ##Reason-Added monthly total tax
            monthly_total_tax = OrderItem.objects.filter(
                Q(type="Exchanged", exchange_initiated_date__gte=month_start) |  
                Q(type="Returned", return_initiated_date__gte=month_start) |  
                Q(type="Cancelled", cancelled_at__gte=month_start) |  
                (Q(type="Sold") & ~Q(
                    id__in=OrderItem.objects.filter(parent_id__isnull=False)
                    .annotate(parent_id_int=Cast(F("parent_id"), output_field=models.BigIntegerField()))
                    .values_list("parent_id_int", flat=True)
                ) & Q(ordered_at__gte=month_start)), 
                order_id__in=monthly_completed_orders
            ).annotate(
                tax_numeric=Cast("tax_percentage", output_field=FloatField())
            ).aggregate(total_tax=Sum("tax_numeric"))
            month_total_tax = monthly_total_tax.get("total_tax") or 0
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-Added monthly total tax
            monthly_completed_order_items = aggregated_data['completed_quantity'] or 0
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # monthly_returned_order_items = aggregated_data['returned_quantity'] or 0
            # monthly_cancelled_order_items = aggregated_data['cancelled_quantity'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            ##Code added by Unnati on 19-01-2025
            ##Reason-Modified month data
            monthly_refunded_order_items = month_data['refunded_quantity'] or 0
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-Modified month data
            monthly_completed_order_amount = aggregated_data['total_completed_amount'] or 0
            monthly_net_amount=monthly_completed_order_amount+monthly_extra_amount_due_to_exchange
            ##Code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            # monthly_refunded_order_amount = aggregated_data['total_refunded_amount'] or 0
            ##End of code commented by Unnati on 03-01-2025
            ##Reason-This code is not in use
            yearly_completed_orders = Order.objects.filter(
                order_date__gte=year_start,
                payment_status="Completed"
            ).values_list('id', flat=True)
            #Code commented by Unnati on 21-11-2024
            #Reason-This code is not in use
            # yearly_order_items = OrderItem.objects.filter(
            #     ordered_at__gte=month_start,
            #     order_id__in=yearly_completed_orders
            # )
            #End of code comment by Unnati on 21-11-2024
            #Reason-This code is not in use
            yearly_order_items = OrderItem.objects.filter(
                #Code modified by Unnati on 03-01-2025
                #Reason-Added year start
                # ordered_at__gte=month_start,
                ordered_at__gte=year_start,
                #End of code modification by Unnati on 03-01-2025
                #Reason-Added year start
                order_id__in=yearly_completed_orders
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            ##code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            yearly_returned_order_items = OrderItem.objects.filter(
                return_initiated_date__gte=year_start,
                order_id__in=yearly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Return Initiated","Return Approved","Return Rejected","Parcel Pickup Initiated for Return","Parcel Picked Up for Return","Returned"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            yearly_refund_due_to_return = OrderItem.objects.filter(
                return_initiated_date__gte=year_start,
                order_id__in=yearly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            yearly_cancelled_order_items = OrderItem.objects.filter(
                cancelled_at__gte=year_start,
                order_id__in=yearly_completed_orders,
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=['Cancelled']
                ##End of code adition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            yearly_refund_due_to_cancel = OrderItem.objects.filter(
                cancelled_at__gte=year_start,
                order_id__in=yearly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            yearly_exchanged_order_items = OrderItem.objects.filter(
                exchange_initiated_date__gte=year_start,
                order_id__in=yearly_completed_orders, 
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added status
                item_status__in=["Exchange Initiated","Exchange Approved","Exchange Rejected","Parcel Pickup Initiated for Exchange","Parcel Picked Up for Exchange","Exchanged"]
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added status
            ).aggregate(total_quantity=Sum('quantity'))['total_quantity']
            yearly_refund_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=year_start,
                order_id__in=yearly_completed_orders, 
            ).aggregate(total_refund=Sum('refund_amount'))['total_refund']
            yearly_total_refunded_amount = (
                (yearly_refund_due_to_cancel or 0) +
                (yearly_refund_due_to_return or 0) +
                (yearly_refund_due_to_exchange or 0)
            )
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added returend order items,cancelled order items,exchanged order items count and refund due to that
            ##Code added by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            yearly_extra_amount_due_to_exchange = OrderItem.objects.filter(
                exchange_initiated_date__gte=year_start,
                order_id__in=yearly_completed_orders, 
            ).aggregate(total_extra_amount=Sum('to_pay'))['total_extra_amount'] or 0
            ##End of code addition by Unnati on 13-01-2025
            ##Reason-Added extra amount due to exchange
            yearly_aggregated_data = OrderItem.objects.filter(
                ordered_at__gte=year_start,
                order_id__in=yearly_completed_orders
            ).aggregate(
                completed_quantity=Sum('quantity', filter=~Q(item_status__in=['Cancelled', 'Returned', 'Refunded'])),
                returned_quantity=Sum('quantity', filter=Q(item_status__in=["Return Initiated", "Returned"])),
                cancelled_quantity=Sum('quantity', filter=Q(item_status="Cancelled")),
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                #Code added by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                # total_completed_amount=Sum('amount', filter=~Q(item_status__in=['Refunded'])),
                total_completed_amount=Sum('total_amount', filter=~Q(item_status__in=['Refunded'])),
                #End of code addition by Unnati on 23-11-2024
                #Reason-Modified condition for total completed amount
                total_refunded_amount=Sum('amount', filter=Q(item_status="Refunded"))
            )
            ##Code added by Unnati on 19-01-2025
            ##Reason-Added year data
            year_data = OrderItem.objects.filter(
                Q(ordered_at__gte=year_start) | 
                Q(exchange_initiated_date__gte=year_start) |
               Q(cancelled_at__gte=year_start)
            ).filter(
                order_id__in=yearly_completed_orders  
            ).aggregate(
                refunded_quantity=Sum('quantity', filter=Q(item_status__in=["Refund Initiated", "Refunded"])),
                total_quantity=Sum('quantity')  
            )
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-Added year data
            ##Code added by Unnati on 19-01-2025
            ##Reason-Added year total tax
            yearly_total_tax = OrderItem.objects.filter(
                Q(type="Exchanged", exchange_initiated_date__gte=year_start) |  
                Q(type="Returned", return_initiated_date__gte=year_start) |  
                Q(type="Cancelled", cancelled_at__gte=year_start) |  
                (Q(type="Sold") & ~Q(
                    id__in=OrderItem.objects.filter(parent_id__isnull=False)
                    .annotate(parent_id_int=Cast(F("parent_id"), output_field=models.BigIntegerField()))
                    .values_list("parent_id_int", flat=True)
                ) & Q(ordered_at__gte=year_start)), 
                order_id__in=yearly_completed_orders
            ).annotate(
                tax_numeric=Cast("tax_percentage", output_field=FloatField())
            ).aggregate(total_tax=Sum("tax_numeric"))
            year_total_tax = yearly_total_tax.get("total_tax") or 0
            ##End of code addition by Unnati on 19-01-2025
            ##Reason-Added year total tax
            yearly_completed_order_items = yearly_aggregated_data['completed_quantity'] or 0
            #Code commeted by Unnati on 03-01-2025
            #Reason-This code is not in use
            # yearly_returned_order_items = yearly_aggregated_data['returned_quantity'] or 0
            # yearly_cancelled_order_items = yearly_aggregated_data['cancelled_quantity'] or 0
            #End of code commented by Unnati on 03-01-2025
            #Reason-This code is not in use
            yearly_refunded_order_items = year_data['refunded_quantity'] or 0
            yearly_completed_order_amount = yearly_aggregated_data['total_completed_amount'] or 0
            yearly_net_amount=yearly_completed_order_amount+yearly_extra_amount_due_to_exchange
            #Code commeted by Unnati on 03-01-2025
            #Reason-This code is not in use
            # yearly_refunded_order_amount = yearly_aggregated_data['total_refunded_amount'] or 0
            #End of code commented by Unnati on 03-01-2025
            #Reason-This code is not in use
            ##End of code addition by Unnati on 14-11-2024
            ##Reason-To have today's revenue,weekly revenue,monthly revenue and yearly revenue
            ##Code added by Unnati on 03-01-2025
            ##Reason-Added todays order placed,returned items,cancelled and exchanged items
            ##Code modified by Unnati on 04-01-2025
            ##Reason-Added order by
            # today_order_placed=Order.objects.filter(order_date__gte=today_start)
            today_order_placed=Order.objects.filter(order_date__gte=today_start).order_by("-id")
            ##End of code modification by Unnati on 04-01-2025
            ##Reason-Added order by
            today_order_placed_serializer=OrderSerializer(today_order_placed,many=True).data
            ##Code modified by Unnati on 04-01-2025
            ##Reason-Added order by
            # today_returned_items=OrderItem.objects.filter(return_initiated_date__gte=today_start,order_id__in=today_completed_orders)
            today_returned_items=OrderItem.objects.filter(return_initiated_date__gte=today_start,order_id__in=today_completed_orders,item_status__in=["Return Initiated","Return Approved","Return Rejected","Parcel Pickup Initiated for Return","Parcel Picked Up for Return","Returned"]).order_by("-id")
            ##End of code modification by Unnati on 04-01-2025
            ##Reason-Added order by
            today_returned_items_serializer=OrderItemSerializer(today_returned_items,many=True).data
            ##Code modified by Unnati on 04-01-2025
            ##Reason-Added order by
            # today_exchanged_items=OrderItem.objects.filter(exchange_initiated_date__gte=today_start,order_id__in=today_completed_orders)
            today_exchanged_items=OrderItem.objects.filter(exchange_initiated_date__gte=today_start,order_id__in=today_completed_orders,item_status__in=['Exchange Initiated','Exchange Approved','Exchange Rejected','Parcel Pickup Initiated for Exchange','Parcel Picked Up for Exchange','Exchanged']).order_by("-id")
            ##End of code modification by Unnati on 04-01-2025
            ##Reason-Added order by
            today_exchanged_items_serializer=OrderItemSerializer(today_exchanged_items,many=True).data
            ##Code modified by Unnati on 04-01-2025
            ##Reason-Added order by
            # today_cancelled_items=OrderItem.objects.filter(cancelled_at__gte=today_start,order_id__in=today_completed_orders)
            today_cancelled_items=OrderItem.objects.filter(cancelled_at__gte=today_start,order_id__in=today_completed_orders,item_status="Cancelled").order_by("-id")
            ##End of code modification by Unnati on 04-01-2025
            ##Reason-Added order by
            today_cancelled_items_serializer=OrderItemSerializer(today_cancelled_items,many=True).data
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added todays order placed,returned items,cancelled and exchanged items
            response_data = {
                "msg": "success",
                "mainCategoryCount": main_category_count,
                # "totalChildrenCount": total_children_count,
                "totalProductCount":total_product_count,
                "today_orders_count":today_orders_count,
                # Code added by Unnati on 21-11-2024
                # Reason-Added today order item
                "today_order_items":today_order_items,
                # End of code addition by Unnati on 21-11-2024
                # Reason-Added today order item
                "today_completed_orders_count":today_completed_orders_count,
                "today_pending_orders_count":today_pending_orders_count,
                "today_failed_orders_count":today_failed_orders_count,
                "today_completed_order_items":today_completed_order_items,
                "today_cancelled_order_items":today_cancelled_order_items,
                ##Code added by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "today_exchanged_order_items":today_exchanged_order_items,
                ##End of code addition by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "today_returned_order_items":today_returned_order_items,
                "today_refunded_order_items":today_refunded_order_items,
                "today_completed_order_amount":today_completed_order_amount,
                "today_net_amount":today_net_amount,

                #Code added by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                "today_refund_due_to_cancel":today_refund_due_to_cancel,
                "today_refund_due_to_exchange":today_refund_due_to_exchange,
                "today_refund_due_to_return":today_refund_due_to_return,
                # "today_refunded_order_amount":today_refunded_order_amount,
                "today_refunded_order_amount":today_total_refunded_amount,
                #End of cdoe addition by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                ##Code added by Unnati on 13-01-2025
                ##Reason-Added extra amount
                "today_extra_amount_due_to_exchange":today_extra_amount_due_to_exchange,
                ##End of code addition by Unnati on 13-01-2025
                ##Reason-Added extra amount
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added today total tax
                "today_total_tax":today_total_tax,
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added today total tax
                "weekly_orders_count":weekly_orders_count,
                # Code added by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "weekly_order_items":weekly_order_items,
                # End of code by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "weekly_completed_orders_count":weekly_completed_orders_count,
                "weekly_pending_orders_count":weekly_pending_orders_count,
                "weekly_failed_orders_count":weekly_failed_orders_count,
                "weekly_completed_order_items":weekly_completed_order_items,
                ##Code added by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "weekly_exchanged_order_items":weekly_exchanged_order_items,
                ##End of code addition by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "weekly_cancelled_order_items":weekly_cancelled_order_items,
                "weekly_returned_order_items":weekly_returned_order_items,
                "weekly_refunded_order_items":weekly_refunded_order_items,
                "weekly_completed_order_amount":weekly_completed_order_amount,
                "weekly_net_amount":weekly_net_amount,
                #Code added by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                "weekly_refund_due_to_cancel":weekly_refund_due_to_cancel,
                "weekly_refund_due_to_exchange":weekly_refund_due_to_exchange,
                "weekly_refund_due_to_return":weekly_refund_due_to_return,
                # "weekly_refunded_order_amount":weekly_refunded_order_amount,
                "weekly_refunded_order_amount":weekly_total_refunded_amount,
                #End of cdoe addition by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                ##Code added by Unnati on 13-01-2025
                ##Reason-Added extra amount
                "weekly_extra_amount_due_to_exchange":weekly_extra_amount_due_to_exchange,
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added year total tax
                "week_total_tax":week_total_tax,
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added year total tax
                ##End of code addition by Unnati on 13-01-2025
                ##Reason-Added extra amount
                "monthly_orders_count":monthly_orders_count,
                # Code added by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "monthly_order_items":monthly_order_items,
                # End of code addition by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "monthly_completed_orders_count":monthly_completed_orders_count,
                "monthy_pending_orders_count":monthy_pending_orders_count,
                "monthy_failed_orders_count":monthy_failed_orders_count,
                "monthly_completed_order_items":monthly_completed_order_items,
                ##Code added by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "monthly_exchanged_order_items":monthly_exchanged_order_items,
                ##End of cdoe additinon by Unnati on 03-01-2025
                ##Reason-Added exchnaged order items
                "monthly_cancelled_order_items":monthly_cancelled_order_items,
                "monthly_returned_order_items":monthly_returned_order_items,
                "monthly_refunded_order_items":monthly_refunded_order_items,
                "monthly_completed_order_amount":monthly_completed_order_amount,
                "monthly_net_amount":monthly_net_amount,
                #Code added by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                "monthly_refund_due_to_cancel":monthly_refund_due_to_cancel,
                "monthly_refund_due_to_exchange":monthly_refund_due_to_exchange,
                "monthly_refund_due_to_return":monthly_refund_due_to_return,
                # "monthly_refunded_order_amount":monthly_refunded_order_amount,
                "monthly_refunded_order_amount":monthly_total_refunded_amount,
                #End of code addition by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added year total tax
                "month_total_tax":month_total_tax,
                ##End of code addition by Unnati on 19-01-2025
                ##Reason-Added year total tax
                #Code added by Unnati on 13-01-2025
                #Reason-Added extra amount
                "monthly_extra_amount_due_to_exchange":monthly_extra_amount_due_to_exchange,
                #End of code addition by Unnati on 13-01-2025
                #Reason-Added extra amount
                "yearly_orders_count":yearly_orders_count,
                # Code added by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "yearly_order_items":yearly_order_items,
                # End of code addition by Unnati on 21-11-2024
                # Reason-Added weekly order item
                "yearly_completed_orders_count":yearly_completed_orders_count,
                "yearly_pending_orders_count":yearly_pending_orders_count,
                "yearly_failed_orders_count":yearly_failed_orders_count,
                "yearly_completed_order_items":yearly_completed_order_items,
                ##Code added by Unnati on 03-01-2025
               ##Reason-Added exchanged items
                "yearly_exchanged_order_items":yearly_exchanged_order_items,
                ##End of code addition by Unnati on 03-01-2025
               ##Reason-Added exchanged items
                "yearly_cancelled_order_items":yearly_cancelled_order_items,
                "yearly_returned_order_items":yearly_returned_order_items,
                "yearly_refunded_order_items":yearly_refunded_order_items,
                "yearly_completed_order_amount":yearly_completed_order_amount,
                "yearly_net_amount":yearly_net_amount,
                #Code added by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                # "yearly_refunded_order_amount":yearly_refunded_order_amount,
                "yearly_refund_due_to_cancel":yearly_refund_due_to_cancel,
                "yearly_refund_due_to_exchange":yearly_refund_due_to_exchange,
                "yearly_refund_due_to_return":yearly_refund_due_to_return,
                "yearly_refunded_order_amount":yearly_total_refunded_amount,
                #End of code addition by Unnati on 03-01-2025
                #Reason-Added code for cancel,exchange and return
                #Code added by Unnati on 13-01-2025
                #Reason-Added extra amount
                "yearly_extra_amount_due_to_exchange":yearly_extra_amount_due_to_exchange,
                #End of code addition by Unnati on 13-01-2025
                #Reason-Added extra amount
                ##Code added by Unnati on 19-01-2025
                ##Reason-Added year total tax
                "year_total_tax":year_total_tax,
                ##End of code addition  by Unnati on 19-01-2025
                ##Reason-Added year total tax
                ##Code added by Unnati on 03-01-2025
               ##Reason-Added todays order placed,returned items,cancelled and exchanged items
                "today_order_placed":today_order_placed_serializer,
                "today_cancelled_items":today_cancelled_items_serializer,
                "today_returned_items":today_returned_items_serializer,
                "today_exchanged_items":today_exchanged_items_serializer,
                ##End of cdoe addition by Unnati on 03-01-2025
               ##Reason-Added todays order placed,returned items,cancelled and exchanged items
            }
            return Response(response_data, 200)

        except Exception as e:
            logger.error(f"{e}")
            return Response({"msg": f"Error: {str(e)}"}, 500)

        

"""
# End of code addition by - Unnati on 14-11-2024
# Reason - To have dashboard API
"""

"""
# Added by - Ashlekh on 18-11-2024
# Reason - To filter products in SaleProduct using (low to high) / (high to low)
"""
#Code commented by Unnati on 06-12-2024
#Reason -This code is not in use
# class FilterProductAPIView(APIView):
#     def get(self, request):
#         try:
#             banner_id = request.query_params.get('banner_id')
#             sort_order = request.query_params.get('sort_order')
#             product = Product.objects.filter(banner=banner_id)
#             if sort_order == "highToLow":
#                 product = product.order_by("-sales_rate")
#             elif sort_order == "lowToHigh":
#                 product = product.order_by("sales_rate")
            
#             productSerializer = ProductSerializer(product, many=True)
#             return Response({"message": "Success", "product": productSerializer.data}, status=200)
#         except Exception as e:
#             print("Error in FilterProductAPIView ", e)
#             return Response({"message": "Error occured",}, status=500)
#End of code comment by Unnati on 06-12-2024
#Reason -This code is not in use
"""
# End of code - Ashlekh on 18-11-2024
# Reason - To filter products in SaleProduct using low to high/high to low
"""

# // Addition by Om Shrivastava on 20-11-2024
# // Reason : Add the method for post the comment and customized price 
class UpdateCustomizationComment(APIView):
    def post(self, request, *args, **kwargs):
        product_id = request.data.get('id') 
        customization_comment = request.data.get('customization_comment')
        logo = request.data.get('logo', False)
        patches = request.data.get('patches', False)
        security_batches = request.data.get('security_batches', False)
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        security_id_on_back = request.data.get('security_id_on_back', False)
        printed_id = request.data.get('printed_id', False)
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        embroider = request.data.get('embroider', False)

        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({"message": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Modification and addition by Om Shrivastava on 21-11-2024
        # Reason : Handle the customization price 
        # customization_price = product.sales_rate  
        if product.sale_percentage:
            customization_price = product.sales_rate - (product.sales_rate * product.sale_percentage) / 100
        else:
            customization_price = product.sales_rate
        # End of modification and addition by Om Shrivastava on 21-11-2024
        # Reason : Handle the customization price 

        if logo:
            customization_price += product.logo_price or 0
        if patches:
            customization_price += product.patches_price or 0
        if security_batches:
            customization_price += product.security_batches_price or 0
        # Added by - Ashlekh on 19-02-2025
        # Reason - To add customization
        if security_id_on_back:
            customization_price += product.security_id_on_back_price or 0
        if printed_id:
            customization_price += product.printed_id_price or 0
        # End of code - Ashlekh on 19-02-2025
        # Reason - To add customization
        if embroider:
            customization_price += product.embroider_price or 0

        if customization_comment:
            product.customization_comment = customization_comment
        product.after_customization_product_price = customization_price
        product.save()

        return Response({
            'customization_comment': product.customization_comment,
            'after_customization_product_price': customization_price
        }, status=status.HTTP_200_OK)
# // End of addition by Om Shrivastava on 20-11-2024
# // Reason : Add the method for post the comment and customized price 


"""
Added by - Ashish Dewangan on 24-11-2024
Reason - To have API for returning the item
"""
def generate_return_authoriation_no():
    now = datetime.now()
    month = now.strftime("%m")
    year = now.strftime("%Y")

    prefix = f"RN{month}{year}"

    last_return_authorization_no = OrderItem.objects.filter(
        return_authorization_no__startswith=prefix
    ).aggregate(Max('return_authorization_no'))
    
    last_number = last_return_authorization_no['return_authorization_no__max']
    
    if last_number:
        match = re.search(rf"{prefix}(\d+)", last_number)
        if match:
            last_sequence = int(match.group(1))
            new_sequence = last_sequence + 1
        else:
            new_sequence = 1
    else:
        new_sequence = 1
    new_sequence_formatted = f"{new_sequence:05d}"
    return_authorization_no = f"{prefix}{new_sequence_formatted}"
    
    return return_authorization_no

class ReturnItemAPIView(APIView):
    #Code modified by Unnati on 27-12-2024
    #Reason-Changed patch to post
    # def patch(self, request):
     def post(self, request):
    #End of code modification by Unnati on 27-12-2024
    #Reason-Changed patch to post
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("order")
            return_initiated_date = request.data.get("OrderItemReturnTime")
            return_reason = request.data.get("returnReason")
            returned_item_image1 = request.data.get('itemImage1')
            returned_item_image2 = request.data.get('itemImage2')
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_return_initiated_date = datetime.strptime(
                return_initiated_date, datetime_format)
            ##Code added by Unnati on 27-12-2024
            ##Reason-To get returned product details
            size=request.data.get("size")
            quantity=request.data.get("quantity")
            color=request.data.get("color")
            amount=request.data.get("amount")
            product_id=request.data.get("product_id")
            sales_rate=request.data.get("sales_rate")
            # subtotal=request.data.get("subtotal")
            subtotal = Decimal(request.data.get("subtotal", 0)) 
            tax_percentage = Decimal(sales_tax)
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added round off
            tax = round((tax_percentage / Decimal('100')) * subtotal,2)
            ##End of code modication by Unnati on 15-01-2025
            ##Reason-Added round off
            total_amount=request.data.get("total_amount")
            sale_percentage_input=request.data.get("sale_percentage")
            if sale_percentage_input and sale_percentage_input.isdigit():
                sale_percentage = Decimal(sale_percentage_input)
            else:
                sale_percentage = Decimal("0")
            product_instance = Product.objects.filter(product_id=product_id,color=color).first()
            order_instance = Order.objects.filter(id=order_id).first()
            ##End of code addition by Unnati on 27-12-2024
            ##Reason-To get returned product details
            order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            return_authorization_no = generate_return_authoriation_no()
            ##Code commented by Unnati on 27-12-2024
            ##Reason-This code is not in use currently
            # order_item.return_authorization_no=return_authorization_no
            # order_item.return_initiated_date = converted_return_initiated_date
            # order_item.return_reason = return_reason
            # order_item.returned_by = "User"
            # order_item.item_status = "Return Initiated"
            # order_item.returned_item_image1 = returned_item_image1
            # order_item.returned_item_image2 = returned_item_image2
            # order_item.save()
            ##End of code comment by Unnati on 27-12-2024
            ##Reason-This code is not in use currently
            ##Code added by Unnati on 27-12-2024
            ##Reason-To create order item row for returned product
            ##Code added by Unnati on 06-01-2025
            ##Reason-Added condition for return images
            if returned_item_image1 in [None,'undefined']:
                returned_item_image1 = None
            if returned_item_image2 in [None,'undefined']:
                returned_item_image2 = None 
            ##End of code addition by Unnati on 06-01-2025
            ##Reason-Added condition for return images
            order_items=OrderItem.objects.create(
                order=order_instance,
                product=product_instance,
                size=size,
                quantity=quantity,
                color=color,
                sales_rate=sales_rate,
                amount=amount,
                item_status="Return Initiated",
                invoice_id=generate_invoice_number(),
                type="Returned",
                sale_percentage=sale_percentage,
                subtotal=subtotal,
                total_amount=total_amount,
                tracking_id="",
                courier_service_provider_name="",  
                parent_id=order_item_id,
                return_reason=return_reason,
                return_initiated_date=converted_return_initiated_date,
                returned_by="User",
                returned_item_image1=returned_item_image1,
                returned_item_image2=returned_item_image2,
                return_authorization_no=return_authorization_no,
                tax_percentage=tax,

            )
            orderItemSerializer = OrderItemSerializer(order_items).data
            return Response({"message": "Item return request initiated.","order_item":orderItemSerializer}, 200)
            ##End of code addition by Unnati on 27-12-2024
            ##Reason-To create order item row for returned product
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)
"""
End of addition by - Ashish Dewangan on 24-11-2024
Reason - To have API for returning the item
"""

"""
Added by - Ashish Dewangan on 24-11-2024
Reason - To have API for adding tracking details for item being returned
"""

class AddTrackingDetailsAPIView(APIView):
    
    def patch(self, request):
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("orderId")
            returnTrackingId = request.data.get("returnTrackingId")
            returnCourierProviderName = request.data.get("returnCourierProviderName")
            order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            order_item.tracking_id = returnTrackingId
            order_item.courier_service_provider_name = returnCourierProviderName
            order_item.save()
            return Response({"message": "Tracking details added."}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)
"""
End of addition by - Ashish Dewangan on 24-11-2024
Reason - To have API for adding tracking details for item being returned
"""

"""
Added by - Ashish Dewangan on 27-11-2024
Reason - Created API class to generate stripe checkout session 
"""

class CreateStripeSessionIdView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get("userId")
            # print(user_id)
            cartData = Cart.objects.filter(user=user_id)
            if cartData.count()<1:
                return Response({"error": f"Cart is empty"}, 200)
            subtotal = 0

            # Modified by - Ashish Dewangan on 06-12-2024
            # Reason - Price was not being calculated according to customization functionality
            # for item in cartData:
            #     item_total = 0
            #     if (item.XS or 0) > 0:
            #         item_total += item.XS * item.sales_rate
            #     if (item.S or 0) > 0:
            #         item_total += item.S * item.sales_rate
            #     if (item.M or 0) > 0:
            #         item_total += item.M * item.sales_rate
            #     if (item.L or 0) > 0:
            #         item_total += item.L * item.sales_rate
            #     if (item.XL or 0) > 0:
            #         item_total += item.XL * item.sales_rate
            #     if (item.XXL or 0) > 0:
            #         item_total += item.XXL * item.sales_rate
            #     if (item.XXXL or 0) > 0:
            #         item_total += item.XXXL * item.sales_rate

            #     subtotal = subtotal+item_total
            # discount_id = request.data.get("discount")
            # if discount_id:
            #     discount = Discount.objects.filter(
            #         id=discount_id, is_active=True).first()
            #     discount_amount = discount.discount_amount
            #     taxable_amount = Decimal(subtotal) - discount_amount
            # else:
            #     discount_amount = Decimal("0.00")
            #     taxable_amount = Decimal(subtotal)
            # tax_percentage = Decimal('5.0')

            for item in cartData:
                item_total = 0
              
                product = item.product 
                
                sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                sale_rate_after_discount = float(
                            item.sales_rate) - (float(item.sales_rate) * (sale_percentage/100))
                after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else item.sales_rate

                if item.logo==True:
                            after_customization_product_price +=float( item.logo_price)
                if item.patches==True:
                            after_customization_product_price +=float( item.patches_price)
                if item.security_batches==True:
                            after_customization_product_price +=float( item.security_batches_price)
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                if item.security_id_on_back==True:
                            after_customization_product_price +=float( item.security_id_on_back_price)
                if item.printed_id==True:
                            after_customization_product_price +=float( item.printed_id_price)
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                if item.embroider==True:
                            after_customization_product_price +=float( item.embroider_price )

                customization_price = after_customization_product_price 

                if (item.quantity or 0) > 0:
                    item_total += item.quantity * customization_price
                subtotal += item_total
 
                subtotal=round(subtotal,2)

            discount_id = request.data.get("discount")

            if discount_id:
                discount = Discount.objects.filter(
                    id=discount_id, is_active=True).first()
                discount_amount = discount.discount_amount
                taxable_amount = Decimal(subtotal) - discount_amount

            else:
                discount_amount = Decimal('0.00')
                taxable_amount = Decimal(subtotal)
  
            taxable_amount = round(taxable_amount, 2) 
 
            tax_percentage = Decimal(sales_tax)
            # End of modification by - Ashish Dewangan on 06-12-2024
            # Reason - Price was not being calculated according to customization functionality

            tax = (tax_percentage / Decimal('100')) * taxable_amount
            grand_total = taxable_amount + tax

            # Modified by - Ashish Dewangan on 28-11-2024
            # Reason - To get these details from setting and .env file
            # YOUR_DOMAIN = 'http://localhost:3000'
            YOUR_DOMAIN = settings.DOMAIN_URL_FOR_STRIPE
            # stripe.api_key = 'sk_test_51QM1ZMLLdYR5IHNiVlnorGq55TyS8Fj2xNhm1NSWXaeDn2YK1Ead71WJ1X7ySVCdqaR8OMO3ru9vo28RYpBEBCqX00KaGdLREq'
            STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
            stripe.api_key = STRIPE_SECRET_KEY
            # End of modification by - Ashish Dewangan on 28-11-2024
            # Reason - To get these details from setting and .env file

            session = stripe.checkout.Session.create(
            ui_mode = 'embedded',
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(grand_total*100),
                        "product_data": {
                            "name": "name of the product",
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            return_url=YOUR_DOMAIN + '/payment_processing?session_id={CHECKOUT_SESSION_ID}',
            )
            return Response({"success":"session created","data":{"clientSecret":session.client_secret}})
        except Exception as e:
            logger.error(e)
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)
"""
End of additin by - Ashish Dewangan on 27-11-2024
Reason - Created API class to generate stripe checkout session 
"""

"""
Added by - Ashish Dewangan on 27-11-2024
Reason - API to create order from stripe's session
"""
class CreateOrderFromStripeView(APIView):
    def post(self, request):
        try:
            order_time = request.data.get('localOrderTime')
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_order_time = datetime.strptime(
                order_time, datetime_format)
 
            response = createBackendOrderUsingStripe(self, request, converted_order_time)
            return response
            
        except Exception as e:
            logger.error(e)
            return Response({"status": "error", }, status=500)
"""
End of addition by - Ashish Dewangan on 27-11-2024
Reason - API to create order from stripe's session
"""

"""
Added by - Ashish Dewangan on 27-11-2024
Reason - API to check if payment was success immediately after checkout
"""
class CheckStripeSession(APIView):
    def get(self,request,sessionId=None):
        try:
            # Modified by - Ashish Dewangan on 28-11-2024
            # Reason - Getting this details from .env file
            # stripe.api_key = 'sk_test_51QM1ZMLLdYR5IHNiVlnorGq55TyS8Fj2xNhm1NSWXaeDn2YK1Ead71WJ1X7ySVCdqaR8OMO3ru9vo28RYpBEBCqX00KaGdLREq'
            STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
            stripe.api_key = STRIPE_SECRET_KEY
            # End of modification by - Ashish Dewangan on 28-11-2024
            # Reason - Getting this details from .env file
            session = stripe.checkout.Session.retrieve(sessionId)
            try:
                if session.payment_status=="paid":
                    order = Order.objects.get(stripe_session_id=sessionId)
                    order.payment_status="Completed"
                    order.save()
            except Exception as orderNotFoundException:
                logger.error(orderNotFoundException)        
            return Response({"status":session.status, "customer_email":session.customer_details.email})
        except Exception as e:
            logger.error(e)
            return Response({"status":"", "customer_email":"Not found"})
"""
End of addition by - Ashish Dewangan on 27-11-2024
Reason - API to check if payment was success immediately after checkout
"""        

"""
Added by - Ashish Dewangan on 27-11-2024
Reason - method that will created order using session id of stripe
"""        
def createBackendOrderUsingStripe(self, request,  converted_order_time):
   
    try:
        user = request.data.get("userId")
        userObject = User.objects.get(id=user)
        cart = Cart.objects.filter(user=userObject)
        stripe_session_id=request.data.get("stripeSessionId")

        subtotal = 0
        for item in cart:
            item_total = 0
            
            # Modification and addition by Om Shrivastava on 25-11-2024
            # Reason : Add customization price 

            # if (item.XS or 0) > 0:
            #     item_total += item.XS * item.sales_rate

            # if (item.S or 0) > 0:
            #     item_total += item.S * item.sales_rate
            # if (item.M or 0) > 0:
            #     item_total += item.M * item.sales_rate
            # if (item.L or 0) > 0:
            #     item_total += item.L * item.sales_rate
            # if (item.XL or 0) > 0:
            #     item_total += item.XL * item.sales_rate
            # if (item.XXL or 0) > 0:
            #     item_total += item.XXL * item.sales_rate
            # if (item.XXXL or 0) > 0:
            #     item_total += item.XXXL * item.sales_rate
            # Modification and addition by Om Shrivastava on 03-12-2024
            # Reason : Add proper customization price calculation 
            product = item.product  # Assuming each cart item has a product relation

            # Fetch customization details from the product table
            # show_patches_and_embroider_on_UI = product.show_patches_and_embroider_on_UI
             
            # Calculate the base price
            # customization_price = item.sales_rate
            # if product.sale_percentage:
            #     customization_price -= (customization_price * product.sale_percentage) / 100

            # Add customization prices if applicable
            # if show_patches_and_embroider_on_UI:
            #     customization_price = after_customization_product_price
            # print(customization_price,'check customization price')

            # if (item.XS or 0) > 0:
            #     item_total += item.XS * customization_price
            # if (item.S or 0) > 0:
            #     item_total += item.S * customization_price
            # if (item.M or 0) > 0:
            #     item_total += item.M * customization_price
            # if (item.L or 0) > 0:
            #     item_total += item.L * customization_price
            # if (item.XL or 0) > 0:
            #     item_total += item.XL * customization_price
            # if (item.XXL or 0) > 0:
            #     item_total += item.XXL * customization_price
            # if (item.XXXL or 0) > 0:
            #     item_total += item.XXXL * customization_price
            
            # print(item_total,'items total')
            # after_customization_product_price = item.after_customization_product_price
            
            sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
            sale_rate_after_discount = float(
                        item.sales_rate) - (float(item.sales_rate) * (sale_percentage/100))
            after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else item.sales_rate

            if item.logo==True:
                        after_customization_product_price +=float( item.logo_price)
            if item.patches==True:
                        after_customization_product_price +=float( item.patches_price)
            if item.security_batches==True:
                        after_customization_product_price +=float( item.security_batches_price)
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            if item.security_id_on_back==True:
                        after_customization_product_price +=float( item.security_id_on_back_price)
            if item.printed_id==True:
                        after_customization_product_price +=float( item.printed_id_price)
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            if item.embroider==True:
                        after_customization_product_price +=float( item.embroider_price )

            customization_price = after_customization_product_price 
            # print(customization_price, 'checkkkkkkkkk calculationnnnnnn') 

            if (item.quantity or 0) > 0:
                item_total += item.quantity * customization_price
            # subtotal = subtotal+item_total
            subtotal += item_total
            # print(subtotal,'subtotalllllll')
             #Code added by Unnati on 04-12-2024
             #Reason-Added round for subtotal  
            subtotal=round(subtotal,2)
             #End of code addition by Unnati on 04-12-2024
             #Reason-Added round for subtotal 
        discount_id = request.data.get("discount")

        if discount_id:
            discount = Discount.objects.filter(
                id=discount_id, is_active=True).first()
            discount_amount = discount.discount_amount
            taxable_amount = Decimal(subtotal) - discount_amount

        else:
            discount_amount = Decimal('0.00')
            taxable_amount = Decimal(subtotal)
         #Code added by Unnati on 04-12-2024
         #Reason-Added round for taxable amount
        taxable_amount = round(taxable_amount, 2) 
         #End of code addition by Unnati on 04-12-2024
         #Reason-Added round for taxable amount
        tax_percentage = Decimal(sales_tax)

        tax = (tax_percentage / Decimal('100')) * taxable_amount
        grand_total = taxable_amount + tax

        order_id = generate_order_id()

        payment_status = "Pending"

        order_summary_data = {
            "order_id": order_id,
            "user": userObject.pk,
            "subtotal": subtotal,
            "is_discount_applied": discount_id is not None,
            "discount_amount": discount_amount if discount_id else Decimal('0.00'),
            "discount_code": "",
            "total_amount": subtotal,
            "shipping_amount": Decimal('0.00'),
            "taxable_amount": taxable_amount,
            "tax_percentage": str(tax_percentage),
            "tax_amount": round(tax, 2),
            "grand_total": round(grand_total, 2),
            "order_status": "Process",
            "payment_status": payment_status,
            "shipping_status": "",
            "discount_code": "",
            "date": datetime.now().strftime('%d-%m-%Y'),
            "order_date": converted_order_time,
            "stripe_session_id":stripe_session_id,
        }

        orderSerializer = OrderSerializer(data=order_summary_data)
        order_row_id = None
        order_summary = None
        if orderSerializer.is_valid():
            order_summary = orderSerializer.save()
            order_row_id = order_summary.pk
            
            order_summary.save()
        else:
            logger.error(orderSerializer.errors)
        for cart_item in cart:
            # for size in ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']:
                # quantity = getattr(cart_item, size) or 0
                quantity = getattr(cart_item,cart_item.size) or 0
                has_patch = False
                has_embroidery = False

                # Modified by - Ashish Dewangan on 12-12-2024
                # Reason - To use quantity from cart directly
                # if quantity > 0:
                if cart_item.quantity > 0:
                # End of modification by - Ashish Dewangan on 12-12-2024
                # Reason - To use quantity from cart directly    
                    size_field_patch = f"{cart_item.size.lower()}_patches"

                    has_patch = getattr(
                        cart_item, size_field_patch, False) or False
                        # cart_item, False) or False

                    size_field_embroidery = f"{cart_item.size.lower()}_embroider"
                    has_embroidery = getattr(
                        cart_item, size_field_embroidery, False) or False
                        # cart_item, False) or False

                if cart_item.quantity > 0:
                    # Addition by Om Shrivastava on 26-11-2024
                    # Reason : Get the customization price 
                    product = cart_item.product
                    # show_patches_and_embroider_on_UI = product.show_patches_and_embroider_on_UI
                    # after_customization_product_price = product.after_customization_product_price

                    # Calculate the sales rate
                    # customization_price = product.sales_rate
                    # if product.sale_percentage:
                    #     customization_price -= (customization_price * product.sale_percentage) / 100

                    # if show_patches_and_embroider_on_UI:
                    #     customization_price = after_customization_product_price

                    # amount = (
                    #     quantity * customization_price
                    #     if show_patches_and_embroider_on_UI
                    #     else quantity * cart_item.sales_rate
                    # )
                    sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                    sale_rate_after_discount = float(
                        cart_item.sales_rate) - (float(cart_item.sales_rate) * (sale_percentage/100))
                    after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else cart_item.sales_rate

                    if cart_item.logo==True:
                        after_customization_product_price +=float( cart_item.logo_price)
                    if cart_item.patches==True:
                        after_customization_product_price +=float( cart_item.patches_price)
                    if cart_item.security_batches==True:
                        after_customization_product_price +=float( cart_item.security_batches_price)
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.security_id_on_back==True:
                        after_customization_product_price +=float( cart_item.security_id_on_back_price)
                    if cart_item.printed_id==True:
                        after_customization_product_price +=float( cart_item.printed_id_price)
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if cart_item.embroider==True:
                        after_customization_product_price +=float( cart_item.embroider_price )

                    customization_price = after_customization_product_price
                    # print(customization_price, 'checkkkkkkkkk calculationnnnnnn') 
                    
                    amount = (
                        cart_item.quantity * customization_price
                    )
                    #Code added by Unnati on 22-12-2024
                    #Reason-To check if invoice exists or not
                    existing_invoice = OrderItem.objects.filter(
                        order=order_summary,
                        type="Sold"
                    ).values_list('invoice_id', flat=True).first()
                    invoice_id = existing_invoice if existing_invoice else generate_invoice_number()
                    #End of code addition by Unnati on 22-12-2024
                    #Reason-To check if invoice exists or not
                    # End of addition by Om Shrivastava on 26-11-2024
                    # Reason : Get the customization price 
                    #Code added by Unnati on 22-12-2024
                    #Reason-Calculation for each item row like amount,subtotal and grandtotal
                    sales_rate = float(cart_item.sales_rate)
                    # sales_tax = float(sales_tax)
                    sale_percentage = float(sale_percentage) if sale_percentage else 0.0
                    quantity = float(quantity)
                    after_customization_product_price = float(after_customization_product_price)

                    # Calculate amount
                    if sale_percentage:
                        amount = sales_rate - ((sale_percentage / 100) * sales_rate)
                    else:
                        amount = sales_rate

                    # Calculate item subtotal and tax
                    ##Code modified by Unnati on 30-12-2024
                    ##Reason-Modified quantity
                    #  item_subtotal = quantity * after_customization_product_price
                    item_subtotal = cart_item.quantity * after_customization_product_price
                    ##End of code modification by Unnati on 30-12-2024
                    ##Reason-Modified quantity
                    tax_percentage = float(sales_tax)
                    ##Code modified by Unnati on 15-01-2025
                    ##Reason-Changed tax to tax_amount
                    # tax_amount = (tax_percentage / 100) * item_subtotal
                    # total_amount = item_subtotal+tax_amount
                    tax_amount = round((tax_percentage / 100) * item_subtotal, 2)
                    total_amount =  round(item_subtotal+tax_amount, 2)
                    ##End of code by Unnati on 15-01-2025
                    ##Reason-Changed tax to tax_amount
                    #End of code addition by Unnati on 22-12-2024
                    #Reason-Calculation for each item row like amount,subtotal and grandtotal

                    # End of addition by Om Shrivastava on 26-11-2024
                    # Reason : Get the customization price 
                    OrderItem.objects.create(
                        order=order_summary,
                        product=cart_item.product,
                        # size=size,
                        size=cart_item.size,
                        # Modified by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        # quantity=quantity,
                        quantity=cart_item.quantity,
                        # End of modification by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        color=cart_item.color,
                        sales_rate=cart_item.sales_rate,
                        # Modification and addition by Om Shrivastava on 26-11-2024
                        # Reason : Set the amount 
                        # amount=quantity * cart_item.sales_rate,
                        amount=amount,
                        # End of modification and addition by Om Shrivastava on 26-11-2024
                        # Reason : Set the amount 
                        # Code changed by - Ashlekh on 12-12-2024
                        # Reason - To change default item status
                        # item_status="Pending",
                        item_status="Order Placed",
                        # End of code - Ashlekh on 12-12-2024
                        # Reason - To change default item status
                        has_patch=has_patch,
                        has_embroidery=has_embroidery,
                        ##Code added by Unnati on 07-11-2024
                        ##Reason-Added ordered_at
                        ordered_at=converted_order_time,
                        ##End of code addition by Unnati on 07-11-2024
                        ##Reason-Added ordered_at
                        # Modification and addition by Om Shrivastava on 21-11-2024
                        # Reasohn : Add customization key
                        # show_patches_and_embroider_on_UI=show_patches_and_embroider_on_UI,
                        after_customization_product_price=customization_price,
                        # End of modification and addition by Om Shrivastava on 21-11-2024
                        # Reasohn : Add customization key
                        # Addiiton by Om Shrivastava on 03-12-2024
                        # Reason : Add customization keys
                        logo = cart_item.logo,
                        patches = cart_item.patches,
                        security_batches = cart_item.security_batches,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back = cart_item.security_id_on_back,
                        printed_id = cart_item.printed_id,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider = cart_item.embroider,
                        # Added by - Ashish Dewangan on 06-12-2024
                        # Reason - Below details were not saved in order items
                        logo_price = cart_item.logo_price, 
                        patches_price = cart_item.patches_price,
                        security_batches_price = cart_item.security_batches_price,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back_price = cart_item.security_id_on_back_price,
                        printed_id_price = cart_item.printed_id_price,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider_price = cart_item.embroider_price,
                        # End of addition by - Ashish Dewangan on 06-12-2024
                        # Reason - Below details were not saved in order items
                        # Added by - Ashlekh on 16-12-2024
                        # Reason - To save customization comment in OrderItem
                        customization_comment = cart_item.customization_comment,
                        # End of code - Ashlekh on 16-12-2024
                        # Reason - To save customization comment in OrderItem
                        #Code added by Unnati on 22-12-2024
                        #Reason-Added invoice id,sale percentage,subtotal and total amount
                        invoice_id=invoice_id,
                        sale_percentage=sale_percentage,
                        subtotal=item_subtotal,
                        total_amount=total_amount,
                        #End of code addition by Unnati on 22-12-2024
                        #Reason-Added invoice id,sale percentage,subtotal and total amount
                        ##Code added by Unnati on 15-01-2025
                        ##Reason-Added tax amount
                        tax_percentage=tax_amount,
                        ##End of code addition by Unnati on 15-01-2025
                        ##Reason-Added tax amount
                    )
                    # Added by - Ashlekh on 22-10-2024
                    # Reason - To decrease quantity of different size from Product table
                    product_color = cart_item.color.lstrip('#')
                    product = Product.objects.filter(
                        id=cart_item.product.id,
                        color__icontains=product_color
                    ).first()

                    if product:
                        # current_size_quantity = getattr(product, size) or 0
                        current_size_quantity = getattr(product, cart_item.size) or 0

                        # Modified by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly
                        # if current_size_quantity >= quantity:
                        if current_size_quantity >= cart_item.quantity:
                        # End of modification by - Ashish Dewangan on 12-12-2024
                        # Reason - To use quantity from cart directly    
                            # setattr(product, size,
                            setattr(product, cart_item.size,
                                    # current_size_quantity - quantity)
                                    current_size_quantity - cart_item.quantity)


                        product.save()
                    # End of code - Ashlekh on 22-10-2024
                    # Reason - To decrease quantity of different size from Product table

        user_address = request.data.get("shippingAddress")

        first_name = user_address["first_name"]
        last_name = user_address["last_name"]
        address = user_address["address"]
        city = user_address["city"]
        country = user_address["country"]
        state = user_address["state"]
        zipcode = user_address["zipcode"]
        contact_number = user_address["contact_number"]
        company = user_address["company"]
        existing_address = UserAddressDetails.objects.filter(
            user=userObject,
            first_name=first_name,
            last_name=last_name,
            address=address,
            city=city,
            country=country,
            state=state,
            zipcode=zipcode,
            contact_number=contact_number,
            company=company,
        ).first()
        if existing_address is not None:
            pass
        else:
            try:
                user_address["user"] = userObject.id
                userAddressSerializer = UserAddressDetailsSerializer(
                    data=user_address
                )
                if userAddressSerializer.is_valid():
                    userAddressSerializer.save()

                else:
                    logger.error("Validation errors user address:",
                          userAddressSerializer.errors)
            except Exception as e:
                logger.error("Exception occured", e)

        shipping_address_data = request.data.get("shippingAddress")
        shippingAddress = {
            "user": userObject.pk,
            "first_name": shipping_address_data["first_name"],
            "last_name": shipping_address_data["last_name"],
            "address": shipping_address_data["address"],
            "city": shipping_address_data["city"],
            "country": shipping_address_data["country"],
            "state": shipping_address_data["state"],
            "zipcode": shipping_address_data["zipcode"],
            "contact_number": shipping_address_data["contact_number"],
            "company": shipping_address_data["company"],
            "order": order_row_id,
        }

        try:
            shippingAddressSerializer = ShippingAddressSerializer(
                data=shippingAddress)

            if shippingAddressSerializer.is_valid(raise_exception=True):
                shippingAddressSerializer.save()
            else:
                logger.error("Validation errors1:",
                      shippingAddressSerializer.errors)
        except Exception as e:
            logger.error("Exception occured", e)

        try:
            if request.data.get("shipToSameAddress"):
                billingAddress = shippingAddress
            else:
                billing_address_data = request.data.get("billingAddress")
                billingAddress = {
                    "user": userObject.pk,
                    "first_name": billing_address_data["first_name"],
                    "last_name": billing_address_data["last_name"],
                    "address": billing_address_data["address"],
                    "city": billing_address_data["city"],
                    "country": billing_address_data["country"],
                    "state": billing_address_data["state"],
                    "zipcode": billing_address_data["zipcode"],
                    "contact_number": billing_address_data["contact_number"],
                    "company": billing_address_data["company"],
                    "order": order_row_id,
                }
            billingAddressSerializer = BillingAddressSerializer(
                data=billingAddress)

            if billingAddressSerializer.is_valid(raise_exception=True):
                billingAddressSerializer.save()
            else:
                logger.error("Validation errors2:",
                      billingAddressSerializer.errors)
        except Exception as e:
            logger.error(e)

        setting = Setting.objects.first()
        if setting is not None:
            companyInfo = CompanyInfo.objects.create(
                order=order_summary,
                name=setting.name,
                address=setting.address,
                pincode=setting.pincode,
                contact_number=setting.contact_number,
                email=setting.email)

        order_items = OrderItem.objects.filter(order=order_summary)
        company_info = CompanyInfo.objects.filter(order=order_summary)
        orderItemSerializer = OrderItemSerializer(order_items, many=True)
        companyInfoSerializer = CompanyInfoSerializer(company_info, many=True)

        cart.delete()
        return Response({"success": "Order processed successfully",
                         "orderSummary": orderSerializer.data,
                         "shippingAddress": shippingAddressSerializer.data,
                         "billingAddress": billingAddressSerializer.data,
                         "payment_status": payment_status,
                         "orderItems": orderItemSerializer.data,
                         "companyInfo": companyInfoSerializer.data,
                         }, 200)
    except Exception as e:
        logger.error("Error in OrderAPI", e)
        return Response({"error": f"Something went wrong: {str(e)}"}, 500)        
"""
End of addition by - Ashish Dewangan on 27-11-2024
Reason - method that will created order using session id of stripe
"""            


"""
Added by - Ashish Dewangan on 28-11-2024
Reason - To handle stripe's webhook response
"""

# Modified by - Ashish Dewangan on 29-11-2024
# Reason - Modified code to gracefully return http response to webhook
"""
STRIPE_WEBHOOK_ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_ENDPOINT_SECRET")
@csrf_exempt
def my_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None
   
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_ENDPOINT_SECRET
        )
    except ValueError as e:
        logger.error(e)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(e)
        return HttpResponse(status=400)
    
  
        

    if event['type'] == 'checkout.session.completed' or  event[type] == "checkout.session.async_payment_succeeded":
        checkout_session = event['data']['object']
        handle_stripe_webhook_event_for_session_success(checkout_session)
    if event['type'] == 'checkout.session.expired' or event['type'] == 'checkout.session.async_payment_failed':
        checkout_session = event['data']['object']
        handle_stripe_webhook_event_for_session_failure(checkout_session)
       
    
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        handle_stripe_webhook_event_for_session_success(payment_intent)
    if event['type'] == 'payment_intent.canceled' or event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        handle_stripe_webhook_event_for_session_failure(payment_intent)

    return HttpResponse(status=200)


def handle_stripe_webhook_event_for_session_success(checkout_session):
    try:
        session_id = checkout_session['id']
        order = Order.objects.get(stripe_session_id=session_id)
        order.payment_status = 'Completed'
        order.save()
    except Order.DoesNotExist:
        logger.error(f"No order found for session ID: {session_id}")


def handle_stripe_webhook_event_for_payment_completed(payment_intent):
    payment_intent_id = payment_intent['id']

    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    stripe.api_key = STRIPE_SECRET_KEY
    session = stripe.checkout.Session.list(
        payment_intent=payment_intent_id
    ).data[0]

    try:
        order = Order.objects.get(stripe_session_id=session['id'])
        order.payment_status = 'Completed'
        order.save()
    except Order.DoesNotExist:
        logger.error(f"No order found for session ID: {session['id']}")


def handle_stripe_webhook_event_for_session_failure(checkout_session):
    try:
        session_id = checkout_session['id']
        orderRequest = Order.objects.get(stripe_session_id=session_id)
        return_order_items_to_cart(orderRequest)
    except Exception as e:
        logger.error(e)
        
   
def handle_stripe_webhook_event_for_payment_failure(payment_intent):
    try:
        payment_intent_id = payment_intent['id']
        STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
        stripe.api_key = STRIPE_SECRET_KEY
        session = stripe.checkout.Session.list(
            payment_intent=payment_intent_id
        ).data[0]
        orderRequest = Order.objects.get(stripe_session_id=session['id'])
        return_order_items_to_cart(orderRequest)
    except Exception as e:
        logger.error(e)
    
def return_order_items_to_cart(orderRequest):
    try:
        orderRequest.payment_status = "Failed"
        orderRequest.order_status = "Failed"

        orderItems = OrderItem.objects.filter(
            order=orderRequest.id)
        orderItemsSerializer = OrderItemSerializer(
            orderItems, many=True)
        for item in orderItemsSerializer.data:
            size = item['size']
            quantity = item['quantity']
            has_patch = item['has_patch']
            has_embroidery = item['has_embroidery']
            size_field_map = {
                'XS': ('XS', 'xs_patches', 'xs_embroider'),
                'S': ('S', 's_patches', 's_embroider'),
                'M': ('M', 'm_patches', 'm_embroider'),
                'L': ('L', 'l_patches', 'l_embroider'),
                'XL': ('XL', 'xl_patches', 'xl_embroider'),
                'XXL': ('XXL', 'xxl_patches', 'xxl_embroider'),
                'XXXL': ('XXXL', 'xxxl_patches', 'xxxl_embroider'),
            }
            cart_data = {
                'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0,
                'xs_patches': False, 's_patches': False, 'm_patches': False, 'l_patches': False, 'xl_patches': False,
                'xxl_patches': False, 'xxxl_patches': False,
                'xs_embroider': False, 's_embroider': False, 'm_embroider': False, 'l_embroider': False, 'xl_embroider': False,
                'xxl_embroider': False, 'xxxl_embroider': False
            }
            if size in size_field_map:
                quantity_field, patches_field, embroidery_field = size_field_map[size]
                cart_data[quantity_field] = quantity
                cart_data[patches_field] = has_patch
                cart_data[embroidery_field] = has_embroidery

            filter_conditions = {
                'user': orderRequest.user,
                'product_id': item['product'],
                'color': item['color'],
                quantity_field: cart_data[quantity_field],
            }
            existing_cart_item = Cart.objects.filter(
                **filter_conditions).first()
            if existing_cart_item:
                existing_cart_item.sales_rate = item['sales_rate']
                existing_cart_item.image1 = item.get(
                    'product_image1', '')
                existing_cart_item.name = item.get(
                    'product_name', '')
                existing_cart_item.__dict__.update(cart_data)
                existing_cart_item.save()
            else:
                Cart.objects.create(
                    user=orderRequest.user,
                    product_id=item['product'],
                    color=item['color'],
                    sales_rate=item['sales_rate'],
                    image1=item.get('product_image1', ''),
                    name=item.get('product_name', ''),
                    **cart_data
                )

        orderRequest.save()
    except Exception as e:
        logger.error(e)
"""

STRIPE_WEBHOOK_ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_ENDPOINT_SECRET")
@csrf_exempt
def my_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None
    # print("****************webhook triggered***************")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_ENDPOINT_SECRET
        )
    except ValueError as e:
        logger.error(e)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(e)
        return HttpResponse(status=400)
    
    # print("event type======",event['type'])

    if event['type'] == 'checkout.session.completed' or  event['type'] == "checkout.session.async_payment_succeeded":
        checkout_session = event['data']['object']
        return handle_stripe_webhook_event_for_session_success(checkout_session)
    if event['type'] == 'checkout.session.expired' or event['type'] == 'checkout.session.async_payment_failed':
        checkout_session = event['data']['object']
        return handle_stripe_webhook_event_for_session_failure(checkout_session)
       
    
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        return handle_stripe_webhook_event_for_payment_completed(payment_intent)
    if event['type'] == 'payment_intent.canceled' or event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        return handle_stripe_webhook_event_for_payment_failure(payment_intent)

def handle_stripe_webhook_event_for_session_success(checkout_session):
    try:
        session_id = checkout_session['id']
        order = Order.objects.get(stripe_session_id=session_id)
        order.payment_status = 'Completed'
        order.save()
        return HttpResponse(status=200)
    except Order.DoesNotExist:
        logger.error(f"No order found for session ID: {session_id}")
        return HttpResponse(status=400)

def handle_stripe_webhook_event_for_payment_completed(payment_intent):
    
    try:
        payment_intent_id = payment_intent['id']

        STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
        stripe.api_key = STRIPE_SECRET_KEY
        session = stripe.checkout.Session.list(
            payment_intent=payment_intent_id
        ).data[0]
        order = Order.objects.get(stripe_session_id=session['id'])
        order.payment_status = 'Completed'
        order.save()
        return HttpResponse(status=200)
    except Order.DoesNotExist:
        logger.error(f"No order found for session ID: {session['id']}")
        return HttpResponse(status=400)

def handle_stripe_webhook_event_for_session_failure(checkout_session):
    try:
        session_id = checkout_session['id']
        orderRequest = Order.objects.get(stripe_session_id=session_id)
        return return_order_items_to_cart(orderRequest)
    except Exception as e:
        logger.error(e)
        return HttpResponse(status=400)
        
   
def handle_stripe_webhook_event_for_payment_failure(payment_intent):
    try:
        payment_intent_id = payment_intent['id']
        STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
        stripe.api_key = STRIPE_SECRET_KEY
        session = stripe.checkout.Session.list(
            payment_intent=payment_intent_id
        ).data[0]
        orderRequest = Order.objects.get(stripe_session_id=session['id'])
        return return_order_items_to_cart(orderRequest)
    except Exception as e:
        logger.error(e)
        return HttpResponse(status=400)

# Modified by - Ashish Dewangan on 30-11-2024
# Reason - Below code was working differently
# def return_order_items_to_cart(orderRequest):
#     try:
#         orderRequest.payment_status = "Failed"
#         orderRequest.order_status = "Failed"

#         orderItems = OrderItem.objects.filter(
#             order=orderRequest.id)
#         orderItemsSerializer = OrderItemSerializer(
#             orderItems, many=True)
#         for item in orderItemsSerializer.data:
#             size = item['size']
#             quantity = item['quantity']
#             has_patch = item['has_patch']
#             has_embroidery = item['has_embroidery']
#             size_field_map = {
#                 'XS': ('XS', 'xs_patches', 'xs_embroider'),
#                 'S': ('S', 's_patches', 's_embroider'),
#                 'M': ('M', 'm_patches', 'm_embroider'),
#                 'L': ('L', 'l_patches', 'l_embroider'),
#                 'XL': ('XL', 'xl_patches', 'xl_embroider'),
#                 'XXL': ('XXL', 'xxl_patches', 'xxl_embroider'),
#                 'XXXL': ('XXXL', 'xxxl_patches', 'xxxl_embroider'),
#             }
#             cart_data = {
#                 'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0,
#                 'xs_patches': False, 's_patches': False, 'm_patches': False, 'l_patches': False, 'xl_patches': False,
#                 'xxl_patches': False, 'xxxl_patches': False,
#                 'xs_embroider': False, 's_embroider': False, 'm_embroider': False, 'l_embroider': False, 'xl_embroider': False,
#                 'xxl_embroider': False, 'xxxl_embroider': False
#             }
#             if size in size_field_map:
#                 quantity_field, patches_field, embroidery_field = size_field_map[size]
#                 cart_data[quantity_field] = quantity
#                 cart_data[patches_field] = has_patch
#                 cart_data[embroidery_field] = has_embroidery

#             filter_conditions = {
#                 'user': orderRequest.user,
#                 'product_id': item['product'],
#                 'color': item['color'],
#                 quantity_field: cart_data[quantity_field],
#             }
#             existing_cart_item = Cart.objects.filter(
#                 **filter_conditions).first()
#             if existing_cart_item:
#                 existing_cart_item.sales_rate = item['sales_rate']
#                 existing_cart_item.image1 = item.get(
#                     'product_image1', '')
#                 existing_cart_item.name = item.get(
#                     'product_name', '')
#                 existing_cart_item.__dict__.update(cart_data)
#                 existing_cart_item.save()
#             else:
#                 Cart.objects.create(
#                     user=orderRequest.user,
#                     product_id=item['product'],
#                     color=item['color'],
#                     sales_rate=item['sales_rate'],
#                     image1=item.get('product_image1', ''),
#                     name=item.get('product_name', ''),
#                     **cart_data
#                 )

#         orderRequest.save()
#         return HttpResponse(status=200)
#     except Exception as e:
#         logger.error(e)
#         return HttpResponse(status=400)

# Modified by - Ashish Dewangan on 06-12-2024
# Reason - To return items to cart with customization    
# def return_order_items_to_cart(orderRequest):
#     try:
#         orderRequest.payment_status = "Failed"
#         orderRequest.order_status = "Failed"

#         orderItems = OrderItem.objects.filter(
#             order=orderRequest.id)
        
#         for item in orderItems:
#             try:
#                 product = Product.objects.get(id=item.product.id)
#                 if item.size=="XS":
#                     product.XS=int(product.XS)+int(item.quantity)
#                 if item.size=="S":
#                     product.S=int(product.S)+int(item.quantity)
#                 if item.size=="M":
#                     product.M=int(product.M)+int(item.quantity)
#                 if item.size=="L":
#                     product.L=int(product.L)+int(item.quantity)
#                 if item.size=="XL":
#                     product.XL=int(product.XL)+int(item.quantity)
#                 if item.size=="XLL":
#                     product.XLL=int(product.XLL)+int(item.quantity)
#                 if item.size=="XLLL":
#                     product.XLLL=int(product.XLLL)+int(item.quantity)                    
#                 product.save()
#                 try:
#                     cart = Cart.objects.get(
#                         user=orderRequest.user,
#                         product=product,
#                         color=item.color,
#                         size=item.size,
#                         logo=item.logo,
#                         patches=item.patches,
#                         security_batches=item.security_batches,
#                         embroider=item.embroider,
#                         )

#                     cart.sales_rate=product.sales_rate
#                     cart.image1=product.image1
#                     cart.name=product.name
#                     cart.quantity=int(cart.quantity)+int(item.quantity)
#                     cart.save()
#                 except Cart.DoesNotExist as e:
#                     Cart.objects.create(
#                         user=orderRequest.user,
#                         product_id=item.product.id,
#                         color=item.color,
#                         sales_rate=product.sales_rate,
#                         image1=product.image1,
#                         name=product.name,
#                         size=item.size,
#                         quantity=item.quantity,
#                         logo=item.logo,
#                         patches=item.patches,
#                         security_batches=item.security_batches,
#                         embroider=item.embroider,
#                         after_customization_product_price=item.after_customization_product_price,
#                         customization_comment=item.customization_comment,

#                     )
#             except Product.DoesNotExist as e:
#                 logger.error(e)

#         orderRequest.save()
#         return HttpResponse(status=200)
#     except Exception as e:
#         logger.error(e)
#         return HttpResponse(status=400)
        
def return_order_items_to_cart(orderRequest):
    try:
        orderRequest.payment_status = "Failed"
        orderRequest.order_status = "Failed"

        orderItems = OrderItem.objects.filter(
            order=orderRequest.id)
        
        for item in orderItems:
            try:
                product = Product.objects.get(id=item.product.id)
                if item.size=="XS":
                    product.XS=int(product.XS)+int(item.quantity)
                if item.size=="S":
                    product.S=int(product.S)+int(item.quantity)
                if item.size=="M":
                    product.M=int(product.M)+int(item.quantity)
                if item.size=="L":
                    product.L=int(product.L)+int(item.quantity)
                if item.size=="XL":
                    product.XL=int(product.XL)+int(item.quantity)
                if item.size=="XXL":
                    product.XXL=int(product.XXL)+int(item.quantity)
                if item.size=="XXXL":
                    product.XXXL=int(product.XXXL)+int(item.quantity)                    
                product.save()

                sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                sale_rate_after_discount = float(
                            product.sales_rate) - (float(product.sales_rate) * (sale_percentage/100))
                after_customization_product_price=0

                if product.show_patches_and_embroider_on_UI==True:
                    after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else product.sales_rate

                    if item.logo==True:
                                after_customization_product_price +=float( product.logo_price)
                    if item.patches==True:
                                after_customization_product_price +=float( product.patches_price)
                    if item.security_batches==True:
                                after_customization_product_price +=float( product.security_batches_price)
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if item.security_id_on_back==True:
                                after_customization_product_price +=float( product.security_id_on_back_price)
                    if item.printed_id==True:
                                after_customization_product_price +=float( product.printed_id_price)
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    if item.embroider==True:
                                after_customization_product_price +=float( product.embroider_price )

                try:
                    cart = Cart.objects.get(
                        user=orderRequest.user,
                        product=product,
                        color=item.color,
                        size=item.size,
                        logo=item.logo,
                        patches=item.patches,
                        security_batches=item.security_batches,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back=item.security_id_on_back,
                        printed_id=item.printed_id,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider=item.embroider,
                        )
                    cart.sales_rate=product.sales_rate
                    
                    cart.image1=product.image1
                    cart.name=product.name
                    cart.quantity=int(cart.quantity)+int(item.quantity)
                    if item.size=="XS":
                        cart.XS=int(cart.XS)+int(item.quantity)
                    if item.size=="S":
                        cart.S=int(cart.S)+int(item.quantity)
                    if item.size=="M":
                        cart.M=int(cart.M)+int(item.quantity)
                    if item.size=="L":
                        cart.L=int(cart.L)+int(item.quantity)
                    if item.size=="XL":
                        cart.XL=int(cart.XL)+int(item.quantity)
                    if item.size=="XXL":
                        cart.XXL=int(cart.XXL)+int(item.quantity)
                    if item.size=="XXXL":
                        cart.XXXL=int(cart.XXXL)+int(item.quantity)     

                    if product.show_patches_and_embroider_on_UI==True:
                        cart.logo_price = product.logo_price if item.logo==True else None
                        cart.patches_price = product.patches_price if item.patches==True else None
                        cart.security_batches_price = product.security_batches_price if item.security_batches==True else None
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.security_id_on_back_price = product.security_id_on_back_price if item.security_id_on_back==True else None
                        cart.printed_id_price = product.printed_id_price if item.printed_id==True else None
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.embroider_price = product.embroider_price if item.embroider==True else None
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        # cart.after_customization_product_price=after_customization_product_price if item.logo==True or item.patches==True or item.security_batches==True or item.embroider==True else None
                        cart.after_customization_product_price=after_customization_product_price if item.logo==True or item.patches==True or item.security_batches==True or item.embroider==True or item.security_id_on_back==True or item.printed_id==True else None
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.customization_comment = item.customization_comment
                    else:
                        cart.logo = False
                        cart.patches = False
                        cart.security_batches = False
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.security_id_on_back  = False
                        cart.printed_id = False
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.embroider = False
                        cart.logo_price = None
                        cart.patches_price = None
                        cart.security_batches_price = None
                        cart.embroider_price = None
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.security_id_on_back_price = None
                        cart.printed_id_price = None
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        cart.after_customization_product_price = None
                        cart.customization_comment = ""     
                    cart.save()
                    c = Cart.objects.get(id=cart.id)    
                    c.image1 = settings.MEDIA_URL+ c.image1
                    c.save()
                except Cart.DoesNotExist as e:
                    if product.show_patches_and_embroider_on_UI == True:
                        cart = Cart.objects.create(
                            user=orderRequest.user,
                            product_id=item.product.id,
                            color=item.color,
                            sales_rate=product.sales_rate,
                            image1=product.image1,
                            name=product.name,
                            size=item.size,
                            quantity=item.quantity,
                            logo=item.logo,
                            patches=item.patches,
                            security_batches=item.security_batches,
                            # Added by - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            security_id_on_back=item.security_id_on_back,
                            printed_id=item.printed_id,
                            # End of code - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            embroider=item.embroider,
                            logo_price = product.logo_price if item.logo==True else None,
                            patches_price = product.patches_price if item.patches==True else None,
                            security_batches_price = product.security_batches_price if item.security_batches==True else None,
                            # Added by - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            security_id_on_back_price = product.security_id_on_back_price if item.security_id_on_back==True else None,
                            printed_id_price = product.printed_id_price if item.printed_id==True else None,
                            # End of code - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            embroider_price = product.embroider_price if item.embroider==True else None,
                            # Added by - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            # after_customization_product_price=after_customization_product_price if item.logo==True or item.patches==True or item.security_batches==True or item.embroider==True else None,
                            after_customization_product_price=after_customization_product_price if item.logo==True or item.patches==True or item.security_batches==True or item.embroider==True or item.security_id_on_back==True or item.printed_id==True else None,
                            # End of code - Ashlekh on 19-02-2025
                            # Reason - To add customization
                            customization_comment=item.customization_comment,
                            
                            XS= item.quantity if item.size=="XS" else None,
                            S= item.quantity if item.size=="S" else None,
                            M= item.quantity if item.size=="M" else None,
                            L= item.quantity if item.size=="L" else None,
                            XL= item.quantity if item.size=="XL" else None,
                            XXL= item.quantity if item.size=="XXL" else None,
                            XXXL= item.quantity if item.size=="XXXL" else None, 

                        )
                    else:
                        cart= Cart.objects.create(
                        user=orderRequest.user,
                        product_id=item.product.id,
                        color=item.color,
                        sales_rate=product.sales_rate,
                        image1=product.image1,
                        name=product.name,
                        size=item.size,
                        quantity=item.quantity,
                        logo=False,
                        patches=False,
                        security_batches=False,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back=False,
                        printed_id=False,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        embroider=False,
                        logo_price = None,
                        patches_price = None,
                        security_batches_price = None,
                        embroider_price = None,
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        security_id_on_back_price = None,
                        printed_id_price = None,
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        after_customization_product_price=None,
                        customization_comment="",

                        XS= item.quantity if item.size=="XS" else None,
                        S= item.quantity if item.size=="S" else None,
                        M= item.quantity if item.size=="M" else None,
                        L= item.quantity if item.size=="L" else None,
                        XL= item.quantity if item.size=="XL" else None,
                        XXL= item.quantity if item.size=="XXL" else None,
                        XXXL= item.quantity if item.size=="XXXL" else None, 
                        )    
                    c = Cart.objects.get(id=cart.id)    
                    c.image1 = settings.MEDIA_URL+ c.image1
                    c.save()    
            except Product.DoesNotExist as e:
                logger.error(e)

        orderRequest.save()
        return HttpResponse(status=200)
    except Exception as e:
        logger.error(e)
        return HttpResponse(status=400)
# End of modification by - Ashish Dewangan on 06-12-2024
# Reason - To return items to cart with customization 
        
# End of modification by - Ashish Dewangan on 30-11-2024
# Reason - code was working differently
            
# End of modification by - Ashish Dewangan on 29-11-2024
# Reason - Modified code to gracefully return http response to webhook



"""
Code commented by - Unnati on 22-11-2024
Reason - Exchange id is not used currently
"""
# def generate_exchange_id():
#     now = datetime.now()
#     month = now.strftime("%m")
#     year = now.strftime("%Y")

#     prefix = f"GP{month}{year}"

#     last_exchange = ReturnExchangeRequest.objects.filter(
#         exchange_id__startswith=prefix
#     ).aggregate(Max('exchange_id'))
    
#     last_id = last_exchange['exchange_id__max']

#     if last_id:
#         match = re.search(rf"{prefix}(\d+)", last_id)
#         if match:
#             last_sequence = int(match.group(1))
#             new_sequence = last_sequence + 1
#         else:
#             new_sequence = 1
#     else:
#         new_sequence = 1
    
    
#     new_sequence_formatted = f"{new_sequence:05d}"
#     exchange_id = f"{prefix}{new_sequence_formatted}"
    
#     return exchange_id
"""
End of code comment - Unnati on 22-11-2024
Reason - Exchange id is not used currently
"""
#Code added by Unnati on 22-12-2024
#Reason-To generate invoice number
def generate_invoice_number():
    last_invoice = OrderItem.objects.aggregate(Max('invoice_id'))
    last_invoice_number = last_invoice['invoice_id__max']

    if last_invoice_number:
        last_invoice_number_int = int(last_invoice_number[-4:])
        new_invoice_number = last_invoice_number_int + 1
    else:
        new_invoice_number = 1001 
    new_invoice_number_formatted = f"{new_invoice_number:04d}"
    invoice_number = f"INV{new_invoice_number_formatted}"
    return invoice_number
#End of code addition by Unnati on 22-12-2024
#Reason-To generate invoice number
"""
Code added by - Unnati on 22-12-2024
Reason - To have exchange item api when original amount is same as exchanged amount
"""
class ExchangeItemAPIView(APIView):
    def post(self, request):
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("orderId")
            exchange_initiated_date = request.data.get("OrderItemExchangeTime")
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_exchanged_initiated_date = datetime.strptime(
                exchange_initiated_date, datetime_format)
            # order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            selectedColor= request.data.get("selectedColor")
            selectedSize=request.data.get("selectedSize")
            # generated_order_id=Order.objects.get(id=order_id)
            logo = request.data.get("logo")
            patches = request.data.get("patches")
            security_batches = request.data.get("security_batches")
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back = request.data.get("security_id_on_back")
            printed_id = request.data.get("printed_id")
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider")
            customization_comment = request.data.get("customization_comment")
            after_customization_product_price = Decimal(request.data.get("after_customization_product_price", "0") or "0")
            #Code modified by Unnati on 30-12-2024
            #Reason-Modified quantity
            # original_item=OrderItem.objects.get(order_id=order_id)
            # quantity=original_item.quantity
            quantity=int(request.data.get("quantity"))
            #End of code modification by Unnati on 30-12-2024
            #Reason-Modified quantity
            product_id=request.data.get("product_id")
            sales_rate = Decimal(request.data.get("salesRate", "0") or "0")
            logo = request.data.get("logo", "").lower() == "true"
            if logo:
                logo_price = Decimal(request.data.get("logoPrice", "0") or "0")
            else:
                logo_price=None 

            patches = request.data.get("patches", "").lower() == "true"
            if patches:
                patches_price = Decimal(request.data.get("patchesPrice", "0") or "0")
            else:
                patches_price=None

            security_batches = request.data.get("security_batches", "").lower() == "true"

            if security_batches:
                security_batches_price = Decimal(request.data.get("securityBatchesPrice", "0") or "0")
            else:
                security_batches_price=None

            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back = request.data.get("security_id_on_back", "").lower() == "true"

            if security_id_on_back:
                security_id_on_back_price = Decimal(request.data.get("securityIdOnBackPrice", "0") or "0")
            else:
                security_id_on_back_price=None
            
            printed_id = request.data.get("printed_id", "").lower() == "true"

            if printed_id:
                printed_id_price = Decimal(request.data.get("printedIdPrice", "0") or "0")
            else:
                printed_id_price=None
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider", "").lower() == "true"
            if embroider:
                embroider_price = Decimal(request.data.get("embroiderPrice", "0") or "0")
            else:
                embroider_price=None
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            # if logo_price or patches_price or security_batches_price or embroider_price:
            if logo_price or patches_price or security_batches_price or embroider_price or security_id_on_back_price or printed_id_price:
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
                customization_price = sum(
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    # price for price in [logo_price, patches_price, security_batches_price, embroider_price] if price is not None
                    price for price in [logo_price, patches_price, security_batches_price, security_id_on_back_price, printed_id_price, embroider_price] if price is not None
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                )
            else:
                customization_price = None
            # image1=request.data.get("image1")
            exchange_reason=request.data.get("exchangeReason")
            sale_percentage_input = request.data.get("sale_percentage")
            if sale_percentage_input and sale_percentage_input.isdigit():
                sale_percentage = Decimal(sale_percentage_input)
            else:
                sale_percentage = Decimal("0")     
            product_instance = Product.objects.filter(product_id=product_id,color=selectedColor).first()
            # order_item_instance = OrderItem.objects.filter(id=order_item_id).first()
            order_instance = Order.objects.filter(id=order_id).first() 
            if sale_percentage:
               amount=sales_rate-((sale_percentage/100)*sales_rate)
            else:
                amount=sales_rate
            requestType=request.data.get("requestType")
            subtotal=quantity*after_customization_product_price
            tax_percentage = Decimal(sales_tax)
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added round off
            tax = round((tax_percentage / Decimal('100')) * subtotal,2)
            ##End of code modication by Unnati on 15-01-2025
            ##Reason-Added round off
            total_amount = subtotal+tax
            #Code added by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            exchanged_item_image1 = request.data.get('itemImage1') 
            exchanged_item_image2 = request.data.get('itemImage2')    
            #End of code addition by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            ##Code added by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            if exchanged_item_image1 in [None,'undefined']:
                exchanged_item_image1 = None
            if exchanged_item_image2 in [None,'undefined']:
                exchanged_item_image2 = None 
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            order_items=OrderItem.objects.create(
                order=order_instance,
                product=product_instance,
                size=selectedSize,
                quantity=quantity,
                color=selectedColor,
                sales_rate=sales_rate,
                amount=amount,
                item_status="Exchange Initiated",
                logo=logo,
                patches=patches,
                security_batches=security_batches,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back=security_id_on_back,
                printed_id=printed_id,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider=embroider,
                logo_price=logo_price if logo_price else 0.0,
                patches_price=patches_price if patches_price else 0.0,
                security_batches_price=security_batches_price if security_batches_price else 0.0,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back_price=security_id_on_back_price if security_id_on_back_price else 0.0,
                printed_id_price=printed_id_price if printed_id_price else 0.0,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider_price=embroider_price if embroider_price else 0.0,
                customization_price=customization_price,
                after_customization_product_price=after_customization_product_price,
                customization_comment=customization_comment,
                exchange_initiated_date=converted_exchanged_initiated_date,
                exchange_reason=exchange_reason,
                invoice_id=generate_invoice_number(),
                type=requestType,
                sale_percentage=sale_percentage,
                subtotal=subtotal,
                total_amount=total_amount,
                tracking_id="",
                courier_service_provider_name="",  
                parent_id=order_item_id,
                #Code added by Unnati on 27-12-2024
                #Reason-Added exchanged item images
                exchanged_item_image1=exchanged_item_image1,
                exchanged_item_image2=exchanged_item_image2,
                #End of code addition by Unnati on 27-12-2024
                #Reason-Added exchanged item images
                ##Code added by Unnati on 15-01-2025
                ##Reason-Added tax amount
                tax_percentage=tax,
                ##End of code addition by Unnati on 15-01-2025
                ##Reason-Added tax amount

            )
            orderItemSerializer = OrderItemSerializer(order_items).data
            return Response({"success": "Order processed successfully","order_item":orderItemSerializer}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)
       
   
    def get(self,request):
        try:
            order_item_id = request.query_params.get("ItemId")
            order_id = request.query_params.get("orderId")
            original_item=OrderItem.objects.get(id=order_item_id)
            exchanged_item=OrderItem.objects.get(parent_id=order_item_id)
            if original_item.total_amount>exchanged_item.total_amount:
                difference=original_item.total_amount-exchanged_item.total_amount
                exchanged_item.refund_amount=difference
                exchanged_item.save()
            elif original_item.total_amount < exchanged_item.total_amount:
                difference = exchanged_item.total_amount - original_item.total_amount
                exchanged_item.to_pay = difference
                exchanged_item.save()
            return Response({"message": "Successfully updated exchange amount."}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)    
  
"""
End of code addition by - Unnati on 22-12-2024
Reason - To have exchange item api when original amount is same as exchanged amount
""" 
"""
Code addition by - Unnati on 22-11-2024
Reason - To have API for exchanging the item
"""
class CreatePayPalOrderExchangeItemView(APIView):
    def post(self, request):
        try:
            extra_amount=request.data.get("extraAmount")
            extra_amount = round(float(extra_amount), 2) 
            PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
            PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
            PAYPAL_API_BASE = os.getenv("PAYPAL_BASE_URL")
            url = f"{PAYPAL_API_BASE}/v1/oauth2/token"
            auth = HTTPBasicAuth(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            }
            data = {
                "grant_type": "client_credentials"
            }
            response = requests.post(
                url, headers=headers, auth=auth, data=data)
            if response.status_code != 200:
                return Response({"Error in generating paypal access token ": {response.text}}, status=200)
            access_token = response.json().get("access_token")
            order_data = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{round(extra_amount, 2):.2f}"
                    }
                }]
            }
            paypal_order = create_paypal_order(access_token, order_data)
            paypal_order_id = paypal_order.get('id')
            return Response({"success": "PayPal order created successfully",
                             "paypal_order_id": paypal_order_id,
                             "paypal_access_token": access_token
                             }, status=200)
        except Exception as e:
            print("Error in create paypal order view", e)
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)
"""
End of code addition by - Unnati on 22-11-2024
Reason - To have API for exchanging the item
"""
"""
Code addition by - Unnati on 22-11-2024
Reason - To have method for exchangeAPI
"""  
def ExchangeAPI(self, request, paypal_response,
                                    paypalOrderIdFrontend, paypalAccessTokenFrontend,order_item_id,order_id,converted_exchanged_initiated_date,selectedColor,selectedSize,generated_order_id,logo,patches,security_batches,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back,
                                    printed_id,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider,customization_comment,after_customization_product_price,quantity,requestType,total_amount,product_instance,sales_rate,amount,logo_price,patches_price,security_batches_price,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back_price,
                                    printed_id_price,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider_price,customization_price,exchange_reason,sale_percentage,subtotal,order_instance,toPay,
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    exchanged_item_image1,exchanged_item_image2
                                     ##Code added by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    ,tax):
                                    ##End of code addition by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    #End of code addition by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
        
    try: 
        if paypal_response == "COMPLETED":
            payment_status = "Completed"
        else:
            payment_status = "Pending"

        order_items=OrderItem.objects.create(
                order=order_instance,
                product=product_instance,
                size=selectedSize,
                quantity=quantity,
                color=selectedColor,
                sales_rate=sales_rate,
                amount=amount,
                item_status="Exchange Initiated",
                logo=logo,
                patches=patches,
                security_batches=security_batches,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back=security_id_on_back,
                printed_id=printed_id,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider=embroider,
                logo_price=logo_price if logo_price else 0.0,
                patches_price=patches_price if patches_price else 0.0,
                security_batches_price=security_batches_price if security_batches_price else 0.0,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back_price=security_id_on_back_price if security_id_on_back_price else 0.0,
                printed_id_price=printed_id_price if printed_id_price else 0.0,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider_price=embroider_price if embroider_price else 0.0,
                customization_price=customization_price,
                after_customization_product_price=after_customization_product_price,
                customization_comment=customization_comment,
                exchange_initiated_date=converted_exchanged_initiated_date,
                exchange_reason=exchange_reason,
                invoice_id=generate_invoice_number(),
                type=requestType,
                sale_percentage=sale_percentage,
                subtotal=subtotal,
                total_amount=total_amount,
                tracking_id="",
                courier_service_provider_name="",  
                parent_id=order_item_id,
                paypal_order_id=paypalOrderIdFrontend,
                paypal_access_token=paypalAccessTokenFrontend,
                payment_status=payment_status,
                to_pay=toPay,
                #Code added by Unnati on 27-12-2024
                 #Reason-Added exchanged item images
                exchanged_item_image1=exchanged_item_image1,
                exchanged_item_image2=exchanged_item_image2,
                 #End of code addition by Unnati on 27-12-2024
                 #Reason-Added exchanged item images
                 ##Code added by Unnati on 15-01-2025
                ##Reason-Added tax amount
                tax_percentage=tax,
                ##End of code addition by Unnati on 15-01-2025
                ##Reason-Added tax amount

            )
        orderItemSerializer = OrderItemSerializer(order_items).data
        return Response({"success": "Order processed successfully","order_item":orderItemSerializer}, 200)
    except Exception as e:
            print("Error in OrderAPI", e)
            logger.error(f"{e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)
"""
End of code addition by - Unnati on 22-11-2024
Reason - To have method for exchangeAPI
""" 
"""
Code addition by - Unnati on 22-11-2024
Reason - To have API for paypal exchange capture 
"""           
class PayPalOrderExchangeCaptureView(APIView):
    
    def post(self, request):
        try:
            order_item_id = request.data.get("itemId")
            order_id = request.data.get("orderId")
            exchange_initiated_date = request.data.get("OrderItemExchangeTime")
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_exchanged_initiated_date = datetime.strptime(
                exchange_initiated_date, datetime_format)
            # order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            selectedColor= request.data.get("selectedColor")
            ##Code modified by Unnati on 12-01-2025
            selectedSize=request.data.get("size")
            ##End of code modification
            generated_order_id=Order.objects.get(id=order_id)
            logo = request.data.get("logo")
            patches = request.data.get("patches")
            security_batches = request.data.get("security_batches")
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back= request.data.get("security_id_on_back")
            printed_id= request.data.get("printed_id")
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider")
            customization_comment = request.data.get("customization_comment")
            after_customization_product_price = Decimal(request.data.get("after_customization_product_price", "0") or "0")
            ##Code modified by Unnati on 30-12-2024
            ##Reason-To get original item
            original_item=OrderItem.objects.get(id=order_item_id)
            ##End of code modification by Unnati on 30-12-2024
            ##Reason-To get original item
            quantity=original_item.quantity
            product_id=request.data.get("product_id")
            # product_name=request.data.get("productName")
            sales_rate = Decimal(request.data.get("salesRate", "0") or "0")
            logo = request.data.get("logo", "").lower() == "true"
            if logo:
                logo_price = Decimal(request.data.get("logoPrice", "0") or "0")
            else:
                logo_price=None 

            patches = request.data.get("patches", "").lower() == "true"
            if patches:
                patches_price = Decimal(request.data.get("patchesPrice", "0") or "0")
            else:
                patches_price=None

            security_batches = request.data.get("security_batches", "").lower() == "true"

            if security_batches:
                security_batches_price = Decimal(request.data.get("securityBatchesPrice", "0") or "0")
            else:
                security_batches_price=None
            
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back = request.data.get("security_id_on_back", "").lower() == "true"

            if security_id_on_back:
                security_id_on_back_price = Decimal(request.data.get("securityIdOnBackPrice", "0") or "0")
            else:
                security_id_on_back_price=None
            
            printed_id = request.data.get("printed_id", "").lower() == "true"

            if printed_id:
                printed_id_price = Decimal(request.data.get("printedIdPrice", "0") or "0")
            else:
                printed_id_price=None
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider", "").lower() == "true"
            if embroider:
                embroider_price = Decimal(request.data.get("embroiderPrice", "0") or "0")
            else:
                embroider_price=None
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            # if logo_price or patches_price or security_batches_price or embroider_price:
            if logo_price or patches_price or security_batches_price or embroider_price or security_id_on_back_price or printed_id_price:
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
                customization_price = sum(
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    # price for price in [logo_price, patches_price, security_batches_price, embroider_price] if price is not None
                    price for price in [logo_price, patches_price, security_batches_price, embroider_price, security_id_on_back_price, printed_id_price] if price is not None
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                )
            else:
                customization_price = None
            # image1=request.data.get("image1")
            exchange_reason=request.data.get("exchangeReason")
            sale_percentage_input = request.data.get("sale_percentage")
            if sale_percentage_input and sale_percentage_input.isdigit():
                sale_percentage = Decimal(sale_percentage_input)
            else:
                sale_percentage = Decimal("0")  
            product_instance = Product.objects.filter(product_id=product_id,color=selectedColor).first()
            # order_item_instance = OrderItem.objects.filter(id=order_item_id).first()
            order_instance = Order.objects.filter(id=order_id).first() 
            if sale_percentage:
               amount=sales_rate-((sale_percentage/100)*sales_rate)
            else:
                amount=sales_rate
            requestType=request.data.get("requestType")
            toPay = request.data.get("toPay", 0) or 0
            subtotal=quantity*after_customization_product_price
            tax_percentage = Decimal(sales_tax)
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added round off
            tax = round((tax_percentage / Decimal('100')) * subtotal,2)
            ##End of code modication by Unnati on 15-01-2025
            ##Reason-Added round off
            total_amount = subtotal+tax
            #Code added by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            exchanged_item_image1 = request.data.get('itemImage1')
            exchanged_item_image2 = request.data.get('itemImage2')
            #End of code addition by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            ##Code added by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            if exchanged_item_image1 in [None,'undefined']:
                exchanged_item_image1 = None
            if exchanged_item_image2 in [None,'undefined']:
                exchanged_item_image2 = None 
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            paypalOrderIdFrontend = request.data.get('paypalOrderId')
            paypalAccessTokenFrontend = request.data.get('paypalAccessToken')
            PAYPAL_API_BASE_FOR_PAYMENT_VERIFICATION = os.getenv("PAYPAL_BASE_URL")
            url = f"{PAYPAL_API_BASE_FOR_PAYMENT_VERIFICATION}/v2/checkout/orders/{paypalOrderIdFrontend}/capture"
            headers = {
                "Authorization": f"Bearer {paypalAccessTokenFrontend}",
                "Content-Type": "application/json",
            }
            response = requests.post(url, headers=headers)
            status = response.json().get('purchase_units', [{}])[0].get(
                'payments', {}).get('captures', [{}])[0].get('status')
            paypal_response = response.json().get('status')
            if paypal_response == "COMPLETED":
                response = ExchangeAPI(self, request, paypal_response,
                                    paypalOrderIdFrontend, paypalAccessTokenFrontend,order_item_id,order_id,converted_exchanged_initiated_date,selectedColor,selectedSize,generated_order_id,logo,patches,security_batches,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back,
                                    printed_id,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider,customization_comment,after_customization_product_price,quantity,requestType,total_amount,product_instance,sales_rate,amount,logo_price,patches_price,security_batches_price,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back_price,
                                    printed_id_price,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider_price,customization_price,exchange_reason,sale_percentage,subtotal,order_instance,toPay,
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    exchanged_item_image1,exchanged_item_image2
                                    ##Code added by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    ,tax)
                                    ##End of code addition by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images  
                return response
            elif status == "PENDING":
                response = ExchangeAPI(self, request, paypal_response,
                                    paypalOrderIdFrontend, paypalAccessTokenFrontend,order_item_id,order_id,converted_exchanged_initiated_date,selectedColor,selectedSize,generated_order_id,logo,patches,security_batches,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back,
                                    printed_id,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider,customization_comment,after_customization_product_price,quantity,requestType,total_amount,product_instance,sales_rate,amount,logo_price,patches_price,security_batches_price,
                                    # Added by - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    security_id_on_back_price,
                                    printed_id_price,
                                    # End of code - Ashlekh on 19-02-2025
                                    # Reason - To add customization
                                    embroider_price,customization_price,exchange_reason,sale_percentage,subtotal,order_instance,toPay,
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    exchanged_item_image1,exchanged_item_image2
                                    ##Code added by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    ,tax)
                                    ##End of code addition by Unnati on 15-01-2025
                                    ##Reason-Added tax
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images 
                return response
            return Response({"message": "Item exchange request initiated."}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)
"""
End of code addition by - Unnati on 22-11-2024
Reason - To have API for paypal exchange capture 
"""        
"""
Added by - Unnati on 20-12-2024
Reason - To have API for stripe session id
"""
class CreateStripeSessionIdForExchangeAPI(APIView):
    def post(self, request):
        try:
            extra_amount=request.data.get("extraAmount")
            extra_amount = round(float(extra_amount), 2)
            YOUR_DOMAIN = settings.DOMAIN_URL_FOR_STRIPE
            STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
            stripe.api_key = STRIPE_SECRET_KEY
            session = stripe.checkout.Session.create(
            ui_mode = 'embedded',
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(extra_amount*100),
                        "product_data": {
                            "name": "name of the product",
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            return_url=YOUR_DOMAIN + '/exchange_payment_processing?session_id={CHECKOUT_SESSION_ID}',
            )
            return Response({"success":"session created","data":{"clientSecret":session.client_secret}})
        except Exception as e:
            logger.error(e)
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)
"""
End of code addition by - Unnati on 20-12-2024
Reason - To have API for stripe session id
"""         
"""
Added by - Unnati on 20-12-2024
Reason - To have a method for exchange using stripe
"""               
def ExchangeUsingStripeAPI(self, request,order_item_id,order_id,converted_exchanged_initiated_date,selectedColor,selectedSize,generated_order_id,logo,patches,security_batches,
                        #    Added by - Ashlekh on 19-02-2025
                        #    Reason - To add customization
                            security_id_on_back,
                            printed_id,
                        #    End of code - Ashlekh on 19-02-2025
                        #    Reason - To add customization
                           embroider,customization_comment,after_customization_product_price,quantity,requestType,total_amount,product_instance,sales_rate,amount,logo_price,patches_price,security_batches_price,embroider_price,
                        #    Added by - Ashlekh on 19-02-2025
                        #    Reason - To add customization
                            security_id_on_back_price,
                            printed_id_price,
                        #    End of code - Ashlekh on 19-02-2025
                        #    Reason - To add customization
                           customization_price,exchange_reason,sale_percentage,subtotal,order_instance,extraAmount,
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    image1,image2
                                    #End of code addition by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images
                                    ##Code modified by Unnati on 15-01-2025
                                    ##Reason-Adde tax
                                    ,tax):
                                    ##End of code modification by Unnati on 15-01-2025
                                    ##Reason-Adde tax
                                    #Code added by Unnati on 27-12-2024
                                    #Reason-Added exchanged item images 
    try: 
        stripe_session_id=request.data.get("stripeSessionId")
        #Code added by unnati on 02-12-2024
        order=Order.objects.get(id=order_id)
        orderSerializer=OrderSerializer(order).data
        #End of cdoe addition by Unnati on 02-01-2025
        order_items=OrderItem.objects.create(
                order=order_instance,
                product=product_instance,
                size=selectedSize,
                quantity=quantity,
                color=selectedColor,
                sales_rate=sales_rate,
                amount=amount,
                item_status="Exchange Initiated",
                logo=logo,
                patches=patches,
                security_batches=security_batches,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back=security_id_on_back,
                printed_id=printed_id,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider=embroider,
                logo_price=logo_price if logo_price else 0.0,
                patches_price=patches_price if patches_price else 0.0,
                security_batches_price=security_batches_price if security_batches_price else 0.0,
                # Added by - Ashlekh on 19-02-2025
                # Reason - To add customization
                security_id_on_back_price=security_id_on_back_price if security_id_on_back_price else 0.0,
                printed_id_price=printed_id_price if printed_id_price else 0.0,
                # End of code - Ashlekh on 19-02-2025
                # Reason - To add customization
                embroider_price=embroider_price if embroider_price else 0.0,
                customization_price=customization_price,
                after_customization_product_price=after_customization_product_price,
                customization_comment=customization_comment,
                exchange_initiated_date=converted_exchanged_initiated_date,
                exchange_reason=exchange_reason,
                invoice_id=generate_invoice_number(),
                type=requestType,
                sale_percentage=sale_percentage,
                subtotal=subtotal,
                total_amount=total_amount,
                tracking_id="",
                courier_service_provider_name="",  
                parent_id=order_item_id,
                stripe_session_id=stripe_session_id,
                to_pay=extraAmount,
                #Code added by Unnati on 27-12-2024
                #Reason-Added exchanged item images
                ##Code added by Unnati on 19-01-2025
                ##Modified images 1 and 2
                exchanged_item_image1=image1,
                exchanged_item_image2=image2,
                ##End of code addition by Unnati on 19-01-2025
                ##Modified images 1 and 2
                #End of code addition by Unnati on 27-12-2024
                #Reason-Added exchanged item images
                ##Code added by Unnati on 15-01-2025
                ##Reason-Added tax
                tax_percentage=tax,
                ##End of code addition by Unnati on 15-01-2025
                ##Reason-Added tax
            )
        orderItemSerializer = OrderItemSerializer(order_items).data
        return Response({"success": "Order processed successfully","order_item":orderItemSerializer,"order":orderSerializer}, 200)
    except Exception as e:
            print("Error in OrderAPI", e)
            logger.error(f"{e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, 500)  
"""
End of code addition by - Unnati on 20-12-2024
Reason - To have a method for exchange using stripe
"""     
"""
Added by - Unnati on 20-12-2024
Reason - To have API for check strip session for exchange
"""    
class CheckStripeSessionForExchange(APIView):
    def get(self,request,sessionId=None):
        try:
            STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
            stripe.api_key = STRIPE_SECRET_KEY
            session = stripe.checkout.Session.retrieve(sessionId)
            try:
                if session.payment_status=="paid":
                    order_item = OrderItem.objects.get(stripe_session_id=sessionId)
                    order_item.payment_status="Completed"
                    order_item.save()
            except Exception as orderNotFoundException:
                logger.error(orderNotFoundException)        
            return Response({"status":session.status, "customer_email":session.customer_details.email})
        except Exception as e:
            logger.error(e)
            return Response({"status":"", "customer_email":"Not found"})    
"""
End of code addition by - Unnati on 20-12-2024
Reason - To have API for check strip session for exchange
"""  
"""
Added by - Unnati on 20-12-2024
Reason - To have API for create exchange through stripe
"""  
def to_decimal(value, default="0"):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError):
                    return Decimal(default)    
class CreateExchangeFromStripeView(APIView):
    def post(self, request):
        try:
            order_item_id = request.data.get("itemId")
            order_id = request.data.get("orderId")
            exchange_initiated_date = request.data.get("OrderItemExchangeTime")
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_exchanged_initiated_date = datetime.strptime(
                exchange_initiated_date, datetime_format)
            
            # order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            selectedColor= request.data.get("selectedColor")
            selectedSize=request.data.get("selectedSize")
            generated_order_id=Order.objects.get(id=order_id)
            logo = request.data.get("logo")
            patches = request.data.get("patches")
            security_batches = request.data.get("security_batches")
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back = request.data.get("security_id_on_back")
            printed_id = request.data.get("printed_id")
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = request.data.get("embroider")
            customization_comment = request.data.get("customization_comment")
            # after_customization_product_price =Decimal(request.data.get("after_customization_product_price", "0"))
            after_customization_product_price = to_decimal(request.data.get("after_customization_product_price", "0"))
            #Code modified by Unnati on 30-12-2024
            #Reason-Modified order_id to order_item_id
            # original_item=OrderItem.objects.get(order_id=order_id)
            original_item=OrderItem.objects.get(id=order_item_id)
            #End of code modification by Unnati on 30-12-2024
            #Reason-Modified order_id to order_item_id
            quantity=int(original_item.quantity)
            product_name=request.data.get("productName")
            # sales_rate = Decimal(request.data.get("salesRate", "0") or "0")
            sales_rate = to_decimal(request.data.get("salesRate", "0"))
            logo = str(request.data.get("logo", "")).lower() == "true"
            
            # if logo:
                
            #     logo_price = Decimal(request.data.get("logoPrice", "0") or "0")
            # else:
            #     logo_price = None 
            logo_price = to_decimal(request.data.get("logoPrice", "0")) if logo else None

            patches = str(request.data.get("patches", "")).lower() == "true"
            security_batches = str(request.data.get("security_batches", "")).lower() == "true"
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back = str(request.data.get("security_id_on_back", "")).lower() == "true"
            printed_id = str(request.data.get("printed_id", "")).lower() == "true"
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            embroider = str(request.data.get("embroider", "")).lower() == "true"
            # patches_price = Decimal(request.data.get("patchesPrice", "0") or "0") if patches else None
            patches_price = to_decimal(request.data.get("patchesPrice", "0")) if patches else None
            # security_batches_price = Decimal(request.data.get("securityBatchesPrice", "0") or "0") if security_batches else None
            security_batches_price = to_decimal(request.data.get("securityBatchesPrice", "0")) if security_batches else None
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            security_id_on_back_price = to_decimal(request.data.get("securityIdOnBackPrice", "0")) if security_id_on_back else None
            printed_id_price = to_decimal(request.data.get("printedIdPrice", "0")) if printed_id else None
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
            # embroider_price = Decimal(request.data.get("embroiderPrice", "0") or "0") if embroider else None
            embroider_price = to_decimal(request.data.get("embroiderPrice", "0")) if embroider else None
            # Added by - Ashlekh on 19-02-2025
            # Reason - To add customization
            # if logo_price or patches_price or security_batches_price or embroider_price:
            if logo_price or patches_price or security_batches_price or embroider_price or security_id_on_back_price or printed_id_price:
            # End of code - Ashlekh on 19-02-2025
            # Reason - To add customization
                customization_price = sum(
                    # Added by - Ashlekh on 19-02-2025
                    # Reason - To add customization
                    # price for price in [logo_price, patches_price, security_batches_price, embroider_price] if price is not None
                    price for price in [logo_price, patches_price, security_batches_price,security_id_on_back_price, printed_id_price, embroider_price] if price is not None
                    # End of code - Ashlekh on 19-02-2025
                    # Reason - To add customization
                )
            else:
                customization_price = None
            # image1=request.data.get("image1")
            exchange_reason=request.data.get("exchangeReason")
            sale_percentage = to_decimal(request.data.get("sale_percentage", "0"))
            # sale_percentage_input = request.data.get("sale_percentage")
            # if sale_percentage_input:
            #     sale_percentage = Decimal(sale_percentage_input)
            # else:
            #     sale_percentage = Decimal("0")  
            product_instance = Product.objects.filter(name=product_name).first()
            # order_item_instance = OrderItem.objects.filter(id=order_item_id).first()
            order_instance = Order.objects.filter(id=order_id).first() 
            if sale_percentage:
                amount = round(sales_rate - ((sale_percentage / 100) * sales_rate), 2)
            else:
                amount = round(sales_rate, 2)

            requestType=request.data.get("requestType")
            subtotal=quantity*after_customization_product_price
            tax_percentage = Decimal(sales_tax)
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added round off
            tax = round((tax_percentage / Decimal('100')) * subtotal,2)
            ##End of code modification by Unnati on 15-01-2025
            ##Reason-Added round off
            total_amount = round((subtotal+tax),2)
            # extraAmount = request.data.get("toPay", 0) or 0
            extraAmount = round(to_decimal(request.data.get("toPay", "0")),0)
            # stripe_session_id=request.data.get("stripeSessionId")
            #Code added by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            ##Code added by Unnati on 24-01-2025
            ##Reason-Modified code 
            exchanged_item_image1 = request.data.get('itemImage1')
            ##Code commented by Unnati on 24-01-2025
            ##Reason-This code is not in use
            # missing_padding1 = len(exchanged_item_image1) % 4
            # if missing_padding1:
            #     exchanged_item_image1 += '=' * (4 - missing_padding1)
            # if 'base64,' in exchanged_item_image1:
            #     base64_data1 = exchanged_item_image1.split('base64,', 1)[-1]
            # imgdata1 = base64.b64decode(base64_data1)
            # extension1 = imghdr.what(None, h=imgdata1)
            # image1 = ContentFile(imgdata1, name="id"+"." + extension1)
            # exchanged_item_image2 = request.data.get('itemImage2')
            # missing_padding2 = len(exchanged_item_image2) % 4
            # if missing_padding2:
            #     exchanged_item_image2 += '=' * (4 - missing_padding2)
            # if 'base64,' in exchanged_item_image2:
            #     base64_data2 = exchanged_item_image2.split('base64,', 1)[-1]
            # imgdata2 = base64.b64decode(base64_data2)
            # extension2 = imghdr.what(None, h=imgdata2)
            # image2 = ContentFile(imgdata2, name="id"+"." + extension2)
            ##End of code comment by Unnati on 24-01-2025
            ##Reason-This code is not in use
            exchanged_item_image2 = request.data.get('itemImage2')
            image1 = None
            image2 = None
            if exchanged_item_image1:  
                missing_padding1 = len(exchanged_item_image1) % 4
                if missing_padding1:
                    exchanged_item_image1 += '=' * (4 - missing_padding1)
                base64_data1 = exchanged_item_image1.split('base64,', 1)[-1] if 'base64,' in exchanged_item_image1 else exchanged_item_image1
                try:
                    imgdata1 = base64.b64decode(base64_data1)
                    extension1 = imghdr.what(None, h=imgdata1)
                    if extension1: 
                        image1 = ContentFile(imgdata1, name=f"id.{extension1}")
                except Exception:
                    image1 = None 
            if exchanged_item_image2:  
                missing_padding2 = len(exchanged_item_image2) % 4
                if missing_padding2:
                    exchanged_item_image2 += '=' * (4 - missing_padding2)
                base64_data2 = exchanged_item_image2.split('base64,', 1)[-1] if 'base64,' in exchanged_item_image2 else exchanged_item_image2
                try:
                    imgdata2 = base64.b64decode(base64_data2)
                    extension2 = imghdr.what(None, h=imgdata2)
                    if extension2: 
                        image2 = ContentFile(imgdata2, name=f"id.{extension2}")
                except Exception:
                    image2 = None 
            ##End of code modification by Unnati on 25-01-2025
            # Reason-Modification for exchange image        
            ##End of code addition by Unnati on 19-01-2025
            ##Reasn-To decode image
            #End of code addition by Unnati on 27-12-2024
            #Reason-Added exchanged item images
            ##Code added by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            if exchanged_item_image1 in [None,'undefined']:
                exchanged_item_image1 = None
            if exchanged_item_image2 in [None,'undefined']:
                exchanged_item_image2 = None 
            ##End of code addition by Unnati on 03-01-2025
            ##Reason-Added condition for exchange images
            response = ExchangeUsingStripeAPI(self, request,order_item_id,order_id,converted_exchanged_initiated_date,selectedColor,selectedSize,generated_order_id,logo,patches,security_batches,
                                            #   Added by - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                            security_id_on_back,
                                            printed_id,
                                            # End of code - Ashlekh on 19-02-2025
                                            # Reason - To add customization
                                              embroider,customization_comment,after_customization_product_price,quantity,requestType,total_amount,product_instance,sales_rate,amount,logo_price,patches_price,security_batches_price,
                                            #   Added by - Ashlekh on 19-02-2025
                                            #     Reason - To add customization
                                            security_id_on_back_price,
                                            printed_id_price,
                                            #     End of code - Ashlekh on 19-02-2025
                                            #     Reason - To add customization
                                              embroider_price,customization_price,exchange_reason,sale_percentage,subtotal,order_instance,extraAmount,
                                              #Code added by Unnati on 27-12-2024
                                               #Reason-Added exchanged item images
                                               #Code added by Unnati on 27-12-2024
                                               #Reason-Added exchanged item images
                                              image1,image2,
                                              #End of code addition by Unnati on 27-12-2024
                                              #Reason-Added exchanged item images
                                              ##Code added by Unnati on 15-01-2025
                                              ##Reason-Added tax
                                              tax)
                                              ##End of code addition by Unnati on 15-01-2025
                                              ##Reason-Added tax
                                                #End of code addition by Unnati on 27-12-2024
                                                #Reason-Added exchanged item images
            return response
            
        except Exception as e:
            logger.error(e)
            return Response({"status": "error", }, status=500)   
"""
End of code addition by - Unnati on 20-12-2024
Reason - To have API for create exchange through stripe
"""              
"""
Added by - Unnati on 20-12-2024
Reason - To have API for adding tracking details for item being exchanged
"""

class AddExchangeTrackingDetailsAPIView(APIView):
    
    def patch(self, request):
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("orderId")
            exchangeTrackingId = request.data.get("exchangeTrackingId")
            exchangeCourierProviderName = request.data.get("exchangeCourierProviderName")
            order_item = OrderItem.objects.get(id=order_item_id, order_id=order_id)
            order_item.tracking_id = exchangeTrackingId
            order_item.courier_service_provider_name = exchangeCourierProviderName
            order_item.save()
            return Response({"message": "Tracking details added."}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Order item not found"}, 404)
"""
End of addition by - Unnati on 20-12-2024
Reason -To have API for adding tracking details for item being exchanged
"""
"""
Added by - Unnati on 20-12-2024
Reason -To have product details for selected product
"""
class GetProductSizeAndColorAPIView(APIView):
    def get(self, request):
        try:
            order_item_id = request.query_params.get("itemId")
            orderItem=OrderItem.objects.get(id=order_item_id)
            product_row_id=orderItem.product_id
            product_instance =Product.objects.get(id=product_row_id)
            product_id=product_instance.product_id
            products=Product.objects.filter(product_id=product_id)
            serialized_products = ProductSerializer(products, many=True).data
            return Response({"message": "Success","products": serialized_products}, 200)
        except Exception as e:   
            logger.error(f"{e}")
            return Response({"error": "Product not found"}, 404) 
"""
End of code addition by - Unnati on 20-12-2024
Reason -To have product details for selected product
"""        
# Modified by - Ashish Dewangan on 16-12-2024
# Reason - Corrected the code logic
# class CartItemForGuestAPIView(APIView):
#     def post(self, request):
#         try:
#             latest_cart = []
#             cart = request.data
#             if cart and  isinstance(cart, (list,)):
#                 for item in cart:
#                     latest_item = item
#                     product = Product.objects.filter(product_id=item["product_id"],color=item["color"]).first()
#                     if product:
#                         productSerializer = ProductSerializer(product)
#                         latest_item["sales_rate"]=productSerializer.data["sales_rate"]
#                         latest_item["sale_percentage"]=productSerializer.data["sale_percentage"]
#                         latest_item["image1"]=productSerializer.data["image1"]
#                         latest_item["name"]=productSerializer.data["name"]
#                         latest_item["is_active"]=productSerializer.data["is_active"]
#                         latest_item["logo_price"]= productSerializer.data["logo_price"] if item["logo"]==True else ""
#                         latest_item["patches_price"]=productSerializer.data["patches_price"] if item["patches"]==True else ""
#                         latest_item["security_batches_price"]=productSerializer.data["security_batches_price"] if item["security_batches"]==True else ""
#                         latest_item["embroider_price"]=productSerializer.data["embroider_price"] if item["embroider"]==True else ""
#                         # Added by - Ashlekh on 14-12-2024
#                         # Reason - To add description
#                         latest_item["description"]=productSerializer.data["description"]
#                         # End of code - Ashlekh on 14-12-2024
#                         # Reason - To add description

#                         latest_item["show_patches_and_embroider_on_UI"]=productSerializer.data["show_patches_and_embroider_on_UI"]

#                         sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
#                         sale_rate_after_discount = float(
#                                     product.sales_rate) - (float(product.sales_rate) * (sale_percentage/100))
#                         after_customization_product_price=0
#                         after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else product.sales_rate
#                         print("working till now")
#                         if item["logo"]==True:
#                             try:
#                                 extra_charge = float(productSerializer.data["logo_price"])
#                                 after_customization_product_price += extra_charge
#                             except :
#                                 extra_charge = 0.0 
#                                 after_customization_product_price += extra_charge
#                         if item["patches"]==True:
#                             try:
#                                 extra_charge = float(productSerializer.data["patches_price"])
#                                 after_customization_product_price += extra_charge
#                             except :
#                                 extra_charge = 0.0 
#                                 after_customization_product_price += extra_charge
#                         if item["security_batches"]==True:
#                             try:
#                                 extra_charge = float(productSerializer.data["security_batches_price"])
#                                 after_customization_product_price += extra_charge
#                             except :
#                                 extra_charge = 0.0 
#                                 after_customization_product_price += extra_charge
#                         if item["embroider"]==True:
#                             try:
#                                 extra_charge = float(productSerializer.data["embroider_price"])
#                                 after_customization_product_price += extra_charge
#                             except :
#                                 extra_charge = 0.0 
#                                 after_customization_product_price += extra_charge

#                         print("after_customization_product_price",after_customization_product_price)
#                         if item["logo"]==True or item["patches"]==True or item["security_batches"]==True or item["embroider"]==True:            
#                             latest_item["after_customization_product_price"]=after_customization_product_price

#                         latest_cart.append(latest_item)
        
#                 return Response({"msg": "success", "products": latest_cart}, 200)
#             else:
#                 return Response({"msg": "success", "products": []}, 200)
#         except Exception as e:
#             logger.error(f"{e}")
#             return Response({"error": "Something went wrong"})
        

class LatestDetailsOfCartItemsAPIView(APIView):
    def post(self, request):
        try:
            latest_cart = []
            cart = request.data
            if cart and  isinstance(cart, (list,)):
                for item in cart:
                    latest_item = item
                    product = Product.objects.filter(product_id=item["product_id"],color=item["color"]).first()
                    if product:
                        productSerializer = ProductSerializer(product)
                        latest_item["sales_rate"]=productSerializer.data["sales_rate"]
                        latest_item["sale_percentage"]=productSerializer.data["sale_percentage"]
                        latest_item["image1"]=productSerializer.data["image1"]
                        latest_item["name"]=productSerializer.data["name"]
                        latest_item["is_active"]=productSerializer.data["is_active"]
                        latest_item["logo_price"]= productSerializer.data["logo_price"] if item["logo"]==True else ""
                        latest_item["patches_price"]=productSerializer.data["patches_price"] if item["patches"]==True else ""
                        latest_item["security_batches_price"]=productSerializer.data["security_batches_price"] if item["security_batches"]==True else ""
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        latest_item["security_id_on_back_price"]=productSerializer.data["security_id_on_back_price"] if item["security_id_on_back"]==True else ""
                        latest_item["printed_id_price"]=productSerializer.data["printed_id_price"] if item["printed_id"]==True else ""
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        latest_item["embroider_price"]=productSerializer.data["embroider_price"] if item["embroider"]==True else ""
                        # Added by - Ashlekh on 14-12-2024
                        # Reason - To add description
                        latest_item["description"]=productSerializer.data["description"]
                        # End of code - Ashlekh on 14-12-2024
                        # Reason - To add description

                        latest_item["show_patches_and_embroider_on_UI"]=productSerializer.data["show_patches_and_embroider_on_UI"]

                        sale_percentage = product.sale_percentage if product.sale_percentage is not None else 0
                        sale_rate_after_discount = float(
                                    product.sales_rate) - (float(product.sales_rate) * (sale_percentage/100))
                        after_customization_product_price=0
                        after_customization_product_price= sale_rate_after_discount if sale_rate_after_discount>0 else product.sales_rate
                        if item["logo"]==True:
                            try:
                                extra_charge = float(productSerializer.data["logo_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge
                        if item["patches"]==True:
                            try:
                                extra_charge = float(productSerializer.data["patches_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge
                        if item["security_batches"]==True:
                            try:
                                extra_charge = float(productSerializer.data["security_batches_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge
                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        if item["security_id_on_back"]==True:
                            try:
                                extra_charge = float(productSerializer.data["security_id_on_back_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge

                        if item["printed_id"]==True:
                            try:
                                extra_charge = float(productSerializer.data["printed_id_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        if item["embroider"]==True:
                            try:
                                extra_charge = float(productSerializer.data["embroider_price"])
                                after_customization_product_price += extra_charge
                            except :
                                extra_charge = 0.0 
                                after_customization_product_price += extra_charge

                        # Added by - Ashlekh on 19-02-2025
                        # Reason - To add customization
                        # if item["logo"]==True or item["patches"]==True or item["security_batches"]==True or item["embroider"]==True: 
                        if item["logo"]==True or item["patches"]==True or item["security_batches"]==True or item["embroider"]==True or item["security_id_on_back"]==True or item["printed_id"]==True: 
                        # End of code - Ashlekh on 19-02-2025
                        # Reason - To add customization           
                            latest_item["after_customization_product_price"]=after_customization_product_price

                        latest_cart.append(latest_item)
        
                return Response({"msg": "success", "products": latest_cart}, 200)
            else:
                return Response({"msg": "success", "products": []}, 200)
        except Exception as e:
            logger.error(f"{e}")
            return Response({"error": "Something went wrong"})

# End of modification by - Ashish Dewangan on 16-12-2024
# Reason - Corrected the code logic
                
"""
End of addition by - Ashish Dewangan on 12-12-2024
Reason - API to get latest details of items in cart for guest user
"""

        
# Added by - Ashish Dewangan on 18-12-2024
# Reason - To check if a product is inactive

def get_inactive_parent_category_hierarchy(category,hierarchy):
    # Modified by - Ashish Dewangan on 19-12-2024
    # Reason - To handle none exception
    # try:
    #     parent = Category.objects.get(id=category.parent_id.id)
    #     if parent.is_active==False:
    #         hierarchy.append(parent)
    #         get_inactive_parent_category_hierarchy(parent,hierarchy)
    #     return hierarchy    
    # except Exception as e:
    #     return hierarchy
    try:
        if category.is_active == False:
            hierarchy.append(category.id)
        else:
            if category.parent_id is not None:
                parent = Category.objects.get(id=category.parent_id.id)
                get_inactive_parent_category_hierarchy(parent, hierarchy)
        return hierarchy
    except Exception as e:
        print(e)
        logger.error(f"{e}")
        return Response({"error": "something went wrong"}, 400)    
    # End of modification by - Ashish Dewangan on 19-12-2024
    # Reason - To handle none exception

class CheckProductAvailability(APIView):
    def get(self,request):
        try:
            hierarchy = []
            product_id = request.query_params.get("product_id")
            color = request.query_params.get("color")
            product = Product.objects.get(product_id=product_id,color=color)
            category = product.category
            hierarchy=get_inactive_parent_category_hierarchy(category,hierarchy)
            if category.is_active == False or len(hierarchy)>0:
                return Response({"is_product_available":False},200)
            if product.is_active==True:    
                return Response({"is_product_available":True},200)
            
            related_active_products = Product.objects.filter(Q(product_id=product_id),~Q(id=product.id),Q(is_active=True))
            if(len(related_active_products)>0):
                return Response({"is_product_available":True},200) 
            else:
                return Response({"is_product_available":False},200) 
        except Exception as e:
            logger.error(e)
            return Response(400)
        
# End of addition by - Ashish Dewangan on 18-12-2024
# Reason - To check if a product is inactive

"""
# Added by - Ashlekh on 18-12-2024
# Reason - API to check quantity when user clicks on +/- from ViewCart
"""
class UpdateQuantityInViewCartAPIView(APIView):
    def post(self, request):
        try:
            product_row_id = request.data.get("productId")
            quantity = request.data.get("newQuantity")
            size = request.data.get("size")
            color = request.data.get("color")
            product = Product.objects.get(id=product_row_id, color=color)
            productSerializer = ProductSerializer(product)
            available_quantity = 0
            product_data = productSerializer.data
            if size in product_data:
                available_quantity = product_data[size]
            
            if available_quantity is None or available_quantity == 0:
                return Response({
                    "message": "quantity_exceeds",
                    "quantity": "0",
                }, status=200)
            if quantity == 0:
                return Response({
                    "message": "Quantity cannot be less than one",
                    "quantity": "0",
                }, status=200)
            if quantity <= available_quantity:
                return Response({"message": "Success", "quantity": quantity}, status=200)
            else:
                return Response({"message": "Quantity exceeds", "quantity": available_quantity}, status=200)
        except Exception as e:
            print("error", e)
            logger.error(f"{e}")
            return Response({"message": "Something went wrong"}, status=500)
"""
# End of code - Ashlekh on 18-12-2024
# Reason - API to check quantity when user clicks on +/- from ViewCart
"""
"""
Code added by Unnati on 27-12-2024
Reason-API to cancel item
"""
class CancelItemAPIView(APIView):
    def post(self,request):
        try:
            order_item_id = request.data.get("ItemId")
            order_id = request.data.get("order")
            order_item_cancellation_time = request.data.get("OrderItemCancellationTime")
            order_cancellation_reason = request.data.get("cancellationReason")
            datetime_format = "%m/%d/%Y, %I:%M:%S %p"
            converted_cancellation_time = datetime.strptime(
                order_item_cancellation_time, datetime_format)
            size=request.data.get("size")
            quantity=request.data.get("quantity")
            color=request.data.get("color")
            amount=request.data.get("amount")
            product_id=request.data.get("product_id")
            sales_rate=request.data.get("sales_rate")
            # subtotal=request.data.get("subtotal")
            subtotal = Decimal(request.data.get("subtotal", 0)) 
            tax_percentage = Decimal(sales_tax)
            ##Code modified by Unnati on 15-01-2025
            ##Reason-Added round off
            tax = round((tax_percentage / Decimal('100')) * subtotal,2)
            ##End of code modication by Unnati on 15-01-2025
            ##Reason-Added round off
            total_amount=request.data.get("total_amount")
            sale_percentage=request.data.get("sale_percentage")
            product_instance = Product.objects.filter(product_id=product_id,color=color).first()
            order_instance = Order.objects.filter(id=order_id).first()
            order_items=OrderItem.objects.create(
                order=order_instance,
                product=product_instance,
                size=size,
                quantity=quantity,
                color=color,
                sales_rate=sales_rate,
                amount=amount,
                item_status="Cancelled",
                invoice_id=generate_invoice_number(),
                type="Cancelled",
                sale_percentage=sale_percentage,
                subtotal=subtotal,
                total_amount=total_amount,
                tracking_id="",
                courier_service_provider_name="",  
                parent_id=order_item_id,
                cancel_reason=order_cancellation_reason,
                cancelled_at=converted_cancellation_time,
                cancelled_by="User",
                ##Code added by Unnati on 19-01-2025
                ##Added tax
                tax_percentage=tax,
                ##End of code addition by Unnati on 19-01-2025
                ##Added tax
            )
            orderItemSerializer = OrderItemSerializer(order_items).data
            return Response({"success": "Order processed successfully","order_item":orderItemSerializer}, 200)
        except Exception as e:
            print("error", e)
            logger.error(f"{e}")
            return Response({"message": "Something went wrong"},500)    
"""
End of code addition by Unnati on 27-12-2024
Reason-API to cancel item
"""        

"""
# Added by - Ashlekh on 01-01-2025
# Reason - To post feedback details
"""
class FeedBackRequestAPIView(APIView):
    def post(self, request):
        try:
            rating = request.data.get('rating')
            content = request.data.get('content')
            name = request.data.get('name')
            email = request.data.get('email')
            product_id = request.data.get('productId')
            product = Product.objects.filter(product_id=product_id).first()
            new_feedback_data = {
                "product": product.id,
                "rating": rating,
                "content": content,
                "name": name,
                "email": email,
            }
            feedBackRequestSerializer = FeedBackRequestSerializer(data=new_feedback_data)
            if feedBackRequestSerializer.is_valid(raise_exception=True):
                feedBackRequestSerializer.save()

            # Added by - Ashlekh on 14-01-2025
            # Reason - To track count of each rating (1 to 5)
            total_five_star_rating = 0
            total_four_star_rating = 0
            total_three_star_rating = 0
            total_two_star_rating = 0
            total_one_star_rating = 0
            # End of code - Ashlekh on 14-01-2025
            # Reason - To track count of each rating (1 to 5)
            
            # Added by - Ashlekh on 04-01-2025
            # Reason - To calculate the average rating, the total number of ratings, and include rating data in the response.
            total_rating = 0
            total_count = 0
            average_rating = 0
            feedback_data = []
            all_feedback_products = FeedBackRequest.objects.all()
            for feedback_product in all_feedback_products:
                identifier = feedback_product.product.product_id if feedback_product.product else None
                if identifier == product_id:
                    total_rating = total_rating + feedback_product.rating
                    total_count = total_count + 1
                    feedback_data.append({
                        "rating": feedback_product.rating,
                        "content": feedback_product.content,
                        "name": feedback_product.name,
                        "email": feedback_product.email,
                        # Added by - Ashlekh on 13-02-2025
                        # Reason - To add created_at date
                        "created_at": feedback_product.created_at,
                        # End of code - Ashlekh on 13-02-2025
                        # Reason - To add created_at date
                    })
                    # Added by - Ashlekh on 14-01-2025
                    # Reason - To increase count of rating
                    if feedback_product.rating == 5.00:
                        total_five_star_rating = total_five_star_rating + 1
                    elif feedback_product.rating == 4.00:
                        total_four_star_rating = total_four_star_rating + 1
                    elif feedback_product.rating == 3.00:
                        total_three_star_rating = total_three_star_rating + 1
                    elif feedback_product.rating == 2.00:
                        total_two_star_rating = total_two_star_rating + 1
                    elif feedback_product.rating == 1.00:
                        total_one_star_rating = total_one_star_rating + 1
                    # End of code - Ashlekh on 14-01-2025
                    # Reason - To increase count of rating
            
            if total_count > 0:
                average_rating = total_rating / total_count
                # Added by - Ashlekh on 07-01-2025
                # Reason - To round off average rating upto 1 digit after decimal
                average_rating = round(average_rating, 1)
                # End of code - Ashlekh on 07-01-2025
                # Reason - To round off average rating upto 1 digit after decimal
            
            feedback_data_count = len(feedback_data)
            # End of code - Ashlekh on 04-01-2025
            # Reason - To calculate the average rating, the total number of ratings, and include rating data in the response.
            return Response({"message": "Saved successfully",
                             # Added by - Ashlekh on 04-01-2025
                             # Reason - To send average rating, feedback data & feedback count in response
                            "average_rating": average_rating,
                            "feedback_data": feedback_data,
                            "feedback_data_count": feedback_data_count,
                             # End of code - Ashlekh on 04-01-2025
                             # Reason - To send average rating, feedback data & feedback count in response
                             # Added by - Ashlekh on 14-01-2025
                             # Reason - To send rating_count in response
                            "total_five_star_rating": total_five_star_rating,
                            "total_four_star_rating": total_four_star_rating,
                            "total_three_star_rating": total_three_star_rating,
                            "total_two_star_rating": total_two_star_rating,
                            "total_one_star_rating": total_one_star_rating,
                             # End of code - Ashlekh on 14-01-2025
                             # Reason - To send rating_count in response
                             }, status=200)
        except Exception as e:
            print("Error in FeedBackRequestAPIView", e)
            logger.error(f"An error occurred: {e}")
            return Response({"error": "Something went wrong"}, status=500)
"""

# End of code - Ashlekh on 01-01-2025
# Reason - To post feedback details
"""
"""
Added by - Unnati on 05-01-2024
Reason -To have product details for selected product
"""
class GetProductDetailsAPIView(APIView):
    def get(self, request):
        try:
            product_id = request.query_params.get("product_id")
            color=request.query_params.get("color")
            products=Product.objects.filter(product_id=product_id)
            serialized_products = ProductSerializer(products, many=True).data
            return Response({"message": "Success","products": serialized_products}, 200)
        except Exception as e:   
            logger.error(f"{e}")
            return Response({"error": "Product not found"}, 404) 
"""
End of code addition by - Unnati on 05-01-2024
Reason -To have product details for selected product
""" 
"""
Added by - Unnati on 09-01-2024
Reason -To have order Items
"""
class OrderItemsAPIView(APIView):
    def get(self, request):
        try:
            # Code added and modified by - Ashlekh on 07-02-2025
            # Reason - To filter details using user_id
            user_id = request.query_params.get("userId")
            # order=Order.objects.all().order_by("-id")
            order=Order.objects.filter(user=user_id).order_by("-id")
            # End of code - Ashlekh on 07-02-2025
            # Reason - To filter details using user_id
            ##Code modified by Unnati on 20-01-2025
            ##Reason-Modified order by id
            # order_item=OrderItem.objects.all().order_by("-id")
            order_item=OrderItem.objects.all().order_by("id")
            ##End of code modification by Unnati on 20-01-2025
            ##Reason-Modified order by id
            orderSerializer=OrderSerializer(order,many=True).data
            orderItemSerializer = OrderItemSerializer(order_item, many=True).data
            return Response({"message": "Success","order_items": orderItemSerializer,"orders":orderSerializer}, 200)
        except Exception as e:   
            logger.error(f"{e}")
            return Response({"error": "Order items not found"}, 404) 
"""
End of code addition by - Unnati on 09-01-2024
Reason -To have order Items
"""        


class BannerListAPIView(APIView):
    def get(self, request):
        banners = Banner.objects.all()
        serializer = BannerSerializer(banners, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
