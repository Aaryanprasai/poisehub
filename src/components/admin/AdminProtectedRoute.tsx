
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminProtectedRoute = ({ 
  children, 
  requireSuperAdmin = false 
}: AdminProtectedRouteProps) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('You need admin access for this page');
      navigate('/');
      return;
    }

    if (requireSuperAdmin && !isSuperAdmin()) {
      toast.error('This page requires superadmin privileges');
      navigate('/admin/dashboard');
    }
  }, [isAdmin, isSuperAdmin, navigate, requireSuperAdmin]);

  if (!isAdmin()) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
