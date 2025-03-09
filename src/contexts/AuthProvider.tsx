import React, { useState, createContext, ReactNode } from 'react';
import { User, RegistrationConfig } from '../types/auth';
import { AuthContextType } from './AuthContextType';
import { 
  mockLogin, 
  mockAdminLogin, 
  mockRegister, 
  isAdminRole, 
  isSuperAdminRole 
} from '../utils/authUtils';

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false,
    publicLoginEnabled: true
  });

  const login = async (email: string, password: string): Promise<void> => {
    // Check if public login is enabled
    if (!registrationConfig.publicLoginEnabled) {
      throw new Error('Public login is currently disabled. Please contact an administrator for access.');
    }
    
    // Mock login - in a real app, this would call an API
    setUser(mockLogin(email));
  };

  const adminLogin = async (username: string, password: string): Promise<void> => {
    // Simplified admin login without 2FA
    const adminUser = mockAdminLogin(username, password);
    if (adminUser) {
      setUser(adminUser);
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
    setUser(mockRegister(name, email, idType));
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
    return isAdminRole(user);
  };

  const isSuperAdmin = () => {
    return isSuperAdminRole(user);
  };
  
  const updateRegistrationConfig = (config: Partial<RegistrationConfig>) => {
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
