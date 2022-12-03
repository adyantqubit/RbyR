
from django.contrib import admin
from django.urls import path,include
from back_site import views
import back_site.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('back_site.urls'))

]
