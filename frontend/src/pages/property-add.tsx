import React, { useState } from 'react';
import AppNavbar from '../components/navbar';
import { addProperty } from '../api/property';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


interface PropertyFormInputs {
  address: string;
  description?: string;
  property_type: string;
  status: string;
  area: number;
  num_of_rooms: number;
}

function AddProperty() {

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyFormInputs>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: PropertyFormInputs) => {
    try {
      setSubmitError(null);
      const token = localStorage.getItem('access') || '';
      await addProperty(data, token);
      navigate('/');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to add property');
    }
  };
  
  return (
    <>
      <AppNavbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="container login-box" style={{ maxWidth: 400 }}>
          <h1 className="mb-4 text-center">Add Property</h1>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                id="address"
                type="text"
                className={`form-control dark-input ${errors.address ? 'is-invalid' : ''}`}
                {...register('address', { required: 'Address is required' })}
                disabled={isSubmitting}
              />
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-control dark-input"
                rows={3}
                {...register('description')}
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="property_type" className="form-label">Property Type</label>
              <select
                id="property_type"
                className={`form-select dark-input ${errors.property_type ? 'is-invalid' : ''}`}
                {...register('property_type', { required: 'Property type is required' })}
                disabled={isSubmitting}
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="office">Office</option>
                <option value="industrial">Industrial</option>
                <option value="town_house">Town house</option>
                <option value="bungalow">Bungalow</option>
              </select>
              {errors.property_type && <div className="invalid-feedback">{errors.property_type.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className={`form-select dark-input ${errors.status ? 'is-invalid' : ''}`}
                {...register('status', { required: 'Status is required' })}
                disabled={isSubmitting}
              >
                <option value="">Select status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="under_renovation">Under renovation</option>
              </select>
              {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="area" className="form-label">Area (m²)</label>
              <input
                id="area"
                type="number"
                step="0.01"
                min="1"
                className={`form-control dark-input ${errors.area ? 'is-invalid' : ''}`}
                {...register('area', {
                  required: 'Area is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Area must be at least 1' }
                })}
                disabled={isSubmitting}
              />
              {errors.area && <div className="invalid-feedback">{errors.area.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="num_of_rooms" className="form-label">Number of rooms</label>
              <input
                id="num_of_rooms"
                type="number"
                min="1"
                className={`form-control dark-input ${errors.num_of_rooms ? 'is-invalid' : ''}`}
                {...register('num_of_rooms', {
                  required: 'Number of rooms is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must have at least 1 room' }
                })}
                disabled={isSubmitting}
              />
              {errors.num_of_rooms && <div className="invalid-feedback">{errors.num_of_rooms.message}</div>}
            </div>

            {submitError && (
              <div className="alert alert-danger" role="alert">
                {submitError}
              </div>
            )}

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
    </>
  );
}

export default AddProperty;
