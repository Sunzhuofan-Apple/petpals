from django.contrib.auth.models import User
from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class Pet(models.Model):
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
    #latitude = models.FloatField() 
    #longitude = models.FloatField()  
    weight = models.FloatField()
    health_states = models.TextField()  

    def __str__(self):
        return f"{self.name} ({self.breed})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    picture = models.URLField(max_length=500, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)

    pet = models.OneToOneField(Pet, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.user.username