// src/pages/admin/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import the new api service
import './datahandling.css';

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
                // Store tokens and admin ID in localStorage
                console.log(typeof response.data.tokens.refresh);
                console.log(response.data.tokens.refresh);

                localStorage.setItem('accessToken', response.data.tokens.access);
                localStorage.setItem('refreshToken', response.data.tokens.refresh);
                localStorage.setItem('adminId', response.data.admin.admin_id);
                navigate('/admin/homepage');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="form-container-wrapper full-height">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Admin Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;