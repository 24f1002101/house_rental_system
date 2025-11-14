// src/common/Layout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import ChatbotModal from "../components/Chatbot";  
import './Layout.css';

const Layout = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const adminId = localStorage.getItem('adminId');

  const handleLogout = () => {
    localStorage.clear();
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
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="content-area">
        <Outlet />
      </main>

      {/* FLOATING CHATBOT ICON */}
      {userId && (
        <button 
          className="floating-chatbot-btn"
          onClick={() => setShowChatbot(true)}
        >
          💬
        </button>
      )}

      {/* Chatbot Modal Component */}
      {showChatbot && (
        <ChatbotModal close={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Layout;
