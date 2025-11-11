
import React, { useState, useEffect } from 'react';
import '../forms.css'; // Reusing generic form styles
import api from '../../services/api';
const EditSpot = ({ lot_id, spot_id, onClose, onSpotUpdated }) => {
    const [formData, setFormData] = useState({ address: '', room: '', price: '' });
    const [originalData, setOriginalData] = useState({});
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!spot_id) return;
        const fetchSpotData = async () => {
            try {
                const response = await api.get(`/api/edit_spot/${lot_id}/${spot_id}`);
                const data = response.data;
                setFormData({ address: data.address, room: data.type, price: data.price.toString() });
                setOriginalData(data);
            } catch (err) {
                setErrors({ api: 'An error occurred while fetching data.' });
            }
        };
        fetchSpotData();
    }, [lot_id, spot_id]);
    const validate = () => {
        const newErrors = {};
        if (!formData.address) newErrors.address = 'Address is required.';
        else if (formData.address.length > 75) {
            newErrors.address = 'Address cannot exceed 75 characters.';
        }else if (originalData.lot_location && !formData.address.toLowerCase().includes(originalData.lot_location.toLowerCase())) {
            newErrors.address = `Address must contain the lot location ("${originalData.lot_location}").`;
        }
        if (!/^\d+$/.test(formData.price) || parseInt(formData.price) < 3000) {
            newErrors.price = 'Minimum price  3000.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage('');

        const changedData = {};
        if (formData.address !== originalData.address) changedData.address = formData.address;
        if (formData.room !== originalData.type) changedData.room = formData.room;
        if (formData.price !== originalData.price.toString()) changedData.price = formData.price;

        if (Object.keys(changedData).length === 0) {
            setErrors({ api: "No changes were made." });
            return;
        }

        try {
            await api.put(`/api/edit_spot/${lot_id}/${spot_id}`, changedData);
            setMessage('Spot updated successfully! Redirecting...');
            setTimeout(() => { 
                onClose();
                onSpotUpdated();
            }, 500);
        } catch (err) {
            console.error(err)
            setErrors({ api: err.response?.data?.error || 'Failed to update spot.' });
        }
    };
    

    return (
        <div className="form-container-wrapper">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Edit Spot #{spot_id}</h1>
                    <p>Location: {originalData.lot_location}</p>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full Address"
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}

                    <label>Room Type</label>
                    <select name="room" value={formData.room} onChange={handleChange}>
                        <option value="1bhk">1BHK</option>
                        <option value="2bhk">2BHK</option>
                        <option value="3bhk">3BHK</option>
                    </select>

                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price per month"
                    />
                    {errors.price && <p className="error-message">{errors.price}</p>}

                    <button type="submit">Update Spot</button>
                </form>
            </div>
        </div>
    );
};


export default EditSpot;