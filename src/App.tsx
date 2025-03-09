import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Support from './pages/Support';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTracks from './pages/admin/AdminTracks';
import AdminCreate from './pages/admin/AdminCreate';
import AdminPlatformsSettings from './pages/admin/AdminPlatformsSettings';
import AdminTickets from './pages/admin/AdminTickets';
import AdminRoyalties from './pages/admin/AdminRoyalties';
import AdminDeletionRequests from './pages/admin/AdminDeletionRequests';
import AdminSettings from './pages/admin/AdminSettings';
import PrivateRoute from './components/PrivateRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate fetching user data or setting it after login
    if (currentUser) {
      // Replace with actual user data fetching logic
      setUser({
        id: currentUser.uid,
        name: currentUser.displayName || 'Test User',
        email: currentUser.email || 'test@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        phoneNumber: '+1234567890',
        twoFactorEnabled: false,
        role: 'artist',
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
      });
    } else {
      setUser(null);
    }
  }, [currentUser]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile user={user} /></PrivateRoute>} />
          <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin user={user} setUser={setUser} />} />
          <Route path="/admin/*" element={
            <AdminProtectedRoute user={user}>
              <AdminProvider user={user} setUser={setUser}>
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard user={user} />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/tracks" element={<AdminTracks />} />
                  <Route path="/create-admin" element={<AdminCreate />} />
                  <Route path="/platforms-settings" element={<AdminPlatformsSettings />} />
                  <Route path="/tickets" element={<AdminTickets />} />
                  <Route path="/royalties" element={<AdminRoyalties />} />
                  <Route path="/deletion-requests" element={<AdminDeletionRequests />} />
                  <Route path="/settings" element={<AdminSettings />} />
                </Routes>
              </AdminProvider>
            </AdminProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
