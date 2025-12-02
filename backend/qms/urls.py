from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuizViewSet, QuestionViewSet, OptionViewSet, ResultViewSet,
    QuizQuestionListView, QuizSubmissionView, UserResultsView
)

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'options', OptionViewSet)
router.register(r'results_admin', ResultViewSet) # Admin view for all results

urlpatterns = [
    # Router URLs (for basic CRUD and Admin views)
    path('', include(router.urls)),

    # --- New Functional URLs ---
    
    # 1. API to get questions for a quiz attempt
    path('quiz/<int:quiz_id>/questions/', 
         QuizQuestionListView.as_view(), 
         name='quiz-questions-list'),

    # 2. API to submit answers and get score
    path('quiz/submit/', 
         QuizSubmissionView.as_view(), 
         name='quiz-submit'),
         
    # 3. API to get results for the current user
    path('user/results/', 
         UserResultsView.as_view(), 
         name='user-results'),
]