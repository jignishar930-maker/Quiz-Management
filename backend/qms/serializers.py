from rest_framework import serializers
from .models import Quiz, Question, Option, Result
from django.contrib.auth import get_user_model

# Get the custom user model (e.g., if you are using CustomUser)
CustomUser = get_user_model()


# ==========================================================
# BASE SERIALIZERS (Usually for Admin/Management Views)
# ==========================================================

# --- User Serializer ---
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username')

# --- Option Serializer (Full Details) ---
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        # Includes 'is_correct' - for admin/post-result views
        fields = ['id', 'text', 'is_correct']

# --- Question Serializer (Full Details) ---
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'options', 'type']

# --- Quiz Serializer (List/Detail without Questions) ---
class QuizSerializer(serializers.ModelSerializer):
    # આ ફિલ્ડ ક્વિઝમાં કેટલા પ્રશ્નો છે તે ગણે છે
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        # ✅ સુધારો: 'duration' ફિલ્ડ દૂર કર્યું.
        fields = ['id', 'title', 'description', 'total_questions', 'passing_score', 'created_at', 'questions_count']
        
    def get_questions_count(self, obj):
        # Assumes the related name on the Quiz model for questions is 'questions'
        return obj.questions.count()

# --- Result Serializer ---
class ResultSerializer(serializers.ModelSerializer):
    quiz_title = serializers.ReadOnlyField(source='quiz.title')
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Result
        fields = ['id', 'user', 'user_username', 'quiz', 'quiz_title', 'score', 'percentage', 'created_at']


# ==========================================================
# QUIZ ATTEMPT SERIALIZERS (Hiding the correct answer)
# ==========================================================

# 1. Option Serializer for Quiz Attempt (NO 'is_correct' field)
class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        # SECURITY NOTE: We explicitly exclude 'is_correct' here to prevent cheating.
        fields = ['id', 'text']

# 2. Question Serializer for Quiz Attempt (Uses QuizOptionSerializer)
class QuizQuestionSerializer(serializers.ModelSerializer):
    # Use the new QuizOptionSerializer
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        # Fields necessary for the user to attempt the question.
        fields = ['id', 'text', 'options']

# 3. Quiz Serializer for Quiz Attempt (Includes the full questions list)
class QuizAttemptSerializer(serializers.ModelSerializer):
    # Use the new QuizQuestionSerializer to nest the questions
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        # ✅ સુધારો: 'duration' ફિલ્ડ અહીંથી પણ દૂર કર્યું.
        fields = ['id', 'title', 'description', 'questions']

# --- Answer Submission Serializer (for POST request) ---
class AnswerSubmissionSerializer(serializers.Serializer):
    question = serializers.IntegerField() # ID of the question
    selected_option = serializers.IntegerField() # ID of the selected option
    
    # આનો ઉપયોગ QuizAttemptView માં સબમિશન ડેટાને વેલિડેટ કરવા માટે થાય છે.