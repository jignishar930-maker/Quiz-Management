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
        help_text='Defines the role of the user (Student or Teacher).'
    )
    

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Quiz(models.Model):
    # 2. 'User' ને બદલે settings.AUTH_USER_MODEL નો ઉપયોગ કરો
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, # અહીં સુધારો કરો
        on_delete=models.CASCADE
    )
    # ...

class Result(models.Model):
    # 2. 'User' ને બદલે settings.AUTH_USER_MODEL નો ઉપયોગ કરો
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, # અહીં સુધારો કરો
        on_delete=models.CASCADE
    )