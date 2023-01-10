from studios.views import StudioView, StudioListView
from django.urls import path
app_name = 'studios'


urlpatterns = [
	path('<int:studio_id>/', StudioView.as_view()),
	path('list/', StudioListView.as_view()), #/studios/list/?location=Toronto
]
