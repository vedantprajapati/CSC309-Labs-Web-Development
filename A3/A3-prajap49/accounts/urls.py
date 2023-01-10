from django.urls import path
import accounts.views as views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('profile/view/', views.profile_view, name='profile'),
    path('profile/edit/', views.profile_edit_view, name='profile_edit'),
    path('register/', views.Register.as_view(), name='register'),
    path('logout/', views.logout_view, name='logout'),
]
