from django.urls import path

from .views import createTowTruck, getTowTruck, createTowTruckFromExcel, updateTowTruck, deleteTowTruck

urlpatterns = [
    path("create", createTowTruck),
    path("get", getTowTruck),
    path("createFromExcel", createTowTruckFromExcel),
    path("update", updateTowTruck),
    path("delete", deleteTowTruck),
]