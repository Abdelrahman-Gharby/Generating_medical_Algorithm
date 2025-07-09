from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser
from django.contrib.auth import authenticate

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this email is already registered. Please use a different email."
            )
        ]
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        error_messages={
            "blank": "Password cannot be empty.",
            "required": "Password is required.",
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            "blank": "Confirm password cannot be empty.",
            "required": "Confirm password is required.",
        }
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'contact_number', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match. Please check and try again."})
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before saving
        user = User.objects.create_user(**validated_data)
        return user



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"non_field_errors": ["User does not exist"]})

        if not user.check_password(password):
            raise serializers.ValidationError({"non_field_errors": ["Incorrect password"]})

        return {"user": user}
