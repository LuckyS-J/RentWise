from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Property, Lease, Payment
import datetime
from decimal import Decimal

User = get_user_model()

class PaymentAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='owner1',
            email='owner1@example.com',
            password='password123'
        )
        self.tenant = User.objects.create_user(
            username='tenant1',
            email='tenant1@example.com',
            password='password123'
        )
        self.property = Property.objects.create(
            address='456 Example Ave',
            owner=self.owner,
            property_type='apartment',
            status='available',
            area=80.0,
            num_of_rooms=2,
        )
        self.lease = Lease.objects.create(
            property=self.property,
            tenant=self.tenant,
            start_date=datetime.date(2026, 1, 1),
            end_date=datetime.date(2026, 12, 31),
            rate_amount=1200,
            active_lease=True
        )
        self.payment = Payment.objects.create(
            lease=self.lease,
            amount=Decimal('1200.00'),
            payment_date=datetime.date(2026, 2, 1),
            is_paid=False
        )

        # Token auth
        self.client = APIClient()
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'owner1',
            'password': 'password123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.list_url = reverse('payment-list')
        self.detail_url = reverse('payment-detail', kwargs={'id': self.payment.pk})

    def test_get_payment_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_payment_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.payment.id)

    def test_create_payment(self):
        data = {
            'lease': self.lease.id,
            'amount': '1500.00',
            'payment_date': '2026-03-01',
            'is_paid': True
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(response.data['amount']), Decimal('1500.00'))

    def test_update_payment(self):
        data = {
            'lease': self.lease.id,  # <-- dodane!
            'amount': '1800.00',
            'payment_date': '2026-04-01',
            'is_paid': True
        }
        response = self.client.put(self.detail_url, data)
        print(response.status_code)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data['amount']), Decimal('1800.00'))
        self.assertTrue(response.data['is_paid'])

    def test_delete_payment(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
