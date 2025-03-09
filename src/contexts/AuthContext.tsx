import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useUserContext, UserProvider } from './UserContext';
import { useAdminContext, AdminProvider } from './AdminContext';
import { useRegistrationContext, RegistrationProvider } from './RegistrationContext';
import { User } from '@/lib/types';
import { toast } from 'sonner';

// Re-export the user type for convenience
export type { User } from '@/lib/types';

// Inactivity timeout in milliseconds (10 minutes)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

// Define the core authentication context
interface AuthContextType {
  user: User | null;
  currentUser: User | null; // Added currentUser to match what App.tsx expects
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
  const [adminOTPRequired, setAdminOTPRequired] = useState<boolean>(false);
  const [adminLoginEmail, setAdminLoginEmail] = useState<string>('');
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check for user inactivity
  useEffect(() => {
    if (user) {
      // Clear any existing timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        // Auto logout after inactivity period
        setUser(null);
        setAdminOTPRequired(false);
        toast('You have been logged out due to inactivity', {
          description: 'Please login again to continue.',
        });
      }, INACTIVITY_TIMEOUT);

      setInactivityTimer(timer);

      // Set up event listeners for user activity
      const activityEvents = [
        'mousedown', 'mousemove', 'keypress',
        'scroll', 'touchstart', 'click'
      ];

      activityEvents.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
      });

      return () => {
        // Cleanup event listeners and timer
        activityEvents.forEach(event => {
          window.removeEventListener(event, resetInactivityTimer);
        });
        
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [user, lastActivity, resetInactivityTimer]);

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
    setAdminOTPRequired(false);
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  // Admin login function
  const adminLogin = async (username: string, password: string): Promise<void> => {
    try {
      // In a real app, we would verify credentials against the database
      if (username === 'poise' && password === 'adminpass123') {
        // After successful password check, we require OTP
        setAdminOTPRequired(true);
        setAdminLoginEmail(username);
        
        // In a real app, send OTP via email or WhatsApp here
        console.log('Admin OTP sent to registered email/WhatsApp');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  // Admin OTP verification function
  const verifyAdminOTP = async (otp: string): Promise<void> => {
    try {
      // In a real app, we would verify the OTP
      // For demo, we'll accept any 6-digit OTP
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setAdminOTPRequired(false);
        setUser({
          id: 'admin1',
          name: 'Poise Admin',
          email: adminLoginEmail + '@poisemusic.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          phoneNumber: '+1234567890',
          twoFactorEnabled: true,
          role: adminLoginEmail === 'poise' ? 'superadmin' : 'admin',
          createdAt: new Date().toISOString(),
          verificationStatus: 'verified',
        } as User);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user, // Set currentUser to the same user object
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
