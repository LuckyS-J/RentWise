import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const access = localStorage.getItem('access');

  const isAuthenticated = access && access !== 'undefined' && access !== '';

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
