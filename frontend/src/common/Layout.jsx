// src/common/Layout.jsx

import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const adminId = localStorage.getItem('adminId');

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('adminId');
    navigate('/');
  };

  return (
    <div className="layout-container">
      <header className="main-header">
       <div className="logo">
          <Link to={userId ? `/user/${userId}/homepage` : (adminId ? '/admin/homepage' : '/')}>
            Rental Parking
          </Link>
        </div>
        <nav>
          {userId && (
            <>
              <Link to={`/user/${userId}/homepage`}>Home</Link>
              <Link to={`/user/${userId}/profile`}>Profile</Link>
              <Link to={`/user/${userId}/history`}>Booking History</Link>
              <Link to={`/user/${userId}/summary`}>My Summary</Link>
            </>
          )}
          {adminId && (
            <>
              <Link to="/admin/homepage">Dashboard</Link>
              <Link to="/admin/registered_users">Users</Link>
              <Link to="/admin/summary">Summary</Link>
              <Link to="/admin/profile">Profile</Link>
            </>
          )}
          {(userId || adminId) && (
            <button onClick={handleLogout} className="logout-button">Logout</button>
          )}
        </nav>
      </header>
      <main className="content-area">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;