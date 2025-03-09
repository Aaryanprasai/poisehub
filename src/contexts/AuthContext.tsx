
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useUserContext, UserProvider } from './UserContext';
import { useAdminContext, AdminProvider } from './AdminContext';
import { useRegistrationContext, RegistrationProvider } from './RegistrationContext';
import { User } from '@/lib/types';

// Re-export the user type for convenience
export type { User } from '@/lib/types';

// Define the core authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Combined provider that wraps all our context providers
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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
      hasReleases: true
    } as User);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        logout,
        isAdmin,
        isSuperAdmin,
      }}
    >
      <UserProvider user={user} setUser={setUser}>
        <AdminProvider user={user} setUser={setUser}>
          <RegistrationProvider>
            {children}
          </RegistrationProvider>
        </AdminProvider>
      </UserProvider>
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Combine all contexts
  const userContext = useUserContext();
  const adminContext = useAdminContext();
  const registrationContext = useRegistrationContext();
  
  return {
    ...context,
    ...userContext,
    ...adminContext,
    ...registrationContext,
  };
}
