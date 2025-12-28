from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Quiz, Question, Option, Result
from .serializers import (
    QuizSerializer, QuestionSerializer, OptionSerializer, 
    ResultSerializer, QuizQuestionSerializer, QuizAttemptSerializer
)

# --- Standard ViewSets ---

class QuizViewSet(viewsets.ModelViewSet):
    """
    ક્વિઝનું લિસ્ટ જોવા અને મેનેજ કરવા માટે.
    """
    queryset = Quiz.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return QuizSerializer
        return QuizAttemptSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAdminUser]

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAdminUser]

class ResultViewSet(viewsets.ModelViewSet):
    # જો completed_at ન હોય તો '-id' વાપરો જેથી એરર ન આવે
    queryset = Result.objects.all().order_by('-id') 
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # એડમિન બધાના રિઝલ્ટ જોઈ શકે, યુઝર ફક્ત પોતાના
        if self.request.user.is_staff:
            return Result.objects.all().order_by('-id')
        return Result.objects.filter(user=self.request.user).order_by('-id')

# ==========================================================
# Quiz Attempt and Scoring Logic
# ==========================================================

class QuizQuestionListView(APIView):
    """
    ચોક્કસ ક્વિઝના બધા પ્રશ્નો મેળવવા માટે.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, quiz_id, format=None):
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
            # ડ્યુરેશન મોકલવું જરૂરી છે જો React માં ટાઈમર વાપરવું હોય
            quiz_duration = getattr(quiz, 'duration', 10) 
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        questions = quiz.questions.all().prefetch_related('options')
        serializer = QuizQuestionSerializer(questions, many=True)
        
        return Response({
            "quiz_title": quiz.title,
            "quiz_duration": quiz_duration,
            "questions": serializer.data
        })

class QuizSubmissionView(APIView):
    """
    ક્વિઝના જવાબો સબમિટ કરવા અને રિઝલ્ટ ગણવા માટે.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        quiz_id = request.data.get('quiz_id')
        user_answers = request.data.get('answers', {})

        try:
            quiz = Quiz.objects.get(pk=quiz_id)
        except (Quiz.DoesNotExist, ValueError):
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        # જો યુઝરે પહેલેથી ક્વિઝ આપી દીધી હોય તો ફરી આપવા દેવી કે નહીં?
        # જો તમે મંજૂરી આપવા માંગતા હોવ તો આ ચેક કાઢી નાખો.
        # if Result.objects.filter(user=user, quiz=quiz).exists():
        #     return Response({"detail": "તમે આ ક્વિઝ પહેલેથી આપી દીધી છે."}, status=status.HTTP_400_BAD_REQUEST)

        total_score = 0
        total_possible_score = 0
        
        with transaction.atomic():
            for q_id, selected_val in user_answers.items():
                try:
                    question = Question.objects.get(pk=int(q_id), quiz=quiz)
                    marks = getattr(question, 'marks', 1)
                    total_possible_score += marks
                    
                    correct_options = list(question.options.filter(is_correct=True).values_list('id', flat=True))
                    
                    # ફોર્મેટિંગ: React માંથી લિસ્ટ અથવા સિંગલ આઈડી આવે તો પણ હેન્ડલ કરે
                    if isinstance(selected_val, list):
                        formatted_selected = [int(i) for i in selected_val]
                    else:
                        formatted_selected = [int(selected_val)]
                    
                    if set(formatted_selected) == set(correct_options) and len(correct_options) > 0:
                        total_score += marks
                except (Question.DoesNotExist, ValueError, TypeError):
                    continue

            # જો કોઈ જવાબ ન આપ્યો હોય તો પણ કુલ માર્ક્સ ગણો
            if total_possible_score == 0:
                total_possible_score = sum(getattr(q, 'marks', 1) for q in quiz.questions.all())
            
            percentage = (total_score / total_possible_score) * 100 if total_possible_score > 0 else 0
            
            result = Result.objects.create(
                user=user,
                quiz=quiz,
                score=total_score,
                total_questions=total_possible_score,
                percentage=round(percentage, 2)
            )

        return Response({
            "id": result.id,
            "detail": "Quiz submitted successfully.",
            "score": total_score,
            "total_questions": total_possible_score,
            "percentage": round(percentage, 2)
        }, status=status.HTTP_201_CREATED)


class UserResultsView(APIView):
    """
    લોગ-ઇન થયેલ યુઝરના પોતાના બધા રિઝલ્ટ જોવા માટે.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        results = Result.objects.filter(user=request.user).order_by('-id')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)