import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuthenticated = !!(localStorage.getItem('adminId') || localStorage.getItem('userId'));
  
  // If the user is already authenticated, redirect them away from the public page to the root.
  // The root will then handle redirecting them to their correct homepage.
  // Otherwise, show the public page (e.g., the login form).
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;