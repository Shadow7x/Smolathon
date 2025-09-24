from django.urls import path

from .views import createReport, getReport, deleteReport

urlpatterns = [
    path("create", createReport),
    path("get", getReport),
    path("delete", deleteReport),
]