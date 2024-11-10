from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetViewSet, RegisterView, LoginView, PetFormView, home, index, login

router = DefaultRouter()
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('api/', include(router.urls)),
    path('login/', login, name='login'),
    path('home/', home, name='home'),
    path('pets/add/', PetFormView.as_view(), name='pet-add'), 
    path('pets/success/', lambda request: render(request, 'api/success.html'), name='pet-success'),  
]
