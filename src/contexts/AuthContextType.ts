
import { User, RegistrationConfig } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, idType: 'personal' | 'business') => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  registrationConfig: RegistrationConfig;
  updateRegistrationConfig: (config: Partial<RegistrationConfig>) => void;
}
