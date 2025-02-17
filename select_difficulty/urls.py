from django.urls import path
from .views import select_difficulty_view

urlpatterns = [
    path('', select_difficulty_view, name="select_difficulty"),
]