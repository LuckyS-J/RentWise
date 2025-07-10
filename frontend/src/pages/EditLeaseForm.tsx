import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Lease {
  id: number;
  property: number;
  tenant: number;
  start_date: string;
  end_date: string;
  rate_amount: string;
  active_lease: boolean;
}

interface Tenant {
  id: number;
  email: string;
}

interface Property {
  id: number;
  address: string;
  status: 'available' | 'rented' | 'under_renovation';
}

const EditLease = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [leaseRes, tenantsRes] = await Promise.all([
          fetch(`http://localhost:8000/properties/api/leases/${id}/`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
          fetch('http://localhost:8000/users/api/users/', {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);

        if (!leaseRes.ok) throw new Error('Failed to fetch lease.');
        if (!tenantsRes.ok) throw new Error('Failed to fetch tenants.');

        const leaseData = await leaseRes.json();
        const tenantsData = await tenantsRes.json();

        setLease(leaseData);
        setTenants(tenantsData);
      } catch {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProperties = async () => {
      try {
        const res = await fetch('http://localhost:8000/properties/api/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
      } catch {
        setError('Failed to fetch properties.');
      }
    };

    fetchProperties();
    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

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
    if (!lease.tenant) errors.tenant = 'Tenant is required';
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
            <select
              id="property"
              name="property"
              className={`form-select dark-input ${validationErrors.property ? 'is-invalid' : ''}`}
              value={lease.property}
              onChange={handleChange}
              required
            >
              <option value="">-- Select property --</option>
              {properties
                // pokaż tylko available lub aktualnie ustawione w lease
                .filter(p => p.status === 'available' || p.id === lease.property)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.address} ({p.status})
                  </option>
                ))}
            </select>
          </div>

                    <div className="mb-3">
            <label htmlFor="tenant" className="form-label">Tenant</label>
            <select
              id="tenant"
              name="tenant"
              className={`form-select dark-input ${validationErrors.tenant ? 'is-invalid' : ''}`}
              value={lease.tenant}
              onChange={handleChange}
              required
            >
              <option value="">-- Select tenant --</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.email}
                </option>
              ))}
            </select>
            {validationErrors.tenant && <div className="invalid-feedback">{validationErrors.tenant}</div>}
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
