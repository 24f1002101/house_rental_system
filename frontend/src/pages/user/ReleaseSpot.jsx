<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReleaseSpot.css';
import api from '../../services/api';
const ReleaseSpot = () => {
    const { lot_id, spot_id, user_id } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/api/release_spot/${lot_id}/${spot_id}/${user_id}`);
                setDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch details.');
            }
        };
        fetchDetails();
    }, [lot_id, spot_id, user_id]);

    const handleRelease = async () => {
        try {
            await api.post(`/api/release_spot/${lot_id}/${spot_id}/${user_id}`);
            setMessage('Spot released successfully! Redirecting...');
            setTimeout(() => navigate(`/user/${user_id}/history`), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to release spot.');
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!details) return <p>Loading release details...</p>;

    return (
        <div className="release-container">
            <div className="release-card">
                <h1>Release Spot #{details.spot_id}</h1>
                {message && <p className="success-message">{message}</p>}
                <p><strong>Address:</strong> {details.address}</p>
                <p><strong>Room Type:</strong> {details.room_type}</p>
                <p><strong>Booked On:</strong> {new Date(details.booked_time).toLocaleString()}</p>
                <p><strong>Days Spent:</strong> {details.days_spent}</p>
                <p className="total-amount"><strong>Total Amount Due:  ₹{details.total_amount.toFixed(2)}</strong></p>
                <button onClick={handleRelease} className="btn btn-danger">Confirm and Release Spot</button>
            </div>
        </div>
    );
};

=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReleaseSpot.css';
import api from '../../services/api';
const ReleaseSpot = () => {
    const { lot_id, spot_id, user_id } = useParams();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/api/release_spot/${lot_id}/${spot_id}/${user_id}`);
                setDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch details.');
            }
        };
        fetchDetails();
    }, [lot_id, spot_id, user_id]);

    const handleRelease = async () => {
        try {
            await api.post(`/api/release_spot/${lot_id}/${spot_id}/${user_id}`);
            setMessage('Spot released successfully! Redirecting...');
            setTimeout(() => navigate(`/user/${user_id}/history`), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to release spot.');
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!details) return <p>Loading release details...</p>;

    return (
        <div className="release-container">
            <div className="release-card">
                <h1>Release Spot #{details.spot_id}</h1>
                {message && <p className="success-message">{message}</p>}
                <p><strong>Address:</strong> {details.address}</p>
                <p><strong>Room Type:</strong> {details.room_type}</p>
                <p><strong>Booked On:</strong> {new Date(details.booked_time).toLocaleString()}</p>
                <p><strong>Days Spent:</strong> {details.days_spent}</p>
                <p className="total-amount"><strong>Total Amount Due:  ₹{details.total_amount.toFixed(2)}</strong></p>
                <button onClick={handleRelease} className="btn btn-danger">Confirm and Release Spot</button>
            </div>
        </div>
    );
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default ReleaseSpot;