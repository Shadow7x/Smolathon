from django.urls import path, include

urlpatterns = [
    path("news/", include("apps.content.news.urls")),
    path("docs/", include("apps.content.docs.urls")),
    
]
