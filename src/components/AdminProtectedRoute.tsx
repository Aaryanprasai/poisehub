
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/lib/types';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  user: User | null;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, user }) => {
  const { isAdmin } = useAuth();

  if (!user || !isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
