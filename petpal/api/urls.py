from django.shortcuts import render
from django.urls import path, include
from django.contrib.auth.views import LogoutView
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, RegisterView, LoginView, PetFormView, home, login

router = DefaultRouter()
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('', home, name='home'),
    path('api/', include(router.urls)),
    path('login/', login, name='login'),
    path('pets/add/', PetFormView.as_view(), name='pet-add'), 
    path('pets/success/', lambda request: render(request, 'api/success.html'), name='pet-success'),  
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
]
