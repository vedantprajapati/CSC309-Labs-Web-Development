from django.db import models
from django.contrib.auth.models import User

class Branch(models.Model):
    name = models.CharField(max_length=200, null=False)
    transit_num = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200, null=False)
    email = models.EmailField(default="admin@utoronto.ca")
    capacity = models.PositiveIntegerField(null=True)
    last_modified = models.DateTimeField(auto_now=True)
    
class Bank(models.Model):
    name = models.CharField(max_length=200, null=False)
    swift_code = models.CharField(max_length=200, null=False)
    institution_number = models.CharField(max_length=200, null=False)
    description = models.CharField(max_length=200, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    branches = models.ManyToManyField(Branch)


