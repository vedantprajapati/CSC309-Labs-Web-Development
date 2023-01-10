from rest_framework import serializers
from studios.models import Studio, StudioImage, Amenity


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'amenity_type', 'quantity']


class StudioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioImage
        fields = ['image']

class StudioSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    images = StudioImageSerializer(many=True)

    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'longitude', 'latitude', 'phone_number', 'postal_code', 'amenities', 'images']
