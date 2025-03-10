from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView



urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    # path('logout/', LogoutView.as_view(next_page='home'), name='logout'),
    path('logout', views.logout_view, name='logout')
]
