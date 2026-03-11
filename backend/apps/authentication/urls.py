from django.urls import path
from .views import GoogleLoginView, MeView, DevLoginView, RegisterView, TraditionalLoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TraditionalLoginView.as_view(), name='login'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('dev-login/', DevLoginView.as_view(), name='dev-login'),
    path('me/', MeView.as_view(), name='me'),
]
