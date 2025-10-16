from django.urls import path

from .views import  getWorkloads, createWorkloadFromExcel

urlpatterns = [

    path("get", getWorkloads),

    path("createFromExcel", createWorkloadFromExcel),
]