from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.http import require_GET

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pet, UserProfile, WagHistory
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
        user_pet = Pet.objects.get(owner=request.user)
        return Response({
            'id': user_pet.id,
            'name': user_pet.name,
            'breed': user_pet.breed,
            'sex': user_pet.sex,
            'birth_date': user_pet.birth_date,
            'weight': user_pet.weight,
            'location': user_pet.location,
            'preferred_time': user_pet.preferred_time,
            'health_states': user_pet.health_states,
            'characters': user_pet.characters,
            'red_flags': user_pet.red_flags,
            'photos': user_pet.photos,
        })
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found'}, status=404)
    except Exception as e:
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

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_matching_recommendations(request):
#     try:
#         # Get the current user's pet location
#         user_profile = UserProfile.objects.get(user=request.user)
#         if not user_profile.pet:
#             return Response({'error': 'User has no pet'}, status=404)
        
#         user_location = user_profile.pet.location
        
#         # Get all pets except the user's own pet
#         other_pets = Pet.objects.exclude(owner=request.user)
        
#         # Calculate distances and create recommendation list
#         recommendations = []
#         for pet in other_pets:
#             try:
#                 distance = calculate_distance(user_location, pet.location)
#                 recommendations.append({
#                     'name': pet.name,
#                     'breed': pet.breed,
#                     'sex': pet.sex,
#                     'birth_date': pet.birth_date,
#                     'weight': pet.weight,
#                     'location': pet.location,
#                     'preferred_time': pet.preferred_time,
#                     'health_states': pet.health_states,
#                     'distance': round(distance, 1)  # Round to 1 decimal place
#                 })
#             except Exception as e:
#                 print(f"Error calculating distance for pet {pet.name}: {str(e)}")
#                 continue
        
#         # Sort recommendations by distance
#         recommendations.sort(key=lambda x: x['distance'])
        
#         return Response(recommendations)
#     except UserProfile.DoesNotExist:
#         return Response({'error': 'User profile not found'}, status=404)
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_sorted_profiles(request):
#     try:
#         user_profile = UserProfile.objects.get(user=request.user)
        
#         if not user_profile.pet or not user_profile.pet.location:
#             print("No pet or location found for user")
#             return Response({'error': 'User pet location not found'}, status=400)
            
#         user_location = user_profile.pet.location
        
#         all_pets = Pet.objects.exclude(owner=request.user)
        
#         # Print all pets for debugging
#         # for pet in all_pets:
#         #     print(f"""
#         #         Pet Details:
#         #         - Name: {pet.name}
#         #         - Breed: {pet.breed}
#         #         - Location: {pet.location}
#         #         - Owner: {pet.owner.username}
#         #         - Birth Date: {pet.birth_date}
#         #         - Weight: {pet.weight}
#         #         - Preferred Time: {pet.preferred_time}
#         #         - Health States: {pet.health_states}
#         #         - Photos: {pet.photos}
#         #     """)
        
#         profiles = []
#         for pet in all_pets:
#             try:
#                 distance = calculate_distance(user_location, pet.location)
#                 # print(f"Calculated distance for {pet.name}: {distance} miles")
                
#                 profile_data = {
#                     'id': pet.id,
#                     'name': pet.name,
#                     'breed': pet.breed,
#                     'age': (datetime.now().date() - pet.birth_date).days // 365,
#                     'weight': pet.weight,
#                     'distance': round(distance, 1),
#                     'location': pet.location,
#                     'preferred_time': pet.preferred_time,
#                     'health_states': pet.health_states,
#                     'photos': pet.photos,
#                 }
#                 profiles.append(profile_data)
#                 # print(f"Added profile: {profile_data}")
                
#             except Exception as e:
#                 print(f"Error calculating distance for pet {pet.name}: {str(e)}")
#                 continue
                
#         sorted_profiles = sorted(profiles, key=lambda x: x['distance'])
        
