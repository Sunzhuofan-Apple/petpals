from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Pet

class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

class PetForm(forms.ModelForm):
    class Meta:
        model = Pet
        fields = ['name', 'birth_date', 'breed', 'birth_date', 'location', 'sex','preferred_time', 'weight']
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date'}),  
        }

    def clean_location(self):
        location = self.data.get('location')
        if not location:
            raise forms.ValidationError("Location is required.")
        return location