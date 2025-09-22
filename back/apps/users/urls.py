from django.urls import path, include
from .users import index

urlpatterns = [
    path("", index),
]
