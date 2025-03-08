
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "artist" | "admin";
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
