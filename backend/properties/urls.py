from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.PropertyViewSet.as_view()),
]