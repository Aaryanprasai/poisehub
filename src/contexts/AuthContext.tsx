
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  role: string;
  createdAt: string;
  idType?: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null;
  idDocument?: File | null;
  businessDocument?: File | null;
  taxDocument?: File | null;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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
      verificationStatus: 'unverified'
    } as User);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
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
      verificationStatus: 'unverified'
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUser,
        toggleTwoFactor,
        updatePhoneNumber,
        uploadVerificationDocuments,
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
