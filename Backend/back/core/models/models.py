from django.contrib.auth.models import User
from django.db import models
from rest_framework.authtoken.models import Token


class Reports(models.Model):
    file = models.FileField(unique=True)

    def __str__(self):
        return str(self.id)+" "+str(self.file)
    
    

class Penalties(models.Model):
    date = models.DateField()
    violations_cumulative = models.IntegerField()
    decrees_cumulative = models.IntegerField()
    fines_imposed_cumulative = models.IntegerField()
    fines_collected_cumulative = models.IntegerField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.id) + " " + str(self.date)
     
    class Meta:
        ordering = ['-date']

class TowTrucks(models.Model):
    date = models.DateField()
    tow_truck_in_line = models.IntegerField()
    count_departures = models.IntegerField()
    count_evacuations = models.IntegerField()
    summary_of_parking_lot = models.IntegerField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    
    def __str__(self):
        return str(self.date)
    
    class Meta:
        ordering = ['-date']


class Route(models.Model):
    street = models.TextField()

    def __str__(self):
        return self.street


class EvacuationRoute(models.Model):
    year = models.IntegerField()
    month = models.TextField()
    routes = models.ManyToManyField(Route)
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.year) + str(self.month)
    
    class Meta:
        ordering = ['-year', '-month']
        
        
class TrafficLight(models.Model):
    numPP = models.IntegerField(unique=True)
    address = models.TextField()
    type = models.TextField()
    year = models.IntegerField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.numPP)
    
    class Meta:
        ordering = ['-numPP']


class DTP(models.Model):
    year = models.IntegerField()
    month = models.TextField()
    point_FPSR = models.TextField()
    statistical_factor = models.TextField()
    count = models.FloatField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.year) + str(self.month) + str(self.statistical_factor)
    
    class Meta:
        ordering = ['-year', '-month']
        

class News(models.Model):
    title = models.TextField()
    text = models.TextField()
    date = models.DateField( auto_now_add=True)
    image = models.FileField(upload_to='news/')
    
    def __str__(self):
        return str(self.title)
    
class Docs(models.Model):
    file = models.FileField( upload_to='documents/')
    updated_at = models.DateTimeField( auto_now=True)


class ImageForMerits(models.Model):
    image = models.FileField(upload_to='merits/images/')

class Merits(models.Model):
    logo_first_block = models.FileField(upload_to='merits/logo/')
    title = models.CharField(max_length=10, unique=True)
    decode = models.TextField()
    images_first_block = models.ManyToManyField(ImageForMerits, related_name="images_first_block")
    purposes = models.TextField()
    logo_second_block = models.FileField(upload_to='merits/logo/')
    images_second_block = models.ManyToManyField(ImageForMerits, related_name="images_second_block")
    parents_name = models.TextField()
    parents_phone = models.TextField()
    parents_email = models.EmailField()
    address = models.TextField()
    
class Detector(models.Model):
    name = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField() 
    
class DetectorRoute(models.Model):
    detectorStart = models.ForeignKey(Detector, on_delete=models.CASCADE, related_name="detectorStart")
    detectorEnd = models.ForeignKey(Detector, on_delete=models.CASCADE, related_name="detectorEnd") 
    count = models.PositiveIntegerField()
    
class Detection(models.Model):
    detector = models.ForeignKey(Detector, on_delete=models.CASCADE)
    time = models.DateTimeField()
    car = models.ForeignKey("Car",  on_delete=models.CASCADE)
    speed = models.FloatField()

class Workload(models.Model):
    TIMES_INTERVAL = [(f"{hour:02d}:00-{hour+2:02d}:00", f"{hour:02d}:00-{hour+2:02d}:00") for hour in range(0, 24, 2)]
    time_interval = models.CharField(max_length=20, choices=TIMES_INTERVAL)
    detections = models.ManyToManyField(Detection)


class Car(models.Model):
    name = models.CharField(max_length=20, unique=True)
    workloads=  models.ManyToManyField(Workload)
    

class authorizedToken(Token):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
    def token(self):
        return self.key