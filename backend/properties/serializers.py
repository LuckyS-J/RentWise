from rest_framework import serializers
from .models import Payment, Property, Lease

class PropertySerializer(serializers.ModelSerializer):
  class Meta:
    model = Property
    fields = ['id', 'address', 'description', 'property_type', 'status', 'area', 'num_of_rooms']

class LeaseSerializer(serializers.ModelSerializer):
    class Meta:
      model = Lease
      fields = ['id', 'property', 'start_date', 'end_date', 'rate_amount', 'active_lease']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
      model = Payment
      fields = ['id', 'amount', 'payment_date', 'is_paid']