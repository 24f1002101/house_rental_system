<<<<<<< HEAD
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuthenticated = !!(localStorage.getItem('adminId') || localStorage.getItem('userId'));
  
  // If the user is already authenticated, redirect them away from the public page to the root.
  // The root will then handle redirecting them to their correct homepage.
  // Otherwise, show the public page (e.g., the login form).
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

=======
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuthenticated = !!(localStorage.getItem('adminId') || localStorage.getItem('userId'));
  
  // If the user is already authenticated, redirect them away from the public page to the root.
  // The root will then handle redirecting them to their correct homepage.
  // Otherwise, show the public page (e.g., the login form).
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default PublicRoute;