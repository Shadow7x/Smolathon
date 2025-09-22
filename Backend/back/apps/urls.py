from django.urls import path, include

urlpatterns = [
    path("", include("apps.users.urls")),
    path("analytics/", include("apps.analytics.urls")),
]
