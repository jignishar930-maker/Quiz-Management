from django.db import models
from django.contrib.auth.models import User

# --- મોડેલ: ક્વિઝ (Quiz) ---
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

# --- મોડેલ: પ્રશ્ન (Question) ---
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    
    def __str__(self):
        return self.text

# --- મોડેલ: વિકલ્પો (Option) ---
class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return self.text

# qms/models.py માં બાકીના મોડેલ ક્લાસ ઉમેરો

# --- મોડેલ: પરિણામ (Result) ---
class Result(models.Model):
    # અહીં તમે User મોડેલનો ઉપયોગ કરી શકો છો જો તમે તેને import કર્યો હોય
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.quiz.title} - Score: {self.score}'

# --- મોડેલ: વિદ્યાર્થીનો જવાબ (StudentAnswer) ---
class StudentAnswer(models.Model):
    result = models.ForeignKey(Result, related_name='student_answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    # Student જવાબ માટે Option મોડેલનો ઉપયોગ કરી શકે છે
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.result.user.username} answered {self.question.text[:20]}...'

# qms/models.py માં UserProfile મોડેલ ઉમેરો

# યુઝરના પ્રકારો (choices)
USER_TYPE_CHOICES = (
    ('student', 'Student'),
    ('teacher', 'Teacher'),
)

class UserProfile(models.Model):
   
    
    # યુઝરનો પ્રકાર સ્ટોર કરવા માટે
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
  
    # 'related_name' ઉમેર્યું
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='qms_profile')

    def __str__(self):
        return self.user.username