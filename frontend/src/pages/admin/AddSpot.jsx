
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../forms.css';
import api from '../../services/api'; // Adjust the path as needed

const AddSpot = ({lot_id,lotInfo,onClose,onSpotAdded}) => {
    // const { lot_id } = useParams();
    const [formData, setFormData] = useState({
        address: '',
        room: '1bhk',
        price: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.address) newErrors.address = 'Address is required.';
        else if (formData.address.length > 75) {
            newErrors.address = 'Address cannot exceed 75 characters.';
        }
        if (!/^\d+$/.test(formData.price) || parseInt(formData.price) < 3000) {
            newErrors.price = 'Minimum price.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage('');

        try {
    await api.post(`/api/add_spot/${lot_id}`, formData);
    setMessage('Spot added successfully! Redirecting...');
    setTimeout(() => {
        onClose();
        onSpotAdded();
    }, 500);
} catch (err) {
    setErrors({ api: err.response?.data?.message || 'Failed to add spot.' });
}
    };

    return (
        <div className="form-container-wrapper">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Add Spot to {lotInfo?.location}</h1>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full Address"
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}

                    <select name="room" value={formData.room} onChange={handleChange}>
                        <option value="1bhk">1BHK</option>
                        <option value="2bhk">2BHK</option>
                        <option value="3bhk">3BHK</option>
                    </select>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price per month"
                    />
                    {errors.price && <p className="error-message">{errors.price}</p>}

                    <button type="submit">Add Spot</button>
                </form>
            </div>
        </div>
    );
};


export default AddSpot;