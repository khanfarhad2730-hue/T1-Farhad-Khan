from django.conf import settings
from django.db import models


class Attempt(models.Model):
    """Stores a user's quiz attempt with answers and score."""

    quiz = models.ForeignKey(
        'quizzes.Quiz',
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    answers = models.JSONField(
        help_text='Dict mapping question_id to selected_option_index',
        default=dict
    )
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.email} — {self.quiz.title} ({self.score}/{self.total_questions})"
