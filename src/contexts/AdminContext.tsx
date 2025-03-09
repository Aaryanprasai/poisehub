import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { User, DistributionService } from '@/lib/types';
import { distributionPlatforms as initialPlatforms } from '@/components/upload/constants';

interface CodeGenerationSettings {
  isrc: {
    autoGenerate: boolean;
    countryCode: string;
    registrantCode: string;
    yearDigits: string;
    lastSerialNumber: number;
  };
  upc: {
    autoGenerate: boolean;
    prefix: string;
    lastSerialNumber: number;
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
  bulkGenerateISRC: (count: number) => string[];
  bulkGenerateUPC: (count: number) => string[];
  validateISRC: (isrc: string) => boolean;
  validateUPC: (upc: string) => boolean;
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
      registrantCode: 'POI',
      yearDigits: new Date().getFullYear().toString().substring(2), // Last 2 digits of current year
      lastSerialNumber: 0
    },
    upc: {
      autoGenerate: true,
      prefix: '12345',
      lastSerialNumber: 0
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

  // Enhanced ISRC code generation function with serial number tracking
  const generateISRC = (): string => {
    if (!codeGenerationSettings.isrc.autoGenerate) {
      return '';
    }
    
    // Increment the last used serial number
    const nextSerialNumber = codeGenerationSettings.isrc.lastSerialNumber + 1;
    
    // Format serial part to be 5 digits with leading zeros
    const serialPart = nextSerialNumber.toString().padStart(5, '0');
    
    // Construct ISRC: CountryCode + RegistrantCode + YearDigits + SerialNumber
    const isrc = `${codeGenerationSettings.isrc.countryCode}${codeGenerationSettings.isrc.registrantCode}${codeGenerationSettings.isrc.yearDigits}${serialPart}`;
    
    // Update last serial number in state
    setCodeGenerationSettings({
      ...codeGenerationSettings,
      isrc: {
        ...codeGenerationSettings.isrc,
        lastSerialNumber: nextSerialNumber
      }
    });
    
    return isrc;
  };

  // Enhanced UPC code generation with check digit calculation and serial tracking
  const generateUPC = (): string => {
    if (!codeGenerationSettings.upc.autoGenerate) {
      return '';
    }
    
    // Increment the last used serial number
    const nextSerialNumber = codeGenerationSettings.upc.lastSerialNumber + 1;
    
    // Format serial to be 5 digits with leading zeros
    const serialPart = nextSerialNumber.toString().padStart(5, '0');
    
    const prefix = codeGenerationSettings.upc.prefix;
    // 12-digit UPC: Prefix (5) + Serial (5) + Random (1) + Check digit (1)
    const random = Math.floor(Math.random() * 10).toString();
    const upcWithoutCheck = `${prefix}${serialPart}${random}`;
    
    // Calculate check digit
    const digits = upcWithoutCheck.split('').map(Number);
    let oddSum = 0;
    let evenSum = 0;
    
    for (let i = 0; i < digits.length; i++) {
      if (i % 2 === 0) {
        oddSum += digits[i] * 3;
      } else {
        evenSum += digits[i];
      }
    }
    
    const totalSum = oddSum + evenSum;
    const checkDigit = (10 - (totalSum % 10)) % 10;
    
    const upc = `${upcWithoutCheck}${checkDigit}`;
    
    // Update last serial number in state
    setCodeGenerationSettings({
      ...codeGenerationSettings,
      upc: {
        ...codeGenerationSettings.upc,
        lastSerialNumber: nextSerialNumber
      }
    });
    
    return upc;
  };

  // Bulk generation functions for batch operations
  const bulkGenerateISRC = (count: number): string[] => {
    const isrcs: string[] = [];
    for (let i = 0; i < count; i++) {
      isrcs.push(generateISRC());
    }
    return isrcs;
  };

  const bulkGenerateUPC = (count: number): string[] => {
    const upcs: string[] = [];
    for (let i = 0; i < count; i++) {
      upcs.push(generateUPC());
    }
    return upcs;
  };

  // Validation functions
  const validateISRC = (isrc: string): boolean => {
    // ISRC format: CC-XXX-YY-NNNNN
    // CC: Country Code (2 chars)
    // XXX: Registrant Code (3 chars)
    // YY: Year (2 digits)
    // NNNNN: Serial Number (5 digits)
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;
    return isrcRegex.test(isrc);
  };

  const validateUPC = (upc: string): boolean => {
    // Basic UPC-A format check (12 digits)
    if (!/^\d{12}$/.test(upc)) {
      return false;
    }
    
    // Check digit validation
    const digits = upc.split('').map(Number);
    const checkDigit = digits.pop();
    
    let oddSum = 0;
    let evenSum = 0;
    
    for (let i = 0; i < digits.length; i++) {
      if (i % 2 === 0) {
        oddSum += digits[i] * 3;
      } else {
        evenSum += digits[i];
      }
    }
    
    const totalSum = oddSum + evenSum;
    const calculatedCheckDigit = (10 - (totalSum % 10)) % 10;
    
    return checkDigit === calculatedCheckDigit;
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
        generateUPC,
        bulkGenerateISRC,
        bulkGenerateUPC,
        validateISRC,
        validateUPC
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
