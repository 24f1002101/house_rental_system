import React, { useState } from 'react';
// No longer need useNavigate
// import { useNavigate } from 'react-router-dom';
import '../forms.css'; // Make sure this path is correct
import api from '../../services/api'; // Adjust the path as needed
// Accept onClose and onLotAdded as props
const AddLot = ({ onClose, onLotAdded }) => {
    const [location, setLocation] = useState('');
    const [pin, setPin] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    // const navigate = useNavigate(); // No longer needed

    const validate = () => {
        const newErrors = {};
        if (!location) {
            newErrors.location = 'Location is required.';
        } else if (location.length > 50) {
            newErrors.location = 'Location cannot exceed 50 characters.';
        }
        if (!/^\d{6}$/.test(pin)) {
            newErrors.pin = 'Pincode must be 6 digits.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage('');

        try {
    // The second argument is the request body. `api` handles headers and stringifying.
    const response = await api.post('/api/add_lot', { location, pin });

    // With axios, the response data is directly on `response.data`
    setMessage('Lot added successfully!');
    onLotAdded();
    setTimeout(() => {
        onClose();
    }, 1500);

    } catch (err) {
    // Axios errors for network or bad status codes are caught here.
    // The server's error message is in `err.response.data`.
        setErrors({ api: err.response?.data?.error || 'Failed to add lot.' });
    }
    };

    return (
        // The styling of this container might need slight adjustments for the modal
        <div className="form-container-wrapper" style={{ padding: '2rem' }}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Add New Lot</h1>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location Name"
                    />
                    {errors.location && <p className="error-message">{errors.location}</p>}
                    <input
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Pincode"
                        maxLength="6"
                    />
                    {errors.pin && <p className="error-message">{errors.pin}</p>}
                    <button type="submit">Add Lot</button>
                </form>
            </div>
        </div>
    );
}

export default AddLot;