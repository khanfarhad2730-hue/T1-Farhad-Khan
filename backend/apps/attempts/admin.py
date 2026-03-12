from django.contrib import admin
from .models import Attempt


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'quiz', 'score', 'total_questions', 'submitted_at')
    list_filter = ('quiz', 'submitted_at')
    search_fields = ('user__email', 'quiz__title')
    ordering = ('-submitted_at',)
