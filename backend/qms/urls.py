from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuizViewSet, QuestionViewSet, SubmitQuizView # 👈 SubmitQuizView Import કરો
# .views માંથી જરૂરી ViewSets ને import કરો
from .views import QuizViewSet, QuestionViewSet 

# DefaultRouter નો ઉપયોગ કરીને ViewSets માટે URLS બનાવો
router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet) # 👈 આ ઉમેરો

urlpatterns = [
    # બધા ViewSets ના URLs અહીં સમાવિષ્ટ થશે
    path('', include(router.urls)),
    path('submit-quiz/', SubmitQuizView.as_view(), name='submit-quiz'),
]