from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # રોલ માટે ચોઈસ
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    
    # રોલ ફીલ્ડ ઉમેરો, ડિફોલ્ટ રોલ 'student' સેટ કરો
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='student',
        verbose_name='User Role'
    )
    
    # યુઝર મોડેલને રિક્વાયરમેન્ટ મુજબ એડિટ કરો (અહીં માત્ર role ઉમેર્યો છે)
    # email = models.EmailField(unique=True)
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

