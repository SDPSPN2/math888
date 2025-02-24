from django.urls import path
from .viewsx import *

urlpatterns = [
    path("", game_view, name="game"),
    # path("test/", game_view_test, name="game_test"),
    # path('update/', update, name='update'),
    # path('update/test/', update_test, name='update_test'),
    # path('cal/', calculate, name='cal'),
    # path('delete_enemy/', delete_enemy, name='delete_enemy'),
]
