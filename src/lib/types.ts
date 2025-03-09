export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  genre: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  releaseDate?: Date;
  duration: number;
  userId: string;
  distributionServices: DistributionService[];
  takenDownAt?: Date;
  modificationRequested?: boolean;
  modificationMessage?: string;
}

export interface DistributionService {
  id: string;
  name: string;
  logo: string;
  isSelected?: boolean;
}

export interface RoyaltyData {
  month: string;
  amount: number;
  service: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  responses: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  message: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userRole: "artist" | "admin";
}
