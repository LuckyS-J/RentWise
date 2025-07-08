import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';

interface Lease {
  id: number;
  property: number;
  start_date: string;
  end_date: string;
  rate_amount: string;
  active_lease: boolean;
}

const EditLease = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLease = async () => {
      const access = localStorage.getItem('access');
      if (!access) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/properties/api/leases/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch lease.');

        const data = await res.json();
        setLease(data);
      } catch (err) {
        setError('Failed to load lease.');
      } finally {
        setLoading(false);
      }
    };

    fetchLease();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setLease((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    if (!access || !lease) return;

    try {
      const res = await fetch(`http://localhost:8000/properties/api/leases/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(lease),
      });

      if (!res.ok) throw new Error('Failed to update lease');

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update lease.');
    }
  };

  if (loading) {
    return (
      <Container className="pt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!lease) {
    return (
      <Container className="pt-5">
        <Alert variant="danger">{error || 'Lease not found.'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="pt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Edit Lease</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="property">
          <Form.Label>Property ID</Form.Label>
          <Form.Control
            type="number"
            name="property"
            value={lease.property}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="start_date" className="mt-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={lease.start_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="end_date" className="mt-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={lease.end_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="rate_amount" className="mt-3">
          <Form.Label>Rate Amount (PLN)</Form.Label>
          <Form.Control
            type="number"
            name="rate_amount"
            value={lease.rate_amount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="active_lease" className="mt-3">
          <Form.Check
            type="checkbox"
            name="active_lease"
            label="Active Lease"
            checked={lease.active_lease}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditLease;
