from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # Access અને Refresh ટોકન મેળવવા માટે (લોગિન)
    TokenRefreshView,    # Access ટોકનને રિફ્રેશ કરવા માટે
)

urlpatterns = [
    # લોગિન URL: આ યુઝરનેમ અને પાસવર્ડ સ્વીકારશે અને ટોકન આપશે
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # ટોકન રિફ્રેશ URL: એક્સેસ ટોકન સમાપ્ત થઈ જાય ત્યારે નવું ટોકન મેળવવા માટે
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]