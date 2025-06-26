from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment, Property, Lease
from .serializers import PaymentSerializer, PropertySerializer, LeaseSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class PropertyViewSet(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    properties = Property.objects.filter(owner=request.user)
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data , status=200)
  
  def post(self, request):
    serializer = PropertySerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(owner=request.user)
      return Response(serializer.data, status=201)
    else:
      return Response(serializer.errors, status=400)
  

# Property APIViews
class PropertyDetailView(APIView):

  permission_classes = [IsAuthenticated]

  def get(self, request, id):
    property = get_object_or_404(Property, owner=request.user, id=id)
    serializer = PropertySerializer(property)
    return Response(serializer.data, status=200)
    
  def put(self, request, id):
    property = get_object_or_404(Property, owner=request.user, id=id)
    serializer = PropertySerializer(instance=property, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=200)
    else:
      return Response(serializer.errors, status=400)
    
  def delete(self, request, id):
    property = get_object_or_404(Property, owner=request.user, id=id)
    property.delete()
    return Response(status=204)
  

# Lease APIViews
class LeaseViewSet(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    leases = Lease.objects.filter(property__owner=request.user)
    serializer = LeaseSerializer(leases, many=True)
    return Response(serializer.data , status=200)
  
  def post(self, request):
    serializer = LeaseSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    else:
      return Response(serializer.errors, status=400)
    
class LeaseDetailView(APIView):

  permission_classes = [IsAuthenticated]

  def get(self, request, id):
    lease = get_object_or_404(Lease, property__owner=request.user, id=id)
    serializer = LeaseSerializer(lease)
    return Response(serializer.data, status=200)
    
  def put(self, request, id):
    lease = get_object_or_404(Lease, property__owner=request.user, id=id)
    serializer = LeaseSerializer(instance=lease, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=200)
    else:
      return Response(serializer.errors, status=400)
    
  def delete(self, request, id):
    lease = get_object_or_404(Lease, property__owner=request.user, id=id)
    lease.delete()
    return Response(status=204)
  

# Payment APIViews
class PaymentViewSet(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    payment = Payment.objects.filter(lease__property__owner=request.user)
    serializer = PaymentSerializer(payment, many=True)
    return Response(serializer.data , status=200)
  
  def post(self, request):
    serializer = PaymentSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    else:
      return Response(serializer.errors, status=400)


class PaymentDetailView(APIView):

  permission_classes = [IsAuthenticated]

  def get(self, request, id):
    payment = get_object_or_404(Payment, lease__property__owner=request.user, id=id)
    serializer = PaymentSerializer(payment)
    return Response(serializer.data, status=200)
    
  def put(self, request, id):
    payment = get_object_or_404(Payment, lease__property__owner=request.user, id=id)
    serializer = PaymentSerializer(instance=payment, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=200)
    else:
      return Response(serializer.errors, status=400)
    
  def delete(self, request, id):
    payment = get_object_or_404(Payment, lease__property__owner=request.user, id=id)
    payment.delete()
    return Response(status=204)
  
  
