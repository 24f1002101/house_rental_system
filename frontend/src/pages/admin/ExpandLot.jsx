
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ExpandLot.css';
import Modal from '../../components/Modal.jsx';
import AddSpot from './AddSpot';
import EditSpot from './EditSpot';
import api from '../../services/api';
const ExpandLot = () => {
    const { lot_id } = useParams();
    const [lotData, setLotData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSpotToEdit, setCurrentSpotToEdit] = useState(null);

    const fetchLotData = async () => {
        try {
            const response = await api.get(`/api/expand_lot/${lot_id}`);
            setLotData(response.data);
        } catch (error) {
            console.error("Fetch error:", error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchLotData();
    }, [lot_id]);

    const handleDeleteSpot = async (spotId) => {
        if (window.confirm('Are you sure you want to delete this spot?')) {
            try {
                await api.get(`/api/delete_spot/${lot_id}/${spotId}`); // Should ideally be api.delete()
                fetchLotData();
            } catch (error) {
                alert(`Error: ${error.response?.data?.error || 'An error occurred.'}`);
            }
        }
    };

    const handleOpenEditModal = (spotId) => {
        setCurrentSpotToEdit(spotId);
        setIsEditModalOpen(true);
    };

    if (loading) return <p>Loading...</p>;
    if (!lotData) return <p>Lot not found.</p>;

    return (
        <div className="expand-lot-container">
            <header className="lot-details-header">
                <h1>{lotData.lot.location} - {lotData.lot.pincode}</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">Add New Spot</button>
            </header>
            <div className="spots-grid">
                {lotData.spots.length > 0 ? (
                    lotData.spots.map(spot => (
                        <div key={spot.spot_id} className={`spot-info-card ${spot.status === 'O' ? 'occupied' : 'available'}`}>
                            <h3>Spot #{spot.spot_id}</h3>
                            <p><strong>Address:</strong> {spot.address}</p>
                            <p><strong>Type:</strong> {spot.room_type}</p>
                            <p><strong>Price:</strong> ₹ {spot.price}/month</p>
                            <p><strong>Status:</strong> {spot.status === 'A' ? 'Available' : 'Occupied'}</p>
                            <div className="spot-actions">
                                {spot.status === 'O' ? (
                                    <Link to={`/admin/view_spot/${lot_id}/${spot.spot_id}`} className="btn btn-secondary">View Details</Link>
                                ) : (
                                    <>
                                        <button onClick={() => handleOpenEditModal(spot.spot_id)} className="btn btn-secondary">Edit</button>
                                        <button onClick={() => handleDeleteSpot(spot.spot_id)} className="btn btn-danger">Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No spots found for this lot. Add one!</p>
                )}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddSpot 
                    lot_id={lot_id}
                    lotInfo={lotData}
                    onClose={() => setIsAddModalOpen(false)}
                    onSpotAdded={fetchLotData}
                />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <EditSpot 
                    lot_id={lot_id}
                    spot_id={currentSpotToEdit}
                    onClose={() => setIsEditModalOpen(false)}
                    onSpotUpdated={fetchLotData}
                />
            </Modal>
        </div>
    );
};

export default ExpandLot;