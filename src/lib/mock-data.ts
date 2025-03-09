
export const distributionPlatforms = [
  {
    id: "1",
    name: "Spotify",
    logo: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Apple Music",
    logo: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Amazon Music",
    logo: "/placeholder.svg",
  },
  {
    id: "4",
    name: "YouTube Music",
    logo: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Deezer",
    logo: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Tidal",
    logo: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Pandora",
    logo: "/placeholder.svg",
  },
  {
    id: "8",
    name: "SoundCloud",
    logo: "/placeholder.svg",
  },
  {
    id: "9",
    name: "TikTok",
    logo: "/placeholder.svg",
  },
  {
    id: "10",
    name: "Instagram",
    logo: "/placeholder.svg",
  }
];

export const tracks = [
  {
    id: "1",
    title: "Summer Breeze",
    artist: "John Doe",
    artwork: "/placeholder.svg",
    genre: "Pop",
    status: "approved",
    submittedAt: new Date("2023-05-10"),
    releaseDate: new Date("2023-06-01"),
    duration: 186,
    userId: "1",
    distributionServices: [
      {
        id: "1",
        name: "Spotify",
        logo: "/placeholder.svg"
      },
      {
        id: "2",
        name: "Apple Music",
        logo: "/placeholder.svg"
      }
    ]
  },
  {
    id: "2",
    title: "Midnight Drive",
    artist: "John Doe",
    artwork: "/placeholder.svg",
    genre: "Electronic",
    status: "pending",
    submittedAt: new Date("2023-05-15"),
    duration: 214,
    userId: "1",
    distributionServices: [
      {
        id: "1",
        name: "Spotify",
        logo: "/placeholder.svg"
      }
    ]
  },
  {
    id: "3",
    title: "Lost in Time",
    artist: "John Doe",
    artwork: "/placeholder.svg",
    genre: "Ambient",
    status: "rejected",
    submittedAt: new Date("2023-05-12"),
    duration: 275,
    userId: "1",
    distributionServices: [
      {
        id: "1",
        name: "Spotify",
        logo: "/placeholder.svg"
      },
      {
        id: "4",
        name: "YouTube Music",
        logo: "/placeholder.svg"
      }
    ]
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "John Doe",
    artwork: "/placeholder.svg",
    genre: "Hip Hop",
    status: "approved",
    submittedAt: new Date("2023-04-30"),
    releaseDate: new Date("2023-05-21"),
    duration: 195,
    userId: "1",
    distributionServices: [
      {
        id: "1",
        name: "Spotify",
        logo: "/placeholder.svg"
      },
      {
        id: "2",
        name: "Apple Music",
        logo: "/placeholder.svg"
      },
      {
        id: "8",
        name: "SoundCloud",
        logo: "/placeholder.svg"
      }
    ]
  }
];

export const royaltyData = [
  { month: "Jan", amount: 256.78, service: "Spotify" },
  { month: "Feb", amount: 289.32, service: "Spotify" },
  { month: "Mar", amount: 321.45, service: "Spotify" },
  { month: "Apr", amount: 290.65, service: "Spotify" },
  { month: "May", amount: 345.12, service: "Spotify" },
  { month: "Jun", amount: 387.98, service: "Spotify" },
  { month: "Jan", amount: 178.32, service: "Apple Music" },
  { month: "Feb", amount: 201.45, service: "Apple Music" },
  { month: "Mar", amount: 232.67, service: "Apple Music" },
  { month: "Apr", amount: 198.54, service: "Apple Music" },
  { month: "May", amount: 254.32, service: "Apple Music" },
  { month: "Jun", amount: 287.65, service: "Apple Music" },
  { month: "Jan", amount: 87.45, service: "YouTube Music" },
  { month: "Feb", amount: 95.32, service: "YouTube Music" },
  { month: "Mar", amount: 112.54, service: "YouTube Music" },
  { month: "Apr", amount: 99.87, service: "YouTube Music" },
  { month: "May", amount: 124.65, service: "YouTube Music" },
  { month: "Jun", amount: 142.32, service: "YouTube Music" },
];

export const currentUser = {
  id: "1",
  name: "John Doe",
  email: "artist@example.com",
  avatar: null,
  isLoggedIn: false,
  phoneNumber: "",
  twoFactorEnabled: false,
  verificationStatus: "unverified", // unverified, pending, verified, rejected
  idType: null, // personal, business
  idDocument: null,
  businessDocument: null,
  taxDocument: null,
};

