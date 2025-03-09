
import { User } from '../types/auth';

// Mock login function - in a real app, this would call an API
export const mockLogin = (email: string): User => {
  return {
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
  } as User;
};

// Mock admin login function
export const mockAdminLogin = (username: string, password: string): User | null => {
  if (username === 'beatecho' && password === 'adminpass123') {
    // Super admin login
    return {
      id: 'admin1',
      name: 'Beat Echo Admin',
      email: username + '@beatecho.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      phoneNumber: '+1234567890',
      twoFactorEnabled: false,
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      verificationStatus: 'verified',
    } as User;
  } else if (username === 'admin' && password === 'admin123') {
    // Regular admin login
    return {
      id: 'admin2',
      name: 'Regular Admin',
      email: username + '@beatecho.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=regularadmin',
      phoneNumber: '+1234567890',
      twoFactorEnabled: false,
      role: 'admin',
      createdAt: new Date().toISOString(),
      verificationStatus: 'verified',
    } as User;
  }
  return null;
};

// Mock register function
export const mockRegister = (name: string, email: string, idType: 'personal' | 'business'): User => {
  return {
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
  } as User;
};

// Role check utilities
export const isAdminRole = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'superadmin';
};

export const isSuperAdminRole = (user: User | null): boolean => {
  return user?.role === 'superadmin';
};
