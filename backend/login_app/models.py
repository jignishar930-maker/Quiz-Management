from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    યુઝરના રોલ (role) જેવી વધારાની માહિતી સ્ટોર કરવા માટે મોડેલ.
    """
    USER_ROLES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # ડિફોલ્ટ રોલ 'student' સેટ કરીએ છીએ
    role = models.CharField(max_length=10, choices=USER_ROLES, default='student')
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"