import React, { useState, useEffect } from 'react';
import '../tables.css';
import api from '../../services/api';
const RegisteredUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/registered_users');
                setUsers(response.data || []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="table-container">
            <h1>Registered Users</h1>
            <div className="table-wrapper">
                {users.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Pincode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.user_id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.user_email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.pincode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">No registered users found.</p>
                )}
            </div>
        </div>
    );
};

export default RegisteredUsers;