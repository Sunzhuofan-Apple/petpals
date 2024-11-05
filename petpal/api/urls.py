from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, RegisterView, LoginView, home

router = DefaultRouter()
router.register(r'pets', PetViewSet)


urlpatterns = [
    path('', RegisterView.as_view(), name='register'),
    path('api/', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('home/', home, name='home'),
]