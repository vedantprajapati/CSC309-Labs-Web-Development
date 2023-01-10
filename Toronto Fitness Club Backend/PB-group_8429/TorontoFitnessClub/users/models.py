from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.db import models

class Card(models.Model):
    DEBIT = "DB"
    CREDIT = "CR"
    CARD_TYPE_CHOICES = [
        (DEBIT, "Debit"),
        (CREDIT, "Credit")
    ]
    card_type = models.CharField(max_length=2, choices=CARD_TYPE_CHOICES)
    card_number = models.CharField(max_length=16, unique=True)
    card_holder_name = models.CharField(max_length=150)
    expiry_date = models.DateTimeField()
    security_code = models.CharField(max_length=4)

class TFCUserManager(UserManager):

    def create_user(self, username, email, password, first_name="", last_name="", is_staff=False, is_superuser=False):
        if not email:
            raise ValueError('Email for user must be set.')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, is_staff=is_staff, is_superuser=is_superuser)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password, is_staff=True, is_superuser=True):


        if is_staff is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if is_superuser is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, email, password, is_staff=is_staff, is_superuser=is_superuser)

class TFCUser(AbstractUser):
    avatar = models.ImageField(upload_to='images/avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=12, null=True, blank=True)
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, related_name="subscribers", blank=True, null=True)
    card = models.OneToOneField('users.Card', on_delete=models.CASCADE, null=True, blank=True)
    objects = TFCUserManager()
    
    def __str__(self):
        return self.username
    
class Coach(models.Model):
    name = models.CharField(max_length=150)
    def __str__(self):
        return self.name