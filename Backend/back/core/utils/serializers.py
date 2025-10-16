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
        
        
class ImageForMeritsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageForMerits
        fields = '__all__'

class MeritsSerializer(serializers.ModelSerializer):
    images_first_block = ImageForMeritsSerializer(many=True)
    images_second_block = ImageForMeritsSerializer(many=True)
    class Meta:
        model = Merits
        fields = '__all__'



class DetectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detector
        fields = '__all__'
    

class DetectorRouteSerializer(serializers.ModelSerializer):
    detectorStart = DetectorSerializer()
    detectorEnd = DetectorSerializer()
    class Meta:
        model = DetectorRoute
        fields = '__all__'
    
class DetectionSerializer(serializers.ModelSerializer):
    detector = DetectorSerializer()

    
    class  Meta:
        model = Detection
        fields = '__all__'    
    
    
class WorkloadSerializer(serializers.ModelSerializer):
    detections = DetectionSerializer(many=True)
    class Meta:
        model = Workload
        fields = '__all__'

class CarSerializer(serializers.ModelSerializer):
    workloads = WorkloadSerializer(many=True)
    class Meta:
        model = Car
        fields = '__all__'

