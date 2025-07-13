import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type RegisterFormInputs = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  re_password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>();

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);

    if (data.password !== data.re_password) {
      setServerError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/users/auth/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        const json = await res.json();
        setServerError(JSON.stringify(json));
      }
    } catch {
      setServerError('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container login-box" style={{ maxWidth: 400 }}>
        <h1 className="mb-4 text-center">Register</h1>

        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className={`form-control dark-input ${errors.username ? 'is-invalid' : ''}`}
              {...register('username', { required: 'Username is required' })}
              disabled={isSubmitting}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className={`form-control dark-input ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              disabled={isSubmitting}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name (optional)</label>
            <input
              id="first_name"
              type="text"
              className="form-control dark-input"
              {...register('first_name')}
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name (optional)</label>
            <input
              id="last_name"
              type="text"
              className="form-control dark-input"
              {...register('last_name')}
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone Number (optional)</label>
            <input
              id="phone_number"
              type="tel"
              className="form-control dark-input"
              {...register('phone_number')}
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className={`form-control dark-input ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
              disabled={isSubmitting}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="re_password" className="form-label">Confirm Password</label>
            <input
              id="re_password"
              type="password"
              className={`form-control dark-input ${errors.re_password ? 'is-invalid' : ''}`}
              {...register('re_password', { required: 'Confirm password is required' })}
              disabled={isSubmitting}
            />
            {errors.re_password && <div className="invalid-feedback">{errors.re_password.message}</div>}
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
              disabled={isSubmitting}
            >
              Back to Login
            </button>

            <button
              type="submit"
              className="btn btn-custom"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
