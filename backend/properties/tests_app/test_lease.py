from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Property, Lease
import datetime

User = get_user_model()

class LeaseAPITests(APITestCase):
    def setUp(self):
        self.tenant = User.objects.create_user(
            username='tenant1',
            email='tenant1@example.com',
            first_name='Tenant',
            last_name='One',
            password='password123'
        )
        self.owner = User.objects.create_user(
            username='owner1',
            email='owner1@example.com',
            first_name='Owner',
            last_name='One',
            password='password123'
        )
        self.property = Property.objects.create(
            address='123 Test St',
            owner=self.owner,
            property_type='apartment',
            status='available',
            area=100.00,
            num_of_rooms=3,
        )
        self.lease = Lease.objects.create(
            property=self.property,
            tenant=self.tenant,
            start_date=datetime.date(2026, 1, 1),
            end_date=datetime.date(2026, 12, 31),
            rate_amount=1000,
            active_lease=True
        )

        self.tenant_client = APIClient()
        response = self.tenant_client.post(reverse('token_obtain_pair'), {
            'username': 'tenant1',
            'password': 'password123'
        })
        self.tenant_token = response.data['access']
        self.tenant_client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.tenant_token}')

        self.owner_client = APIClient()
        response = self.owner_client.post(reverse('token_obtain_pair'), {
            'username': 'owner1',
            'password': 'password123'
        })
        self.owner_token = response.data['access']
        self.owner_client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_token}')

        self.list_url = reverse('lease-list')
        self.detail_url = reverse('lease-detail', kwargs={'id': self.lease.pk})

    def test_get_lease_list(self):
        response = self.owner_client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_lease_detail(self):
        response = self.owner_client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.lease.id)

    def test_create_lease(self):
        data = {
            'property': self.property.id,
            'tenant': self.tenant.id,
            'start_date': '2026-01-01',
            'end_date': '2026-12-31',
            'rate_amount': 1200,
            'active_lease': True
        }
        response = self.tenant_client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data['rate_amount']), 1200)

    def test_update_lease(self):
        data = {
            'property': self.property.id,
            'tenant': self.tenant.id,
            'start_date': '2026-01-01',
            'end_date': '2026-12-31',
            'rate_amount': 1500,
            'active_lease': True
        }
        response = self.owner_client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['rate_amount']), 1500.0)

    def test_delete_lease(self):
        response = self.owner_client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
