from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'photo_url', 'is_admin', 'created_at']
        read_only_fields = ['id', 'email', 'created_at']

    def get_is_admin(self, obj):
        from django.conf import settings
        return obj.email in settings.ADMIN_EMAILS
