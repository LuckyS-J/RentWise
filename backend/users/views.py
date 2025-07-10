from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer
from django.contrib.auth import get_user_model

# Create your views here.

User = get_user_model()

class UserListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer