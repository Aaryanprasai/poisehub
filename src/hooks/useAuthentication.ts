
import { useState } from 'react';
import { User, RegistrationConfig } from '../types/auth';
import { adminLogin as loginToAdmin } from '../lib/supabase';

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false,
    publicLoginEnabled: true
  });
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    // Check if public login is enabled
    if (!registrationConfig.publicLoginEnabled) {
      throw new Error('Public login is currently disabled. Please contact an administrator for access.');
    }
    
    // This will be replaced with actual Supabase auth in the future
    if (email && password) {
      setUser({
        id: Date.now().toString(),
        name: "Artist User",
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        phoneNumber: '',
        twoFactorEnabled: false,
        role: 'artist',
        createdAt: new Date().toISOString(),
        idType: null,
        verificationStatus: 'verified',
        deleteStatus: null,
        hasReleases: false
      });
      return Promise.resolve();
    }
    
    throw new Error('Invalid credentials');
  };

  const adminLogin = async (username: string, password: string): Promise<void> => {
    try {
      // Use the supabase admin login function
      console.log('Calling loginToAdmin with:', username);
      const adminUser = await loginToAdmin(username, password);
      
      if (!adminUser) {
        throw new Error('Authentication failed');
      }
      
      console.log('Admin login successful, user data:', adminUser);
      
      setUser({
        id: adminUser.id,
        name: "Admin User",
        email: username,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        phoneNumber: '',
        twoFactorEnabled: false,
        role: adminUser.is_superadmin ? 'superadmin' : 'admin',
        createdAt: new Date().toISOString(),
        idType: null,
        verificationStatus: 'verified',
        deleteStatus: null,
        hasReleases: false
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
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
    
    // This will be replaced with actual Supabase auth in the future
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

  return {
    user,
    setUser,
    registrationConfig,
    setRegistrationConfig,
    loading,
    setLoading,
    login,
    adminLogin,
    register,
    logout
  };
}
