<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Common Components
import Layout from '../common/Layout.jsx';
import RoleSelection from '../pages/RoleSelection.jsx';
import PrivateRoute from '../common/PrivateRoute'; // Protects routes that need login
import PublicRoute from '../common/PublicRoute';   // Protects routes like login from logged-in users
import RootRedirect from '../common/RootRedirect'; 
// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminHomepage from '../pages/admin/AdminHomePage.jsx';
import AddLot from '../pages/admin/AddLot.jsx';
import ExpandLot from '../pages/admin/ExpandLot.jsx';
import AddSpot from '../pages/admin/AddSpot.jsx';
import EditSpot from '../pages/admin/EditSpot.jsx';
import ViewSpot from '../pages/admin/ViewSpot.jsx';
import RegisteredUsers from '../pages/admin/RegisteredUsers.jsx';
import AdminProfile from '../pages/admin/AdminProfile.jsx';
import AdminSummary from '../pages/admin/AdminSummary.jsx';

// User Pages
import UserLogin from '../pages/user/UserLogin.jsx';
import UserRegistration from '../pages/user/UserRegistration.jsx';
import UserHomepage from '../pages/user/UserHomepage.jsx';
import UserProfile from '../pages/user/UserProfile.jsx';
import BookSpot from '../pages/user/BookSpot.jsx';
import ReleaseSpot from '../pages/user/ReleaseSpot.jsx';
import UserHistory from '../pages/user/UserHistory.jsx';
import UserSummary from '../pages/user/UserSummary.jsx';

const NotFound = () => <h1>404 - Page Not Found</h1>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<PublicRoute />}>
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/registration" element={<UserRegistration />} />
      </Route>

      {/* 
        3. PROTECTED APPLICATION ROUTES
        These routes require a user to be logged in.
        They are all nested within the main <Layout> (header, sidebar, etc.).
      */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route path="/admin/homepage" element={<AdminHomepage />} />
          <Route path="/admin/add_lot" element={<AddLot />} />
          <Route path="/admin/expand_lot/:lot_id" element={<ExpandLot />} />
          <Route path="/admin/add_spot/:lot_id" element={<AddSpot />} />
          <Route path="/admin/edit_spot/:lot_id/:spot_id" element={<EditSpot />} />
          <Route path="/admin/view_spot/:lot_id/:spot_id" element={<ViewSpot />} />
          <Route path="/admin/registered_users" element={<RegisteredUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/summary" element={<AdminSummary />} />
          {/* Add other admin routes here... */}
          
          {/* User Routes */}
          <Route path="/user/:user_id/homepage" element={<UserHomepage />} />
          <Route path="/user/:user_id/profile" element={<UserProfile />} />
          <Route path="/user/book_spot/:lot_id/:spot_id/:user_id" element={<BookSpot />} />
          <Route path="/user/release_spot/:lot_id/:spot_id/:user_id" element={<ReleaseSpot />} />
          <Route path="/user/:user_id/history" element={<UserHistory />} />
          <Route path="/user/:user_id/summary" element={<UserSummary />} />
        </Route>
      </Route>
      
      {/* 4. CATCH-ALL / NOT FOUND ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

=======
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Common Components
import Layout from '../common/Layout.jsx';
import RoleSelection from '../pages/RoleSelection.jsx';
import PrivateRoute from '../common/PrivateRoute'; // Protects routes that need login
import PublicRoute from '../common/PublicRoute';   // Protects routes like login from logged-in users
import RootRedirect from '../common/RootRedirect'; 
// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminHomepage from '../pages/admin/AdminHomePage.jsx';
import AddLot from '../pages/admin/AddLot.jsx';
import ExpandLot from '../pages/admin/ExpandLot.jsx';
import AddSpot from '../pages/admin/AddSpot.jsx';
import EditSpot from '../pages/admin/EditSpot.jsx';
import ViewSpot from '../pages/admin/ViewSpot.jsx';
import RegisteredUsers from '../pages/admin/RegisteredUsers.jsx';
import AdminProfile from '../pages/admin/AdminProfile.jsx';
import AdminSummary from '../pages/admin/AdminSummary.jsx';

// User Pages
import UserLogin from '../pages/user/UserLogin.jsx';
import UserRegistration from '../pages/user/UserRegistration.jsx';
import UserHomepage from '../pages/user/UserHomepage.jsx';
import UserProfile from '../pages/user/UserProfile.jsx';
import BookSpot from '../pages/user/BookSpot.jsx';
import ReleaseSpot from '../pages/user/ReleaseSpot.jsx';
import UserHistory from '../pages/user/UserHistory.jsx';
import UserSummary from '../pages/user/UserSummary.jsx';

const NotFound = () => <h1>404 - Page Not Found</h1>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<PublicRoute />}>
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/registration" element={<UserRegistration />} />
      </Route>

      {/* 
        3. PROTECTED APPLICATION ROUTES
        These routes require a user to be logged in.
        They are all nested within the main <Layout> (header, sidebar, etc.).
      */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route path="/admin/homepage" element={<AdminHomepage />} />
          <Route path="/admin/add_lot" element={<AddLot />} />
          <Route path="/admin/expand_lot/:lot_id" element={<ExpandLot />} />
          <Route path="/admin/add_spot/:lot_id" element={<AddSpot />} />
          <Route path="/admin/edit_spot/:lot_id/:spot_id" element={<EditSpot />} />
          <Route path="/admin/view_spot/:lot_id/:spot_id" element={<ViewSpot />} />
          <Route path="/admin/registered_users" element={<RegisteredUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/summary" element={<AdminSummary />} />
          {/* Add other admin routes here... */}
          
          {/* User Routes */}
          <Route path="/user/:user_id/homepage" element={<UserHomepage />} />
          <Route path="/user/:user_id/profile" element={<UserProfile />} />
          <Route path="/user/book_spot/:lot_id/:spot_id/:user_id" element={<BookSpot />} />
          <Route path="/user/release_spot/:lot_id/:spot_id/:user_id" element={<ReleaseSpot />} />
          <Route path="/user/:user_id/history" element={<UserHistory />} />
          <Route path="/user/:user_id/summary" element={<UserSummary />} />
        </Route>
      </Route>
      
      {/* 4. CATCH-ALL / NOT FOUND ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
export default AppRoutes;