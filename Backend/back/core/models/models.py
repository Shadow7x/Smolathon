from django.contrib.auth.models import User
from django.db import models
from rest_framework.authtoken.models import Token


class Reports(models.Model):
    file = models.FileField(unique=True)

    def __str__(self):
        return str(self.file)
    
    

class Penalties(models.Model):
    date = models.DateField()
    violations_cumulative = models.IntegerField()
    decrees_cumulative = models.IntegerField()
    fines_imposed_cumulative = models.IntegerField()
    fines_collected_cumulative = models.IntegerField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.date)

class TowTrucks(models.Model):
    date = models.DateField()
    tow_truck_in_line = models.IntegerField()
    count_departures = models.IntegerField()
    count_evacuations = models.IntegerField()
    summary_of_parking_lot = models.IntegerField()
    report = models.ForeignKey(Reports, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.date)


class authorizedToken(Token):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
    def token(self):
        return self.key