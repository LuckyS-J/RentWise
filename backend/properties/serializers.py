from rest_framework import serializers
from .models import Payment, Property, Lease

class PropertySerializer(serializers.ModelSerializer):
  class Meta:
    model = Property
    fields = ['id', 'address', 'description', 'property_type', 'status', 'area', 'num_of_rooms']

class LeaseSerializer(serializers.ModelSerializer):
    class Meta:
      model = Lease
      fields = ['id', 'tenant', 'property', 'start_date', 'end_date', 'rate_amount', 'active_lease']

class PaymentSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='status', read_only=True)

    class Meta:
      model = Payment
      fields = ['id', 'lease', 'amount', 'due_date', 'payment_date', 'is_paid', 'status']


class LeaseDetailSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Lease
        fields = ['id','tenant','property','start_date','end_date','rate_amount','active_lease','payments',
        ]