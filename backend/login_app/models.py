from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    # અહીં 'related_name' અલગ હોવો જોઈએ, દા.ત. 'login_profile'
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='login_profile') 
    
    # ... login_app ને સંબંધિત અન્ય ફિલ્ડ્સ
    # દા.ત.: phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username