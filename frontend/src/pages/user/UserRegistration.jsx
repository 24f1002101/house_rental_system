// src/pages/user/UserRegistration.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import the api service
import '../admin/datahandling.css';
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
        if (!formData.name) {
            newErrors.name = 'Name is required.';
        } else if (formData.name.length > 45) {
            newErrors.name = 'Name cannot exceed 45 characters.';
        }
        if (!/^[a-z0-9]+@gmail\.com$/i.test(formData.user_email)) {
            newErrors.user_email = 'Invalid email format.';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.address) {
            newErrors.address = 'Address is required.';
        } else if (formData.address.length > 75) {
            newErrors.address = 'Address cannot exceed 75 characters.';
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const submissionData = {
            user_email: formData.user_email,
            password: formData.password,
            name: formData.name,
            address: formData.address,
            pincode: formData.pincode,
        };
        try {
            const response = await api.post('/api/user_registration', submissionData);
            
            if (response.status === 201) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/user/login'), 2000);
            }
        } catch (err) {
            console.error(err)
            setErrors({ api: err.response?.data?.errors ? Object.values(err.response.data.errors).join(', ') : 'Registration failed' });
        }
    };
   
    return (
        <div className="form-container-wrapper full-height">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>User Registration</h1>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <input type="text" name="name" onChange={handleChange} placeholder="Full Name" />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                    <input type="email" name="user_email" onChange={handleChange} placeholder="Email" />
                    {errors.user_email && <p className="error-message">{errors.user_email}</p>}
                    <input type="password" name="password" onChange={handleChange} placeholder="Password" />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                    <input type="text" name="address" onChange={handleChange} placeholder="Address" />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                    <input type="text" name="pincode" onChange={handleChange} placeholder="Pincode" maxLength="6" />
                    {errors.pincode && <p className="error-message">{errors.pincode}</p>}
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default UserRegistration;