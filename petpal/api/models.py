from django.contrib.auth.models import User
from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class Pet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100)
    sex = models.CharField(max_length=10, choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Neutered', 'Neutered')
    ])
    preferred_time = models.CharField(max_length=20, choices=[
        ('Morning', 'Morning (6-9 AM)'),
        ('Midday', 'Midday (11 AM - 2 PM)'),
        ('Afternoon', 'Afternoon (3-6 PM)'),
        ('Evening', 'Evening (6-9 PM)')
    ])
    breed = models.CharField(max_length=100)
    birth_date = models.DateField()
    location = models.CharField(max_length=200)
    weight = models.FloatField()
    health_states = models.TextField()  
    characters = models.TextField() 
    red_flags = models.TextField()  
    photos = models.JSONField(default=list) 

    def __str__(self):
        return f"{self.name} ({self.breed})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pet = models.OneToOneField(Pet, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.user.username