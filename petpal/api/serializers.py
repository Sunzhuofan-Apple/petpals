from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')  # 用户名为只读

    class Meta:
        model = Pet
        fields = '__all__'
