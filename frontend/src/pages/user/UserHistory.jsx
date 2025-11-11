<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../tables.css';
import api from '../../services/api';
const UserHistory = () => {
    const { user_id } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/api/user_history/${user_id}`);
                setHistory(response.data.history || []);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user_id]);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="table-container">
            <h1>Your Booking History</h1>
            <div className="table-wrapper">
                {history.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Booked On</th>
                                <th>Released On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(item => (
                                <tr key={item.booking_id}>
                                    <td>{item.location}</td>
                                    <td>{item.address}</td>
                                    <td>{new Date(item.registered_time).toLocaleString()}</td>
                                    <td>{item.leaving_time ? new Date(item.leaving_time).toLocaleString() : 'Active'}</td>
                                    <td>
                                        {item.can_release ? (
                                            <Link to={`/user/release_spot/${item.lot_id}/${item.spot_id}/${user_id}`} className="btn btn-danger">Release</Link>
                                        ) : (
                                            'Completed'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">You have no booking history yet.</p>
                )}
            </div>
        </div>
    );
};

=======
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../tables.css';
import api from '../../services/api';
const UserHistory = () => {
    const { user_id } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/api/user_history/${user_id}`);
                setHistory(response.data.history || []);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user_id]);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="table-container">
            <h1>Your Booking History</h1>
            <div className="table-wrapper">
                {history.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Booked On</th>
                                <th>Released On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(item => (
                                <tr key={item.booking_id}>
                                    <td>{item.location}</td>
                                    <td>{item.address}</td>
                                    <td>{new Date(item.registered_time).toLocaleString()}</td>
                                    <td>{item.leaving_time ? new Date(item.leaving_time).toLocaleString() : 'Active'}</td>
                                    <td>
                                        {item.can_release ? (
                                            <Link to={`/user/release_spot/${item.lot_id}/${item.spot_id}/${user_id}`} className="btn btn-danger">Release</Link>
                                        ) : (
                                            'Completed'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">You have no booking history yet.</p>
                )}
            </div>
        </div>
    );
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default UserHistory;