from rest_framework import serializers
from .models import Quiz, Question


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question — used when creating/viewing questions."""

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'question_text', 'options', 'correct_answer_index']
        read_only_fields = ['id']

    def validate_options(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Options must be a list.')
        if len(value) != 4:
            raise serializers.ValidationError('Exactly 4 options are required.')
        for i, opt in enumerate(value):
            if not isinstance(opt, str) or not opt.strip():
                raise serializers.ValidationError(f'Option {i + 1} must be a non-empty string.')
        return value

    def validate_correct_answer_index(self, value):
        if value not in (0, 1, 2, 3):
            raise serializers.ValidationError('correct_answer_index must be 0, 1, 2, or 3.')
        return value


class QuestionDisplaySerializer(serializers.ModelSerializer):
    """
    Serializer for displaying questions to users during a quiz attempt.
    Hides the correct_answer_index to prevent cheating.
    """

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options']


class QuizListSerializer(serializers.ModelSerializer):
    """Serializer for quiz list view (summary)."""

    question_count = serializers.IntegerField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'time_limit',
            'question_count', 'created_by_name', 'created_at'
        ]


class QuizDetailSerializer(serializers.ModelSerializer):
    """Serializer for quiz detail — includes questions (without answers)."""

    questions = QuestionDisplaySerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'time_limit',
            'question_count', 'created_by_name', 'created_at', 'questions'
        ]


class QuizCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new quiz (admin only)."""

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'time_limit']
        read_only_fields = ['id']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError('Title must be at least 3 characters.')
        return value.strip()

    def validate_time_limit(self, value):
        if value < 1:
            raise serializers.ValidationError('Time limit must be at least 1 minute.')
        if value > 180:
            raise serializers.ValidationError('Time limit cannot exceed 180 minutes.')
        return value
