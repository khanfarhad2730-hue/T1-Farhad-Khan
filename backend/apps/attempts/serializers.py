from rest_framework import serializers
from .models import Attempt
from apps.quizzes.serializers import QuestionSerializer


class AttemptSubmitSerializer(serializers.Serializer):
    """Serializer for submitting a quiz attempt."""

    quiz_id = serializers.IntegerField()
    answers = serializers.DictField(
        child=serializers.IntegerField(min_value=0, max_value=3),
        help_text='Dict mapping question_id (str) to selected_option_index (int)'
    )

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError('Answers cannot be empty.')
        return value


class AttemptSerializer(serializers.ModelSerializer):
    """Serializer for viewing attempt results."""

    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_id = serializers.IntegerField(source='quiz.id', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Attempt
        fields = [
            'id', 'quiz_id', 'quiz_title', 'user_email',
            'answers', 'score', 'total_questions', 'submitted_at'
        ]
        read_only_fields = fields


class AttemptDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed attempt review with questions and correct answers."""

    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_id = serializers.IntegerField(source='quiz.id', read_only=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Attempt
        fields = [
            'id', 'quiz_id', 'quiz_title',
            'answers', 'score', 'total_questions', 'submitted_at',
            'questions'
        ]

    def get_questions(self, obj):
        """Include questions with correct answers for review after submission."""
        questions = obj.quiz.questions.all()
        return QuestionSerializer(questions, many=True).data
