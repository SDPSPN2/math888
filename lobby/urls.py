from django.urls import path
from .views import lobby_view, game_room

urlpatterns = [
    path('', lobby_view, name="lobby"),
    path("room/<str:room_name>/", game_room, name="game_room"),
]
