
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../admin/datahandling.css';
import api from '../../services/api';
const UserProfile = () => {
    const { user_id } = useParams();
    const [formData, setFormData] = useState({ name: '', email: '', address: '', pincode: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/api/user_profile/${user_id}`);
                const data = response.data;
                setFormData({
                    name: data.name,
                    email: data.user_email,
                    address: data.address,
                    pincode: data.pincode
                });
            } catch (err) {
                setErrors({ api: 'Failed to load profile.' });
            }
        };
        fetchProfile();
    }, [user_id]);

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
        if (!/^[a-z0-9._%+-]+@gmail\.com$/i.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
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

       try {
            await api.put(`/api/user_profile/${user_id}`, formData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setErrors({ api: err.response?.data?.error || 'Update failed.' });
        }
    };

    return (
        <div className="form-container-wrapper full-height">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Your Profile</h1>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                    <label>Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                    {errors.pincode && <p className="error-message">{errors.pincode}</p>}
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};


export default UserProfile;