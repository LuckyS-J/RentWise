import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProperty } from '../api/property';
import AppNavbar from '../components/navbar';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const access = localStorage.getItem('access');

  const [form, setForm] = useState({
    address: '',
    description: '',
    property_type: 'apartment',
    status: 'available',
    area: '',
    num_of_rooms: '',
  });

  useEffect(() => {
    if (!access) {
      navigate('/login');
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:8000/properties/api/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();

        setForm({
          address: data.address || '',
          description: data.description || '',
          property_type: data.property_type || 'apartment',
          status: data.status || 'available',
          area: data.area !== null && data.area !== undefined ? String(data.area) : '',
          num_of_rooms: data.num_of_rooms !== null && data.num_of_rooms !== undefined ? String(data.num_of_rooms) : '',
        });
      } catch (error) {
        alert('Failed to load property data.');
      }
    };

    fetchProperty();
  }, [id, access, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!access) return;

    try {
      const updatedData = {
        ...form,
        area: form.area === '' ? null : Number(form.area),
        num_of_rooms: form.num_of_rooms === '' ? null : Number(form.num_of_rooms),
      };

      await updateProperty(Number(id), updatedData, access);
      navigate('/');
    } catch (err) {
      alert('Failed to update property.');
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="container login-box" style={{ maxWidth: 500 }}>
          <h2 className="text-center mb-4">Edit Property</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control dark-input"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control dark-input"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="property_type" className="form-label">Property Type</label>
              <select
                id="property_type"
                name="property_type"
                className="form-control dark-input"
                value={form.property_type}
                onChange={handleChange}
              >
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="office">Office</option>
                <option value="industrial">Industrial</option>
                <option value="town_house">Town House</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-control dark-input"
                value={form.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="under_renovation">Under Renovation</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="area" className="form-label">Area (m²)</label>
              <input
                id="area"
                name="area"
                type="text"
                className="form-control dark-input"
                value={form.area}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="num_of_rooms" className="form-label">Number of Rooms</label>
              <input
                id="num_of_rooms"
                name="num_of_rooms"
                type="number"
                className="form-control dark-input"
                value={form.num_of_rooms}
                onChange={handleChange}
              />
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
    </>
  );
};

export default EditProperty;
