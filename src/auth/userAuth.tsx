
import { User } from '@/lib/types';

export function useUserAuth(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in a real app, this would call an API
    setUser({
      id: '1',
      name: 'Demo User',
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      phoneNumber: '+1234567890',
      twoFactorEnabled: false,
      role: 'artist',
      createdAt: new Date().toISOString(),
      verificationStatus: 'unverified',
      hasReleases: true,
      idType: 'personal'
    } as User);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = (user: User | null) => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = (user: User | null) => {
    return user?.role === 'superadmin';
  };

  return {
    login,
    logout,
    isAdmin,
    isSuperAdmin
  };
}
