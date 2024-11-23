from django.contrib.auth.models import User
from django.db import models
from django.conf import settings


class Pet(models.Model):
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Neutered', 'Neutered'),
    ]
    PREFERRED_TIME_CHOICES = [
        ('Morning', 'Morning (6-9 AM)'),
        ('Midday', 'Midday (11 AM - 2 PM)'),
        ('Afternoon', 'Afternoon (3-6 PM)'),
        ('Evening', 'Evening (6-9 PM)'),
    ]

    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pet')
    name = models.CharField(max_length=100)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    preferred_time = models.CharField(max_length=20, choices=PREFERRED_TIME_CHOICES)
    breed = models.CharField(max_length=100)
    birth_date = models.DateField()
    location = models.CharField(max_length=200)
    weight = models.FloatField()
    health_states = models.TextField()  
    characters = models.TextField()  
    red_flags = models.TextField()  
    photos = models.JSONField(default=list) 

    followers = models.ManyToManyField(User, related_name='followers', blank=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    def __str__(self):
        return f"{self.name} ({self.breed})"
    
    def save(self, *args, **kwargs):
        if not self.photos:
            self.photos = [getattr(settings, 'DEFAULT_PHOTO_URL', 'http://localhost:8000/media/photos/default.jpg')]
        super().save(*args, **kwargs)
    
    @property
    def preferred_time_index(self):
        value_to_index = {value: index for index, (value, label) in enumerate(self.PREFERRED_TIME_CHOICES)}
        return value_to_index.get(self.preferred_time, None)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pet = models.OneToOneField(Pet, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return self.user.username
