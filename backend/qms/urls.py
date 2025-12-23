from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuizViewSet, QuestionViewSet, OptionViewSet, ResultViewSet, 
    QuizSubmissionView, UserResultsView
)

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'results', ResultViewSet)

urlpatterns = [
    path('', include(router.urls)), # આનાથી quizzes/ અને results/ પાથ બનશે
    
    # ✅ સબમિટ કરવા માટેનો ખાસ પાથ
    path('submit/', QuizSubmissionView.as_view(), name='quiz-submit'),
    path('user-results/', UserResultsView.as_view(), name='user-results'),
]