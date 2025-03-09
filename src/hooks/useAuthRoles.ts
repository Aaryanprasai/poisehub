
import { User } from '../types/auth';

export function useAuthRoles(user: User | null) {
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  return {
    isAdmin,
    isSuperAdmin
  };
}
