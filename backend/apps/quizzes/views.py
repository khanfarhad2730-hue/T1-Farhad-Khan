from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Quiz, Question
from .serializers import (
    QuizListSerializer,
    QuizDetailSerializer,
    QuizCreateSerializer,
    QuestionSerializer,
)


class IsAdmin:
    """Mixin to check if the user is an admin."""

    def is_admin_user(self, request):
        return request.user.email in settings.ADMIN_EMAILS


class QuizListView(generics.ListAPIView):
    """GET /api/quizzes — List all quizzes with pagination."""

    serializer_class = QuizListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.select_related('created_by').all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context


class QuizDetailView(generics.RetrieveAPIView):
    """GET /api/quizzes/<id> — Get quiz detail with questions (answers hidden)."""

    serializer_class = QuizDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.prefetch_related('questions').select_related('created_by').all()


class QuizCreateView(APIView, IsAdmin):
    """POST /api/quizzes — Create a new quiz (admin only)."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not self.is_admin_user(request):
            return Response(
                {'error': 'Only admins can create quizzes.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = QuizCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz = serializer.save(created_by=request.user)
        return Response(
            QuizCreateSerializer(quiz).data,
            status=status.HTTP_201_CREATED
        )


class QuestionCreateView(APIView, IsAdmin):
    """POST /api/quizzes/<quiz_id>/questions — Add a question to a quiz (admin only)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        if not self.is_admin_user(request):
            return Response(
                {'error': 'Only admins can add questions.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(
                {'error': 'Quiz not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        data = {**request.data, 'quiz': quiz.id}
        serializer = QuestionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        return Response(
            QuestionSerializer(question).data,
            status=status.HTTP_201_CREATED
        )


class QuestionListView(generics.ListAPIView):
    """GET /api/quizzes/<quiz_id>/questions — List questions for a quiz (admin: with answers)."""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        from .serializers import QuestionDisplaySerializer
        if self.request.user.email in settings.ADMIN_EMAILS:
            return QuestionSerializer
        return QuestionDisplaySerializer

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id)
