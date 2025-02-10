from django.urls import path
from .views import *

urlpatterns = [
    path("", game_view, name="game"),
    path('update/', update, name='update'),
    path('cal/', calculate, name='cal'),
]
