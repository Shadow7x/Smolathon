from django.urls import path

from .views import createDocs, getDocs, updateDocs, deleteDocs

urlpatterns = [
    path("create", createDocs),
    path("get", getDocs),
    path("update", updateDocs),
    path("delete", deleteDocs),
]