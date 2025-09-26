from rest_framework import serializers
from ..models.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','is_superuser')
        
class ReportsSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='file.name')
    class Meta:
        model = Reports
        fields = '__all__'

class PenaltiesSerializer(serializers.ModelSerializer):
    report = ReportsSerializer()
    class Meta:
        model = Penalties
        fields = '__all__'
        
class TowTrucksSerializer(serializers.ModelSerializer):
    report = ReportsSerializer()
    class Meta:
        model = TowTrucks
        fields = '__all__'

class RoutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'
        
class EvacuationRouteSerializer(serializers.ModelSerializer):
    report = ReportsSerializer()
    routes = RoutesSerializer(many=True)
    class Meta:
        model = EvacuationRoute
        fields = '__all__'
        
class TrafficLightSerializer(serializers.ModelSerializer):
    report = ReportsSerializer()
    class Meta:
        model = TrafficLight
        fields = '__all__'
        
class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
        
class DocsSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='file.name')
    class Meta:
        model = Docs
        fields = '__all__'
        
class DTPSerializer(serializers.ModelSerializer):
    report = ReportsSerializer()
    class Meta:
        model = DTP
        fields = '__all__'


