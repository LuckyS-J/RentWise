from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.PropertyViewSet.as_view()),
    path('api/<int:id>/', views.PropertyDetailView.as_view()),
    path('api/leases/', views.LeaseViewSet.as_view(), name='lease-list'),
    path('api/leases/<int:id>/', views.LeaseDetailView.as_view(), name='lease-detail'),
    path('api/payments/', views.PaymentViewSet.as_view(), name='payment-list'),
    path('api/payments/<int:id>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('leases/<int:pk>/contract/', views.lease_contract_pdf, name='lease_contract_pdf'),
]