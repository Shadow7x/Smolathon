from django.urls import path, include


urlpatterns = [
    path("penalties/", include("apps.analytics.penalties.urls")),
    path("towTrucks/", include("apps.analytics.towTrucks.urls")),
    path("evacuationRoute/", include("apps.analytics.evacuationRoute.urls")),
]