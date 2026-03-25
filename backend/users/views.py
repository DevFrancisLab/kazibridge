from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, JobSerializer, JobCreateSerializer, TaskSerializer, EarningsSerializer
from .models import Job, Task, Earnings

User = get_user_model()


class RegisterView(APIView):
    """
    User registration endpoint.
    POST: Create new user account
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
            except IntegrityError as e:
                return Response({
                    'success': False,
                    'errors': {'detail': str(e)},
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'success': True,
                'message': 'User registered successfully.',
                'email': user.email,
                'role': user.role,
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    User login endpoint.
    POST: Authenticate user and create session
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'email': user.email,
                'role': user.role,
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors,
        }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    User logout endpoint.
    POST: Logout user and destroy session
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({
            'success': True,
            'message': 'Logout successful.',
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    Get current user profile.
    GET: Return authenticated user data
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'data': serializer.data,
        }, status=status.HTTP_200_OK)


class JobListCreateView(generics.ListCreateAPIView):
    """
    Jobs endpoint.
    GET: List jobs (filtered by user role)
    POST: Create new job (clients only)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = JobSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CLIENT':
            return Job.objects.filter(client=user)
        elif user.role == 'FREELANCER':
            return Job.objects.filter(status='OPEN')
        return Job.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer


class TaskListView(generics.ListAPIView):
    """
    Tasks endpoint.
    GET: List tasks for authenticated freelancer
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'FREELANCER':
            return Task.objects.filter(freelancer=user)
        return Task.objects.none()


class EarningsListView(generics.ListAPIView):
    """
    Earnings endpoint.
    GET: List earnings for authenticated freelancer
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EarningsSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'FREELANCER':
            return Earnings.objects.filter(freelancer=user)
        return Earnings.objects.none()
