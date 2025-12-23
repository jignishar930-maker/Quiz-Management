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
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin પેનલ
    path('admin/', admin.site.urls),
    
    # Authentication (Browsing login/logout)
    path('api/auth/', include('rest_framework.urls')),
    
    # Registration અને Login એપના URLs
    path('api/auth/', include('login_app.urls')),

    # ✅ Quiz Management System (QMS) URLs
    # આ લાઇન ઉપરની 'qms/urls.py' ને પ્રોજેક્ટ સાથે જોડે છે
    path('api/qms/', include('qms.urls')),
    
    # JWT Token મેળવવા અને રિફ્રેશ કરવા માટે
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]