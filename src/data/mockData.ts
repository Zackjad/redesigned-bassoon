import { User, Pin, Reel, Transaction } from '../types';

export const ADMIN_CREDENTIALS = {
  email: 'zackjad34@gmail.com',
  username: 'ZackjadAdmin',
  name: 'Daemyn Zaccur (Admin)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Platform Creator & Lead Developer for Zackjad.',
  role: 'admin'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'zackjad34@gmail.com',
    username: 'zackjad_official',
    name: 'Daemyn Zaccur',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    bio: 'Founder & Software Engineer behind Zackjad. Building from Nairobi, Kenya 🇰🇪',
    followers: ['user-2', 'user-3'],
    following: ['user-2'],
    isAdmin: true,
    isPremium: true,
    planType: 'VIP Ultimate'
  },
  {
    id: 'user-2',
    email: 'aura_vance@zackjad.io',
    username: 'auravance',
    name: 'Aura Vance',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    bio: 'Visual Artist & Creative Director based in Nairobi',
    followers: ['user-admin'],
    following: ['user-admin', 'user-3'],
    isAdmin: false,
    isPremium: true,
    planType: 'Pro Creator'
  },
  {
    id: 'user-3',
    email: 'kenji_sato@zackjad.io',
    username: 'kenjisato',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    bio: 'Architectural Designer & Photographer.',
    followers: ['user-2'],
    following: ['user-admin'],
    isAdmin: false,
    isPremium: false,
    planType: 'Free Member'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1001',
    userId: 'user-2',
    userName: 'Aura Vance',
    plan: 'Pro Creator',
    amount: 'Ksh 60',
    currency: 'KES',
    paymentMethod: 'M-Pesa (+254 712***890)',
    status: 'Completed',
    date: '2026-10-24 14:22'
  },
  {
    id: 'tx-1002',
    userId: 'user-admin',
    userName: 'Daemyn Zaccur',
    plan: 'VIP Ultimate',
    amount: 'Ksh 60',
    currency: 'KES',
    paymentMethod: 'Credit Card (Visa **** 4242)',
    status: 'Completed',
    date: '2026-10-20 09:15'
  }
];

export const INITIAL_PINS: Pin[] = [
  {
    id: 'pin-1',
    title: 'Modern Workspace Design',
    description: 'Clean minimalist desktop and office inspiration.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    category: 'Interior',
    authorId: 'user-admin',
    likes: ['user-2', 'user-3'],
    saves: ['user-2'],
    comments: [{ id: 'c1', author: 'auravance', text: 'Love this layout!' }],
    createdAt: '2 hours ago'
  },
  {
    id: 'pin-2',
    title: 'Nairobi Skyline Dusk',
    description: 'Panoramas across the vibrant capital cityscape.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    category: 'Photography',
    authorId: 'user-3',
    likes: ['user-admin'],
    saves: [],
    comments: [],
    createdAt: '5 hours ago'
  },
  {
    id: 'pin-3',
    title: 'Clean Minimalist Brand Identity',
    description: 'Elegance in visual composition and typography.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Branding',
    authorId: 'user-2',
    likes: ['user-admin', 'user-3'],
    saves: ['user-admin'],
    comments: [],
    createdAt: '1 day ago'
  },
  {
    id: 'pin-4',
    title: 'Modern Architecture Concept',
    description: 'Sustainable glass and natural wood structure.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    category: 'Architecture',
    authorId: 'user-admin',
    likes: ['user-2'],
    saves: ['user-3'],
    comments: [],
    createdAt: '2 days ago'
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    title: 'Building Modern Web Interfaces with React ⚡',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-binary-code-animation-28821-large.mp4',
    authorId: 'user-admin',
    likes: ['user-2', 'user-3'],
    reposts: 12,
    comments: [{ id: 'rc1', author: 'kenjisato', text: 'Great breakdown!' }]
  },
  {
    id: 'reel-2',
    title: 'Exploring Design Trends in East Africa',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-micro-controller-loop-41566-large.mp4',
    authorId: 'user-2',
    likes: ['user-admin'],
    reposts: 5,
    comments: []
  }
];

export const CATEGORIES = ['All', 'Interior', 'Photography', 'Branding', 'Architecture', 'UI/UX', 'Art'];
