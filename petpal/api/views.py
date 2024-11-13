from django.conf import settings
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
from .models import Pet
from .serializers import PetSerializer
from django.utils.decorators import method_decorator

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from django.contrib.auth import login
from django.http import JsonResponse, HttpResponseRedirect

from django.contrib.auth.models import User
from .models import UserProfile

import requests

def home(request):
    return render(request, 'api/home.html')

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

@method_decorator(login_required, name='dispatch')
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

from urllib.parse import urlencode

# Custom login required decorator
def custom_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        full_path = request.get_full_path()
        next_url = full_path.replace('/api/', '')
        print(f"Next URL: {next_url}")
        print("user", request)
        if not request.user.is_authenticated:
            login_url =  f"{settings.LOGIN_URL}?{urlencode({'next': next_url})}"
            print(f"Redirecting to login URL: {login_url}")
            return redirect(login_url)
        
        return view_func(request, *args, **kwargs)
    
    return wrapper
            

def oauth_complete(request):
    token = request.GET.get('token')
    next_url = request.GET.get('next', '')
    print(f"Token: {token}")
    print("user, ", request.user)

    if not token:
        return JsonResponse({"error": "Token is missing"}, status=400)

    try:
        print(f"User logged in successfully")

        front_end_url = f"http://localhost:3000/{next_url}"
        response = HttpResponseRedirect(front_end_url)
        response.set_cookie('session_token', 'your_session_token', httponly=True, secure=False, samesite='None')
        return response

    except Exception as e:
        error_message = f"Unexpected error: {str(e)}"
        print(error_message)
        return JsonResponse({"error": error_message}, status=500)

@custom_login_required
def profile_setup(request):
    return JsonResponse({"message": "Profile setup page"})