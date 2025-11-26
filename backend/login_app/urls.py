# backend/login_app/urls.py

from django.urls import path
from .views import LoginView

urlpatterns = [
    # /api/login/ એન્ડપોઇન્ટ
    path('login/', LoginView.as_view(), name='login'),
]