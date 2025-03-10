from django.urls import re_path
from .GameConsumer import GameConsumer

websocket_urlpatterns = [
    re_path(r"wss/game/(?P<room_name>\w+)/$", GameConsumer.as_asgi()),
]
