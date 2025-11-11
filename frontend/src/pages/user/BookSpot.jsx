<<<<<<< HEAD
import React, { useState } from 'react';
import '../forms.css'; // Using the beautiful generic form styles
import api from '../../services/api';
const BookSpot = ({ spotInfo, onClose, onBookingSuccess }) => {
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage('');

        try {
            await api.post(`/api/book_spot/${spotInfo.lot_id}/${spotInfo.spot_id}/${spotInfo.user_id}`, { phone });
            setMessage('Spot booked successfully! Refreshing...');
            setTimeout(() => {
                if (onClose) onClose();
            }, 500);
            if (onBookingSuccess) onBookingSuccess();
        } catch (err) {
            setErrors({ api: err.response?.data?.error || 'An error occurred during booking.' });
        }
    };

    if (!spotInfo) return null;

    return (
        // The .form-container provides the visible modal body
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1>Confirm Your Booking</h1>
                <p>You are about to book a <strong>{spotInfo.type}</strong> spot in <strong>{spotInfo.location}</strong>.</p>
                
                {errors.api && <div className="error-message">{errors.api}</div>}
                {message && <div className="success-message">{message}</div>}

                <label htmlFor="phone">Contact Number</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit Phone Number"
                    maxLength="10"
                    required
                />
                {errors.phone && <div className="error-message" style={{marginTop: '-1rem', marginBottom: '1rem'}}>{errors.phone}</div>}
                
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

=======
import React, { useState } from 'react';
import '../forms.css'; // Using the beautiful generic form styles
import api from '../../services/api';
const BookSpot = ({ spotInfo, onClose, onBookingSuccess }) => {
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage('');

        try {
            await api.post(`/api/book_spot/${spotInfo.lot_id}/${spotInfo.spot_id}/${spotInfo.user_id}`, { phone });
            setMessage('Spot booked successfully! Refreshing...');
            setTimeout(() => {
                if (onClose) onClose();
            }, 500);
            if (onBookingSuccess) onBookingSuccess();
        } catch (err) {
            setErrors({ api: err.response?.data?.error || 'An error occurred during booking.' });
        }
    };

    if (!spotInfo) return null;

    return (
        // The .form-container provides the visible modal body
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1>Confirm Your Booking</h1>
                <p>You are about to book a <strong>{spotInfo.type}</strong> spot in <strong>{spotInfo.location}</strong>.</p>
                
                {errors.api && <div className="error-message">{errors.api}</div>}
                {message && <div className="success-message">{message}</div>}

                <label htmlFor="phone">Contact Number</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit Phone Number"
                    maxLength="10"
                    required
                />
                {errors.phone && <div className="error-message" style={{marginTop: '-1rem', marginBottom: '1rem'}}>{errors.phone}</div>}
                
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default BookSpot;