# qms/models.py

from django.db import models
from django.conf import settings # settings.AUTH_USER_MODEL માટે જરૂરી છે

# -----------------
# CORE QUIZ MODELS
# -----------------

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    total_questions = models.IntegerField(default=0)
    passing_score = models.IntegerField(default=0) # ટકાવારીમાં અથવા સ્કોરમાં
    

    # settings.AUTH_USER_MODEL નો ઉપયોગ અને ક્લેશ ટાળવા માટે unique related_name
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='created_quizzes' # ✅ related_name સુધારો
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    
    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return self.text

# -----------------
# RESULT MODELS
# -----------------

class Result(models.Model):
    # settings.AUTH_USER_MODEL નો ઉપયોગ અને ક્લેશ ટાળવા માટે unique related_name
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='quiz_results' # ✅ related_name સુધારો
    ) 
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField()
    percentage = models.FloatField(default=0.0)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # ખાતરી કરો કે self.user.username ઉપલબ્ધ છે
        try:
            username = self.user.username
        except:
            username = "Deleted User"
        return f'{username} - {self.quiz.title} - Score: {self.score}'

class StudentAnswer(models.Model):
    result = models.ForeignKey(Result, related_name='student_answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.result.user.username} answered {self.question.text[:20]}...'

# -----------------
# USER PROFILE (જો જરૂર હોય તો)
# -----------------

USER_TYPE_CHOICES = (
    ('student', 'Student'),
    ('teacher', 'Teacher'),
)

class UserProfile(models.Model):
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    
    # settings.AUTH_USER_MODEL નો ઉપયોગ અને ક્લેશ ટાળવા માટે unique related_name
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='qms_profile' # ✅ related_name સુધારો (જો અગાઉ ન હોય તો)
    )

    def __str__(self):
        return self.user.username