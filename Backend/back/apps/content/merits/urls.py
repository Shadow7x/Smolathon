from django.urls import path

from .views import createMerit, getMerits, updateMerit, deleteMerit

urlpatterns = [
    path("create", createMerit),
    path("get", getMerits),
    path("update", updateMerit),
    path("delete", deleteMerit),
]
