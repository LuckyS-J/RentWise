import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useState } from 'react';

type LoginFormInputs = {
  username: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await loginUser(data.username, data.password);
      localStorage.setItem('access', res.access);
      localStorage.setItem('refresh', res.refresh);
      localStorage.setItem('username', data.username);
      navigate('/');
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container login-box" style={{ maxWidth: 400 }}>
        <h1 className="mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`form-control dark-input ${errors.username ? 'is-invalid' : ''}`}
              {...register('username', { required: 'Username is required' })}
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-control dark-input ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { required: 'Password is required' })}
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {loginError && (
            <div className="alert alert-danger" role="alert">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-custom w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 text-center" style={{ color: '#c8c8ff' }}>
          Don't have an account?{' '}
          <span
            style={{ cursor: 'pointer', color: '#7c4dff', textDecoration: 'underline' }}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
