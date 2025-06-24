from django.contrib import admin
from .models import Payment, Property, Lease

# Register your models here.

admin.site.register(Payment)
admin.site.register(Property)
admin.site.register(Lease)