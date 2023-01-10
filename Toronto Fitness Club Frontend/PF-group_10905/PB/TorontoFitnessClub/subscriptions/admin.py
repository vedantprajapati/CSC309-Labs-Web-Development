from django.contrib import admin
from subscriptions.models import Subscription

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['__str__']

admin.site.register(Subscription, SubscriptionAdmin)