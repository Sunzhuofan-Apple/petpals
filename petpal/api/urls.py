from django.shortcuts import render
from django.urls import path, include
from django.contrib.auth.views import LogoutView
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, RegisterView, LoginView, PetFormView, home, login
from . import views

router = DefaultRouter()
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('api/', include(router.urls)),
    path('login/', login, name='login'),
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),

    path('pets/add/', PetFormView.as_view(), name='pet-add'), 
    path('pets/success/', lambda request: render(request, 'api/success.html'), name='pet-success'),  
    
    path('api/logout/', views.api_logout, name='logout'),
    
    # path('auth/complete/google-oauth2', views.oauth_complete, name='oauth_complete'),

    path('auth/redirect/', views.oauth_redirect, name='oauth_redirect'),

    # redirect protected pages
    path('ProfileSignUp', views.profileSignUp, name='profileSignUp'),

    path('api/ProfileSignUp', views.profile_setup, name='profile_setup'),

    # path('api/google-login-link/', views.google_login_link, name='google-login-link'),
]
