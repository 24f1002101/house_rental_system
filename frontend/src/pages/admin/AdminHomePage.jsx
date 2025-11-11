import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHomepage.css';
import Modal from '../../components/Modal.jsx'; // Import the Modal component
import AddLot from './AddLot'; // Import the AddLot component
import api from '../../services/api'; // Adjust the path as needed
const AdminHomepage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLots, setFilteredLots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const navigate = useNavigate();

    // Renamed to be more descriptive
    const fetchAdminData = async () => {
        try {
    const response = await api.get('/api/admin_homepage');
    setData(response.data);
    setFilteredLots(response.data.lots);
    } catch (error) {
        console.error('Fetch error:', error.response?.data?.error || error.message);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            navigate('/admin/login');
            return;
        }
        fetchAdminData();
    }, [navigate]);

    useEffect(() => {
        if (data) {
            const results = data.lots.filter(lot =>
                lot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lot.pincode.includes(searchTerm)
            );
            setFilteredLots(results);
        }
    }, [searchTerm, data]);

    const handleDeleteLot = async (lotId) => {
        if (window.confirm('Are you sure you want to delete this lot? This action cannot be undone.')) {
            try {
                await api.delete(`/api/delete_lot/${lotId}`);
                // If the request is successful, refetch the data.
                fetchAdminData(); 
            } catch (error) {
                // Axios handles non-2xx responses as errors, simplifying the logic.
                const errorMessage = error.response?.data?.error || 'An error occurred while deleting the lot.';
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    if (loading) return <div className="loading-spinner"></div>;
    if (!data) return <p>No data found.</p>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {data.admin.admin_name}</h1>
                <div className="header-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by location or pincode..."
                            className="search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Changed from Link to a button that opens the modal */}
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        Add New Lot
                    </button>
                </div>
            </header>

            <div className="lots-container">
                {filteredLots.length > 0 ? (
                    filteredLots.map(lot => (
                        <div key={lot.lot_id} className="lot-card">
                            <div className="card-content">
                                <div className="lot-header">
                                    <h2>{lot.location} ({lot.pincode})</h2>
                                </div>
                                <div className="lot-stats">
                                    <p>Total Spots: <strong>{lot.total_spots}</strong></p>
                                    <p>Available: <strong className="available">{lot.available_spots}</strong></p>
                                    <p>Occupied: <strong className="occupied">{lot.occupied_spots}</strong></p>
                                </div>
                            </div>
                            <div className="lot-actions">
                                <Link to={`/admin/expand_lot/${lot.lot_id}`} className="btn btn-secondary">View Details</Link>
                                <button onClick={() => handleDeleteLot(lot.lot_id)} className="btn btn-danger">Delete Lot</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No lots found matching your search.</p>
                )}
            </div>

            {/* Modal for adding a new lot */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddLot
                    onClose={() => setIsModalOpen(false)}
                    onLotAdded={fetchAdminData} // Pass the fetch function to refresh data
                />
            </Modal>
        </div>
    );
};

export default AdminHomepage;