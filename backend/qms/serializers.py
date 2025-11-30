# qms/serializers.py (Recommended structure)
from rest_framework import serializers
from .models import Quiz, Question, Result # Make sure you import all models

# 1. Quiz Serializer (Assuming this one is already correct)
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

# 2. Question Serializer (The missing one)
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        # Include necessary fields, e.g., 'quiz', 'text', 'question_type'
        fields = '__all__' 

# 3. Result Serializer (You are also importing this one)
class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        # Include fields like 'user', 'quiz', 'score', 'date_taken'
        fields = '__all__'