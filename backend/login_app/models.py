from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # રોલ પસંદગી માટેના વિકલ્પો
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

# જો તમારું મોડેલનું નામ આનાથી અલગ હોય (દા.ત. User_Profile), 
# તો તેને 'UserProfile' કરો અથવા 'admin.py' માં નામ સુધારો.