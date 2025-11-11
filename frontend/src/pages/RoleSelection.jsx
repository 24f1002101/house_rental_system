import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css';

const RoleSelection = () => {
    const [role, setRole] = useState('User');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role === 'User') {
            navigate('/user/login');
        } else if (role === 'Admin') {
            navigate('/admin/login');
        }
    };

    return (
        <div className="form-container-wrapper">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Select Your Role</h1>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button type="submit">Proceed</button>
                </form>
            </div>
        </div>
    );
};

export default RoleSelection;