
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  role: 'artist' | 'admin' | 'superadmin';
  createdAt: string;
  idType?: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null;
  idDocument?: File | null;
  businessDocument?: File | null;
  taxDocument?: File | null;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  deleteStatus?: 'pending' | 'approved' | null;
  hasReleases?: boolean;
}

export interface RegistrationConfig {
  publicRegistrationEnabled: boolean;
  inviteOnlyMode: boolean;
  publicLoginEnabled: boolean;
}
