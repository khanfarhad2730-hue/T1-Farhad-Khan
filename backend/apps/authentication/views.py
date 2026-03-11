from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from apps.users.models import User
from apps.users.serializers import UserSerializer
from .serializers import GoogleLoginSerializer, RegisterSerializer, TraditionalLoginSerializer


class GoogleLoginView(APIView):
    """
    Authenticate user via Google OAuth 2.0.

    Flow:
    1. Frontend sends Google credential (ID token)
    2. Backend verifies token with Google
    3. Creates or fetches user
    4. Returns JWT access/refresh tokens + user data
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credential = serializer.validated_data['credential']

        try:
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            # Verify issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response(
                    {'error': 'Invalid token issuer'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            email = idinfo.get('email', '')
            name = idinfo.get('name', '')
            photo_url = idinfo.get('picture', '')

            if not email:
                return Response(
                    {'error': 'Email not provided by Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create or update user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'name': name,
                    'photo_url': photo_url,
                }
            )

            if not created:
                # Update profile info on each login
                user.name = name
                user.photo_url = photo_url
                user.save(update_fields=['name', 'photo_url'])

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {'error': f'Invalid Google token: {str(e)}'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {'error': f'Authentication failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MeView(APIView):
    """Return the current authenticated user's profile."""

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DevLoginView(APIView):
    """Bypass for local development and E2E testing."""
    permission_classes = [AllowAny]

    def post(self, request):
        if not settings.DEBUG:
            return Response({'error': 'Not available in production'}, status=status.HTTP_403_FORBIDDEN)
            
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if email not in settings.ADMIN_EMAILS:
            return Response({'error': f'{email} is not authorized for Admin Login'}, status=status.HTTP_403_FORBIDDEN)
            
        user = User.objects.filter(email=email).first()
        
        if not user:
            return Response({'error': f'User {email} not found in database'}, status=status.HTTP_404_NOT_FOUND)
            
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """Register a new user with email and password."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TraditionalLoginView(APIView):
    """Login a user with email and password."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TraditionalLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)

