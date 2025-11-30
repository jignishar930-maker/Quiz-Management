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
# 'include' અહીંયા જ આયાત થઈ ગયું છે, તેથી નીચેની લાઇન બિનજરૂરી છે:
# from django.urls import include 

urlpatterns = [
    # Django Admin Interface
    path('admin/', admin.site.urls),
    
    # 🔑 Djoser/JWT Authentication URLs: Registration, Login, User Details, etc.
    # Djoser URLs (Registration, Activation, Password Reset)
    path('api/auth/', include('djoser.urls')),
    # JWT Token URLs (Login/Create Token, Refresh Token)
    path('api/auth/', include('djoser.urls.jwt')), 
    
    # 📝 Quiz Management System URLs
    path('api/qms/', include('qms.urls')),
]