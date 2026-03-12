from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.quizzes.models import Quiz, Question
from .models import Attempt
from .serializers import AttemptSubmitSerializer, AttemptSerializer, AttemptDetailSerializer


class AttemptSubmitView(APIView):
    """
    POST /api/attempt — Submit a quiz attempt.

    Server-side scoring: compares submitted answers against correct_answer_index.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AttemptSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        quiz_id = serializer.validated_data['quiz_id']
        user_answers = serializer.validated_data['answers']

        try:
            quiz = Quiz.objects.prefetch_related('questions').get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(
                {'error': 'Quiz not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Server-side scoring
        questions = quiz.questions.all()
        total_questions = questions.count()
        score = 0

        for question in questions:
            q_id_str = str(question.id)
            if q_id_str in user_answers:
                if user_answers[q_id_str] == question.correct_answer_index:
                    score += 1

        # Create the attempt record
        attempt = Attempt.objects.create(
            quiz=quiz,
            user=request.user,
            answers=user_answers,
            score=score,
            total_questions=total_questions,
        )

        return Response(
            AttemptDetailSerializer(attempt).data,
            status=status.HTTP_201_CREATED
        )


class UserResultsView(generics.ListAPIView):
    """GET /api/results/<user_id> — Get all attempts for a specific user."""

    serializer_class = AttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        # Users can only view their own results (unless admin)
        if str(self.request.user.id) != str(user_id):
            from django.conf import settings
            if self.request.user.email not in settings.ADMIN_EMAILS:
                return Attempt.objects.none()
        return Attempt.objects.filter(user_id=user_id).select_related('quiz', 'user')


class AttemptDetailView(generics.RetrieveAPIView):
    """GET /api/attempts/<id> — Get detailed attempt with questions and correct answers."""

    serializer_class = AttemptDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Attempt.objects.filter(
            user=self.request.user
        ).select_related('quiz').prefetch_related('quiz__questions')


class MyAttemptsView(generics.ListAPIView):
    """GET /api/my-attempts — Get current user's attempt history."""

    serializer_class = AttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Attempt.objects.filter(
            user=self.request.user
        ).select_related('quiz', 'user')
