from django.shortcuts import render
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .GameService import GameService

game_service = GameService()  # Initialize GameService instance

def game_view_test(request, username):
    return render(request, "game.html", {'username':username})

def update_test(request, username):
    return JsonResponse({"status": "success", "message": [[1, 1]], "player": [0, 0], "username":username})

def game_view(request, username):
    game_service.create_new_player(username)
    return render(request, "game.html", {'username': username})

def update(request, username):
    # Use the GameService to fetch game status for the specific username
    status = game_service.get_game_status(username)
    return JsonResponse({
        "status": "success", 
        "message": status['targetPosition'], 
        "player": status['playerPosition'], 
        'username': username
    })

@csrf_exempt
def delete_enemy(request, username):
    if request.method == 'POST':
        data = json.loads(request.body)
        point_to_delete = data.get('point')

        print("run")
        
        # Use the GameService to delete the enemy point for the specific username
        response = game_service.delete_enemy(username, point_to_delete)
        return JsonResponse(response)

# def calculate(request, username):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         equation = data.get('equation', '')
        
#         # Use the GameService to calculate the points based on the equation
#         points_array = game_service.calculate(username,equation)
#         print(points_array)

#         return JsonResponse({"pointsArray": points_array})


def calculate(request, username):
    if request.method == 'POST':
        data = json.loads(request.body)
        equation = data.get('equation', '')
        
        # Use the GameService to calculate the points based on the equation
        points_array = game_service.calculate(username,equation)
        print(points_array)

        return JsonResponse({"pointsArray": points_array})
