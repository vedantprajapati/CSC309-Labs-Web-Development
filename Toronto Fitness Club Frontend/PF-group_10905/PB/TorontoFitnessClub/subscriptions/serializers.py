from rest_framework import serializers
from subscriptions.models import Subscription, Payment



class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = ['id', 'cost', 'term_length']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'card_number', 'date']