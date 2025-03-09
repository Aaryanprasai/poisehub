
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "artist" | "admin" | "superadmin";
  createdAt: Date;
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
  isrc?: string;
  upc?: string;
}

export interface DistributionService {
  id: string;
  name: string;
  logo: string;
  isSelected?: boolean;
}

export interface RoyaltyData {
  id?: string;
  month: string;
  amount: number;
  service: string;
  isrc?: string;
  trackId?: string;
  trackTitle?: string;
}

export interface StreamData {
  id: string;
  trackId: string;
  serviceName: string;
  streamCount: number;
  streamDate: string;
  isrc?: string;
  track?: {
    title: string;
    artist: string;
  };
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
  userRole: "artist" | "admin" | "superadmin";
}

export interface TrackMetadata {
  id: string;
  trackId: string;
  userId: string;
  isrc: string;
  upc?: string;
  releaseDate?: Date;
  genre?: string;
  createdAt: Date;
}
