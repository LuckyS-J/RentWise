import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

interface Property {
  id: number;
  address: string;
}

const AddLeaseForm = () => {
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rateAmount, setRateAmount] = useState('');
  const [activeLease, setActiveLease] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    // Fetch user properties for selection
    fetch('http://localhost:8000/properties/api/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => setError('Failed to load properties.'));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const access = localStorage.getItem('access');
    if (!access) return;

    const payload = {
      property: propertyId,
      start_date: startDate,
      end_date: endDate,
      rate_amount: rateAmount,
      active_lease: activeLease,
    };

    const response = await fetch('http://localhost:8000/properties/api/leases/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      navigate('/');
    } else {
      const data = await response.json();
      setError('Failed to create lease. ' + JSON.stringify(data));
    }
  };

  return (
    <Container className="pt-4 mt-5" style={{ maxWidth: '600px' }}>
      <Card className="custom-card">
        <Card.Body>
          <h3 className="mb-4 text-center">Add Lease</h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Property</Form.Label>
              <Form.Select
                value={propertyId}
                onChange={(e) => setPropertyId(Number(e.target.value))}
                required
              >
                <option value="">-- Select property --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.address}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rate Amount (PLN)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={rateAmount}
                onChange={(e) => setRateAmount(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Lease"
                checked={activeLease}
                onChange={(e) => setActiveLease(e.target.checked)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Lease
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddLeaseForm;
