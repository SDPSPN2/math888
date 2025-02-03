from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("game/", include("game_main.urls")),
    path("", include("homepage.urls")),
    path("admin/", admin.site.urls),
    path('users/', include('users.urls')),
]

