import React from 'react';
import AppNavbar from '../components/navbar';

function AddProperty() {
  return (
    <>
      <AppNavbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="container login-box" style={{ maxWidth: 400 }}>
          <h1 className="mb-4 text-center">Add Property</h1>
          <form noValidate>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                id="address"
                type="text"
                className="form-control dark-input"
                placeholder=""
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-control dark-input"
                rows={3}
                placeholder=""
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="property_type" className="form-label">Property Type</label>
              <select id="property_type" className="form-select dark-input">
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="office">Office</option>
                <option value="industrial">Industrial</option>
                <option value="town_house">Town house</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select id="status" className="form-select dark-input">
                <option value="">Select status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="under_renovation">Under renovation</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="area" className="form-label">Area (m²)</label>
              <input
                id="area"
                type="number"
                step="0.01"
                min="1"
                className="form-control dark-input"
                placeholder=""
              />
            </div>

            <div className="mb-3">
              <label htmlFor="num_of_rooms" className="form-label">Number of rooms</label>
              <input
                id="num_of_rooms"
                type="number"
                min="1"
                className="form-control dark-input"
                placeholder=""
              />
            </div>

            <button type="submit" className="btn btn-custom w-100">Add Property</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProperty;
