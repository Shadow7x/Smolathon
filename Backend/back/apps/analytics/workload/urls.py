from django.urls import path

from .views import  getWorkloads, createWorkloadFromExcel, getAdjacencies

urlpatterns = [

    path("get", getWorkloads),

    path("createFromExcel", createWorkloadFromExcel),
    path("getAdjacencies", getAdjacencies),
]