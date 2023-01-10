from django.shortcuts import render
from subscriptions.models import Subscription, Payment
from subscriptions.serializers import SubscriptionSerializer, PaymentSerializer
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from dateutil.relativedelta import relativedelta
import datetime
from classes.models import ClassSession

User = get_user_model()

# Create your views here.
class SubscriptionListAPIView(ListAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.all()


def pay_user_subscriptions_due_today():
    users = User.objects.all()
    if not users:
        print("No users found")
        return

    for user in users:
        if user.subscription:
            payment = user.payments.order_by("-date").first()
            if (
                payment
                and payment.date.date()
                + relativedelta(months=user.subscription.term_length)
                == datetime.date.today()
                and user.card
            ):
                # pay the subscription
                Payment.objects.create(
                    user=user,
                    amount=user.subscription.cost,
                    card_holder_name=user.card.card_holder_name,
                    card_type=user.card.card_type,
                    card_number=user.card.card_number,
                    expiry_date=user.card.expiry_date,
                    security_code=user.card.security_code,
                )
                print(f"Paid {user.subscription.cost} for {user.username}")
            else:
                print(f"Card invalid for {user.username} or payment not due")
        else:
            print(f"No subscription for {user.username}")


class UpdateUserSubscriptionView(UpdateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_object_or_404(Subscription, id=self.kwargs["subscription_id"])

    def patch(self, request, *args, **kwargs):
        subscription = self.get_queryset()
        current_user = request.user
        if not request.user.card:
            return Response(
                {
                    "message": "You currently do not have a payment method added to your account. Please add a Card"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if current_user.subscription and current_user.subscription != subscription:
            sessions = ClassSession.objects.filter(
                tfc_class_id=current_user.id,
                time__gte=datetime.date.today()
                + relativedelta(
                    months=current_user.subscription.term_length
                ),
            )
            for session in sessions:
                session.participants.remove(current_user)
                session.save()

        user_card = current_user.card
        current_user.subscription = subscription

        current_user.save()

        # pay_all_user_subscriptions_due_today()
        Payment.objects.create(
            user=current_user,
            amount=subscription.cost,
            card_holder_name=user_card.card_holder_name,
            card_type=user_card.card_type,
            card_number=user_card.card_number,
            expiry_date=user_card.expiry_date,
            security_code=user_card.security_code,
        )

        return Response(
            {
                "message": f"You have successfully subscribed. You will be billed {subscription.cost} immediately recurring every {subscription.term_length} month(s)"
            },
            status=status.HTTP_200_OK,
        )


class DropUserSubscriptionView(UpdateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        request.user.subscription = None
        request.user.save()
        return Response(
            {"message": "You have successfully cancelled your subscription"},
            status=status.HTTP_200_OK,
        )


class PastUserPaymentsView(ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    


class FutureUserPaymentsView(APIView):
	
    def get(self, request, *args, **kwargs):
        user = request.user
        subscription = user.subscription
        if not subscription:
            return Response({"message": "You do not have a subscription"}, status=status.HTTP_400_BAD_REQUEST)
        dates = {}
        for i in range (10):
            dates[i] ={}
            dates[i]['date'] = (datetime.date.today() + relativedelta(months=i*user.subscription.term_length)).strftime("%m/%d/%Y")
            dates[i]['amount'] = user.subscription.cost

        return Response({"Future Payment Dates": dates}, status=status.HTTP_200_OK)
