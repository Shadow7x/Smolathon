from django.urls import path, include
from .views import login, logout, info

urlpatterns = [
    path("login", login),
    path("logout", logout),
    path("info", info),
]