#         return Response(sorted_profiles)
#     except Exception as e:
#         print(f"Error in get_sorted_profiles: {str(e)}")
#         return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def matching(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        
        if not user_profile.pet or not user_profile.pet.location:
            print("No pet or location found for user")
            return Response({'error': 'User pet location not found'}, status=400)

        result = process_target_pet(user_profile.pet.id, request.user.id)
        return JsonResponse({'results': result}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
class MatchingAPIView(APIView):
    def post(self, request):
        try:
            pet_id = request.data
            pet_info = Pet.objects.get(id=pet_id)
            result = process_target_pet(pet_id)
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
def follow_pet(request, pet_id):
    print(f"Received follow request for pet {pet_id}")
    print(f"User authenticated: {request.user.is_authenticated}")
    print(f"User: {request.user.username}")
    
    try:
        pet_to_follow = Pet.objects.get(id=pet_id)
        print(f"Found pet to follow: {pet_to_follow.name}")
        
        user_pet = Pet.objects.get(owner=request.user)
        print(f"Found user's pet: {user_pet.name}")
        
        if request.user in pet_to_follow.followers.all():
            print("User already following this pet")
            return Response({'message': 'Already following this pet'}, status=200)
            
        pet_to_follow.followers.add(request.user)
        user_pet.following.add(pet_to_follow.owner)
        print("Successfully added follower relationship")
        
        return Response({
            'message': 'Successfully followed pet',
            'isFollowing': True
        }, status=200)
        
    except Pet.DoesNotExist as e:
        print(f"Pet not found error: {str(e)}")
        return Response({'error': 'Pet not found'}, status=404)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_following(request):
    try:
        user_pet = Pet.objects.get(owner=request.user)
        following_users = user_pet.following.all()
        following_data = []
        
        for followed_user in following_users:
            try:
                followed_pet = Pet.objects.get(owner=followed_user)
                following_data.append({
                    'id': followed_pet.id,
                    'name': followed_pet.name
                })
            except Pet.DoesNotExist:
                continue
                
        return Response({'following': following_data}, status=200)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_pet(request, pet_id):
    print(f"Received unfollow request for pet {pet_id}")
    print(f"User authenticated: {request.user.is_authenticated}")
    print(f"User: {request.user.username}")
    
    try:
        pet_to_unfollow = Pet.objects.get(id=pet_id)
        print(f"Found pet to unfollow: {pet_to_unfollow.name}")
        
        user_pet = Pet.objects.get(owner=request.user)
        print(f"Found user's pet: {user_pet.name}")
        
        if request.user not in pet_to_unfollow.followers.all():
            print("User is not following this pet")
            return Response({'message': 'Not following this pet'}, status=200)
            
        pet_to_unfollow.followers.remove(request.user)
        user_pet.following.remove(pet_to_unfollow.owner)
        print("Successfully removed follower relationship")
        
        return Response({
            'message': 'Successfully unfollowed pet',
            'isFollowing': False
        }, status=200)
        
    except Pet.DoesNotExist as e:
        print(f"Pet not found error: {str(e)}")
        return Response({'error': 'Pet not found'}, status=404)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request):
    try:
        user_pet = Pet.objects.get(owner=request.user)
        followers_data = []
        
        for follower in user_pet.followers.all():
            try:
                follower_pet = Pet.objects.get(owner=follower)
                followers_data.append({
                    'id': follower_pet.id,
                    'name': follower_pet.name,
                    'hasWaggedBack': WagHistory.objects.filter(
                        wagger=request.user,
                        wagged_to=follower
                    ).exists()
                })
            except Pet.DoesNotExist:
                continue
                
        return Response({'followers': followers_data}, status=200)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wag_back(request, follower_id):
    try:
        follower_pet = Pet.objects.get(id=follower_id)
        user_pet = Pet.objects.get(owner=request.user)
        
        WagHistory.objects.create(
            wagger=request.user,
            wagged_to=follower_pet.owner
        )
        
        follower_pet.followers.add(request.user)
        user_pet.following.add(follower_pet.owner)
        
        return Response({
            'message': 'Successfully wagged back',
            'isFollowing': True
        }, status=200)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_pet_exists(request):
    try:
        user_profile = UserProfile.objects.filter(user=request.user).first()
        has_pet = user_profile and user_profile.pet is not None
        return Response({"has_pet": has_pet}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_pet(request):
    try:
        pet_data = request.data
        if not isinstance(pet_data.get('health_states'), list):
            return Response({'error': 'Health states must be a list.'}, status=400)
        if not isinstance(pet_data.get('characters'), list):
            return Response({'error': 'Characters must be a list.'}, status=400)
        if not isinstance(pet_data.get('red_flags'), list):
            return Response({'error': 'Red flags must be a list.'}, status=400)
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            pet = user_profile.pet
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=404)
        except Pet.DoesNotExist:
            return Response({'error': 'Pet not found'}, status=404)

        pet.name = pet_data['name']
        pet.sex = pet_data['sex']
        pet.preferred_time = pet_data['preferred_time']
        pet.breed = pet_data['breed']
        pet.birth_date = pet_data['birth_date']
        pet.location = pet_data['location']
        pet.weight = float(pet_data['weight'])
        pet.health_states = pet_data['health_states']
        pet.characters = pet_data['characters']
        pet.red_flags = pet_data['red_flags']
        pet.photos = pet_data.get('photos', [])
        
        pet.save()

        return Response({'message': 'Pet profile updated successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
