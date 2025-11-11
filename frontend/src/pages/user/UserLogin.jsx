// src/pages/user/UserLogin.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Import the new api service
import '../admin/datahandling.css';
import { GoogleLogin } from '@react-oauth/google';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use the api service and the new URL path
            const response = await api.post('/api/user_login', { email, password });
            
            if (response.status === 200) {
                if (response.data.redirect_to === 'user_homepage') {
                    // Store tokens and user ID in localStorage
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
    
    const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential:", credentialResponse);

    try {
        const response = await api.post('/dj-rest-auth/google/', {
        id_token: credentialResponse.credential,
    });


        const { access, refresh, user } = response.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('userId', user.pk);

        navigate(`/user/${user.pk}/homepage`);
    } catch (err) {
        console.error("Google login failed:", err);
        setError('Google login failed. Please try again.');
    }
};


    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="form-container-wrapper full-height">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>User Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                    <h1>google auth</h1>
                    <div className="google-login-container">
                        <p>OR</p>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                        />
                    </div>
                    <Link to="/user/registration" className="form-link">Don't have an account? Register</Link>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;