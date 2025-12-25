from rest_framework import serializers
from .models import Quiz, Question, Option, Result
from django.contrib.auth import get_user_model

# Get the custom user model
CustomUser = get_user_model()

# ==========================================================
# BASE SERIALIZERS
# ==========================================================

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username')

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'total_questions', 'passing_score', 'created_at', 'questions_count']
        
    def get_questions_count(self, obj):
        return obj.questions.count()

# ==========================================================
# RESULT SERIALIZER (તમારા રિઝલ્ટ પેજ માટે)
# ==========================================================

class ResultSerializer(serializers.ModelSerializer):
    quiz_title = serializers.ReadOnlyField(source='quiz.title')
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Result
        fields = ['id', 'quiz_title', 'user_username', 'score', 'total_questions', 'percentage', 'completed_at']

# ==========================================================
# QUIZ ATTEMPT SERIALIZERS (પ્રશ્નોના જવાબ છુપાવવા માટે)
# ==========================================================

class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']

class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'options']

class QuizAttemptSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions', 'questions_count']

    def get_questions_count(self, obj):
        return obj.questions.count()

class AnswerSubmissionSerializer(serializers.Serializer):
    question = serializers.IntegerField()
    selected_option = serializers.IntegerField()