
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { User } from '@/lib/types';

interface AdminContextType {
  adminLogin: (username: string, password: string) => Promise<void>;
  verifyAdminOTP: (otp: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: React.ReactNode;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export function AdminProvider({ children, user, setUser }: AdminProviderProps) {
  const [adminOTPRequired, setAdminOTPRequired] = useState<boolean>(false);
  const [adminLoginEmail, setAdminLoginEmail] = useState<string>('');

  const adminLogin = async (username: string, password: string): Promise<void> => {
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
  };

  const verifyAdminOTP = async (otp: string): Promise<void> => {
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
  };

  return (
    <AdminContext.Provider
      value={{
        adminLogin,
        verifyAdminOTP,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook to use admin context
export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
