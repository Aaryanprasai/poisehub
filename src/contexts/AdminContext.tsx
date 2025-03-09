
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { User, DistributionService } from '@/lib/types';
import { distributionPlatforms as initialPlatforms } from '@/components/upload/constants';

interface CodeGenerationSettings {
  isrc: {
    autoGenerate: boolean;
    countryCode: string;
    registrantCode: string;
  };
  upc: {
    autoGenerate: boolean;
    prefix: string;
  };
}

interface AdminContextType {
  adminLogin: (username: string, password: string) => Promise<void>;
  verifyAdminOTP: (otp: string) => Promise<void>;
  adminOTPRequired: boolean;
  distributionPlatforms: DistributionService[];
  addPlatform: (platform: DistributionService) => void;
  removePlatform: (platformId: string) => void;
  codeGenerationSettings: CodeGenerationSettings;
  updateCodeGenerationSettings: (settings: CodeGenerationSettings) => void;
  generateISRC: () => string;
  generateUPC: () => string;
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
  const [distributionPlatforms, setDistributionPlatforms] = useState<DistributionService[]>(initialPlatforms);
  const [codeGenerationSettings, setCodeGenerationSettings] = useState<CodeGenerationSettings>({
    isrc: {
      autoGenerate: true,
      countryCode: 'US',
      registrantCode: 'POI'
    },
    upc: {
      autoGenerate: true,
      prefix: '12345'
    }
  });

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

  const verifyAdminOTP = async (otp: string): Promise<void> => {
    try {
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
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  // ISRC code generation function
  const generateISRC = (): string => {
    if (!codeGenerationSettings.isrc.autoGenerate) {
      return '';
    }
    
    const prefix = codeGenerationSettings.isrc.countryCode + codeGenerationSettings.isrc.registrantCode;
    const year = new Date().getFullYear().toString().substring(2); // Get last 2 digits of year
    const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    
    return `${prefix}${year}${random}`;
  };

  // UPC code generation function
  const generateUPC = (): string => {
    if (!codeGenerationSettings.upc.autoGenerate) {
      return '';
    }
    
    const prefix = codeGenerationSettings.upc.prefix;
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Simple check digit calculation
    const digits = (prefix + random).split('').map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += i % 2 === 0 ? digits[i] * 3 : digits[i];
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return `${prefix}${random}${checkDigit}`;
  };

  // Add new platform
  const addPlatform = (platform: DistributionService) => {
    setDistributionPlatforms([...distributionPlatforms, platform]);
  };

  // Remove platform
  const removePlatform = (platformId: string) => {
    setDistributionPlatforms(distributionPlatforms.filter(p => p.id !== platformId));
  };

  // Update code generation settings
  const updateCodeGenerationSettings = (settings: CodeGenerationSettings) => {
    setCodeGenerationSettings(settings);
  };

  return (
    <AdminContext.Provider
      value={{
        adminLogin,
        verifyAdminOTP,
        adminOTPRequired,
        distributionPlatforms,
        addPlatform,
        removePlatform,
        codeGenerationSettings,
        updateCodeGenerationSettings,
        generateISRC,
        generateUPC
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
