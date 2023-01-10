import django_filters.rest_framework
from django.shortcuts import render
from rest_framework.generics import (
    RetrieveAPIView,
    ListAPIView,
    CreateAPIView,
    UpdateAPIView,
)
from studios.serializers import StudioSerializer
from django.shortcuts import get_object_or_404
from studios.models import Studio
from haversine import haversine
from rest_framework.views import APIView
import geocoder
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Case, When, F

# Create your views here.
class StudioView(APIView):

    def get(self, request, *args, **kwargs):
        studio_serializer = StudioSerializer(
            get_object_or_404(Studio, id=self.kwargs["studio_id"])
        )

        if not studio_serializer.data:
            return Response(
                studio_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        if not self.request.query_params.get("location"):
            return Response({"studio":studio_serializer.data}, status=status.HTTP_200_OK)
        else:
            user_location = geocoder.arcgis(
                self.request.query_params.get("location")
            ).latlng
            directions_url = (
                "https://www.google.com/maps/dir/"
                + f"'{user_location[0]},{user_location[1]}'"
                + "/"
                + "'{}".format(studio_serializer.data["latitude"])
                + ","
                + "{}'".format(studio_serializer.data["longitude"])
                + "/"
            )
            return Response({"studio": studio_serializer.data, "directions": directions_url}, status=status.HTTP_200_OK)


class StudioFilter(django_filters.rest_framework.FilterSet):
    coach = django_filters.CharFilter(field_name='classes__coach__name', lookup_expr='contains')
    amenity = django_filters.CharFilter(field_name='amenities__amenity_type', lookup_expr='exact')
    class_name = django_filters.CharFilter(field_name='classes__name', lookup_expr='contains')

    class Meta:
        model = Studio
        fields = ['name', 'coach', 'amenity', 'class_name']


class StudioListView(ListAPIView):
    serializer_class = StudioSerializer
    filterset_class = StudioFilter

    def get_queryset(self):
        user_location = self.request.query_params.get("location", None)
        if not user_location:
            return Studio.objects.all()
        user_lat, user_long = None, None
        
        try:
            user_lat = user_location.split(", ")[0].strip()
            user_long = user_location.split(", ")[1].strip()
            user_lat=float(user_lat)
            user_long=float(user_long)
        except:
            pass
        
        if user_lat and user_long:
            user_latlng = [user_lat, user_long]
        else:
            user_latlng = geocoder.arcgis(user_location).latlng
        
        studios = Studio.objects.values_list("id", "latitude", "longitude")
        distances = []
        for studio in studios:
            studio_latlng = (studio[1], studio[2])
            user_latlng = (user_latlng[0], user_latlng[1])
            distances.append((studio[0], haversine(studio_latlng, user_latlng)))
        distances.sort(key=lambda x: x[1])
        if distances == []:
            return Studio.objects.none()

        ids, distances_list = zip(*distances)
        preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ids)])
        queryset = Studio.objects.filter(pk__in=ids).order_by(preserved).distinct()
        return queryset
