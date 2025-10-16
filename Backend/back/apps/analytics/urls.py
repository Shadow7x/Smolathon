from django.urls import path, include


urlpatterns = [
    path("penalties/", include("apps.analytics.penalties.urls")),
    path("towTrucks/", include("apps.analytics.towTrucks.urls")),
    path("evacuationRoute/", include("apps.analytics.evacuationRoute.urls")),
    path("trafficLight/", include("apps.analytics.trafficLight.urls")),
    path("DTP/", include("apps.analytics.DTP.urls")),
    path("reports/", include("apps.analytics.report.urls")), 
    path("workload/", include("apps.analytics.workload.urls")), 
    path("detectors/", include("apps.analytics.Detectors.urls")), 
]