from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet, AvailableQuizzesView, SubmitQuizView

router = DefaultRouter()

router.register(r'quizzes', QuizViewSet) 
router.register(r'questions', QuestionViewSet) 

urlpatterns = [
    path('', include(router.urls)),
    
    
    path('student/quizzes/', AvailableQuizzesView.as_view(), name='available-quizzes'),
    path('student/submit/<int:quiz_id>/', SubmitQuizView.as_view(), name='submit-quiz'),
]