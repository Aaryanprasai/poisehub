
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  // Authentication is completely disabled
  // This will simply render the children without any auth checks
  return <>{children}</>;
};

export default AdminProtectedRoute;
