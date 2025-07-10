import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  address: string;
  status: 'available' | 'rented' | 'under_renovation';
}

interface Tenant {
  id: number;
  email: string;
}

const AddLeaseForm = () => {
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState<number | ''>('');
  const [tenantId, setTenantId] = useState<number | ''>('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rateAmount, setRateAmount] = useState('');
  const [activeLease, setActiveLease] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/properties/api/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => setError('Failed to load properties.'));

    fetch('http://localhost:8000/users/api/users/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTenants(data))
      .catch(() => setError('Failed to load tenants.'));

  }, [navigate]);




  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (propertyId === '') errors.propertyId = 'Property is required';
    if (tenantId === '') errors.tenantId = 'Tenant is required'; 
    if (!startDate) errors.startDate = 'Start Date is required';
    if (!endDate) errors.endDate = 'End Date is required';
    if (!rateAmount) errors.rateAmount = 'Rate Amount is required';
    else if (Number(rateAmount) < 0) errors.rateAmount = 'Rate Amount cannot be negative';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const access = localStorage.getItem('access');
    if (!access) return;

    const payload = {
      property: propertyId,
      tenant: tenantId, 
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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <h3 className="mb-4 text-center">Add Lease</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="property" className="form-label">Property</label>
            <select
              id="property"
              className={`form-select dark-input ${validationErrors.propertyId ? 'is-invalid' : ''}`}
              value={propertyId}
              onChange={(e) => setPropertyId(Number(e.target.value))}
              required
            >
              <option value="">-- Select property --</option>
              {properties
                .filter(p => p.status === 'available')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.address} ({p.status})
                  </option>
                ))}
            </select>
            {validationErrors.propertyId && (
              <div className="invalid-feedback">{validationErrors.propertyId}</div>
            )}
</div>


          <div className="mb-3">
            <label htmlFor="tenant" className="form-label">Tenant</label>
            <select
              id="tenant"
              className={`form-select dark-input ${validationErrors.tenantId ? 'is-invalid' : ''}`}
              value={tenantId}
              onChange={(e) => setTenantId(Number(e.target.value))}
              required
            >
              <option value="">-- Select tenant --</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.email}
                </option>
              ))}
            </select>
            {validationErrors.tenantId && (
              <div className="invalid-feedback">{validationErrors.tenantId}</div>
            )}
          </div>


          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              id="startDate"
              type="date"
              className={`form-control dark-input ${validationErrors.startDate ? 'is-invalid' : ''}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {validationErrors.startDate && (
              <div className="invalid-feedback">{validationErrors.startDate}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              id="endDate"
              type="date"
              className={`form-control dark-input ${validationErrors.endDate ? 'is-invalid' : ''}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            {validationErrors.endDate && (
              <div className="invalid-feedback">{validationErrors.endDate}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="rateAmount" className="form-label">Rate Amount (PLN)</label>
            <input
              id="rateAmount"
              type="number"
              min="0"
              step="0.01"
              className={`form-control dark-input ${validationErrors.rateAmount ? 'is-invalid' : ''}`}
              value={rateAmount}
              onChange={(e) => setRateAmount(e.target.value)}
              required
            />
            {validationErrors.rateAmount && (
              <div className="invalid-feedback">{validationErrors.rateAmount}</div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              id="activeLease"
              type="checkbox"
              className="form-check-input"
              checked={activeLease}
              onChange={(e) => setActiveLease(e.target.checked)}
            />
            <label htmlFor="activeLease" className="form-check-label">
              Active Lease
            </label>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-custom">
              Add Lease
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeaseForm;
