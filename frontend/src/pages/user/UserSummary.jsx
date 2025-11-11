<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../tables.css';
import api from '../../services/api';
const UserSummary = () => {
    const { user_id } = useParams();
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
           try {
                const response = await api.get(`/api/user_summary/${user_id}`);
                setSummary(response.data.summary || []);
            } catch (error) {
                console.error("Failed to fetch summary:", error);
                setSummary([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [user_id]);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="table-container">
            <h1>Your Past Bookings Summary</h1>
            <div className="table-wrapper">
                {summary.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Booked</th>
                                <th>Released</th>
                                <th>Days Spent</th>
                                <th>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.location}</td>
                                    <td>{item.address}</td>
                                    <td>{new Date(item.booked_time).toLocaleString()}</td>
                                    <td>{new Date(item.leaving_time).toLocaleString()}</td>
                                    <td>{item.days_spent}</td>
                                    <td>₹{item.amount_spent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">You have no completed bookings to summarize.</p>
                )}
            </div>
        </div>
    );
};

=======
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../tables.css';
import api from '../../services/api';
const UserSummary = () => {
    const { user_id } = useParams();
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
           try {
                const response = await api.get(`/api/user_summary/${user_id}`);
                setSummary(response.data.summary || []);
            } catch (error) {
                console.error("Failed to fetch summary:", error);
                setSummary([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [user_id]);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="table-container">
            <h1>Your Past Bookings Summary</h1>
            <div className="table-wrapper">
                {summary.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Booked</th>
                                <th>Released</th>
                                <th>Days Spent</th>
                                <th>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.location}</td>
                                    <td>{item.address}</td>
                                    <td>{new Date(item.booked_time).toLocaleString()}</td>
                                    <td>{new Date(item.leaving_time).toLocaleString()}</td>
                                    <td>{item.days_spent}</td>
                                    <td>₹{item.amount_spent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">You have no completed bookings to summarize.</p>
                )}
            </div>
        </div>
    );
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default UserSummary;