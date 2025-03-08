
import { User, Track, DistributionService, RoyaltyData, Ticket } from './types';

// Mock user data
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@beatecho.com',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
  role: 'artist',
  createdAt: new Date('2023-01-01'),
};

// Mock distribution services
export const distributionServices: DistributionService[] = [
  { id: '1', name: 'Spotify', logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png' },
  { id: '2', name: 'Apple Music', logo: 'https://www.apple.com/v/apple-music/s/images/shared/apple-music-logo__dcojfwkzna2q_large.svg' },
  { id: '3', name: 'Amazon Music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Amazon_Music_logo.svg/2560px-Amazon_Music_logo.svg.png' },
  { id: '4', name: 'YouTube Music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/1024px-Youtube_Music_icon.svg.png' },
  { id: '5', name: 'Tidal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/TIDAL_20220511.svg/2560px-TIDAL_20220511.svg.png' },
  { id: '6', name: 'Deezer', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Deezer_Icon.svg/1024px-Deezer_Icon.svg.png' },
  { id: '7', name: 'Pandora', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Pandora_Logo.svg/2560px-Pandora_Logo.svg.png' },
];

// Mock tracks data
export const tracks: Track[] = [
  {
    id: '1',
    title: 'Summer Breeze',
    artist: 'John Doe',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    genre: 'Pop',
    status: 'approved',
    submittedAt: new Date('2023-05-01'),
    releaseDate: new Date('2023-06-01'),
    duration: 216, // 3:36 in seconds
    userId: '1',
    distributionServices: [distributionServices[0], distributionServices[1], distributionServices[3]],
  },
  {
    id: '2',
    title: 'Midnight Dreams',
    artist: 'John Doe feat. Jane Smith',
    artwork: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    genre: 'R&B',
    status: 'pending',
    submittedAt: new Date('2023-06-15'),
    duration: 198, // 3:18 in seconds
    userId: '1',
    distributionServices: [distributionServices[0], distributionServices[1], distributionServices[4]],
  },
  {
    id: '3',
    title: 'Urban Echo',
    artist: 'John Doe',
    artwork: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80',
    genre: 'Hip Hop',
    status: 'rejected',
    submittedAt: new Date('2023-04-10'),
    duration: 245, // 4:05 in seconds
    userId: '1',
    distributionServices: [distributionServices[0], distributionServices[3], distributionServices[5]],
  },
  {
    id: '4',
    title: 'Electric Waves',
    artist: 'John Doe',
    artwork: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    genre: 'Electronic',
    status: 'approved',
    submittedAt: new Date('2023-03-20'),
    releaseDate: new Date('2023-04-15'),
    duration: 312, // 5:12 in seconds
    userId: '1',
    distributionServices: [distributionServices[0], distributionServices[1], distributionServices[2]],
  },
];

// Mock royalty data
export const royaltyData: RoyaltyData[] = [
  { month: 'Jan', amount: 120.50, service: 'Spotify' },
  { month: 'Feb', amount: 145.32, service: 'Spotify' },
  { month: 'Mar', amount: 189.75, service: 'Spotify' },
  { month: 'Apr', amount: 210.40, service: 'Spotify' },
  { month: 'May', amount: 240.20, service: 'Spotify' },
  { month: 'Jun', amount: 310.65, service: 'Spotify' },
  { month: 'Jan', amount: 95.20, service: 'Apple Music' },
  { month: 'Feb', amount: 105.45, service: 'Apple Music' },
  { month: 'Mar', amount: 125.30, service: 'Apple Music' },
  { month: 'Apr', amount: 140.75, service: 'Apple Music' },
  { month: 'May', amount: 178.90, service: 'Apple Music' },
  { month: 'Jun', amount: 220.15, service: 'Apple Music' },
];

// Mock tickets data
export const tickets: Ticket[] = [
  {
    id: '1',
    title: 'Issue with track approval',
    description: 'My track "Summer Breeze" has been pending for over a week. Can you please check the status?',
    status: 'resolved',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-12'),
    userId: '1',
    responses: [
      {
        id: '1',
        message: 'Thanks for reaching out. We\'ll check the status of your track and get back to you soon.',
        createdAt: new Date('2023-05-11'),
        userId: '2',
        userName: 'Support Agent',
        userRole: 'admin',
      },
      {
        id: '2',
        message: 'Your track has been approved and will be distributed to the selected platforms within 48 hours.',
        createdAt: new Date('2023-05-12'),
        userId: '2',
        userName: 'Support Agent',
        userRole: 'admin',
      },
      {
        id: '3',
        message: 'Thank you for the quick resolution!',
        createdAt: new Date('2023-05-12'),
        userId: '1',
        userName: 'John Doe',
        userRole: 'artist',
      },
    ],
  },
  {
    id: '2',
    title: 'Question about royalty payments',
    description: 'I noticed a discrepancy in my royalty payments for April. Can someone review this?',
    status: 'in-progress',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-06'),
    userId: '1',
    responses: [
      {
        id: '1',
        message: 'We\'ll look into this right away and provide you with a detailed breakdown of your April royalties.',
        createdAt: new Date('2023-06-06'),
        userId: '2',
        userName: 'Support Agent',
        userRole: 'admin',
      },
    ],
  },
  {
    id: '3',
    title: 'Help with distribution selection',
    description: 'I\'m not sure which platforms would be best for my new electronic track. Can you provide some guidance?',
    status: 'open',
    createdAt: new Date('2023-06-18'),
    updatedAt: new Date('2023-06-18'),
    userId: '1',
    responses: [],
  },
];
