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
                'name': 'Dry',
                'breed': 'Golden Retriever',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*2),
                'location': '5026 Cypress St, Pittsburgh, PA',
                'weight': 65,
                'preferred_time': 'Morning',
                'health_states': 'rabies,dhlpp,bordetella',
                'characters': 'Active,Friendly,Playful',
                'red_flags': 'Not Trained,Big Dog'
            },
            {
                'name': 'Rocky',
                'breed': 'German Shepherd',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*3),
                'location': '456 5th Ave, New York, NY',
                'weight': 75,
                'preferred_time': 'Evening',
                'health_states': 'rabies,lyme,influenza',
                'characters': 'Protective,Independent,Active',
                'red_flags': 'Not Good with Small Dogs,Barks a Lot'
            },
            {
                'name': 'Bella',
                'breed': 'French Bulldog',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*1.5),
                'location': '789 Madison Ave, New York, NY',
                'weight': 25,
                'preferred_time': 'Midday',
                'health_states': 'rabies,bordetella',
                'characters': 'Gentle,Love Sleep,Calm',
                'red_flags': 'Separation Anxiety'
            },
            {
                'name': 'Max',
                'breed': 'Labrador',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*4),
                'location': '321 Broadway, New York, NY',
                'weight': 70,
                'preferred_time': 'Afternoon',
                'health_states': 'rabies,dhlpp,heartworm',
                'characters': 'Social,Independent,Gentle',
                'red_flags': 'Not Neutered,Too Energetic'
            },
            {
                'name': 'Daisy',
                'breed': 'Poodle',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*2.5),
                'location': '555 Central Park West, New York, NY',
                'weight': 45,
                'preferred_time': 'Morning',
                'health_states': 'rabies,leptospirosis,bordetella',
                'characters': 'Calm,Gentle,Love Sleep',
                'red_flags': 'Not Active Dog,Not Socialized'
            },
            {
                'name': 'Shadow',
                'breed': 'Border Collie',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*1.8),
                'location': '4765 Forbes Ave, Pittsburgh, PA',
                'weight': 45,
                'preferred_time': 'Morning',
                'health_states': 'rabies,dhlpp,bordetella,lyme',
                'characters': 'Active,Curious,Protective',
                'red_flags': 'Not Good with Small Dogs,Resource Guarding'
            },
            {
                'name': 'Luna',
                'breed': 'Shih Tzu',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*3.5),
                'location': '230 McKee Pl, Pittsburgh, PA',
                'weight': 12,
                'preferred_time': 'Afternoon',
                'health_states': 'rabies,bordetella,influenza',
                'characters': 'Gentle,Love Sleep,Calm',
                'red_flags': 'Big Dog,Too Energetic'
            },
            {
                'name': 'Zeus',
                'breed': 'German Shepherd',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*2.2),
                'location': '3959 Fifth Ave, Pittsburgh, PA',
                'weight': 85,
                'preferred_time': 'Evening',
                'health_states': 'rabies,dhlpp,leptospirosis',
                'characters': 'Protective,Independent,Social',
                'red_flags': 'Not Trained,Not Neutered'
            },
            {
                'name': 'Coco',
                'breed': 'Cocker Spaniel',
                'sex': 'Female',
                'birth_date': datetime.now() - timedelta(days=365*1.3),
                'location': '5000 Forbes Ave, Pittsburgh, PA',
                'weight': 28,
                'preferred_time': 'Midday',
                'health_states': 'rabies,bordetella,heartworm',
                'characters': 'Friendly,Playful,Social',
                'red_flags': 'Separation Anxiety'
            },
            {
                'name': 'Bear',
                'breed': 'Newfoundland',
                'sex': 'Male',
                'birth_date': datetime.now() - timedelta(days=365*4),
                'location': '1212 Smallman St, Pittsburgh, PA',
                'weight': 130,
                'preferred_time': 'Morning',
                'health_states': 'rabies,dhlpp,lyme,bordetella',
                'characters': 'Gentle,Calm,Friendly',
                'red_flags': 'Not Active Dog,Barks a Lot'
            }
        ]

        for pet_data in fake_pets:
            pet = Pet.objects.create(
                owner=test_user,
                **pet_data
            )
            self.stdout.write(f'Created pet: {pet.name}')
