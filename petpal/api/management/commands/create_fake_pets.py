from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Pet, UserProfile
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Creates fake pet profiles for testing'

    def handle(self, *args, **kwargs):
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
            },
            {
                "name": "Xavier",
                "sex": "Neutered",
                "preferred_time": "Afternoon",
                "breed": "Labrador",
                "birth_date": "2024-10-04",
                "location": "100 Art Rooney Ave, Pittsburgh, PA 15212",
                "weight": 16.8,
                "health_states": "dhlpp",
                "characters": "Protective",
                "red_flags": "Aggressive, Not Trained"
            },
            {
                "name": "Ricardo",
                "sex": "Female",
                "preferred_time": "Evening",
                "breed": "Beagle",
                "birth_date": "2018-05-04",
                "location": "200 Ross St, Pittsburgh, PA 15219",
                "weight": 8.3,
                "health_states": "bordetella, heartworm, rabies, leptospirosis",
                "characters": "Active, Love Sleep",
                "red_flags": "Not Trained, Barks a Lot"
            },
            {
                "name": "Susan",
                "sex": "Female",
                "preferred_time": "Midday",
                "breed": "Labrador",
                "birth_date": "2015-03-02",
                "location": "4200 Fifth Ave, Pittsburgh, PA 15260",
                "weight": 35.0,
                "health_states": "dhlpp, leptospirosis, rabies",
                "characters": "Calm",
                "red_flags": "Big Dog"
            },
            {
                "name": "Katherine",
                "sex": "Male",
                "preferred_time": "Midday",
                "breed": "Labrador",
                "birth_date": "2015-06-24",
                "location": "625 Liberty Ave, Pittsburgh, PA 15222",
                "weight": 16.9,
                "health_states": "dhlpp, leptospirosis, lyme, influenza",
                "characters": "Gentle",
                "red_flags": ""
            },
            {
                "name": "Ronald",
                "sex": "Male",
                "preferred_time": "Midday",
                "breed": "Poodle",
                "birth_date": "2022-04-25",
                "location": "1 PPG Place, Pittsburgh, PA 15222",
                "weight": 20.0,
                "health_states": "dhlpp, leptospirosis, rabies",
                "characters": "Protective, Social",
                "red_flags": "Barks a Lot, Big Dog"
            },
            {
                "name": "Eric",
                "sex": "Male",
                "preferred_time": "Morning",
                "breed": "Labrador",
                "birth_date": "2018-06-14",
                "location": "5800 Baum Blvd, Pittsburgh, PA 15206",
                "weight": 47.7,
                "health_states": "influenza",
                "characters": "Protective, Independent, Calm",
                "red_flags": "Not Trained"
            },
            {
                "name": "Dawn",
                "sex": "Neutered",
                "preferred_time": "Midday",
                "breed": "Bulldog",
                "birth_date": "2019-04-12",
                "location": "4400 Forbes Ave, Pittsburgh, PA 15213",
                "weight": 30.3,
                "health_states": "rabies, lyme, bordetella",
                "characters": "Calm",
                "red_flags": ""
            },
            {
                "name": "Luke",
                "sex": "Neutered",
                "preferred_time": "Afternoon",
                "breed": "Dachshund",
                "birth_date": "2017-01-11",
                "location": "100 Art Rooney Ave, Pittsburgh, PA 15212",
                "weight": 12.4,
                "health_states": "lyme, bordetella, leptospirosis, heartworm",
                "characters": "Love Sleep, Playful",
                "red_flags": "Big Dog, Not Socialized"
            },
            {
                "name": "Matthew",
                "sex": "Female",
                "preferred_time": "Evening",
                "breed": "Dachshund",
                "birth_date": "2023-10-16",
                "location": "200 Ross St, Pittsburgh, PA 15219",
                "weight": 9.3,
                "health_states": "influenza, leptospirosis, heartworm, dhlpp",
                "characters": "Social, Active",
                "red_flags": "Barks a Lot"
            },
            {
                "name": "Jason",
                "sex": "Female",
                "preferred_time": "Morning",
                "breed": "Labrador",
                "birth_date": "2020-02-29",
                "location": "4200 Fifth Ave, Pittsburgh, PA 15260",
                "weight": 27.0,
                "health_states": "lyme",
                "characters": "Social",
                "red_flags": ""
            },
            {
                "name": "Crystal",
                "sex": "Female",
                "preferred_time": "Morning",
                "breed": "Poodle",
                "birth_date": "2018-11-01",
                "location": "200 Ross St, Pittsburgh, PA 15219",
                "weight": 47.2,
                "health_states": "lyme, rabies, bordetella, influenza",
                "characters": "Friendly, Active, Calm",
                "red_flags": "Not Neutered"
            },
            {
                "name": "Shawn",
                "sex": "Male",
                "preferred_time": "Afternoon",
                "breed": "Dachshund",
                "birth_date": "2023-10-14",
                "location": "2118 Murray Ave, Pittsburgh, PA 15217",
                "weight": 9.2,
                "health_states": "rabies, influenza",
                "characters": "Curious, Love Sleep, Gentle",
                "red_flags": ""
            },
            {
                "name": "Charles",
                "sex": "Female",
                "preferred_time": "Afternoon",
                "breed": "Dachshund",
                "birth_date": "2022-12-31",
                "location": "5000 Forbes Ave, Pittsburgh, PA 15213",
                "weight": 42.6,
                "health_states": "dhlpp, bordetella",
                "characters": "Active",
                "red_flags": ""
            },
            {
                "name": "Colleen",
                "sex": "Male",
                "preferred_time": "Midday",
                "breed": "Beagle",
                "birth_date": "2020-06-03",
                "location": "5000 Forbes Ave, Pittsburgh, PA 15213",
                "weight": 10.1,
                "health_states": "leptospirosis, heartworm",
                "characters": "Friendly",
                "red_flags": "Not Socialized"
            },
            {
                "name": "Samantha",
                "sex": "Female",
                "preferred_time": "Evening",
                "breed": "Labrador",
                "birth_date": "2018-12-29",
                "location": "100 Art Rooney Ave, Pittsburgh, PA 15212",
                "weight": 30.3,
                "health_states": "heartworm, lyme",
                "characters": "Gentle, Curious",
                "red_flags": "Not Trained, Too Energetic"
            },
            {
                "name": "Brian",
                "sex": "Male",
                "preferred_time": "Evening",
                "breed": "Bulldog",
                "birth_date": "2018-08-13",
                "location": "625 Liberty Ave, Pittsburgh, PA 15222",
                "weight": 36.1,
                "health_states": "bordetella",
                "characters": "Playful, Social",
                "red_flags": ""
            },
            {
                "name": "Dana",
                "sex": "Female",
                "preferred_time": "Evening",
                "breed": "Dachshund",
                "birth_date": "2023-11-24",
                "location": "100 Art Rooney Ave, Pittsburgh, PA 15212",
                "weight": 20.9,
                "health_states": "lyme",
                "characters": "Curious, Calm, Playful",
                "red_flags": "Aggressive, Not Active Dog"
            },
            {
                "name": "Trevor",
                "sex": "Female",
                "preferred_time": "Evening",
                "breed": "Golden Retriever",
                "birth_date": "2023-09-19",
                "location": "625 Liberty Ave, Pittsburgh, PA 15222",
                "weight": 7.0,
                "health_states": "rabies, bordetella",
                "characters": "Active, Curious, Independent",
                "red_flags": ""
            },
            {
                "name": "Carolyn",
                "sex": "Female",
                "preferred_time": "Morning",
                "breed": "Poodle",
                "birth_date": "2015-07-03",
                "location": "1212 Smallman St, Pittsburgh, PA 15222",
                "weight": 21.3,
                "health_states": "lyme, rabies, influenza, leptospirosis",
                "characters": "Independent",
                "red_flags": "Barks a Lot"
            },
            {
                "name": "Tina",
                "sex": "Female",
                "preferred_time": "Midday",
                "breed": "Poodle",
                "birth_date": "2023-12-29",
                "location": "1 PPG Place, Pittsburgh, PA 15222",
                "weight": 19.3,
                "health_states": "heartworm, dhlpp",
                "characters": "Gentle, Calm, Independent",
                "red_flags": "Big Dog"
            },
            {
                "name": "kiki",
                "sex": "Female",
                "preferred_time": "Afternoon",
                "breed": "Eskimo",
                "birth_date": "2019-09-09",
                "location": "5819 Centre Ave, Pittsburgh, PA 15206",
                "weight": 16.8,
                "health_states": "rabies, influenza, dhlpp, bordetella",
                "characters": "Friendly, Curious, Active",
                "red_flags": "Aggressive, Not Trained, Not Neutered"
            },
        ]

        for pet_data in fake_pets:
            owner_username = f"test_{pet_data['name']}Owner"
            owner_email = f"{owner_username}@example.com"
            
            test_user, _ = User.objects.get_or_create(
                username=owner_username,
                email=owner_email
            )
            
            pet = Pet.objects.create(
                owner=test_user,
                **pet_data
            )
            self.stdout.write(f"Created pet: {pet.name} with owner: {test_user.username}")