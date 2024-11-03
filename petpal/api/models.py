from django.db import models

# Create your models here.

class Pet(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

