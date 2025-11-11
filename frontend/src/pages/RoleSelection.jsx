import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css';
import roleBg from '../assets/house2.jpeg'; // 🌆 choose any image you like

const RoleSelection = () => {
  const [role, setRole] = useState('User');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'User') navigate('/user/login');
    else if (role === 'Admin') navigate('/admin/login');
  };

  return (
    <div
      className="form-container-wrapper full-height"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(133,204,237,0.4)), url(${roleBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="form-container"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '50px 40px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          width: '100%',
          maxWidth: '400px',
          color: '#fff',
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1 style={{ marginBottom: '25px', color: '#fff', fontWeight: '600' }}>
            Select Your Role
          </h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              color: '#333',
              marginBottom: '25px',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
            }}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(133, 204, 237, 0.9)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(133, 204, 237, 1)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(133, 204, 237, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;
