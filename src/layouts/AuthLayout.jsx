import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // The Landing and Login pages provide their own full-screen immersive designs,
  // so we don't wrap them in any additional UI here.
  return <Outlet />;
};

