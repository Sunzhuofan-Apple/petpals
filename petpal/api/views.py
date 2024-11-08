from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Pet
from .serializers import PetSerializer
from django.http import HttpResponse

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.views import View
from .forms import RegisterForm

from django.contrib.auth.decorators import login_required

def home(request):
    return HttpResponse("Welcome to the React!")

@login_required
def index(request):
    return render(request, 'api/index.html')

def login(request):
    return render(request, 'api/login.html')

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer


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