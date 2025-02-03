from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    character_name = forms.CharField(max_length=50, required=True) 

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'character_name', 'password1', 'password2']
