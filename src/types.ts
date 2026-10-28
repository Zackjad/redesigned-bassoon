export interface Comment {
  id: string;
  author: string;
  text: string;
  avatar?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  username: string;
  name: string;
  avatar: string;
  cover?: string;
  bio: string;
  followers: string[];
  following: string[];
  isAdmin: boolean;
  isPremium: boolean;
  planType: 'Free Member' | 'Pro Creator' | 'VIP Ultimate' | 'Administrator' | string;
}

export interface Pin {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  authorId: string;
  likes: string[];
  saves: string[];
  comments: Comment[];
  createdAt: string;
  boardId?: string;
}

export interface Board {
  id: string;
  name: string;
  userId: string;
  pinIds: string[];
  isPrivate?: boolean;
  coverImage?: string;
}

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  authorId: string;
  likes: string[];
  reposts: number;
  comments: Comment[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Failed' | string;
  date: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  time: string;
}

export interface AdminCard {
  linked: boolean;
  provider: string;
  cardHolder?: string;
  last4?: string;
  currency?: string;
  expiry?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  announcementText: string;
  announcementActive: boolean;
  allowPublicSignups: boolean;
  allowPinUploads: boolean;
  proPriceKes: number;
}
