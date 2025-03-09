import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { User } from '@/lib/types';

interface UserContextType {
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
  register: (name: string, email: string, password: string, idType: 'personal' | 'business') => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export function UserProvider({ children, user, setUser }: UserProviderProps) {
  // User management functions
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
        // Immediate deletion would be handled by the auth context's logout
      }
    }
  };

  const register = async (name: string, email: string, password: string, idType: 'personal' | 'business'): Promise<void> => {
    // This would normally check registration config from the RegistrationContext
    // but we've simplified for this refactoring
    
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

  return (
    <UserContext.Provider
      value={{
        updateUser,
        toggleTwoFactor,
        updatePhoneNumber,
        uploadVerificationDocuments,
        requestAccountDeletion,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
