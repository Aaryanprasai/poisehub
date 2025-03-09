
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile user={currentUser} /></PrivateRoute>} />
      <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/tracks" element={<AdminProtectedRoute><AdminTracks /></AdminProtectedRoute>} />
      <Route path="/admin/create-admin" element={<AdminProtectedRoute><AdminCreate /></AdminProtectedRoute>} />
      <Route path="/admin/platforms-settings" element={<AdminProtectedRoute><AdminPlatformsSettings /></AdminProtectedRoute>} />
      <Route path="/admin/tickets" element={<AdminProtectedRoute><AdminTickets /></AdminProtectedRoute>} />
      <Route path="/admin/royalties" element={<AdminProtectedRoute><AdminRoyalties /></AdminProtectedRoute>} />
      <Route path="/admin/deletion-requests" element={<AdminProtectedRoute><AdminDeletionRequests /></AdminProtectedRoute>} />
      <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
