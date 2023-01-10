import django_filters.rest_framework
from django.shortcuts import render
from classes.serializers import ClassSessionsSerializer
from classes.models import Class, ClassSession
from studios.models import Studio
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
import datetime
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class StudioClassScheduleFilter(django_filters.rest_framework.FilterSet):
	name = django_filters.CharFilter(field_name='tfc_class__name', lookup_expr='contains')
	coach = django_filters.CharFilter(field_name='tfc_class__coach__name', lookup_expr='contains')
	date = django_filters.DateTimeFromToRangeFilter(field_name='tfc_class__start_date')
	time = django_filters.DateTimeFromToRangeFilter(field_name='time')

	class Meta:
		model = ClassSession
		fields = ['name', 'coach', 'date', 'time']


class StudioClassScheduleListView(ListAPIView):
	serializer_class = ClassSessionsSerializer
	filterset_class = StudioClassScheduleFilter

	def get_queryset(self):
		studio = get_object_or_404(Studio, id=self.kwargs["studio_id"])
		classes = Class.objects.filter(studio_id=studio.id)	
		class_sessions = ClassSession.objects.filter(tfc_class_id__in=classes, is_cancelled=False, time__gte=datetime.datetime.now()).order_by("time").distinct()
		return class_sessions

class ClassSessionEnrolView(UpdateAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		return ClassSession.objects.get(id=self.kwargs["session_id"])

	def patch(self, request, *args, **kwargs):
		user = request.user
		subscription = user.subscription
		if not subscription:
			return Response({"message": "You do not have a subscription"}, status=status.HTTP_400_BAD_REQUEST)
		class_session = self.get_queryset()
		class_session.participants.add(request.user)
		class_session.save()
		return Response({"message": "You have successfully enrolled in this class session."}, status=status.HTTP_200_OK)


class ClassEnrolView(UpdateAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		return ClassSession.objects.filter(tfc_class_id=self.kwargs["class_id"], is_cancelled=False, time__gte=datetime.datetime.now()).order_by("time")

	def patch(self, request, *args, **kwargs):
		user = request.user
		subscription = user.subscription
		if not subscription:
			return Response({"message": "You do not have a subscription"}, status=status.HTTP_400_BAD_REQUEST)

		for class_session in self.get_queryset():
			class_session.participants.add(request.user)
			class_session.save()
		return Response({"message": "You have successfully enrolled in this class."}, status=status.HTTP_200_OK)


class ClassSessionDropView(UpdateAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		return ClassSession.objects.get(id=self.kwargs["session_id"])

	def patch(self, request, *args, **kwargs):
		class_session = self.get_queryset()
		if (request.user in class_session.participants.all()):
			class_session.participants.remove(request.user)
			class_session.save()
			return Response({"message": "You have successfully dropped this class session."}, status=status.HTTP_200_OK)
		return Response({"message": "You are not enrolled in the session!"}, status=status.HTTP_200_OK)


class ClassDropView(UpdateAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		return ClassSession.objects.filter(tfc_class_id=self.kwargs["class_id"], is_cancelled=False, time__gte=datetime.datetime.now()).order_by("time")

	def patch(self, request, *args, **kwargs):
		user_found = False
		for class_session in self.get_queryset():
			if (request.user in class_session.participants.all()):
				user_found = True
				class_session.participants.remove(request.user)
				class_session.save()
		if not user_found:
			return Response({"message": "You are not enrolled in any sessions in this class!"}, status=status.HTTP_200_OK)
		return Response({"message": "You have successfully dropped this class."}, status=status.HTTP_200_OK)

class UserClassScheduleListView(ListAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		class_sessions = ClassSession.objects.filter(participants=self.request.user, is_cancelled=False, time__gte=datetime.datetime.now()).order_by("time")
		return class_sessions

class UserClassHistoryListView(ListAPIView):
	serializer_class = ClassSessionsSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		class_sessions = ClassSession.objects.filter(participants=self.request.user, is_cancelled=False, time__lt=datetime.datetime.now()).order_by("time")
		return class_sessions
