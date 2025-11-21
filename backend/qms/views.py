from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Quiz, Question
from .serializers import QuizSerializer, QuestionSerializer
from .permissions import IsTeacher

class QuizViewSet(viewsets.ModelViewSet):
 
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated, IsTeacher] 

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsTeacher]


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Quiz, Question, Option, Result, UserProfile 
from .serializers import StudentQuizListSerializer, StudentQuizAttemptSerializer
from .permissions import IsTeacher 

class AvailableQuizzesView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        if request.user.userprofile.role != 'student':
            return Response({"detail": "Only students can access this."}, status=status.HTTP_403_FORBIDDEN)
            
        quizzes = Quiz.objects.all() 
        serializer = StudentQuizListSerializer(quizzes, many=True)
        return Response(serializer.data)

class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        user = request.user
        if user.userprofile.role != 'student':
            return Response({"detail": "Only students can submit quizzes."}, status=status.HTTP_403_FORBIDDEN)

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        student_answers = request.data.get('answers', []) 
        total_score = 0
        total_marks = 0

        # 2. score count
        for item in student_answers:
            question_id = item.get('question_id')
            selected_option_id = item.get('selected_option_id')

            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
                correct_option = Option.objects.get(question=question, is_correct=True)
                total_marks += question.marks
                
                if selected_option_id and correct_option.id == selected_option_id:
                    total_score += question.marks
            except Question.DoesNotExist:
                continue 

        # 3. resut display 
        Result.objects.create(
            student=user,
            quiz=quiz,
            score=total_score,
            total_marks=total_marks
        )

        return Response({
            "message": "Quiz submitted successfully.",
            "score": total_score,
            "total_marks": total_marks
        }, status=status.HTTP_200_OK)