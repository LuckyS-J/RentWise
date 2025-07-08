import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      } catch {
        setError('Failed to load lease.');
      } finally {
        setLoading(false);
      }
    };

    fetchLease();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!lease) return false;
    if (!lease.property) errors.property = 'Property ID is required';
    if (!lease.start_date) errors.start_date = 'Start Date is required';
    if (!lease.end_date) errors.end_date = 'End Date is required';
    if (!lease.rate_amount) errors.rate_amount = 'Rate Amount is required';
    else if (Number(lease.rate_amount) < 0) errors.rate_amount = 'Rate Amount cannot be negative';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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

      navigate('/');
    } catch {
      setError('Failed to update lease.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="container pt-5">
        <div className="alert alert-danger">{error || 'Lease not found.'}</div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <h2 className="mb-4 text-center">Edit Lease</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="property" className="form-label">Property ID</label>
            <input
              id="property"
              name="property"
              type="number"
              className={`form-control dark-input ${validationErrors.property ? 'is-invalid' : ''}`}
              value={lease.property}
              onChange={handleChange}
              required
            />
            {validationErrors.property && (
              <div className="invalid-feedback">{validationErrors.property}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="start_date" className="form-label">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className={`form-control dark-input ${validationErrors.start_date ? 'is-invalid' : ''}`}
              value={lease.start_date}
              onChange={handleChange}
              required
            />
            {validationErrors.start_date && (
              <div className="invalid-feedback">{validationErrors.start_date}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="end_date" className="form-label">End Date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              className={`form-control dark-input ${validationErrors.end_date ? 'is-invalid' : ''}`}
              value={lease.end_date}
              onChange={handleChange}
              required
            />
            {validationErrors.end_date && (
              <div className="invalid-feedback">{validationErrors.end_date}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="rate_amount" className="form-label">Rate Amount (PLN)</label>
            <input
              id="rate_amount"
              name="rate_amount"
              type="number"
              min="0"
              step="0.01"
              className={`form-control dark-input ${validationErrors.rate_amount ? 'is-invalid' : ''}`}
              value={lease.rate_amount}
              onChange={handleChange}
              required
            />
            {validationErrors.rate_amount && (
              <div className="invalid-feedback">{validationErrors.rate_amount}</div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              id="active_lease"
              name="active_lease"
              type="checkbox"
              className="form-check-input"
              checked={lease.active_lease}
              onChange={handleChange}
            />
            <label htmlFor="active_lease" className="form-check-label">
              Active Lease
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

export default EditLease;
