from django.urls import path

from .views import createPenalty, getPenalties, createPenaltiesFromExcel, updatePenalty, deletePenalty

urlpatterns = [
    path("createFromExcel", createPenaltiesFromExcel),
    path("create", createPenalty),
    path("get", getPenalties),
    path("update", updatePenalty), 
    path("delete", deletePenalty), 
]