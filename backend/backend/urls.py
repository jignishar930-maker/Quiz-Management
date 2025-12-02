"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

"""
URL configuration for backend project.
"""

# 💡 સુધારો: 'include' ને માત્ર એક જ વાર આયાત કરો
from django.contrib import admin
from django.urls import path, include
from login_app.views import index_view # NEW: index_view ને import કરો

urlpatterns = [
    # NEW: રુટ URL (/) ને login_app ના index_view સાથે જોડો
    path('', index_view, name='home'),
    
    path('admin/', admin.site.urls),
    
    # Auth URLs (Provided by Simple JWT/DRF Auth, if you set them up)
    # Note: These paths should match whatever you are using in your project setup
    path('api/auth/', include('rest_framework.urls')), # For browsable API login/logout
    path('api/auth/', include('login_app.urls')), # For registration, token management etc.

    # Quiz Management System URLs
    path('api/qms/', include('qms.urls')),
]