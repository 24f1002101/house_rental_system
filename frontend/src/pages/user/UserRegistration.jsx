// src/pages/user/UserRegistration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import userBg from '../../assets/house1.jpeg';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    user_email: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    else if (formData.name.length > 45) newErrors.name = 'Name cannot exceed 45 characters.';
    if (!/^[a-z0-9]+@gmail\.com$/i.test(formData.user_email))
      newErrors.user_email = 'Invalid email format.';
    if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.address) newErrors.address = 'Address is required.';
    else if (formData.address.length > 75)
      newErrors.address = 'Address cannot exceed 75 characters.';
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = 'Pincode must be 6 digits.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await api.post('/api/user_registration', {
        user_email: formData.user_email,
        password: formData.password,
        name: formData.name,
        address: formData.address,
        pincode: formData.pincode,
      });
      if (response.status === 201) {
        setMessage('🎉 Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/user/login'), 2000);
      }
    } catch (err) {
      console.error(err);
      setErrors({
        api:
          err.response?.data?.errors
            ? Object.values(err.response.data.errors).join(', ')
            : 'Registration failed. Please try again.',
      });
    }
  };

  // Inline styles
  const wrapperStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(133, 204, 237, 0.4)), url(${userBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    color: '#fff',
    animation: 'fadeIn 0.7s ease-in-out',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    fontSize: '15px',
    transition: '0.3s',
  };

  const inputFocus = {
    borderColor: '#90e0ef',
    backgroundColor: 'rgba(255,255,255,0.2)',
  };

  const buttonStyle = {
    marginTop: '15px',
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #00b4d8, #48cae4)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background 0.3s ease',
  };

  const buttonHover = {
    transform: 'scale(1.03)',
    background: 'linear-gradient(90deg, #0096c7, #00b4d8)',
  };

  const errorMessage = {
    color: '#ff6b6b',
    fontSize: '13px',
    textAlign: 'left',
    marginBottom: '5px',
  };

  const successMessage = {
    color: '#90ee90',
    fontSize: '14px',
    marginBottom: '10px',
  };

  return (
    <div style={wrapperStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h1 style={{ marginBottom: '15px', fontSize: '26px', fontWeight: '600' }}>User Registration</h1>

          {errors.api && <p style={errorMessage}>{errors.api}</p>}
          {message && <p style={successMessage}>{message}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.name && <p style={errorMessage}>{errors.name}</p>}

          <input
            type="email"
            name="user_email"
            placeholder="Email"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.user_email && <p style={errorMessage}>{errors.user_email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.password && <p style={errorMessage}>{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p style={errorMessage}>{errors.confirmPassword}</p>}

          <input
            type="text"
            name="address"
            placeholder="Address"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.address && <p style={errorMessage}>{errors.address}</p>}

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            maxLength="6"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            onChange={handleChange}
          />
          {errors.pincode && <p style={errorMessage}>{errors.pincode}</p>}

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
