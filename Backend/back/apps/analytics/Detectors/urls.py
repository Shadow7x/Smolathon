from django.urls import path

from .views import getDetectors, createDetectersFromExcel

urlpatterns = [
    path("get", getDetectors),
    path("createFromExcel", createDetectersFromExcel),

]