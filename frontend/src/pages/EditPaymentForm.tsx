import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Payment {
  id: number;
  lease: number;
  amount: string;
  payment_date: string;
  is_paid: boolean;
}

const EditPayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const formatDate = (dateString: string) => {
    return dateString ? dateString.split('T')[0] : '';
  };

  useEffect(() => {
    const fetchPayment = async () => {
      const access = localStorage.getItem('access');
      if (!access) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/properties/api/payments/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch payment.');

        const data = await res.json();

      console.log('Raw payment_date from API:', data.payment_date);
      console.log('Full payment data:', data);

        data.payment_date = formatDate(data.payment_date);

        setPayment(data);
      } catch {
        setError('Failed to load payment.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPayment((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
          }
        : null
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!payment) return false;

    if (!payment.lease) errors.lease = 'Lease ID is required';
    if (!payment.amount) errors.amount = 'Amount is required';
    else if (Number(payment.amount) < 0) errors.amount = 'Amount cannot be negative';
    if (!payment.payment_date) errors.payment_date = 'Payment date is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const access = localStorage.getItem('access');
    if (!access || !payment) return;

    try {
      const res = await fetch(`http://localhost:8000/properties/api/payments/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(payment),
      });

      if (!res.ok) throw new Error('Failed to update payment');

      navigate('/');
    } catch {
      setError('Failed to update payment.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container pt-5">
        <div className="alert alert-danger">{error || 'Payment not found.'}</div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <h2 className="mb-4 text-center">Edit Payment</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="lease" className="form-label">
              Lease ID
            </label>
            <input
              id="lease"
              name="lease"
              type="number"
              className={`form-control dark-input ${validationErrors.lease ? 'is-invalid' : ''}`}
              value={payment.lease}
              onChange={handleChange}
              required
            />
            {validationErrors.lease && <div className="invalid-feedback">{validationErrors.lease}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount (PLN)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              className={`form-control dark-input ${validationErrors.amount ? 'is-invalid' : ''}`}
              value={payment.amount}
              onChange={handleChange}
              required
            />
            {validationErrors.amount && <div className="invalid-feedback">{validationErrors.amount}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="payment_date" className="form-label">
              Payment Date
            </label>
            <input
              id="payment_date"
              name="payment_date"
              type="date"
              className={`form-control dark-input ${validationErrors.payment_date ? 'is-invalid' : ''}`}
              value={payment.payment_date}
              onChange={handleChange}
              required
            />
            {validationErrors.payment_date && (
              <div className="invalid-feedback">{validationErrors.payment_date}</div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              id="is_paid"
              name="is_paid"
              type="checkbox"
              className="form-check-input"
              checked={payment.is_paid}
              onChange={handleChange}
            />
            <label htmlFor="is_paid" className="form-check-label">
              Paid
            </label>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-custom">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
