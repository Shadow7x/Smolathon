from django.urls import path

from .views import createTrafficLight, getTrafficLight, updateTrafficLight, deleteTrafficLight, createTrafficLightFromExcel

urlpatterns = [
    path("create", createTrafficLight),
    path("get", getTrafficLight),
    path("update", updateTrafficLight),
    path("delete", deleteTrafficLight),
    path("createFromExcel", createTrafficLightFromExcel),
]