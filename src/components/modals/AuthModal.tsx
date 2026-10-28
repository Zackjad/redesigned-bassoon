import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { X, Mail, Lock, User as UserIcon, CheckCircle2, Camera, Upload } from 'lucide-react';
import { Logo } from '../Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginUser: (user: User) => void;
  onRegisterUser: (newUser: User) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginUser,
  onRegisterUser,
  initialMode = 'login'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Gmail popup modal state for smooth 1-click Gmail auth without OTP
  const [showGmailPrompt, setShowGmailPrompt] = useState(false);
  const [gmailInput, setGmailInput] = useState('');
  const avatarFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading avatar from device during signup
  const handleDeviceAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handles 1-click or quick Gmail authentication WITHOUT OTP
  const handleGmailAuth = (gmailAddress: string) => {
    const cleanEmail = gmailAddress.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please provide a valid Gmail address (e.g., yourname@gmail.com).');
      return;
    }

    // Check if this matches admin
    if (cleanEmail === 'zackjad34@gmail.com') {
      const adminUser = users.find(u => u.email.toLowerCase() === 'zackjad34@gmail.com' || u.isAdmin);
      if (adminUser) {
        onLoginUser(adminUser);
        onClose();
        return;
      }
    }

    // Check if already registered
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      onLoginUser(existing);
      onClose();
      return;
    }

    // Otherwise create account with Gmail instantly without OTP
    const cleanUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'gmail_user';
    const newUser: User = {
      id: 'user-gmail-' + Date.now(),
      email: cleanEmail,
      username: cleanUsername,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      bio: 'Creative visual member connected via Gmail.',
      followers: [],
      following: [],
      isAdmin: cleanEmail === 'zackjad34@gmail.com',
      isPremium: cleanEmail === 'zackjad34@gmail.com',
      planType: cleanEmail === 'zackjad34@gmail.com' ? 'Administrator' : 'Free Member'
    };

    onRegisterUser(newUser);
    onClose();
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // Check for default admin login credentials
    if (cleanEmail === 'zackjad34@gmail.com') {
      if (password === 'Damian@2010' || authMode === 'signup') {
        const adminUser = users.find(u => u.email.toLowerCase() === 'zackjad34@gmail.com' || u.isAdmin) || {
          id: 'user-admin',
          email: 'zackjad34@gmail.com',
          username: 'zackjad_official',
          name: 'Daemyn Zaccur (Admin)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          bio: 'Founder & Software Engineer behind Zackjad. Building from Nairobi, Kenya 🇰🇪',
          followers: ['user-2', 'user-3'],
          following: ['user-2'],
          isAdmin: true,
          isPremium: true,
          planType: 'Administrator'
        };
        onLoginUser(adminUser);
        onClose();
        return;
      } else {
        setErrorMessage('Invalid email or password.');
        return;
      }
    }

    if (authMode === 'signup') {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (!cleanUsername) {
        setErrorMessage('Please enter a valid username.');
        return;
      }

      const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername);
      if (existingUser) {
        setErrorMessage('An account with this email or username already exists. Please log in.');
        return;
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        username: cleanUsername,
        name: name.trim() || cleanUsername,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
        bio: 'Creative member on Zackjad Visual Platform.',
        followers: [],
        following: [],
        isAdmin: false,
        isPremium: false,
        planType: 'Free Member'
      };

      onRegisterUser(newUser);
      onClose();
    } else {
      // Login mode
      const existingUser = users.find(u => 
        u.email.toLowerCase() === cleanEmail || 
        u.username.toLowerCase() === cleanEmail
      );

      if (existingUser) {
        onLoginUser(existingUser);
        onClose();
      } else {
        // Seamlessly register new account without OTP
        const fallbackUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'creator';
        const newUser: User = {
          id: 'user-' + Date.now(),
          email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`,
          username: fallbackUsername,
          name: fallbackUsername.replace(/\b\w/g, l => l.toUpperCase()),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          bio: 'Visual Creator on Zackjad.',
          followers: [],
          following: [],
          isAdmin: false,
          isPremium: false,
          planType: 'Free Member'
        };
        onRegisterUser(newUser);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 relative shadow-2xl my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="md" className="mb-2" />
          <h3 className="font-extrabold text-xl text-white mt-1">
            {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login' 
              ? 'Sign in to access your saved pins, reels, and messages' 
              : 'Join creators and visual designers on Zackjad'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        {/* 1-CLICK GMAIL AUTH (NO OTP) */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setShowGmailPrompt(!showGmailPrompt);
            }}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-slate-200"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z" />
            </svg>
            <span>Continue with Gmail (Instant, No OTP)</span>
          </button>

          {/* Quick Gmail Address Input */}
          {showGmailPrompt && (
            <div className="p-3 bg-slate-900/90 border border-sky-500/40 rounded-xl space-y-2">
              <p className="text-[11px] text-sky-300 font-medium">Enter your Gmail to sign in or register instantly without OTP:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleGmailAuth(gmailInput)}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold absolute">
              or with password
            </span>
          </div>
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <>
              {/* Optional Profile Picture Upload during Signup */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0" />
                <div className="flex-1">
                  <input 
                    ref={avatarFileRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleDeviceAvatarUpload}
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current?.click()}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload profile picture from device</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Daemyn Zaccur" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="zackjad_creator" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500" 
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Gmail / Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{authMode === 'login' ? 'Log In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
            }}
            className="text-xs text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            {authMode === 'login' ? "Don't have an account? Sign up with Gmail" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};
