from rest_framework import serializers
from .models import Algorithm

class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = ['id', 'title', 'algorithm_json', 'last_updated']
        read_only_fields = ['user', 'last_updated']
