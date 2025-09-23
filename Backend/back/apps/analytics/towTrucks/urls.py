from django.urls import path

from .views import createTowTruck, getTowTruck

urlpatterns = [
    path("create", createTowTruck),
    path("get", getTowTruck),
]