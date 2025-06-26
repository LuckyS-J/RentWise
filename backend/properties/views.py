from django.shortcuts import render
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