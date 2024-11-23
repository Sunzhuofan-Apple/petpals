from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from django.urls import path, include
from django.contrib.auth.views import LogoutView
from rest_framework.routers import DefaultRouter
from .views import (
    PetViewSet,
    RegisterView,
    LoginView,
    PetFormView,
    home,
    login,
    match_pet,
    get_user_pet,
    get_matching_recommendations,
    get_sorted_profiles,
    upload_photos,  
    check_pet_exists,
    follow_pet,
    get_following,
    unfollow_pet,
    get_followers,
    wag_back,
)
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
    path('auth/redirect/', views.oauth_redirect, name='oauth_redirect'),
    path('ProfileSignUp/', views.profileSignUp, name='profileSignUp'),
    path('api/ProfileSignUp/', views.profile_setup, name='profile_setup'),
    # path('api/matching/', views.MatchingAPIView.as_view(), name='matching'),
    path('api/matching/', views.matching, name='matching'),
    path('api/user-pet/', views.get_user_pet, name='user-pet'),
    path('api/match-pet/', views.match_pet, name='match_pet'),
    path('api/sorted-profiles/', get_sorted_profiles, name='sorted-profiles'),
    path('api/upload-photos/', views.upload_photos, name='upload-photos'),  
    path('api/user-pet/', get_user_pet, name='get_user_pet'),
    path('api/check-pet-exists/', check_pet_exists, name='check-pet-exists'),
    path('api/follow-pet/<int:pet_id>/', views.follow_pet, name='follow-pet'),
    path('api/following/', views.get_following, name='get-following'),
    path('api/followers/', views.get_followers, name='get-followers'),
    path('api/unfollow-pet/<int:pet_id>/', views.unfollow_pet, name='unfollow-pet'),
    path('api/wag-back/<int:follower_id>/', views.wag_back, name='wag-back'),
]

if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
