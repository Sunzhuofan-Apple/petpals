from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from bs4 import BeautifulSoup
import requests

from .models import Pet, UserProfile

class PetPalTests(TestCase):
    def setUp(self):
        # Create a test client
        self.client = Client()
        
        # Create a test user
        self.test_user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        # Create a test pet with valid address
        self.test_pet = Pet.objects.create(
            owner=self.test_user,
            name='TestDog',
            breed='Labrador',
            sex='Male',
            birth_date='2020-01-01',
            location='4200 Fifth Ave, Pittsburgh, PA',
            weight=25.5,
            preferred_time='Morning',
            health_states='rabies,dhlpp',
            characters='Friendly,Active,Gentle',
            red_flags='Big Dogs,Aggressive Dogs'
        )
        
        # Create user profile
        self.test_profile = UserProfile.objects.create(
            user=self.test_user,
            pet=self.test_pet
        )

    def test_home_page_loads(self):
        """Test that home page loads successfully"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Check if the welcome message exists
        welcome_msg = soup.find('h1')
        self.assertIsNotNone(welcome_msg)
        self.assertEqual(welcome_msg.text.strip(), 'Welcome to Petpals')

    def test_login_page_loads(self):
        """Test that login page loads successfully"""
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        
        # Check for Google login button
        soup = BeautifulSoup(response.content, 'html.parser')
        google_button = soup.find('button', string='Login using Google')
        self.assertIsNotNone(google_button)

    def test_pet_api_unauthorized(self):
        """Test that unauthorized users cannot access pet data"""
        response = self.client.get(reverse('match_pet'))
        self.assertEqual(response.status_code, 403)

    def test_pet_api_authorized(self):
        """Test that authorized users can access pet data"""
        # Login the test user
        self.client.login(username='testuser', password='testpass123')
        
        # Make request to pet API
        response = self.client.get(reverse('match_pet'))
        self.assertEqual(response.status_code, 200)
        
        # Check response data
        data = response.json()
        self.assertEqual(data['name'], 'TestDog')
        self.assertEqual(data['breed'], 'Labrador')

    def test_pet_profile_creation(self):
        """Test creating a new pet profile"""
        self.client.login(username='testuser', password='testpass123')
        
        pet_data = {
            'name': 'NewDog',
            'breed': 'Golden Retriever',
            'sex': 'Female',
            'birth_date': '2021-01-01',
            'location': 'New Location',
            'weight': 30.5,
            'preferred_time': 'Evening',
            'health_states': 'rabies,bordetella',
            'characters': 'Playful,Energetic,Social',
            'red_flags': 'Small Dogs'
        }
        
        response = self.client.post(reverse('profile_setup'), pet_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        
        # Verify pet was created with all fields
        new_pet = Pet.objects.get(name='NewDog')
        self.assertEqual(new_pet.breed, 'Golden Retriever')
        self.assertEqual(new_pet.characters, 'Playful,Energetic,Social')

    def test_matching_sort(self):
        """Test that pets are correctly sorted by distance"""
        self.client.login(username='testuser', password='testpass123')
        
        # Create additional users
        user2 = User.objects.create_user(
            username='testuser2',
            password='testpass123'
        )
        
        user3 = User.objects.create_user(
            username='testuser3',
            password='testpass123'
        )
        
        # Create pets with valid addresses
        pet2 = Pet.objects.create(
            owner=user2,
            name='NearbyDog',
            breed='Husky',
            sex='Female',
            birth_date='2021-01-01',
            location='5026 Cypress St, Pittsburgh, PA',
            weight=30.5,
            preferred_time='Evening',
            health_states='rabies,bordetella',
            characters='Playful,Energetic',
            red_flags='Small Dogs'
        )
        
        pet3 = Pet.objects.create(
            owner=user3,
            name='FarDog',
            breed='Poodle',
            sex='Male',
            birth_date='2019-01-01',
            location='789 Madison Ave, New York, NY',
            weight=20.5,
            preferred_time='Morning',
            health_states='rabies,dhlpp',
            characters='Calm,Gentle',
            red_flags='Aggressive Dogs'
        )
        
        # Make request to sorted profiles API
        response = self.client.get(reverse('sorted-profiles'))
        self.assertEqual(response.status_code, 200)
        
        # Check that profiles are sorted by distance
        data = response.json()
        self.assertTrue(len(data) >= 2, "Should have at least 2 profiles")
        
        # Verify distances are in ascending order
        distances = [profile['distance'] for profile in data]
        self.assertEqual(distances, sorted(distances), 
                        "Profiles should be sorted by distance in ascending order")
        
        # Clean up
        user2.delete()
        user3.delete()
        pet2.delete()
        pet3.delete()

    def tearDown(self):
        # Clean up after tests
        self.test_user.delete()
        self.test_pet.delete()
        self.test_profile.delete()
