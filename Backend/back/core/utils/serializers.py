from rest_framework import serializers
from ..models.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','is_superuser')

class PenaltiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Penalties
        fields = '__all__'
        
class TowTrucksSerializer(serializers.ModelSerializer):
    class Meta:
        model = TowTrucks
        fields = '__all__'

class RoutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'
        
class EvacuationRouteSerializer(serializers.ModelSerializer):
    routes = RoutesSerializer(many=True)
    class Meta:
        model = TowTrucks
        fields = '__all__'
        
class TrafficLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficLight
        fields = '__all__'
        
class DTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = DTP
        fields = '__all__'


