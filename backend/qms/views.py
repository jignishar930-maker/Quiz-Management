from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Quiz, Question, Option, Result, StudentAnswer, UserProfile
from .serializers import (
    QuizSerializer, 
    QuestionSerializer, 
    ResultSerializer,
    # Add other serializers if you have them, e.g., OptionSerializer
)

# --- 1. ViewSets for CRUD Operations ---

# Quiz ViewSet: Allows anyone to view, but only logged-in users to create/edit
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    # Permission: Allows reading (GET) for everyone, but writing for authenticated users only.
    permission_classes = [IsAuthenticatedOrReadOnly] 
    
    # Automatically set the user who creates the quiz
    def perform_create(self, serializer):
        # We assume the 'created_by' field in the Quiz model is linked to User
        serializer.save(created_by=self.request.user)


# Question ViewSet: Allowing everyone to view questions is usually fine for a quiz app
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny] 
    

# --- 2. Generic Views (You can keep these, but they are often optional) ---

class AvailableQuizzesView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

class SubmitQuizView(generics.CreateAPIView):
    # Permission: Submitting a quiz result usually requires the user to be logged in
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated] 
    
    # Logic to calculate and save the score would go here
    # def perform_create(self, serializer):
    #     # ... scoring logic ...
    #     serializer.save(user=self.request.user, score=calculated_score)

    # Submit Quiz View: Handles POST request for quiz submission
class SubmitQuizView(generics.CreateAPIView):
    # આ ResultSerializer માં સ્કોરિંગ લોજિક છે
    serializer_class = ResultSerializer
    # ક્વિઝ સબમિટ કરવા માટે યુઝરનો લોગઇન હોવો જરૂરી છે
    permission_classes = [IsAuthenticated]