from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):

  email = models.EmailField(unique=True)
  phone_number = models.CharField(max_length=20, blank=True, null=True)

  REQUIRED_FIELDS = ["email", "first_name", "last_name"]
  USERNAME_FIELD = "username"

  def __str__(self):
    return f"{self.username}, {self.role}"


