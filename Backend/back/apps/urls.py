from django.urls import path, include

urlpatterns = [
    path("account/", include("apps.users.urls")),
    path("analytics/", include("apps.analytics.urls")),
    path("content/", include("apps.content.urls")),
]
