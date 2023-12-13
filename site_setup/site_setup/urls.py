
from django.contrib import admin
from django.urls import path,include
from back_site import views
import back_site.views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # Added by - Ashish Dewangan on 13-12-2023
    # Reason - Added routes for pending and completed orders
    # path('admin/back_site/pending_orders/',TemplateView.as_view(template_name="admin/pending_orders.html"),name="pending_orders"),
    path('admin/pending_orders/',TemplateView.as_view(template_name="admin/pending_orders.html"),name="pending_orders"),
    # path('admin/back_site/completed_orders/',TemplateView.as_view(template_name="admin/completed_orders.html"),name="completed_orders"),
    path('admin/completed_orders/',TemplateView.as_view(template_name="admin/completed_orders.html"),name="completed_orders"),
    # End of code addition by - Ashish Dewangan on 13-12-2023
    # Reason - Added routes for pending and completed orders
    
    path('admin/', admin.site.urls),
    path('api/',include('back_site.urls')),
]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)   
