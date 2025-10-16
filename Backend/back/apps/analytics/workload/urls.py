from django.urls import path

from .views import  getWorkloads, createWorkloadFromExcel, getAdjacencies, getCars

urlpatterns = [

    path("get", getWorkloads),

    path("createFromExcel", createWorkloadFromExcel),
    path("getAdjacencies", getAdjacencies),
    path("getCars", getCars),
]