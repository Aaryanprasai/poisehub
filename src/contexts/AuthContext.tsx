
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser as mockUser } from '@/lib/mock-data';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isLoggedIn: boolean;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  idType: 'personal' | 'business' | null;
  idDocument: string | null;
  businessDocument: string | null;
  taxDocument: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  updatePhoneNumber: (phoneNumber: string) => void;
  toggleTwoFactor: (enabled: boolean) => void;
  uploadVerificationDocuments: (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument?: string,
    taxDocument?: string
  ) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check local storage for user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('beatEchoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const isAuthenticated = !!user?.isLoggedIn;

  const login = async (email: string, password: string) => {
    // This would be an API call in a real app
    // For demo, we use a simulated delay and mock data
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const updatedUser = { 
          ...mockUser, 
          isLoggedIn: true 
        };
        
        setUser(updatedUser);
        localStorage.setItem('beatEchoUser', JSON.stringify(updatedUser));
        resolve(true);
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // This would be an API call in a real app
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...mockUser,
          id: Math.random().toString(36).substring(7),
          name,
          email,
          isLoggedIn: false,
        };
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beatEchoUser');
    navigate('/');
    toast.success('You have been logged out');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('beatEchoUser', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  const updatePhoneNumber = (phoneNumber: string) => {
    if (user) {
      updateUser({ phoneNumber });
      toast.success('Phone number updated successfully');
    }
  };

  const toggleTwoFactor = (enabled: boolean) => {
    if (user) {
      updateUser({ twoFactorEnabled: enabled });
      toast.success(enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
    }
  };

  const uploadVerificationDocuments = (
    idType: 'personal' | 'business', 
    idDocument: string, 
    businessDocument?: string, 
    taxDocument?: string
  ) => {
    if (user) {
      const updates: Partial<User> = {
        idType,
        idDocument,
        verificationStatus: 'pending',
      };
      
      if (idType === 'business') {
        updates.businessDocument = businessDocument || null;
        updates.taxDocument = taxDocument || null;
      }
      
      updateUser(updates);
      toast.success('Verification documents submitted for review');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUser,
      updatePhoneNumber,
      toggleTwoFactor,
      uploadVerificationDocuments
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
