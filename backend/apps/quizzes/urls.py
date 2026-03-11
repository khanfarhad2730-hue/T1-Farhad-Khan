from django.urls import path
from .views import (
    QuizListView,
    QuizDetailView,
    QuizCreateView,
    QuestionCreateView,
    QuestionListView,
)

urlpatterns = [
    path('quizzes/', QuizListView.as_view(), name='quiz-list'),
    path('quizzes/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:quiz_id>/questions/', QuestionListView.as_view(), name='question-list'),
    path('quizzes/<int:quiz_id>/questions/create/', QuestionCreateView.as_view(), name='question-create'),
]
