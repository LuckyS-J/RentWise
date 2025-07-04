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
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input
            {...register('username', { required: 'Username is required' })}
            type="text"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;