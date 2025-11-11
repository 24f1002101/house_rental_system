<<<<<<< HEAD
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // A user is authenticated if either an adminId or userId exists.
  const isAuthenticated = !!(localStorage.getItem('adminId') || localStorage.getItem('userId'));
  
  // If authenticated, render the child route (using <Outlet />).
  // Otherwise, redirect them to the user login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

=======
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // A user is authenticated if either an adminId or userId exists.
  const isAuthenticated = !!(localStorage.getItem('adminId') || localStorage.getItem('userId'));
  
  // If authenticated, render the child route (using <Outlet />).
  // Otherwise, redirect them to the user login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default PrivateRoute;