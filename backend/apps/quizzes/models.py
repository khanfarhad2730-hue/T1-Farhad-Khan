from django.conf import settings
from django.db import models


class Quiz(models.Model):
    """Quiz model with title, description, and time limit."""

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    time_limit = models.PositiveIntegerField(
        help_text='Time limit in minutes',
        default=30
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_quizzes'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'quizzes'

    def __str__(self):
        return self.title

    @property
    def question_count(self):
        return self.questions.count()


class Question(models.Model):
    """MCQ question belonging to a quiz."""

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_text = models.TextField()
    options = models.JSONField(
        help_text='List of exactly 4 option strings'
    )
    correct_answer_index = models.PositiveSmallIntegerField(
        help_text='Index of the correct option (0-3)'
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"Q{self.id}: {self.question_text[:50]}"
