
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useUserContext, UserProvider } from './UserContext';
import { useAdminContext, AdminProvider } from './AdminContext';
import { useRegistrationContext, RegistrationProvider } from './RegistrationContext';
import { User } from '@/lib/types';
import { useUserAuth } from '@/auth/userAuth';
import { useAdminAuth } from '@/auth/adminAuth';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

// Re-export the user type for convenience
export type { User } from '@/lib/types';

// Define the core authentication context
interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  verifyAdminOTP: (otp: string) => Promise<void>;
  adminOTPRequired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Combined provider that wraps all our context providers
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // User authentication hooks
  const { login, logout, isAdmin: checkIsAdmin, isSuperAdmin: checkIsSuperAdmin } = useUserAuth(setUser);
  
  // Admin authentication hooks
  const { adminOTPRequired, adminLogin, verifyAdminOTP } = useAdminAuth(setUser);

  // Handler for inactivity timeout
  const handleTimeout = () => {
    setUser(null);
  };

  // Inactivity tracking
  useInactivityTimeout(!!user, handleTimeout);

  // Wrapper functions to maintain the original API
  const isAdmin = () => checkIsAdmin(user);
  const isSuperAdmin = () => checkIsSuperAdmin(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        logout,
        isAdmin,
        isSuperAdmin,
        adminLogin,
        verifyAdminOTP,
        adminOTPRequired,
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
  
  // Get other contexts
  const userContext = useUserContext();
  const adminContext = useAdminContext();
  const registrationContext = useRegistrationContext();
  
  // Merge all contexts
  return {
    ...context,
    ...userContext,
    ...adminContext,
    ...registrationContext,
  };
}
