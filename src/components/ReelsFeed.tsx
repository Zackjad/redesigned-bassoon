import React from 'react';
import { Reel, User } from '../types';
import { Heart, Repeat, MessageCircle, CheckCircle2 } from 'lucide-react';

interface ReelsFeedProps {
  reels: Reel[];
  users: User[];
  currentUser: User | null;
  onLikeReel: (reelId: string) => void;
  onRepostReel: (reelId: string) => void;
  onSelectProfile: (userId: string) => void;
  onRequireAuth: () => void;
  onOpenCreateReel?: () => void;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  reels,
  users,
  currentUser,
  onLikeReel,
  onRepostReel,
  onSelectProfile,
  onRequireAuth,
  onOpenCreateReel
}) => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Creator Reels</h2>
          <p className="text-xs text-slate-400">Short video loops and creative breakdowns</p>
        </div>
        {onOpenCreateReel && (
          <button
            onClick={() => {
              if (!currentUser) return onRequireAuth();
              onOpenCreateReel();
            }}
            className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Upload Reel</span>
          </button>
        )}
      </div>

      {reels.map(reel => {
        const author = users.find(u => u.id === reel.authorId) || {
          name: 'Creator',
          username: 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          isAdmin: false,
          isPremium: false,
          id: reel.authorId
        };
        const isLiked = currentUser && reel.likes.includes(currentUser.id);

        return (
          <div 
            key={reel.id} 
            className="glass-card rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl bg-black"
          >
            <div className="relative aspect-[9/16] w-full bg-slate-950 flex items-center justify-center">
              <video 
                src={reel.videoUrl} 
                controls 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Author & Title overlay */}
              <div className="absolute bottom-4 left-4 right-16 z-10 space-y-2 pointer-events-auto bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 rounded-xl">
                <div 
                  onClick={() => onSelectProfile(author.id)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img 
                    src={author.avatar} 
                    alt={author.username} 
                    className="w-8 h-8 rounded-full border border-white/20 object-cover" 
                  />
                  <div>
                    <span className="font-bold text-sm text-white flex items-center gap-1 leading-tight">
                      <span>{author.name}</span>
                      {(author.isAdmin || author.isPremium) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 inline" />
                      )}
                    </span>
                    <span className="text-xs text-sky-400">@{author.username}</span>
                  </div>
                </div>
                <p className="text-xs text-white/95 font-medium line-clamp-2">{reel.title}</p>
              </div>

              {/* Right side floating action buttons */}
              <div className="absolute bottom-6 right-3 z-10 flex flex-col items-center gap-4 text-white">
                <button 
                  onClick={() => {
                    if (!currentUser) return onRequireAuth();
                    onLikeReel(reel.id);
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title="Like Reel"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </div>
                  <span className="text-[10px] font-semibold">{reel.likes.length}</span>
                </button>

                <button 
                  onClick={() => onRepostReel(reel.id)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title="Repost Reel"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                    <Repeat className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold">{reel.reposts}</span>
                </button>

                {reel.comments && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold">{reel.comments.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
