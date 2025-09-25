from django.urls import path

from .views import createNews, getNews, updateNews, deleteNews

urlpatterns = [
    path("create", createNews),
    path("get", getNews),
    path("update", updateNews),
    path("delete", deleteNews),
]