import React from 'react';
import { User, Pin } from '../types';
import { Crown, CheckCircle2, UserCheck, UserPlus, Image as ImageIcon } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  currentUser: User | null;
  pins: Pin[];
  onToggleFollow: (userId: string) => void;
  onEditProfile: () => void;
  onOpenPremium: () => void;
  onOpenPinDetail: (pin: Pin) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  pins,
  onToggleFollow,
  onEditProfile,
  onOpenPremium,
  onOpenPinDetail
}) => {
  const isMe = currentUser?.id === user.id;
  const isFollowing = currentUser?.following.includes(user.id);
  const userPins = pins.filter(p => p.authorId === user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 relative shadow-xl">
        <div className="h-44 sm:h-52 relative bg-slate-900">
          {user.cover ? (
            <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </div>

        <div className="px-6 pb-6 relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-900 shadow-xl"
            />
            <div className="mt-2 sm:mt-0">
              <h2 className="text-xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                {user.name}
                {user.isPremium && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                )}
                {(user.isAdmin || user.isPremium) && (
                  <span title={user.isAdmin ? "Verified Administrator" : "Verified Subscriber"}>
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  </span>
                )}
              </h2>
              <p className="text-xs text-sky-400 font-medium">@{user.username}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-md">{user.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isMe ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onEditProfile}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={onOpenPremium}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" /> Subscription
                </button>
              </div>
            ) : (
              <button
                onClick={() => onToggleFollow(user.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    : 'bg-sky-600 text-white hover:bg-sky-500 shadow-sm'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Counts summary */}
        <div className="border-t border-slate-800/80 px-6 py-3 flex items-center justify-around text-center text-xs text-slate-300">
          <div>
            <span className="font-bold text-white text-sm block">{user.followers.length}</span>
            <span className="text-[11px] text-slate-400">Followers</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="font-bold text-white text-sm block">{user.following.length}</span>
            <span className="text-[11px] text-slate-400">Following</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="font-bold text-white text-sm block">{userPins.length}</span>
            <span className="text-[11px] text-slate-400">Pins</span>
          </div>
        </div>
      </div>

      {/* Created Pins Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-sky-400" /> Created Pins
        </h3>
        
        {userPins.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userPins.map(pin => (
              <div 
                key={pin.id} 
                onClick={() => onOpenPinDetail(pin)}
                className="glass-card rounded-xl overflow-hidden cursor-pointer group hover:border-slate-700 transition-all shadow-md"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-900">
                  <img 
                    src={pin.image} 
                    alt={pin.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-slate-200 truncate">{pin.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{pin.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center text-slate-400 text-xs">
            No pins published yet by this creator.
          </div>
        )}
      </div>
    </div>
  );
};
