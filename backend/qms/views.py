from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Quiz, Question, Option, Result, StudentAnswer, UserProfile
from .serializers import (
    QuizSerializer, 
    QuestionSerializer, 
    ResultSerializer,
)

# --- 1. ViewSets for CRUD Operations ---

class QuizViewSet(viewsets.ModelViewSet):
    """
    Allows viewing, creating, updating, and deleting Quizzes.
    Read-only access for anyone; Write access only for authenticated users.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Corrected Indentation
    
    def perform_create(self, serializer):
        # Automatically set the user who creates the quiz
        serializer.save(created_by=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):
    """
    Allows full access (CRUD) to Questions.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny] 
    

# --- 2. Generic Views for Custom Actions ---

class AvailableQuizzesView(generics.ListAPIView):
    """
    Lists all available Quizzes.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

class SubmitQuizView(generics.CreateAPIView):
    """
    Handles POST requests for quiz submission and result creation.
    Requires the user to be authenticated.
    """
    serializer_class = ResultSerializer # Corrected Indentation
    permission_classes = [IsAuthenticated] 
    
    # Note: You will need to add logic here to calculate the score 
    # before saving the result object.
    # def perform_create(self, serializer):
    #     # scoring logic goes here
    #     serializer.save(user=self.request.user, score=calculated_score)