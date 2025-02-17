from django.shortcuts import render

def select_difficulty_view(request):
    return render(request, 'select_difficulty.html')
