import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/logoutButton';
import { fetchProperties } from '../api/property';

interface Property {
  id: number;
  name: string;
  address: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }

    const loadProperties = async () => {
      try {
        const data = await fetchProperties(access);
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties');
      }
    };

    loadProperties();
  }, [navigate]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard</h2>
      <LogoutButton />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {properties.length === 0 && !error && <p>No properties found.</p>}
        {properties.map((prop) => (
          <li key={prop.id}>
            <strong>{prop.name}</strong> — {prop.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
