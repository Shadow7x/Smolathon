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
        

class authorizedToken(Token):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
    def token(self):
        return self.key