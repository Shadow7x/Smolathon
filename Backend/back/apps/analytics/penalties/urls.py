from django.urls import path

from .views import createPenalties, getPenalties

urlpatterns = [
    path("create", createPenalties),
    path("get", getPenalties),
]