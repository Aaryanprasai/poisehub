
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // For development - temporarily disable authentication check
  // This will be controlled via admin settings later
  const authEnabled = false;
  
  if (authEnabled) {
    if (!isAuthenticated) {
      return <Navigate to="/admin" replace />;
    }

    if (!isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Allow access without authentication temporarily
  return <>{children}</>;
};

export default AdminProtectedRoute;
