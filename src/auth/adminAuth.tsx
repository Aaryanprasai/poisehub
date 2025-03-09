
import { useState } from 'react';
import { User } from '@/lib/types';
import { toast } from 'sonner';

export function useAdminAuth(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
  const [adminOTPRequired, setAdminOTPRequired] = useState<boolean>(false);
  const [adminLoginEmail, setAdminLoginEmail] = useState<string>('');

  // Admin login function
  const adminLogin = async (username: string, password: string): Promise<void> => {
    try {
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
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  // Admin OTP verification function
  const verifyAdminOTP = async (otp: string): Promise<void> => {
    try {
      // In a real app, we would verify the OTP
      // For demo, we'll accept any 6-digit OTP
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        const adminUser = {
          id: 'admin1',
          name: 'Poise Admin',
          email: adminLoginEmail + '@poisemusic.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          phoneNumber: '+1234567890',
          twoFactorEnabled: true,
          role: adminLoginEmail === 'poise' ? 'superadmin' : 'admin',
          createdAt: new Date().toISOString(),
          verificationStatus: 'verified',
        } as User;
        
        setUser(adminUser);
        setAdminOTPRequired(false);
        toast.success('Admin login successful');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  return {
    adminOTPRequired,
    adminLogin,
    verifyAdminOTP
  };
}
