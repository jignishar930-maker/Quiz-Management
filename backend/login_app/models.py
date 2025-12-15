# login_app/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
# અહીં settings ઈમ્પોર્ટ કરવાની જરૂર નથી કારણ કે તે કસ્ટમ યુઝર મોડેલમાં વપરાતું નથી.

class User(AbstractUser):
    """
    AbstractUser માંથી ઇનહેરિટ કરીને કસ્ટમ યુઝર મોડેલ.
    """
    
    # યુઝર રોલ માટે ચોઈસ
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    
    # રોલ ફીલ્ડ ઉમેરો, ડિફોલ્ટ રોલ 'student' સેટ કરો
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='student',
        verbose_name='User Role',
        help_text='Defines the role of the user (Student or Teacher).'
    )
    
    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

# ડુપ્લિકેટ Quiz અને Result મોડેલો અહીંથી દૂર કરવામાં આવ્યા છે.