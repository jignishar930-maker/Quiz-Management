from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet, SubmitQuizView # 👈 ગુજરાતી ટિપ્પણી દૂર કરી

# 1. Router setup (Only needed once)
router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')

# 2. URL Patterns
urlpatterns = [
    # Router URLs (e.g., /api/qms/quizzes/, /api/qms/questions/)
    path('', include(router.urls)), 
    
    # Custom View URLs (e.g., /api/qms/submit-quiz/)
    path('submit-quiz/', SubmitQuizView.as_view(), name='submit-quiz'),
]