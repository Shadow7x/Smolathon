from django.contrib import admin

from core.models.models import *

from django.db.models.signals import post_delete
from django.dispatch import receiver
import os


@receiver(post_delete, sender=Reports)
def delete_report_file(sender, instance, **kwargs):

    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
# Register your models here.

admin.site.register(Reports)
admin.site.register(Penalties)
admin.site.register(TowTrucks) 
admin.site.register(EvacuationRoute)
admin.site.register(Route)
admin.site.register(TrafficLight)
admin.site.register(DTP)
admin.site.register(authorizedToken)


 