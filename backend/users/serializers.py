from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.db import IntegrityError
from .models import Job, Task, Earnings

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('email', 'password', 'role')
        extra_kwargs = {
            'role': {'required': True},
        }
    
    def validate_email(self, value):
        """Validate that email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        """Create user with hashed password."""
        password = validated_data.pop('password')

        # Ensure username is set for AbstractUser unique username constraint.
        validated_data['username'] = validated_data.get('email', '')
        validated_data.setdefault('first_name', '')

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('email', 'password', 'role')
        extra_kwargs = {
            'role': {'required': True},
        }
    
    def validate_email(self, value):
        """Validate that email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        """Create user with hashed password."""
        password = validated_data.pop('password')

        # Ensure username is set for AbstractUser unique username constraint.
        validated_data['username'] = validated_data.get('email', '')
        validated_data.setdefault('first_name', '')

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Validate user credentials."""
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError({
                'email': 'Email and password are required.'
            })
        
        # Authenticate using email
        user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError({
                'email': 'Invalid email or password.'
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                'email': 'User account is disabled.'
            })
        
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data (read-only)."""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class JobSerializer(serializers.ModelSerializer):
    """Serializer for Job model."""
    
    client = UserSerializer(read_only=True)
    freelancer = UserSerializer(read_only=True)
    
    class Meta:
        model = Job
        fields = ('id', 'title', 'description', 'budget', 'client', 'freelancer', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating jobs."""
    
    class Meta:
        model = Job
        fields = ('title', 'description', 'budget')
    
    def create(self, validated_data):
        """Create job with client set to current user."""
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""
    
    job = JobSerializer(read_only=True)
    freelancer = UserSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'job', 'freelancer', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class EarningsSerializer(serializers.ModelSerializer):
    """Serializer for Earnings model."""
    
    freelancer = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = Earnings
        fields = ('id', 'freelancer', 'job', 'amount', 'earned_at')
        read_only_fields = ('id', 'earned_at')
