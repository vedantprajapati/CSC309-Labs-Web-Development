from django.urls import path
from users.views import CreateTFCUserView, LoginTFCUserView, EditTFCUserView, UserCardUpdateAPIView,UserCardCreateAPIView, CoachesListAPIView

app_name = 'users'

urlpatterns = [
    path('signup/', CreateTFCUserView.as_view()),
    path('login/', LoginTFCUserView.as_view()),
    path('edit/', EditTFCUserView.as_view()),
    path('card/edit/', UserCardUpdateAPIView.as_view()),
    path('card/create/', UserCardCreateAPIView.as_view()),
    path('coaches/', CoachesListAPIView.as_view()),
]
