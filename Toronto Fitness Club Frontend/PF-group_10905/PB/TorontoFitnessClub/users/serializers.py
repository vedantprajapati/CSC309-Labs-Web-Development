from rest_framework import serializers

from django.contrib.auth.models import User
from users.models import TFCUser, Card, Coach
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    pass

class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = ['id', 'name']
        
class TFCUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = User(
            username=validated_data.get('username'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            avatar=validated_data.get('avatar', None),
            phone_number=validated_data.get('phone_number', None),
        )
        user.set_password(validated_data.get('password'))
        user.save()

        return user

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'avatar', 'phone_number']

class CardSerializer(serializers.ModelSerializer):
    user = TFCUserSerializer(read_only=True, many=False)
    class Meta:
        model = Card
        fields = ['card_type', 'card_number', 'card_holder_name', 'expiry_date', 'security_code', 'user']


