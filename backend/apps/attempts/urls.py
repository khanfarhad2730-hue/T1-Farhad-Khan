from django.urls import path
from .views import (
    AttemptSubmitView,
    UserResultsView,
    AttemptDetailView,
    MyAttemptsView,
)

urlpatterns = [
    path('attempt/', AttemptSubmitView.as_view(), name='attempt-submit'),
    path('attempts/<int:pk>/', AttemptDetailView.as_view(), name='attempt-detail'),
    path('my-attempts/', MyAttemptsView.as_view(), name='my-attempts'),
    path('results/<int:user_id>/', UserResultsView.as_view(), name='user-results'),
]
