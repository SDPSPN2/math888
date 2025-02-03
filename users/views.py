from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login  # ✅ เพิ่ม import
from django.contrib import messages
from django.contrib.auth import get_user_model

User = get_user_model()

def register(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        charactername = request.POST.get('charactername')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 == password2:
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already taken.")
            elif User.objects.filter(email=email).exists():
                messages.error(request, "Email already registered.")
            elif User.objects.filter(character_name=charactername).exists():
                messages.error(request, "This character name is already taken.")
            else:
                user = User.objects.create_user(username=username, character_name=charactername, email=email, password=password1)
                user.save()
                messages.success(request, "Account created successfully!")
                return redirect("login")  # ✅ เพิ่มให้ redirect ไปหน้า login

        else:
            messages.error(request, "Passwords do not match.")
    
    return render(request, "register.html")


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        print(username, password)

        user = authenticate(request, username=username, password=password)  
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password.") 

    return render(request, 'login.html')
