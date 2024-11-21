from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Pet, UserProfile
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Creates fake pet profiles for testing'

    def handle(self, *args, **kwargs):
        test_user, _ = User.objects.get_or_create(
            username='test_user',
            email='test@example.com'
        )
        
        fake_pets = [
            {
                'name': '77',
                'breed': 'Golden Retriever',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*2),
                'location': '5026 Cypress St, Pittsburgh, PA',
                'weight': 65,
                'preferred_time': 'Morning',
                'health_states': 'rabies,dhlpp,bordetella'
            },
            {
                'name': 'Rocky',
                'breed': 'German Shepherd',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*3),
                'location': '456 5th Ave, New York, NY',
                'weight': 75,
                'preferred_time': 'Evening',
                'health_states': 'rabies,lyme,influenza'
            },
            {
                'name': 'Bella',
                'breed': 'French Bulldog',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*1.5),
                'location': '789 Madison Ave, New York, NY',
                'weight': 25,
                'preferred_time': 'Midday',
                'health_states': 'rabies,bordetella'
            },
            {
                'name': 'Max',
                'breed': 'Labrador',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*4),
                'location': '321 Broadway, New York, NY',
                'weight': 70,
                'preferred_time': 'Afternoon',
                'health_states': 'rabies,dhlpp,heartworm'
            },
            {
                'name': 'Daisy',
                'breed': 'Poodle',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*2.5),
                'location': '555 Central Park West, New York, NY',
                'weight': 45,
                'preferred_time': 'Morning',
                'health_states': 'rabies,leptospirosis,bordetella'
            }
        ]

        for pet_data in fake_pets:
            pet = Pet.objects.create(
                owner=test_user,
                **pet_data
            )
            self.stdout.write(f'Created pet: {pet.name}')
