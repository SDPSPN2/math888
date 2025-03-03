from django.shortcuts import render
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt


# def game_view_test(request):
#     return render(request, "game.html")

# def update_test(request):
#     return JsonResponse({"status": "success", "message": [[1,1]], "player": [0,0]})

def game_view(request):
    return render(request, "game.html")


def update(request):
    return 0
    # return JsonResponse({"status": "success", "message": game.targetPosition, "player": game.playerPosition})


# def solvePoint(expr, playerPoint, maxX):
#     data = []

#     for i in range(playerPoint[0], maxX):
#         x = i
#         y = eval(expr)
#         data.append([x*40,y*40])

#     return data

# @csrf_exempt 
# def delete_enemy(request):
#     if request.method == 'POST':
#         # Parse the incoming JSON data
#         data = json.loads(request.body)
#         point_to_delete = data.get('point')

#         print(point_to_delete,  game.targetPosition)
#         # # Check if the point exists and delete it
#         if point_to_delete in game.targetPosition:
#             game.targetPosition.remove(point_to_delete)

#         print(game.targetPosition)
#         return JsonResponse({'status': 'success', 'message': 'Point deleted successfully'})

#     return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# def calculate(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         equation = data.get('equation', '')  

#         # print(equation)

#         points_array = []

#         try:
#             eq = equation.replace("y=", "").strip()
#             points_array = solvePoint(str(eq), [0,0], 20)
#             print(eq)
           
#             #     points_array.append([x, y]) 
#         except Exception as e:
#             print(f"Error processing equation: {e}")

#         # print(points_array)

#     return JsonResponse({"pointsArray":points_array})