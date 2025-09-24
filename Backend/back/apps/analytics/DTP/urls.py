from django.urls import path

from .views import createDTP, getDTP

urlpatterns = [
    path("create", createDTP),
    path("get", getDTP),
]