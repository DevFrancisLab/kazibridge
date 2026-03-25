from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.db import IntegrityError
from .models import Job, Task, Earnings, Bid

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
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Job
        fields = ('id', 'title', 'description', 'budget', 'deadline', 'created_by', 'status', 'created_at')
        read_only_fields = ('id', 'created_at', 'created_by')


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating jobs."""
    
    class Meta:
        model = Job
        fields = ('title', 'description', 'budget', 'deadline')
    
    def create(self, validated_data):
        """Create job with client set to current user."""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""
    
    job = JobSerializer(read_only=True)
    freelancer = UserSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'job', 'freelancer', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating only task status."""

    class Meta:
        model = Task
        fields = ('status',)

    def validate_status(self, value):
        valid_statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of {', '.join(valid_statuses)}.")
        return value


class EarningsSerializer(serializers.ModelSerializer):
    """Serializer for Earnings model."""
    
    freelancer = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = Earnings
        fields = ('id', 'freelancer', 'job', 'amount', 'earned_at')
        read_only_fields = ('id', 'earned_at')


class BidSerializer(serializers.ModelSerializer):
    """Serializer for Bid model (read/write)."""

    freelancer = UserSerializer(read_only=True)
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())

    class Meta:
        model = Bid
        fields = ('id', 'job', 'freelancer', 'amount', 'proposal', 'status', 'created_at')
        read_only_fields = ('id', 'created_at', 'freelancer', 'status')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['freelancer'] = request.user
        return super().create(validated_data)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Bid amount must be greater than zero.")
        return value


class BidUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating bid status (client only)."""

    class Meta:
        model = Bid
        fields = ('status',)

    def validate_status(self, value):
        if value not in ['ACCEPTED', 'REJECTED']:
            raise serializers.ValidationError("Status must be ACCEPTED or REJECTED.")
        return value
