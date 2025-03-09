
import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { User, RegistrationConfig } from '../types/auth';
import { AuthContextType } from './AuthContextType';
import { currentUser as mockUser } from '../lib/mock-data';

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false,
    publicLoginEnabled: true
  });
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Check if public login is enabled
    if (!registrationConfig.publicLoginEnabled) {
      throw new Error('Public login is currently disabled. Please contact an administrator for access.');
    }
    
    // Mock login
    if (email && password) {
      // Set mock user data
      setUser({
        id: "1",
        name: "John Doe",
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        phoneNumber: mockUser.phoneNumber || '',
        twoFactorEnabled: mockUser.twoFactorEnabled,
        role: 'artist',
        createdAt: new Date().toISOString(),
        idType: mockUser.idType,
        verificationStatus: mockUser.verificationStatus,
        deleteStatus: null,
        hasReleases: false
      });
      return Promise.resolve();
    }
    
    throw new Error('Invalid credentials');
  };

  const adminLogin = async (username: string, password: string): Promise<void> => {
    // Mock admin login
    if (username && password) {
      setUser({
        id: "admin1",
        name: "Admin User",
        email: username.includes('@') ? username : `${username}@beatecho.com`,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        phoneNumber: '',
        twoFactorEnabled: false,
        role: 'admin',
        createdAt: new Date().toISOString(),
        idType: null,
        verificationStatus: 'verified',
        deleteStatus: null,
        hasReleases: false
      });
      return Promise.resolve();
    }
    
    throw new Error('Invalid admin credentials');
  };

  const register = async (name: string, email: string, password: string, idType: 'personal' | 'business'): Promise<void> => {
    // Check if public registration is enabled
    if (!registrationConfig.publicRegistrationEnabled) {
      throw new Error('Public registration is currently disabled');
    }
    
    // Check if invite-only mode is enabled
    if (registrationConfig.inviteOnlyMode) {
      throw new Error('Registration is currently invite-only');
    }
    
    // Mock register
    if (name && email && password) {
      setUser({
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        phoneNumber: '',
        twoFactorEnabled: false,
        role: 'artist',
        createdAt: new Date().toISOString(),
        idType,
        verificationStatus: 'unverified',
        deleteStatus: null,
        hasReleases: false
      });
      return Promise.resolve();
    }
    
    throw new Error('Registration failed');
  };

  const logout = async () => {
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      // Update local state only
      setUser({ ...user, ...userData });
    }
  };

  const toggleTwoFactor = async (enabled: boolean) => {
    if (user) {
      await updateUser({ twoFactorEnabled: enabled });
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (user) {
      await updateUser({ phoneNumber });
    }
  };

  const uploadVerificationDocuments = async (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => {
    if (user) {
      // Mock document upload
      await updateUser({
        idType,
        verificationStatus: 'pending'
      });
    }
  };

  const requestAccountDeletion = async () => {
    if (user) {
      // If user has releases, set delete status to pending for admin approval
      if (user.hasReleases) {
        await updateUser({
          deleteStatus: 'pending'
        });
      } else {
        // Immediately delete account for users without releases
        await logout();
      }
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  const updateRegistrationConfig = async (config: Partial<RegistrationConfig>) => {
    // Update local state only
    setRegistrationConfig({
      ...registrationConfig,
      ...config
    });
  };

  if (loading) {
    // You could return a loading state here if needed
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        register,
        adminLogin,
        logout,
        updateUser,
        toggleTwoFactor,
        updatePhoneNumber,
        uploadVerificationDocuments,
        requestAccountDeletion,
        isAdmin,
        isSuperAdmin,
        registrationConfig,
        updateRegistrationConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
