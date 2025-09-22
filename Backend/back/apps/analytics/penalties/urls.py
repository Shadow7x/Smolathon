from django.urls import path

from .views import createPenalties

urlpatterns = [
    path("create", createPenalties),
]