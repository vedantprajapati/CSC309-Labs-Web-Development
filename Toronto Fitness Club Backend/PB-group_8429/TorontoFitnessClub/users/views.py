from users.models import TFCUser, Card
from users.serializers import TFCUserSerializer, CustomTokenObtainPairSerializer, CardSerializer
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.exceptions import AuthenticationFailed
import datetime, jwt
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404

User = get_user_model()

class CreateTFCUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TFCUserSerializer

class LoginTFCUserView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        user = authenticate(
            username=request.data.get('username', ''),
            password=request.data.get('password', '')
        )
        if user:
            login_input = self.serializer_class(data=request.data)
            if login_input.is_valid():
                user_serializer = TFCUserSerializer(user)
                return Response({
                    'token': login_input.validated_data.get('access'),
                    'refresh-token': login_input.validated_data.get('refresh'),
                    'user': user_serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid Username or Password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Invalid Username or Password'}, status=status.HTTP_400_BAD_REQUEST)


class EditTFCUserView(UpdateAPIView):
    permission_classes=[IsAuthenticated,]
    queryset = User.objects.all()
    serializer_class=TFCUserSerializer

    def get_object(self):
        return User.objects.get(username=self.request.user.username)
    

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully",'user': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
class UserCardCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = Card.objects.all()
    
    def post(self, request, *args, **kwargs):
        request.data['user'] = request.user
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            card = Card.objects.get(card_number=serializer.data['card_number'])
            if not card:
                return Response({"message": "Card could not be added to the cardholder"}, status=status.HTTP_400_BAD_REQUEST)
            request.user.card=card
            request.user.save()
            return Response({"message": "Card created successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserCardUpdateAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer
    queryset = Card.objects.all()

    def get_object(self):
        current_user=self.request.user
        return current_user.card if current_user.card else status.HTTP_404_NOT_FOUND

    def put(self, request, *args, **kwargs):
        current_user = self.request.user
        card = self.get_object()
        serializer = self.get_serializer(card, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()
            current_user.card=card
            current_user.save()
            return Response({"message": "User updated successfully",'Card Information': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    