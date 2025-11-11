from django.db import models
from django.utils import timezone
class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    admin_name = models.CharField(max_length=45)
    admin_email = models.EmailField(unique=True)
    password = models.CharField(unique=True,max_length=100)

    @property
    def is_authenticated(self):
        """
        Admins are always authenticated. This is required for REST Framework.
        """
        return True

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_email = models.EmailField(unique=True)
    password = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=45)
    address = models.CharField(max_length=75, blank=True)
    pincode = models.CharField(max_length=6, blank=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    
class Rental_lot(models.Model):
    lot_id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=50)
    pincode = models.CharField(max_length=6)

class Rental_spot(models.Model):
    spot_id = models.AutoField(primary_key=True)
    lot = models.ForeignKey(Rental_lot , on_delete=models.CASCADE)
    status = models.CharField(max_length=1)
    price = models.IntegerField()
    address = models.CharField(max_length=75)
    location = models.CharField(max_length = 50)
    type = models.CharField(max_length = 4)

class Registered_spot(models.Model):
    registered_id = models.AutoField(primary_key=True)
    lot = models.ForeignKey(Rental_lot,on_delete=models.CASCADE)
    spot = models.ForeignKey(Rental_spot,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    registered_time = models.DateTimeField(default=timezone.now)
    leaving_time = models.DateTimeField(null=True)
    phone_number = models.IntegerField(null=False)