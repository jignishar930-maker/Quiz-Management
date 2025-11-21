# qms/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Quiz, Question
from .serializers import QuizSerializer, QuestionSerializer
from .permissions import IsTeacher

class QuizViewSet(viewsets.ModelViewSet):
    """
    ક્વિઝ બનાવવા, જોવા, એડિટ કરવા અને ડિલીટ કરવા માટેનો API (ફક્ત ટીચર માટે).
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    # પરવાનગી: યુઝર લોગિન થયેલો હોવો જોઈએ અને રોલ 'teacher' હોવો જોઈએ
    permission_classes = [IsAuthenticated, IsTeacher] 

    # જ્યારે ક્વિઝ બનાવવામાં આવે ત્યારે created_by ફિલ્ડમાં યુઝરને ઓટોમેટિકલી સેટ કરો
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):
    """
    પ્રશ્નો મેનેજ કરવા માટેનો API (ફક્ત ટીચર માટે).
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsTeacher]