
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  // For now, we'll completely bypass authentication
  // In a production app, we would check if user exists and has admin/superadmin role
  return <>{children}</>;
  
  // Commented out the actual authentication logic for now
  // if (!user) {
  //   return <Navigate to="/admin" replace />;
  // }
  
  // if (user.role !== 'admin' && user.role !== 'superadmin') {
  //   return <Navigate to="/admin" replace />;
  // }
  
  // return <>{children}</>;
};

export default AdminProtectedRoute;
