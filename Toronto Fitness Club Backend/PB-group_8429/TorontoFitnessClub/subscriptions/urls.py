from subscriptions.views import SubscriptionListAPIView, UpdateUserSubscriptionView, DropUserSubscriptionView, PastUserPaymentsView, FutureUserPaymentsView
from django.urls import path

app_name = 'subscriptions'
urlpatterns = [
    path("list/", SubscriptionListAPIView.as_view()),
	path('subscribe/<int:subscription_id>/', UpdateUserSubscriptionView.as_view()),
	path('cancel/', DropUserSubscriptionView.as_view()),
	path('payments/history/', PastUserPaymentsView.as_view()),
	path('payments/future/', FutureUserPaymentsView.as_view()),
]
