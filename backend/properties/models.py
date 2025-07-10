from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from users.models import CustomUser
import datetime

# Create your models here.

class Property(models.Model):

  PROPERTY_CHOICES = [
    ("apartment", "Apartment"),
    ("room", "Room"),
    ("office", "Office"),
    ("industrial", "Industrial"),
    ("town_house", "Town house"),
    ("bungalow", "Bungalow"),
  ]
  STATUS_CHOICES = [
    ("available", "Available"),
    ("rented", "Rented"),
    ("under_renovation", "Under renovation"),
  ]

  address = models.CharField(max_length=150, unique=True, null=False)
  description = models.TextField(null=True, blank=True)
  owner = models.ForeignKey(CustomUser, null=True, related_name="owned_properties", on_delete=models.CASCADE)
  property_type = models.CharField(choices=PROPERTY_CHOICES, max_length=30)
  status = models.CharField(choices=STATUS_CHOICES, max_length=30)
  area = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(1)])
  num_of_rooms = models.IntegerField(validators=[MinValueValidator(1)])

  def __str__(self):
    return f"{self.address}"

class Lease(models.Model):
  tenant = models.ForeignKey(CustomUser, null=False, related_name="leases", on_delete=models.CASCADE)
  property = models.ForeignKey(Property, related_name="leases", null=True, blank=True, on_delete=models.CASCADE)
  start_date = models.DateField(default=datetime.date.today)
  end_date = models.DateField()
  rate_amount = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
  active_lease = models.BooleanField(default=False)

  def save(self, *args, **kwargs):

    # Checks start date
    if self.start_date < datetime.date.today():
      raise ValidationError("The start date cannot be in the past!")
    
    # Checks end date
    if self.end_date < datetime.date.today() or self.end_date < self.start_date:
      raise ValidationError("Invalid end date!")

    # Changes status of property & checks if already rented
    is_new = self.pk is None
    old = None
    if not is_new:
        old = Lease.objects.get(pk=self.pk)

    super().save(*args, **kwargs)

    prop = self.property
    active_now = self.active_lease and self.start_date <= datetime.date.today() <= self.end_date

    if active_now:
        prop.status = 'rented'
    else:
        has_other = Lease.objects.filter(
            property=prop,
            active_lease=True,
            start_date__lte=datetime.date.today(),
            end_date__gte=datetime.date.today()
        ).exclude(pk=self.pk).exists()
        prop.status = 'rented' if has_other else 'available'
    prop.save(update_fields=['status'])
 
class Payment(models.Model):
  lease = models.ForeignKey(Lease, related_name='payments', on_delete=models.CASCADE)
  amount = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(0)])
  payment_date = models.DateField(default=datetime.date.today)
  is_paid = models.BooleanField(default=False)
