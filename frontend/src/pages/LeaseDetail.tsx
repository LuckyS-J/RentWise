import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLeaseDetail } from '../api/lease';
import { Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const LeaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [error, setError] = useState('');

const previewContractPdf = async () => {
  const access = localStorage.getItem('access');
  if (!access) {
    setError('You must be logged in to view the contract.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8000/properties/leases/${lease.id}/contract/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
      responseType: 'blob',
    });

    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    setError('Failed to load contract PDF preview.');
  }
};

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    if (id) {
      const leaseId = parseInt(id, 10);
      if (!isNaN(leaseId)) {
        const fetchData = async () => {
          try {
            const data = await fetchLeaseDetail(leaseId, access);
            setLease(data);
          } catch (err) {
            setError('Failed to load lease data.');
          }
        };
        fetchData();
      } else {
        setError('Invalid lease ID');
      }
    } else {
      setError('Lease ID is missing');
    }
  }, [id, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h3 className="mb-5 text-center">Lease Details</h3>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {lease && (
          <Card className="custom-card mb-4">
            <Card.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Property: {lease.property.address}</h5>
                  <p><strong>Start Date:</strong> {lease.start_date}</p>
                  <p><strong>End Date:</strong> {lease.end_date}</p>
                  <p><strong>Rate Amount:</strong> {lease.rate_amount} PLN</p>
                  <p><strong>Status:</strong> {lease.active_lease ? 'Active' : 'Inactive'}</p>
                </Col>
              </Row>

              <h5 className="mt-4 mb-3">Payments</h5>
              <Row>
                {lease.payments.map((payment: any) => (
                  <Col key={payment.id} md={4} className="mb-3">
                    <Card className="custom-card">
                      <Card.Body>
                        <p><strong>Amount:</strong> {payment.amount} PLN</p>
                        <p><strong>Payment Date:</strong> {payment.payment_date}</p>
                        <p><strong>Status:</strong> {payment.is_paid ? 'Paid' : 'Unpaid'}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-between mt-4">
                <Button className="btn-secondary" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
                <Button className="btn-custom" onClick={() => navigate(`/leases/${lease.id}/edit`)}>
                  Edit Lease
                </Button>
                <Button 
                  className="btn-success" 
                  onClick={() => navigate(`/payments/add?leaseId=${lease.id}`)}
                >
                  Add Payment
                </Button>
                <Button className="btn-dark" onClick={previewContractPdf}>
                  Preview Contract PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeaseDetail;
