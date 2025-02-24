from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def lobby_view(request):
    return render(request, "lobby.html")

# def rooom_view(request):
#     return render(request, "room.html")


def game_room(request, room_name):
    return render(request, "room.html", {"room_name": room_name, "username": request.user.username})
