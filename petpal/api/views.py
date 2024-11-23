from datetime import datetime
from urllib.parse import urlencode
import json

from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pet, UserProfile
from .forms import PetForm, RegisterForm
from .serializers import PetSerializer
from .filters import process_target_pet
import googlemaps
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Pet, UserProfile, WagHistory



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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profile_setup(request):
    try:
        pet_data = request.data
        # 检查health_states, characters, red_flags是否为列表
        if not isinstance(pet_data.get('health_states'), list):
            return Response({'error': 'Health states must be a list.'}, status=400)
        if not isinstance(pet_data.get('characters'), list):
            return Response({'error': 'Characters must be a list.'}, status=400)
        if not isinstance(pet_data.get('red_flags'), list):
            return Response({'error': 'Red flags must be a list.'}, status=400)
        
        pet = Pet.objects.create(
            owner=request.user,
            name=pet_data['name'],
            sex=pet_data['sex'],
            preferred_time=pet_data['preferred_time'],
            breed=pet_data['breed'],
            birth_date=pet_data['birth_date'],
            location=pet_data['location'],
            weight=float(pet_data['weight']),
            health_states=pet_data['health_states'],
            characters=pet_data['characters'],
            red_flags=pet_data['red_flags'],
            photos=pet_data.get('photos', []),
        )

        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        user_profile.pet = pet
        user_profile.save()

        return Response({'message': 'Profile created successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

        


# helper function to check path suffix:
def validate_url(next_url):
    if not (next_url and next_url in settings.ALLOWED_PATH_SUFFIXES):
        next_url = ''
    return next_url

def calculate_distance(start, end):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    distance = gmaps.distance_matrix(start, end)
    return distance['rows'][0]['elements'][0]['distance']['value'] / 1609.34 # convert to miles

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def match_pet(request):
    try:
        print(f"Checking user profile for: {request.user.username}")
        user_profile = UserProfile.objects.get(user=request.user)
        print(f"Found user profile: {user_profile}")
        
        if user_profile.pet:
            print(f"Found pet: {user_profile.pet.__dict__}")
            return Response({
                'name': user_profile.pet.name,
                'breed': user_profile.pet.breed,
                'sex': user_profile.pet.sex,
                'birth_date': user_profile.pet.birth_date,
                'weight': user_profile.pet.weight,
                'location': user_profile.pet.location,
                'preferred_time': user_profile.pet.preferred_time,
                'health_states': user_profile.pet.health_states,
                'photos': user_profile.pet.photos,
            })
        print("No pet found for user profile")
        return Response({'error': 'No pet found'}, status=404)
    except UserProfile.DoesNotExist:
        print(f"UserProfile does not exist for user: {request.user.username}")
        return Response({'error': 'User profile not found'}, status=404)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_pet(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        if user_profile.pet:
            return Response({
                'name': user_profile.pet.name,
                'breed': user_profile.pet.breed,
                'sex': user_profile.pet.sex,
                'birth_date': user_profile.pet.birth_date,
                'weight': user_profile.pet.weight,
                'location': user_profile.pet.location,
                'preferred_time': user_profile.pet.preferred_time,
                'health_states': user_profile.pet.health_states,
                'characters': user_profile.pet.characters,
                'red_flags': user_profile.pet.red_flags,
                'photos': user_profile.pet.photos,
            })

        return Response({'error': 'No pet found'}, status=404)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)


@login_required
def matching_redirect(request):
    return redirect('http://localhost:3000/Matching')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matching_recommendations(request):
    try:
        # Get the current user's pet location
        user_profile = UserProfile.objects.get(user=request.user)
        if not user_profile.pet:
            return Response({'error': 'User has no pet'}, status=404)
        
        user_location = user_profile.pet.location
        
        # Get all pets except the user's own pet
        other_pets = Pet.objects.exclude(owner=request.user)
        
        # Calculate distances and create recommendation list
        recommendations = []
        for pet in other_pets:
            try:
                distance = calculate_distance(user_location, pet.location)
                recommendations.append({
                    'name': pet.name,
                    'breed': pet.breed,
                    'sex': pet.sex,
                    'birth_date': pet.birth_date,
                    'weight': pet.weight,
                    'location': pet.location,
                    'preferred_time': pet.preferred_time,
                    'health_states': pet.health_states,
                    'distance': round(distance, 1)  # Round to 1 decimal place
                })
            except Exception as e:
                print(f"Error calculating distance for pet {pet.name}: {str(e)}")
                continue
        
        # Sort recommendations by distance
        recommendations.sort(key=lambda x: x['distance'])
        
        return Response(recommendations)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sorted_profiles(request):
    try:
        print("=== Debug: Starting get_sorted_profiles ===")
        user_profile = UserProfile.objects.get(user=request.user)
        print(f"Found user profile for: {request.user.username}")
        
        if not user_profile.pet or not user_profile.pet.location:
            print("No pet or location found for user")
            return Response({'error': 'User pet location not found'}, status=400)
            
        user_location = user_profile.pet.location
        print(f"User pet location: {user_location}")
        
        all_pets = Pet.objects.exclude(owner=request.user)
        print(f"Total pets found (excluding user's): {all_pets.count()}")
        
        # Print all pets for debugging
        for pet in all_pets:
            print(f"""
                Pet Details:
                - Name: {pet.name}
                - Breed: {pet.breed}
                - Location: {pet.location}
                - Owner: {pet.owner.username}
                - Birth Date: {pet.birth_date}
                - Weight: {pet.weight}
                - Preferred Time: {pet.preferred_time}
                - Health States: {pet.health_states}
                - Photos: {pet.photos}
            """)
        
        profiles = []
        for pet in all_pets:
            try:
                distance = calculate_distance(user_location, pet.location)
                print(f"Calculated distance for {pet.name}: {distance} miles")
                
                profile_data = {
                    'name': pet.name,
                    'breed': pet.breed,
                    'age': (datetime.now().date() - pet.birth_date).days // 365,
                    'weight': pet.weight,
                    'distance': round(distance, 1),
                    'location': pet.location,
                    'preferred_time': pet.preferred_time,
                    'health_states': pet.health_states,
                    'photos': pet.photos,
                }
                profiles.append(profile_data)
                print(f"Added profile: {profile_data}")
                
            except Exception as e:
                print(f"Error calculating distance for pet {pet.name}: {str(e)}")
                continue
                
        sorted_profiles = sorted(profiles, key=lambda x: x['distance'])
        print(f"Final number of profiles: {len(sorted_profiles)}")
        print("=== Debug: Ending get_sorted_profiles ===")
        
        return Response(sorted_profiles)
    except Exception as e:
        print(f"Error in get_sorted_profiles: {str(e)}")
        return Response({'error': str(e)}, status=400)

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
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_photos(request):
    try:
        uploaded_files = request.FILES.getlist('photos')  
        photo_urls = []

        for file in uploaded_files:
            file_path = default_storage.save(f'photos/{file.name}', file)

            photo_url = request.build_absolute_uri(f"{settings.MEDIA_URL}{file_path}")
            photo_urls.append(photo_url)

        return Response({'photos': photo_urls}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)


from django.utils.http import urlencode

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_pet(request):
    try:
        user = request.user
        pet = Pet.objects.filter(owner=user).first()

        if not pet:
            return Response({"error": "No pet found for the current user."}, status=404)

        pet_data = {
            "name": pet.name,
            "sex": pet.sex,
            "preferred_time": pet.preferred_time,
            "breed": pet.breed,
            "birth_date": pet.birth_date,
            "location": pet.location,
            "weight": pet.weight,
            "health_states": pet.health_states if isinstance(pet.health_states, list) else pet.health_states.split(','),
            "characters": pet.characters if isinstance(pet.characters, list) else pet.characters.split(','),
            "red_flags": pet.red_flags if isinstance(pet.red_flags, list) else pet.red_flags.split(','),
            "photos": pet.photos,
        }

        return Response(pet_data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wag_pet(request):
    try:
        wagged_user_id = request.data.get('wagged_user_id')
        wagged_user = User.objects.get(id=wagged_user_id)

        WagHistory.objects.create(
            wagger=request.user,
            wagged_to=wagged_user
        )

        return Response({'message': 'Wagged successfully!'}, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
