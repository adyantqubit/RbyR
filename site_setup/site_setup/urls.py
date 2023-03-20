
from django.contrib import admin
from django.urls import path,include
from back_site import views
import back_site.views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('back_site.urls')),
]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)   
