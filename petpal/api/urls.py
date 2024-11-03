from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet
from .views import PetViewSet, home

router = DefaultRouter()
router.register(r'pets', PetViewSet)


urlpatterns = [
    path('', home, name='home'), 
    path('api/', include(router.urls)),
]