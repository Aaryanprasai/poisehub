import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  role: 'artist' | 'admin' | 'superadmin';
  createdAt: string;
  idType?: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null;
  idDocument?: File | null;
  businessDocument?: File | null;
  taxDocument?: File | null;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  deleteStatus?: 'pending' | 'approved' | null;
  hasReleases?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, idType: 'personal' | 'business') => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  toggleTwoFactor?: (enabled: boolean) => void;
  updatePhoneNumber?: (phoneNumber: string) => void;
  uploadVerificationDocuments?: (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => void;
  requestAccountDeletion: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  registrationConfig: {
    publicRegistrationEnabled: boolean;
    inviteOnlyMode: boolean;
  };
  updateRegistrationConfig: (config: Partial<{ publicRegistrationEnabled: boolean; inviteOnlyMode: boolean }>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registrationConfig, setRegistrationConfig] = useState({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false
  });

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in a real app, this would call an API
    // For demo purposes, we're setting a fake user
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

  const adminLogin = async (username: string, password: string): Promise<void> => {
    // Simplified admin login without 2FA
    if (username === 'beatecho' && password === 'adminpass123') {
      // Super admin login
      setUser({
        id: 'admin1',
        name: 'Beat Echo Admin',
        email: username + '@beatecho.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        phoneNumber: '+1234567890',
        twoFactorEnabled: false,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
      } as User);
    } else if (username === 'admin' && password === 'admin123') {
      // Regular admin login
      setUser({
        id: 'admin2',
        name: 'Regular Admin',
        email: username + '@beatecho.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=regularadmin',
        phoneNumber: '+1234567890',
        twoFactorEnabled: false,
        role: 'admin',
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
      } as User);
    } else {
      throw new Error('Invalid admin credentials');
    }
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
    
    // Mock registration - in a real app, this would call an API
    setUser({
      id: '1',
      name: name,
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new',
      phoneNumber: '',
      twoFactorEnabled: false,
      role: 'artist',
      createdAt: new Date().toISOString(),
      verificationStatus: 'unverified',
      idType: idType,
      hasReleases: false
    } as User);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const toggleTwoFactor = (enabled: boolean) => {
    if (user) {
      setUser({ ...user, twoFactorEnabled: enabled });
    }
  };

  const updatePhoneNumber = (phoneNumber: string) => {
    if (user) {
      setUser({ ...user, phoneNumber });
    }
  };

  const uploadVerificationDocuments = (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => {
    if (user) {
      setUser({
        ...user,
        idType,
        verificationStatus: 'pending'
      });
    }
  };

  const requestAccountDeletion = () => {
    if (user) {
      // If user has releases, set delete status to pending for admin approval
      // Otherwise, we could immediately delete the account (logout in this demo)
      if (user.hasReleases) {
        setUser({
          ...user,
          deleteStatus: 'pending'
        });
      } else {
        // Immediately delete account (logout in this demo)
        logout();
      }
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  const updateRegistrationConfig = (config: Partial<{ publicRegistrationEnabled: boolean; inviteOnlyMode: boolean }>) => {
    setRegistrationConfig({
      ...registrationConfig,
      ...config
    });
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
