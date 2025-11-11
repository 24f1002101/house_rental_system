import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import adminBg from '../../assets/house4.jpeg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/admin_login', { email, password });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        localStorage.setItem('adminId', response.data.admin.admin_id);
        navigate('/admin/homepage');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  // Inline styles
  const wrapperStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(33, 158, 188, 0.4)), url(${adminBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Poppins", sans-serif',
  };

  const formContainerStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '40px 50px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#fff',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const inputFocus = {
    borderColor: '#90e0ef',
    backgroundColor: 'rgba(255,255,255,0.2)',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #0077b6, #00b4d8)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 183, 255, 0.4)',
    transition: 'transform 0.25s ease, background 0.3s ease',
  };

  const buttonHover = {
    transform: 'scale(1.03)',
    background: 'linear-gradient(90deg, #0096c7, #48cae4)',
  };

  const errorMessage = {
    color: '#ff6b6b',
    fontSize: '14px',
    marginBottom: '10px',
    textAlign: 'center',
  };

  return (
    <div style={wrapperStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h1 style={headingStyle}>Admin Login</h1>

          {error && <p style={errorMessage}>{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
