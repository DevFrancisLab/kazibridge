from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from django.shortcuts import get_object_or_404
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, JobSerializer, JobCreateSerializer, TaskSerializer, EarningsSerializer
from .serializers import BidSerializer, BidUpdateSerializer, TaskUpdateSerializer
from .models import Job, Task, Earnings
from .models import Bid

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
        # Return only jobs that are currently open
        return Job.objects.filter(status='OPEN')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'CLIENT':
            raise PermissionDenied("Only clients can post jobs.")
        serializer.save(created_by=user)


class IsClientOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.is_authenticated and request.user.role == 'CLIENT'


class IsFreelancerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.is_authenticated and request.user.role == 'FREELANCER'


class IsJobOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj in this view is Bid
        return request.user.is_authenticated and obj.job.created_by == request.user


class IsTaskOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj in this view is Task
        return request.user.is_authenticated and obj.freelancer == request.user


class BidListCreateView(generics.ListCreateAPIView):
    """
    Bids endpoint.
    POST: Freelancer creates a bid (freelancer set automatically).
    GET: List bids for authenticated user (freelancers get their bids, clients get bids on their jobs).
    """
    permission_classes = [IsAuthenticated, IsFreelancerOrReadOnly]
    serializer_class = BidSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'FREELANCER':
            return Bid.objects.filter(freelancer=user)
        if user.role == 'CLIENT':
            return Bid.objects.filter(job__created_by=user)
        return Bid.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'FREELANCER':
            raise PermissionDenied('Only freelancers can place bids.')
        serializer.save(freelancer=user)


class JobBidsListView(generics.ListAPIView):
    """List all bids for a given job (client only)."""
    permission_classes = [IsAuthenticated, IsClientOrReadOnly]
    serializer_class = BidSerializer

    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        job = get_object_or_404(Job, pk=job_id)
        if self.request.user != job.created_by:
            raise PermissionDenied('Only the client who owns the job can see bids.')
        return Bid.objects.filter(job=job)


class BidUpdateView(generics.UpdateAPIView):
    """Update bid status (client of the job only)."""
    permission_classes = [IsAuthenticated, IsJobOwner]
    serializer_class = BidUpdateSerializer
    queryset = Bid.objects.all()

    def perform_update(self, serializer):
        bid = serializer.instance
        job = bid.job
        if self.request.user != job.created_by:
            raise PermissionDenied('Only the job client can accept/reject bids.')

        # Save bid status change first
        updated_bid = serializer.save()

        # If bid is accepted, mark the job in-progress and create a task for freelancer
        if updated_bid.status == 'ACCEPTED':
            if job.status != 'IN_PROGRESS':
                job.status = 'IN_PROGRESS'
                job.save(update_fields=['status'])

            Task.objects.get_or_create(
                job=job,
                freelancer=updated_bid.freelancer,
                defaults={
                    'title': job.title,
                    'description': updated_bid.proposal,
                    'status': 'PENDING',
                }
            )

            # Optionally reject other pending bids for the same job
            Bid.objects.filter(job=job, status='PENDING').exclude(pk=updated_bid.pk).update(status='REJECTED')
        

class TaskUpdateView(generics.UpdateAPIView):
    """Update task status (freelancer only)."""
    permission_classes = [IsAuthenticated, IsTaskOwner]
    serializer_class = TaskUpdateSerializer
    queryset = Task.objects.all()

    def perform_update(self, serializer):
        updated_task = serializer.save()
        if updated_task.status == 'COMPLETED':
            job = updated_task.job
            if job.status != 'COMPLETED':
                job.status = 'COMPLETED'
                job.save(update_fields=['status'])
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
