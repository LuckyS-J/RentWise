import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Lease {
  id: number;
  start_date: string;
  end_date: string;
}

const AddPaymentForm = () => {
  const navigate = useNavigate();
  const [leaseId, setLeaseId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/properties/api/leases/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch leases');
        return res.json();
      })
      .then(data => setLeases(data))
      .catch(() => setError('Failed to load leases.'));
  }, [navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (leaseId === '') errors.leaseId = 'Lease is required';
    if (!amount) errors.amount = 'Amount is required';
    else if (Number(amount) < 0) errors.amount = 'Amount cannot be negative';
    if (!paymentDate) errors.paymentDate = 'Payment date is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const access = localStorage.getItem('access');
    if (!access) return;

    const payload = {
      lease: leaseId,
      amount,
      payment_date: paymentDate,
      is_paid: isPaid,
    };

    const response = await fetch('http://localhost:8000/properties/api/payments/', {
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
      setError('Failed to create payment. ' + JSON.stringify(data));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <h3 className="mb-4 text-center">Add Payment</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="lease" className="form-label">Lease</label>
            <select
              id="lease"
              className={`form-select dark-input ${validationErrors.leaseId ? 'is-invalid' : ''}`}
              value={leaseId}
              onChange={(e) => setLeaseId(Number(e.target.value))}
              required
            >
              <option value="">-- Select Lease --</option>
              {leases.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.start_date} → {l.end_date}
                </option>
              ))}
            </select>
            {validationErrors.leaseId && (
              <div className="invalid-feedback">{validationErrors.leaseId}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount (PLN)</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              className={`form-control dark-input ${validationErrors.amount ? 'is-invalid' : ''}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {validationErrors.amount && (
              <div className="invalid-feedback">{validationErrors.amount}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="paymentDate" className="form-label">Payment Date</label>
            <input
              id="paymentDate"
              type="date"
              className={`form-control dark-input ${validationErrors.paymentDate ? 'is-invalid' : ''}`}
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
            {validationErrors.paymentDate && (
              <div className="invalid-feedback">{validationErrors.paymentDate}</div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              id="isPaid"
              type="checkbox"
              className="form-check-input"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <label htmlFor="isPaid" className="form-check-label">
              Paid
            </label>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-custom">
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentForm;
