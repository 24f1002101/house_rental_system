
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewSpot.css';
import api from '../../services/api';
const ViewSpot = () => {
    const { lot_id, spot_id } = useParams();
    const [spotDetails, setSpotDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpotDetails = async () => {
            try {
                const response = await api.get(`/api/view_spot/${lot_id}/${spot_id}`);
                setSpotDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchSpotDetails();
    }, [lot_id, spot_id]);

    if (loading) return <p>Loading spot details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!spotDetails) return <p>No details available for this spot.</p>;

    return (
        <div className="view-spot-container">
            <div className="details-card">
                <h1>Booking Details for Spot #{spotDetails.spot_id}</h1>
                <div className="details-grid">
                    <p><strong>Booked By:</strong> {spotDetails.booked_user}</p>
                    <p><strong>Registered Time:</strong> {new Date(spotDetails.registered_time).toLocaleString()}</p>
                    <p><strong>Days Elapsed:</strong> {spotDetails.days_elapsed}</p>
                    <p><strong>Daily Amount:</strong>  ₹{spotDetails.daily_amount.toFixed(2)}</p>
                    <p><strong>Total Amount Due:</strong>  ₹{spotDetails.total_amount.toFixed(2)}</p>
                </div>
                <h2>Spot Information</h2>
                <div className="details-grid">
                    <p><strong>Address:</strong> {spotDetails.spot_details.address}</p>
                    <p><strong>Type:</strong> {spotDetails.spot_details.type}</p>
                    <p><strong>Monthly Price:</strong>  ₹{spotDetails.spot_details.price}</p>
                    <p><strong>Status:</strong> {spotDetails.spot_details.status === 'O' ? 'Occupied' : 'Available'}</p>
                </div>
            </div>
        </div>
    );
};


export default ViewSpot;