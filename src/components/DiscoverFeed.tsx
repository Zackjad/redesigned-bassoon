import React from 'react';
import { Pin, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Crown, Heart, Bookmark, Trash2, CheckCircle2, Compass } from 'lucide-react';

interface DiscoverFeedProps {
  pins: Pin[];
  users: User[];
  currentUser: User | null;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  onOpenPinDetail: (pin: Pin) => void;
  onLikePin: (pinId: string) => void;
  onSavePin: (pinId: string) => void;
  onDeletePin: (pinId: string) => void;
  onOpenPremium: () => void;
  onSelectProfile: (userId: string) => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  pins,
  users,
  currentUser,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onOpenPinDetail,
  onLikePin,
  onSavePin,
  onDeletePin,
  onOpenPremium,
  onSelectProfile
}) => {
  const displayedPins = pins.filter(pin => {
    const matchesCategory = selectedCategory === 'All' || pin.category === selectedCategory;
    const matchesSearch = 
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pin.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Premium Upgrade Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300">Unlock Zackjad Pro & VIP Features — Ksh 60 / Month</h4>
            <p className="text-xs text-slate-400">Get creator verification badge, 4K HD video uploads, priority feed placement, and zero ads for only Ksh 60/mo.</p>
          </div>
        </div>
        <button
          onClick={onOpenPremium}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all whitespace-nowrap shadow-md shadow-amber-500/20 cursor-pointer"
        >
          Upgrade for Ksh 60
        </button>
      </div>

      {/* Masonry Pin Grid */}
      {displayedPins.length > 0 ? (
        <div className="masonry-grid space-y-5">
          {displayedPins.map(pin => {
            const author = users.find(u => u.id === pin.authorId) || { 
              name: 'Unknown', 
              username: 'user', 
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              isAdmin: false,
              isPremium: false,
              id: pin.authorId
            };
            const isLiked = currentUser && pin.likes.includes(currentUser.id);
            const isSaved = currentUser && pin.saves.includes(currentUser.id);

            return (
              <div 
                key={pin.id} 
                className="break-inside-avoid glass-card rounded-2xl overflow-hidden group hover:border-slate-700 transition-all duration-300 shadow-lg relative mb-5"
              >
                {/* Pin Image with Hover Actions */}
                <div 
                  className="relative overflow-hidden cursor-pointer" 
                  onClick={() => onOpenPinDetail(pin)}
                >
                  <img 
                    src={pin.image} 
                    alt={pin.title} 
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onSavePin(pin.id); 
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isSaved ? 'bg-red-600 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white'
                        }`}
                      >
                        <Bookmark className="w-3 h-3" />
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-white line-clamp-1">{pin.title}</p>
                  </div>
                </div>

                {/* Pin Footer / Author & Stats */}
                <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-800/80">
                  <div 
                    onClick={() => onSelectProfile(author.id)}
                    className="flex items-center gap-2 cursor-pointer min-w-0"
                    title={`View @${author.username}`}
                  >
                    <img 
                      src={author.avatar} 
                      alt={author.username} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-700" 
                    />
                    <span className="text-xs font-medium text-slate-300 truncate hover:text-sky-400 flex items-center gap-1">
                      @{author.username}
                      {(author.isAdmin || author.isPremium) && (
                        <span title={author.isAdmin ? "Verified Administrator" : "Verified Subscriber"}>
                          <CheckCircle2 className="w-3 h-3 text-sky-400 inline" />
                        </span>
                      )}
                      {author.isPremium && (
                        <Crown className="w-2.5 h-2.5 text-amber-400 inline" />
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <button 
                      onClick={() => onLikePin(pin.id)}
                      className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-500 font-bold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{pin.likes.length}</span>
                    </button>
                    {currentUser?.isAdmin && (
                      <button 
                        onClick={() => onDeletePin(pin.id)} 
                        className="text-slate-500 hover:text-red-400 cursor-pointer"
                        title="Delete Pin (Admin Action)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl max-w-md mx-auto">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No pins found</h3>
          <p className="text-xs text-slate-400 mt-1">Try selecting another category or searching for something else.</p>
        </div>
      )}
    </div>
  );
};
