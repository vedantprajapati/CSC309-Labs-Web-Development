from django.db import models
from django.core.exceptions import ValidationError
import geocoder

class Studio(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=150, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Latitude of studio (-90 to 90)")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Longitude of studio (-180 to 180)")
    phone_number = models.CharField(max_length=12, null=True, blank=True)
    postal_code = models.CharField(max_length=6, null=True, blank=True)

    def clean(self):
        if not (self.address or (self.longitude and self.latitude) or self.postal_code):
            raise ValidationError("You must specify a type of location")
        if not (self.longitude and self.latitude):
            if self.postal_code:
                g = geocoder.arcgis(self.postal_code).latlng
                self.latitude = g[0]
                self.longitude = g[1]
            else:
                g = geocoder.arcgis(self.address).latlng
                self.latitude = g[0]
                self.longitude = g[1]

    def __str__(self):
        return f"{self.name} {self.longitude} {self.latitude}"

class StudioImage(models.Model):
    studio = models.ForeignKey(Studio, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/studios/')


class Amenity(models.Model):
    POOL = "PL"
    HOCKEY_ARENA = "HK"
    FITNESS_CENTRE = "FIT"
    GYM = "GYM"
    SQUASH_COURT = "SQC"
    AMENITY_CHOICES = [
        (POOL, "Pool"),
        (HOCKEY_ARENA, "Hockey Arena"),
        (FITNESS_CENTRE, "Fitness Centre"),
        (GYM, "Gymnasium"),
        (SQUASH_COURT, "Squash Court"),
    ]
    class Meta:
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"
        
    amenity_type = models.CharField(max_length=3, choices=AMENITY_CHOICES)
    quantity = models.PositiveIntegerField()
    studio = models.ForeignKey(Studio, related_name="amenities", on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.amenity_type} {self.studio.name}"
