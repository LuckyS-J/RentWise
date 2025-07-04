import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProperties } from '../api/property';
import { fetchLeases } from '../api/lease';
import { fetchPayments } from '../api/payment';
import AppNavbar from '../components/navbar';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';

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
        setProperties(props);
        setLeases(ls);
        setPayments(pays);
      } catch (err) {
        setError('Failed to load dashboard data.');
      }
    };

    fetchAllData();
  }, [navigate]);

  return (
    <>
      <AppNavbar />
      <Container className="pt-4 mt-5">
        <h2 className="text-center mb-4">Dashboard</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <Row className="g-4">
          <Col md={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <Card.Title>Properties</Card.Title>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {properties.map((p) => (
                    <li key={p.id} style={{ marginBottom: '1rem' }}>
                      <div>
                        <strong>{p.address}</strong>{' '}
                        <Badge
                          bg={
                            p.status === 'available'
                              ? 'success'
                              : p.status === 'rented'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                        {p.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <Card.Title>Leases</Card.Title>
                <ul>
                  {leases.map((l) => (
                    <li key={l.id}>
                      {l.start_date} → {l.end_date}{' | '}
                      {l.rate_amount} PLN{' | '}
                      {l.active_lease ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="custom-card h-100">
              <Card.Body>
                <Card.Title>Payments</Card.Title>
                <ul>
                  {payments.map((p) => (
                    <li key={p.id}>
                      {p.payment_date}: {p.amount} PLN{' '}
                      {p.is_paid ? (
                        <Badge bg="success">Paid</Badge>
                      ) : (
                        <Badge bg="danger">Unpaid</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
