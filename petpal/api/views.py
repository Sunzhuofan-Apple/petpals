from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Pet
from .forms import PetForm
from .serializers import PetSerializer
from django.http import HttpResponse

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.views import View
from .forms import RegisterForm
from rest_framework.generics import CreateAPIView
from .models import Pet
from .serializers import PetSerializer



class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

def home(request):
    return HttpResponse("Welcome to the React!")

class RegisterView(View):
    def get(self, request):
        form = RegisterForm()
        return render(request, 'api/register.html', {'form': form})

    def post(self, request):
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
        return render(request, 'api/register.html', {'form': form})

class LoginView(View):
    def get(self, request):
        form = AuthenticationForm()
        return render(request, 'api/login.html', {'form': form})

    def post(self, request):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        return render(request, 'api/login.html', {'form': form})


class PetFormView(View):
    def get(self, request):
        form = PetForm()
        return render(request, 'api/pet_form.html', {'form': form})
    
    def post(self, request):
        form = PetForm(request.POST)
        if form.is_valid():
            form.save()  
            return redirect('pet-success')  
        return render(request, 'api/pet_form.html', {'form': form})  