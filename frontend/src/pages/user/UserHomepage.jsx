
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserHomepage.css';
import Modal from '../../components/Modal.jsx';
import BookSpot from './BookSpot.jsx';
import api from '../../services/api.js';
const UserHomepage = () => {
    const { user_id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/user_homepage/${user_id}`);
            setData(response.data);
        } catch (error) {
            console.error("Fetch error:", error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId || storedUserId !== user_id) {
            navigate('/user/login');
            return;
        }
        fetchData();
    }, [user_id, navigate]);

    const handleBookNowClick = (spot, lot) => {
        setSelectedSpot({
            ...spot,
            lot_id: lot.lot_id,
            location: lot.location,
            user_id: user_id
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSpot(null);
    };

    if (loading) return <div className="loading-spinner-wrapper"><div className="loading-spinner"></div></div>;
    if (!data) return <p className="error-message">Could not load dashboard data.</p>;

    const lotsWithAvailability = data.lots.filter(lot => lot.available_spots && lot.available_spots.length > 0);

    return (
        <div className="user-homepage">
            <header className="homepage-header">
                <h1>Welcome, {data.user.user_name}!</h1>
                <p>Find your perfect rental spot below.</p>
            </header>

            <div className="user-lots-container">
                {lotsWithAvailability.length > 0 ? (
                    lotsWithAvailability.map(lot => (
                        <div key={lot.lot_id} className="user-lot-card">
                            <h2>{lot.location} ({lot.pincode})</h2>
                            <div className="available-spots-list">
                                {lot.available_spots.map(spot => (
                                    <div key={spot.spot_id} className="user-spot-card">
                                        {/* This new wrapper is crucial for the layout */}
                                        <div className="spot-card-content">
                                            <p className="spot-price">₹{spot.price}/month</p>
                                            <p><strong>Address:</strong> {spot.address}</p>
                                            <p><strong>Type:</strong> 
                                                <span className="spot-type-badge">{spot.type}</span>
                                            </p>
                                        </div>
                                        {/* Footer ensures the button is always at the bottom */}
                                        <div className="spot-card-footer">
                                            <button 
                                                onClick={() => handleBookNowClick(spot, lot)}
                                                className="btn-book-now"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-container">
                        <p className="empty-state-text">There are currently no available spots anywhere. Please check back later!</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <BookSpot 
                    spotInfo={selectedSpot}
                    onClose={handleCloseModal}
                    onBookingSuccess={fetchData}
                />
            </Modal>
        </div>
    );
};

export default UserHomepage;