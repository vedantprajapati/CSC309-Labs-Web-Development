from rest_framework import serializers
from classes.models import Class, ClassSession

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'coach', 'keywords', 'capacity', 'studio', 'start_date', 'end_date', 'last_modified']

class ClassSessionsSerializer(serializers.ModelSerializer):
    tfc_class = ClassSerializer(many=False, read_only=True)
    class Meta:
        model = ClassSession
        fields = ['id', 'time', 'session_length', 'is_cancelled', 'tfc_class', 'participants']
