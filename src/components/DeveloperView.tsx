import React from 'react';
import { User } from '../types';
import { ADMIN_CREDENTIALS } from '../data/mockData';
import { MapPin, UserCog, Code, ExternalLink, Edit3 } from 'lucide-react';
import { Logo } from './Logo';

interface DeveloperViewProps {
  liveAdmin: User | typeof ADMIN_CREDENTIALS;
  currentUser?: User | null;
  onOpenEditProfile?: () => void;
}

export const DeveloperView: React.FC<DeveloperViewProps> = ({ 
  liveAdmin,
  currentUser,
  onOpenEditProfile
}) => {
  const isAdminLoggedIn = currentUser?.isAdmin || currentUser?.email?.toLowerCase() === 'zackjad34@gmail.com';

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between">
        <Logo size="lg" />
        {isAdminLoggedIn && onOpenEditProfile && (
          <button
            onClick={onOpenEditProfile}
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Developer Profile</span>
          </button>
        )}
      </div>

      {/* Hero Banner */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 relative shadow-xl">
        <div className="h-48 sm:h-56 relative bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-6 text-center">
          <div className="z-10">
            <span className="text-xs font-bold tracking-wider uppercase text-sky-400 bg-slate-900/80 px-3.5 py-1 rounded-full border border-slate-700/80 mb-2.5 inline-block shadow-sm">
              Platform Architect & Lead Developer
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              {liveAdmin.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium max-w-lg mx-auto leading-relaxed">
              {liveAdmin.bio || 'Designing full-stack digital web applications, creative visual tools, and modern media platforms.'}
            </p>
          </div>
        </div>

        {/* Developer Info & Social Links */}
        <div className="px-6 pb-6 pt-5 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img 
              src={liveAdmin.avatar} 
              alt={liveAdmin.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sky-500/60 shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                <span>{liveAdmin.name}</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 font-bold px-1.5 py-0.2 rounded">
                  CREATOR
                </span>
              </h3>
              <p className="text-xs text-sky-400 font-medium">@{liveAdmin.username} • Lead Software Engineer</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Nairobi, Kenya 🇰🇪
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a 
              href="https://instagram.com/itzz._jad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
            >
              <span className="font-bold">Instagram</span>
              <span>@itzz._jad</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://tiktok.com/@itzz._jad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
            >
              <span className="font-bold">TikTok</span>
              <span>@itzz._jad</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-sky-400" /> About the Developer
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Zackjad was built by <strong className="text-sky-400">{liveAdmin.name} (@{liveAdmin.username})</strong> in Nairobi, Kenya, as a platform for visual inspiration, media sharing, and creative showcase.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {liveAdmin.bio || 'Focused on clean design, performance, and accessible user experiences.'}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-400" /> Technical Architecture
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">React 18 & Vite</p>
              <p className="text-[10px] text-slate-400">Fast modern SPA architecture</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">Tailwind CSS</p>
              <p className="text-[10px] text-slate-400">Clean responsive UI & styling</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">TypeScript</p>
              <p className="text-[10px] text-slate-400">Type safety across models</p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <p className="font-bold text-white">Local & Cloud Sync</p>
              <p className="text-[10px] text-slate-400">Reactive client state store</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
