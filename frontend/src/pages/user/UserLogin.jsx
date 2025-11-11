import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import '../admin/datahandling.css';
import { GoogleLogin } from '@react-oauth/google';
import userBg from '../../assets/house1.jpeg';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/user_login', { email, password });
      if (response.status === 200) {
        if (response.data.redirect_to === 'user_homepage') {
          localStorage.setItem('accessToken', response.data.tokens.access);
          localStorage.setItem('refreshToken', response.data.tokens.refresh);
          localStorage.setItem('userId', response.data.user_id);
          navigate(`/user/${response.data.user_id}/homepage`);
        }
      }
    } catch (err) {
      if (err.response && err.response.data.redirect_to === 'registration') {
        navigate('/user/registration');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="form-container-wrapper full-height"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(133, 204, 237, 0.4)), url(${userBg})`,
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
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          width: '100%',
          maxWidth: '400px',
          color: '#fff',
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1 style={{ textAlign: 'center', color: '#fff' }}>User Login</h1>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.6)',
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.6)',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(133, 204, 237, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 'bold',
              marginTop: '10px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.background = 'rgba(133, 204, 237, 1)')}
            onMouseOut={(e) => (e.target.style.background = 'rgba(133, 204, 237, 0.9)')}
          >
            Login
          </button>
          <Link
            to="/user/registration"
            className="form-link"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '15px',
              color: '#fff',
              textDecoration: 'underline',
            }}
          >
            Don't have an account? Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
