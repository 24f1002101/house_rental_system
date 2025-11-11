import React from 'react';
import { Navigate } from 'react-router-dom';
import RoleSelection from '../pages/RoleSelection';

const RootRedirect = () => {
    const adminId = localStorage.getItem('adminId');
    const userId = localStorage.getItem('userId');

    if (adminId) {
        // If an adminId exists, redirect to the admin dashboard.
        // `replace` prevents the user from clicking "back" to this redirect page.
        return <Navigate to="/admin/homepage" replace />;
    }
    
    if (userId) {
        // If a userId exists, redirect to that user's homepage.
        return <Navigate to={`/user/${userId}/homepage`} replace />;
    }

    // If neither is logged in, show the role selection page.
    return <RoleSelection />;
};

export default RootRedirect;