import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProperties, deleteProperty } from '../api/property';
import { fetchLeases } from '../api/lease';
import { fetchPayments } from '../api/payment';
import AppNavbar from '../components/navbar';
import { Card, Row, Col, Container, Badge, Button } from 'react-bootstrap';

interface Property {
  id: number;
  address: string;
  property_type: string;
  status: string;
  area: string;
  num_of_rooms: number;
  description: string;
}

interface Lease {
  id: number;
  start_date: string;
  end_date: string;
  rate_amount: string;
  active_lease: boolean;
}

interface Payment {
  id: number;
  amount: string;
  payment_date: string;
  is_paid: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    const fetchAllData = async () => {
      try {
        const [props, ls, pays] = await Promise.all([
          fetchProperties(access),
          fetchLeases(access),
          fetchPayments(access),
        ]);
      console.log('Fetched properties:', props);
      console.log('Fetched leases:', ls);
      console.log('Fetched payments:', pays);
        setProperties(props);
        setLeases(ls);
        setPayments(pays);
      } catch (err) {
        setError('Failed to load dashboard data.');
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleDelete = async (id: number) => {
    const access = localStorage.getItem('access');
    if (!access) return;

    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await deleteProperty(id, access);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete property.');
    }
  };

const handleDeleteLease = async (id: number) => {
  const access = localStorage.getItem('access');
  if (!access) return;

  if (!window.confirm('Are you sure you want to delete this lease?')) return;

  try {
    const response = await fetch(`http://localhost:8000/properties/api/leases/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.ok) {
      setLeases(leases.filter((l) => l.id !== id));
    } else {
      alert('Failed to delete lease.');
    }
  } catch (err) {
    alert('Failed to delete lease.');
  }
};

return (
    <>
      <AppNavbar />
      <Container className="pt-4 mt-5">
        <h2 className="text-center mb-4">Dashboard</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <Row className="g-4">
          {/* PROPERTIES */}
          <Col md={4}>
            <Card className="custom-card h-100">
              <div className="custom-card-header">Properties</div>
              <div className="custom-card-body">
                {properties.map((p) => (
                  <div key={p.id} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{p.address}</strong>
                      <span className={`status-badge status-${p.status.replace(' ', '_')}`}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>{p.description}</div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline-light"
                        className="me-2"
                        onClick={() => navigate(`properties/${p.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* LEASES */}
          <Col md={4}>
            <Card className="custom-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 custom-card-header">
                <div>Leases</div>
                <Button size="sm" variant="outline-light" onClick={() => navigate('/leases/add')}>
                  Add Lease
                </Button>
              </div>
              <div className="custom-card-body">
                {leases.map((l) => (
                  <div key={l.id} className="mb-3">
                    <div>
                      {l.start_date} → {l.end_date}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>{l.rate_amount} PLN</span>
                      <span className={`status-badge ${l.active_lease ? 'status-available' : 'status-under_renovation'}`}>
                        {l.active_lease ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline-light"
                      className="me-2"
                      onClick={() => navigate(`/leases/${l.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteLease(l.id)}
                    >
                      Delete
                    </Button>
                  </div>

                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* PAYMENTS */}
          <Col md={4}>
            <Card className="custom-card h-100">
              <div className="custom-card-header">Payments</div>
              <div className="custom-card-body">
                {payments.map((p) => (
                  <div key={p.id} className="mb-3">
                    <div>{p.payment_date}</div>
                    <div className="d-flex justify-content-between">
                      <span>{p.amount} PLN</span>
                      <span className={`status-badge ${p.is_paid ? 'status-available' : 'status-rented'}`}>
                        {p.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
