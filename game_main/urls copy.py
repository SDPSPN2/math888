from django.urls import path
from .views3 import *

urlpatterns = [
    path("<str:username>/", game_view, name="game"),
    path("test/", game_view_test, name="game_test"),
    path('update/<str:username>/', update, name='update_game'),  # อัปเดตให้รองรับ username
    path('update/test/', update_test, name='update_test'),
    path('cal/<str:username>/', calculate, name='cal'),
    path('delete_enemy/<str:username>/', delete_enemy, name='delete_enemy'),


    # path('game/<str:username>/', game_view, name='game_view'),
    # path('update/<str:username>/', views.update, name='update_game'),
    # path('delete_enemy/<str:username>/', views.delete_enemy, name='delete_enemy'),
    # path('calculate/', views.calculate, name='calculate'),
]




# urlpatterns = [
#    path("game/<str:username>/", game_view, name="game"),
#    path("test/", game_view_test, name="game_test"),
#    path('update/<str:username>/', update, name='update_game'),  # อัปเดตให้รองรับ username
#    path('update/test/', update_test, name='update_test'),
#    path('cal/<str:username>/', calculate, name='cal'),
#    path('delete_enemy/<str:username>/', delete_enemy, name='delete_enemy'),
# ]