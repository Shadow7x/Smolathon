from django.urls import path

from .views import createEvacuationRoute, getEvacuationRoute

urlpatterns = [
    path("create", createEvacuationRoute),
    path("get", getEvacuationRoute),
]