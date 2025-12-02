from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import RegisterView

urlpatterns = [
    # 1. Login Endpoint (access અને refresh tokens મેળવવા માટે)
    # /api/auth/token/
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 2. Token Refresh Endpoint (નવા access token મેળવવા માટે)
    # /api/auth/token/refresh/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 3. Token Verify Endpoint (token માન્ય છે કે નહીં તે ચકાસવા માટે)
    # /api/auth/token/verify/
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # 4. User Registration Endpoint
    # /api/auth/register/
    path('register/', RegisterView.as_view(), name='register'),
]