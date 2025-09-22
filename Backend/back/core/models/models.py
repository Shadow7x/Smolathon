from django.contrib.auth.models import User
from django.db import models
from rest_framework.authtoken.models import Token


class authorizedToken(Token):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
    def token(self):
        return self.key