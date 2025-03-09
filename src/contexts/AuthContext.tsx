import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  role: string; // Adding the required role property
  createdAt: string; // Adding the required createdAt property
  idType?: 'passport' | 'drivers_license' | 'national_id' | null;
  idDocument?: File | null;
  businessDocument?: File | null;
  taxDocument?: File | null;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    // For demo purposes, we're setting a fake user
    setUser({
      isLoggedIn: true,
      verificationStatus: 'unverified',
      id: '1',
      name: 'Demo User',
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      phoneNumber: '+1234567890',
      twoFactorEnabled: false,
      role: 'artist', // Adding role value
      createdAt: new Date().toISOString(), // Adding createdAt value
    } as User);
    
    return Promise.resolve();
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in a real app, this would call an API
    setUser({
      isLoggedIn: true,
      verificationStatus: 'unverified',
      id: '1',
      name: name,
      email: email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new',
      phoneNumber: '',
      twoFactorEnabled: false,
      role: 'artist', // Adding role value
      createdAt: new Date().toISOString(), // Adding createdAt value
    } as User);
    
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUser,
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
