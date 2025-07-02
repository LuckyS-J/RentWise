from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.PropertyViewSet.as_view()),
    path('api/<int:id>/', views.PropertyDetailView.as_view()),
    path('api/leases/', views.LeaseViewSet.as_view()),
    path('api/leases/<int:id>/', views.LeaseDetailView.as_view()),
    path('api/payments/', views.PaymentViewSet.as_view()),
    path('api/payments/<int:id>/', views.PaymentDetailView.as_view()),
]