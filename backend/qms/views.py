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
    queryset = Quiz.objects.all().order_by('-created_at') # Quiz મોડેલમાં 'created_at' છે એટલે આ બરાબર છે.
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
    # ✅ સુધારો: 'created_at' ને બદલે 'completed_at' લખ્યું
    queryset = Result.objects.all().order_by('-completed_at') 
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAdminUser]

# ==========================================================
# Quiz Attempt and Scoring Logic
# ==========================================================

class QuizQuestionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, quiz_id, format=None):
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        questions = quiz.questions.all().prefetch_related('options')
        serializer = QuizQuestionSerializer(questions, many=True)
        
        return Response({
            "quiz_title": quiz.title,
            "questions": serializer.data
        })

class QuizSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        quiz_id = request.data.get('quiz_id')
        user_answers = request.data.get('answers', {})

        try:
            quiz = Quiz.objects.get(pk=quiz_id)
        except (Quiz.DoesNotExist, ValueError):
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        if Result.objects.filter(user=user, quiz=quiz).exists():
            return Response({"detail": "તમે આ ક્વિઝ પહેલેથી આપી દીધી છે."}, status=status.HTTP_400_BAD_REQUEST)

        total_score = 0
        with transaction.atomic():
            for q_id, selected_option_ids in user_answers.items():
                try:
                    question = Question.objects.get(pk=q_id, quiz=quiz)
                    correct_options = list(question.options.filter(is_correct=True).values_list('id', flat=True))
                    
                    # મલ્ટીપલ ચોઈસ માટે સેટ સરખામણી
                    if set(map(int, selected_option_ids)) == set(correct_options) and len(correct_options) > 0:
                        total_score += getattr(question, 'marks', 1)
                except (Question.DoesNotExist, ValueError):
                    continue

            total_possible_score = sum(getattr(q, 'marks', 1) for q in quiz.questions.all())
            percentage = (total_score / total_possible_score) * 100 if total_possible_score > 0 else 0
            
            # ✅ સુધારો: 'total_questions' ફિલ્ડ ઉમેર્યું કારણ કે તે ડેટાબેઝમાં છે
            result = Result.objects.create(
                user=user,
                quiz=quiz,
                score=total_score,
                total_questions=total_possible_score,
                percentage=round(percentage, 2)
            )

        return Response({
            "detail": "Quiz submitted successfully.",
            "score": total_score,
            "percentage": round(percentage, 2)
        }, status=status.HTTP_201_CREATED)


class UserResultsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # ✅ સુધારો: 'created_at' ને બદલે 'completed_at' લખ્યું
        results = Result.objects.filter(user=request.user).order_by('-completed_at')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)