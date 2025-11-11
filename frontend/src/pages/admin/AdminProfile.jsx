
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './datahandling.css';
import api from '../../services/api';
const AdminProfile = () => {
    const [formData, setFormData] = useState({ admin_name: '', admin_email: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/update_admin_profile');
                console.log(response.data);
                setFormData(response.data);
            } catch (err) {
                console.error(err);
                setErrors({ api: 'Failed to load profile.' });
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.admin_name) {
            newErrors.admin_name = 'Name is required.';
        } else if (formData.admin_name.length > 45) {
            newErrors.admin_name = 'Name cannot exceed 45 characters.';
        }
        if (!/^[a-z0-9]+@gmail\.com$/i.test(formData.admin_email)) {
            newErrors.admin_email = 'Invalid email format.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

       try {
            await api.put('/api/update_admin_profile', formData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setErrors({ api: err.response?.data?.error || 'Update failed.' });
        }
    };

    return (
        <div className="form-container-wrapper full-height">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Admin Profile</h1>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <label>Name</label>
                    <input type="text" name="admin_name" value={formData.admin_name} onChange={handleChange} />
                    {errors.admin_name && <p className="error-message">{errors.admin_name}</p>}
                    <label>Email</label>
                    <input type="email" name="admin_email" value={formData.admin_email} onChange={handleChange} />
                    {errors.admin_email && <p className="error-message">{errors.admin_email}</p>}
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;