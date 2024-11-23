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
    follow_pet,
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
    path('api/matching/', views.MatchingAPIView.as_view(), name='matching'),
    path('api/user-pet/', views.get_user_pet, name='user-pet'),
    path('Matching/', views.matching_redirect, name='matching_redirect'),
    path('api/match-pet/', views.match_pet, name='match_pet'),
    path('matching-recommendations/', views.get_matching_recommendations, name='matching-recommendations'),
    path('api/sorted-profiles/', get_sorted_profiles, name='sorted-profiles'),
    path('api/upload-photos/', views.upload_photos, name='upload-photos'),  
    path('api/user-pet/', get_user_pet, name='get_user_pet'),
    path('follow-pet/<int:pet_id>/', views.follow_pet, name='follow-pet'),
]

if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
