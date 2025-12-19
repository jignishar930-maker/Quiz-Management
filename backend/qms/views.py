from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Quiz, Question, Option, Result
# ✅ અહીં QuizAttemptSerializer ઉમેર્યું છે
from .serializers import (
    QuizSerializer, QuestionSerializer, OptionSerializer, 
    ResultSerializer, QuizQuestionSerializer, QuizAttemptSerializer
)

# --- Standard ViewSets ---

class QuizViewSet(viewsets.ModelViewSet):
    """
    API endpoint for listing and managing Quizzes.
    """
    queryset = Quiz.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]

    # ✅ આ મેથડ હવે યોગ્ય રીતે લખેલી છે
    def get_serializer_class(self):
        if self.action == 'list':
            return QuizSerializer
        # જ્યારે કોઈ એક ક્વિઝ ખોલીએ ત્યારે પ્રશ્નો સાથેનો Serializer
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
    queryset = Result.objects.all().order_by('-completed_at') 
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAdminUser]

# ==========================================================
# NEW: Quiz Attempt and Scoring Logic
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
            # જો model માં duration ન હોય તો નીચેની લાઈન કાઢી નાખવી
            # "quiz_duration": getattr(quiz, 'duration', None), 
            "questions": serializer.data
        })

class QuizSubmissionView(APIView):
    """
    API endpoint for submitting answers, calculating the score, and saving the result.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        quiz_id = request.data.get('quiz_id')
        user_answers = request.data.get('answers', {}) # {question_id: [selected_option_ids]}

        if not quiz_id or not user_answers:
            return Response({"detail": "Quiz ID and answers are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quiz = Quiz.objects.get(pk=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has already submitted a result for this quiz
        if Result.objects.filter(user=user, quiz=quiz).exists():
            return Response({"detail": "You have already submitted this quiz."}, status=status.HTTP_400_BAD_REQUEST)

        total_score = 0
        total_questions = quiz.questions.count()

        # Begin a database transaction for score calculation and result saving
        with transaction.atomic():
            for q_id, selected_option_ids in user_answers.items():
                try:
                    question = Question.objects.get(pk=q_id, quiz=quiz)
                except Question.DoesNotExist:
                    continue # Skip questions that don't belong to the quiz

                # Find all correct options for the question
                correct_options = list(question.options.filter(is_correct=True).values_list('id', flat=True))
                
                # Check if the user's selected options exactly match the correct options
                # Note: selected_option_ids must be a list, even for single choice
                selected_set = set(selected_option_ids)
                correct_set = set(correct_options)

                if selected_set == correct_set and len(correct_set) > 0:
                    # Score based on question marks, assuming 1 mark if not specified
                    total_score += getattr(question, 'marks', 1) 

            # Calculate Percentage (using total possible questions count)
            # Assuming 1 mark per question for percentage calculation if 'marks' is not used
            total_possible_score = sum(getattr(q, 'marks', 1) for q in quiz.questions.all())
            
            percentage = (total_score / total_possible_score) * 100 if total_possible_score > 0 else 0
            
            # Save the result to the database
            result = Result.objects.create(
                user=user,
                quiz=quiz,
                score=total_score,
                percentage=round(percentage, 2),
                total_questions=total_questions # Save how many questions were attempted/counted
            )

        # Return the score details
        return Response({
            "detail": "Quiz submitted successfully.",
            "result_id": result.id,
            "score": total_score,
            "total_questions": total_questions,
            "percentage": round(percentage, 2)
        }, status=status.HTTP_201_CREATED)


class UserResultsView(APIView):
    """
    API endpoint to retrieve all results for the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Result મોડેલ માટે 'completed_at' દ્વારા સૉર્ટિંગ
        results = Result.objects.filter(user=request.user).order_by('-completed_at')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)