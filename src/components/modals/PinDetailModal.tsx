import React, { useState } from 'react';
import { Pin, User } from '../../types';
import { X, Heart, Bookmark, MessageSquare, Send, CheckCircle2, Download, Share2, Check } from 'lucide-react';

interface PinDetailModalProps {
  pin: Pin | null;
  onClose: () => void;
  users: User[];
  currentUser: User | null;
  onLikePin: (pinId: string) => void;
  onSavePin: (pinId: string) => void;
  onAddComment: (pinId: string, commentText: string) => void;
  onSelectProfile: (userId: string) => void;
  onRequireAuth: () => void;
}

export const PinDetailModal: React.FC<PinDetailModalProps> = ({
  pin,
  onClose,
  users,
  currentUser,
  onLikePin,
  onSavePin,
  onAddComment,
  onSelectProfile,
  onRequireAuth
}) => {
  const [newComment, setNewComment] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!pin) return null;

  const author = users.find(u => u.id === pin.authorId) || {
    id: pin.authorId,
    name: 'Unknown Creator',
    username: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isAdmin: false,
    isPremium: false
  };

  const isLiked = currentUser && pin.likes.includes(currentUser.id);
  const isSaved = currentUser && pin.saves.includes(currentUser.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(pin.id, newComment.trim());
    setNewComment('');
  };

  // Download high-resolution pin to device
  const handleDownloadPin = () => {
    setDownloadSuccess(true);
    // Create an anchor and trigger download
    const link = document.createElement('a');
    link.href = pin.image;
    link.download = `zackjad-${pin.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2000);
  };

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-20 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Container with Download Overlay */}
          <div className="bg-slate-950 flex flex-col items-center justify-center max-h-[75vh] overflow-hidden relative group">
            <img 
              src={pin.image} 
              alt={pin.title} 
              className="w-full h-full object-contain"
            />
            {/* Quick action buttons on image */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={handleDownloadPin}
                className="bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer shadow-lg"
                title="Download high-resolution image to device"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details & Comments */}
          <div className="p-5 sm:p-6 flex flex-col justify-between max-h-[75vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Category & Action buttons */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                  {pin.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyShareLink}
                    className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Share Pin"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser) return onRequireAuth();
                      onLikePin(pin.id);
                    }}
                    className={`p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      isLiked 
                        ? 'bg-rose-950/50 border-rose-800 text-rose-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{pin.likes.length}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser) return onRequireAuth();
                      onSavePin(pin.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSaved ? 'bg-red-600 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold text-white leading-snug">{pin.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Published {pin.createdAt}</p>
                {pin.description && (
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {pin.description}
                  </p>
                )}
              </div>

              {/* Author Card */}
              <div 
                onClick={() => {
                  onSelectProfile(author.id);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={author.avatar} 
                    alt={author.username} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-700" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {author.name}
                      {(author.isAdmin || author.isPremium) && (
                        <span title={author.isAdmin ? "Verified Administrator" : "Verified Subscriber"}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 inline" />
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">@{author.username}</p>
                  </div>
                </div>
                <span className="text-xs text-sky-400 font-semibold hover:underline">
                  View Profile →
                </span>
              </div>

              {/* Comments Section */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Comments ({pin.comments?.length || 0})</span>
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {pin.comments && pin.comments.length > 0 ? (
                    pin.comments.map(c => (
                      <div key={c.id} className="text-xs p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/60">
                        <span className="font-bold text-sky-300">@{c.author}</span>
                        <p className="text-slate-200 mt-0.5">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 italic py-2">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-4 mt-2 border-t border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Log in to comment"} 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500" 
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl px-4 py-2 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
