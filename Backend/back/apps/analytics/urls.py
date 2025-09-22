from django.urls import path, include


urlpatterns = [
    path("penalties/", include("apps.analytics.penalties.urls")),
]