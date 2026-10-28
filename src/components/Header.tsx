import React from 'react';
import { User } from '../types';
import { 
  Compass, 
  Play, 
  MessageSquare, 
  Crown, 
  Code2, 
  ShieldCheck, 
  Search, 
  Plus, 
  LogOut, 
  LogIn, 
  UserPlus,
  Video,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCreatePin: () => void;
  onOpenCreateReel: () => void;
  onOpenPremium: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onSelectProfile: (userId: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  searchQuery,
  setSearchQuery,
  onOpenCreatePin,
  onOpenCreateReel,
  onOpenPremium,
  onOpenAuth,
  onLogout,
  onSelectProfile
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo Component */}
        <div 
          onClick={() => onNavigate('feed')} 
          className="cursor-pointer"
        >
          <Logo size="md" />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-full border border-slate-700/60">
          <button
            onClick={() => onNavigate('feed')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'feed' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Discover
          </button>
          <button
            onClick={() => onNavigate('reels')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reels' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Reels
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Messages
          </button>
          <button
            onClick={onOpenPremium}
            className="px-4 py-1.5 rounded-full font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" /> Premium
          </button>
          <button
            onClick={() => onNavigate('developer')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'developer' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Developer
          </button>
          {currentUser?.isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'admin' ? 'bg-slate-700 text-sky-400 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Admin Centre
            </button>
          )}
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search visual ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-sm text-slate-100 pl-10 pr-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* User Account & Create Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <>
              {/* Post Pin Button */}
              <button
                onClick={onOpenCreatePin}
                className="bg-sky-600 hover:bg-sky-500 text-white px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Post New Pin"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pin</span>
              </button>

              {/* Post Reel Button */}
              <button
                onClick={onOpenCreateReel}
                className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3 sm:px-3.5 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Upload New Reel"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reel</span>
              </button>

              {/* Profile Chip with Verified Badge (Admin or Subscribed) */}
              <div 
                onClick={() => onSelectProfile(currentUser.id)}
                className="flex items-center gap-2 cursor-pointer pl-1 pr-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                title="View Profile"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username} 
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <span className="text-xs font-semibold text-slate-200 hidden lg:inline flex items-center gap-1">
                  <span>{currentUser.username}</span>
                  {(currentUser.isAdmin || currentUser.isPremium) && (
                    <span title={currentUser.isAdmin ? "Verified Administrator" : "Verified Subscriber"}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 inline" />
                    </span>
                  )}
                  {currentUser.isPremium && (
                    <Crown className="w-3 h-3 text-amber-400 inline" />
                  )}
                </span>
              </div>

              {/* Log out Button */}
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                title="Log Out of this Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-full border border-slate-700/80 shadow-md">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-slate-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-slate-700/60 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-400" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-slate-800/60 text-xs text-slate-400">
        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${activeTab === 'feed' ? 'text-sky-400 font-bold' : ''}`}
        >
          <Compass className="w-4 h-4" /> Discover
        </button>
        <button
          onClick={() => onNavigate('reels')}
          className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${activeTab === 'reels' ? 'text-sky-400 font-bold' : ''}`}
        >
          <Play className="w-4 h-4" /> Reels
        </button>
        <button
          onClick={() => onNavigate('messages')}
          className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${activeTab === 'messages' ? 'text-sky-400 font-bold' : ''}`}
        >
          <MessageSquare className="w-4 h-4" /> Messages
        </button>
        <button
          onClick={onOpenPremium}
          className="flex flex-col items-center gap-1 py-1 px-2 text-amber-400 font-bold cursor-pointer"
        >
          <Crown className="w-4 h-4" /> Ksh 60
        </button>
        <button
          onClick={() => onNavigate('developer')}
          className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${activeTab === 'developer' ? 'text-sky-400 font-bold' : ''}`}
        >
          <Code2 className="w-4 h-4" /> Dev
        </button>
        {currentUser?.isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer ${activeTab === 'admin' ? 'text-sky-400 font-bold' : ''}`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        )}
      </div>
    </header>
  );
};
