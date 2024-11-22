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

from django.views.decorators.http import require_GET
from urllib.parse import urlencode

from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth import logout

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .filters import process_target_pet

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# --- authentication methods ---

# # get oauth redirect link
# def google_login_link(request):
#     google_login_url = reverse('social:begin', args=['google-oauth2'])
#     return JsonResponse({'google_login_url': google_login_url})

# # custom oauth complete
# def oauth_complete(request):
#     print("oauth_complete")
#     # add additional user data
#     if request.user.is_authenticated:
#         return JsonResponse({"message": "User is authenticated",
#                              "user": request.user}, status=200)
#     return JsonResponse({"message": "User is not authenticated"}, status=401)
    
# Custom login required decorator, return json response
def custom_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        next_url = request.GET.get('next', '')
        next_url = validate_url(next_url)
        if not request.user.is_authenticated:
            return JsonResponse({"is_authenticated": False}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

@require_GET
@custom_login_required
def oauth_redirect(request):
    return JsonResponse({"is_authenticated": request.user.is_authenticated,
                         "username": request.user.username,
                         }, status=200)

# Custom redirect
@login_required
def profileSignUp(request):
    return redirect('http://localhost:3000/ProfileSignUp')

@login_required
def api_logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({"message": "Successfully logged out"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)

import googlemaps

def home(request):
    return render(request, 'api/home.html')

def login(request):
    return render(request, 'api/login.html')

def home(request):
    return render(request, 'api/home.html')

class PetViewSet(ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)  


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

@login_required
def profile_setup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            serializer = PetSerializer(data=data)
            if serializer.is_valid():
                serializer.save(owner=request.user) 
                return JsonResponse({"message": "Pet profile created successfully!"}, status=201)
            else:
                return JsonResponse({"errors": serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# helper function to check path suffix:
def validate_url(next_url):
    if not (next_url and next_url in settings.ALLOWED_PATH_SUFFIXES):
        next_url = ''
    return next_url

def calculate_distance(start, end):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    distance = gmaps.distance_matrix(start, end)
    return distance['rows'][0]['elements'][0]['distance']['value'] / 1609.34 # convert to miles

def matching(request):
    if request.method == 'POST':
        try:
            target_pet = json.loads(request.body)
            result = process_target_pet(target_pet)
            return JsonResponse({'results': result}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
class MatchingAPIView(APIView):
    def post(self, request):
        try:
            target_pet = request.data
            result = process_target_pet(target_pet)
            return Response({'results': result}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    
    def get(self, request):
        return Response({'error': 'Invalid request method'}, status=405)