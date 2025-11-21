# qms/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)  # /api/quizzes/
router.register(r'questions', QuestionViewSet) # /api/questions/

urlpatterns = [
    path('', include(router.urls)),
]