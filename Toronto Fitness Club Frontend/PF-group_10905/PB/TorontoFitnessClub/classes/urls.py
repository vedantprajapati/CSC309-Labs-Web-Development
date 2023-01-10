from classes.views import (
    StudioClassScheduleListView,
    ClassSessionEnrolView,
    ClassEnrolView,
    ClassSessionDropView,
    ClassDropView,
    UserClassScheduleListView,
    UserClassHistoryListView,
)
from django.urls import path


app_name = "classes"
urlpatterns = [
    path("<int:studio_id>/schedule/", StudioClassScheduleListView.as_view()),
    path("session/<int:session_id>/enrol/", ClassSessionEnrolView.as_view()),
    path("class/<int:class_id>/enrol/", ClassEnrolView.as_view()),
    path("session/<int:session_id>/drop/", ClassSessionDropView.as_view()),
    path("class/<int:class_id>/drop/", ClassDropView.as_view()),
    path("schedule/", UserClassScheduleListView.as_view()),
    path("history/", UserClassHistoryListView.as_view()),
]
