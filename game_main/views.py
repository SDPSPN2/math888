from django.shortcuts import render
from .GameControl import GameControl
from .GameConsumer import GameConsumer
from django.http import JsonResponse
import json

game = GameControl(10,10)


def game_view(request):
    return render(request, "game.html")


def update(request):
    return JsonResponse({"status": "success", "message": game.targetPosition, "player": [-5,-5]})


def solvePoint(expr, playerPoint, maxX):
    data = []

    for i in range(playerPoint[0], maxX):
        # if(i == 0):
        #     continue
        x = i
        y = eval(expr)
        data.append([x*40,y*40])

    return data

def calculate(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        equation = data.get('equation', '')  

        print(equation)

        points_array = []

        try:
            eq = equation.replace("y=", "").strip()
            points_array = solvePoint(str(eq), [0,0], 20)
           
            #     points_array.append([x, y]) 
        except Exception as e:
            print(f"Error processing equation: {e}")

        print(points_array)

    return JsonResponse({"pointsArray":points_array})