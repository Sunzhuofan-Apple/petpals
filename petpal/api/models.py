from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Pet(models.Model):
    id = models.AutoField(primary_key=True)
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
    health_states = models.JSONField(default=list, blank=False, null=False)
    characters = models.JSONField(default=list, blank=False, null=False)
    red_flags = models.JSONField(default=list, blank=False, null=False) 
    photos = models.JSONField(default=list) 
    

    def clean(self):
        super().clean()
        if not isinstance(self.health_states, list) or not self.health_states:
            raise ValidationError({'health_states': 'Health states must be a non-empty list.'})
        if not isinstance(self.characters, list) or not self.characters:
            raise ValidationError({'characters': 'Characters must be a non-empty list.'})
        if not isinstance(self.red_flags, list) or not self.red_flags:
            raise ValidationError({'red_flags': 'Red flags must be a non-empty list.'})



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
    
class WagHistory(models.Model):
    wagger = models.ForeignKey(User, related_name='wagged', on_delete=models.CASCADE)
    wagged_to = models.ForeignKey(User, related_name='received_wags', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('wagger', 'wagged_to')
        
    def __str__(self):
        return f"{self.wagger.username} wagged to {self.wagged_to.username}"
