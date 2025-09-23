from django.urls import path

from .views import createTrafficLight, getTrafficLight

urlpatterns = [
    path("create", createTrafficLight),
    path("get", getTrafficLight),
]