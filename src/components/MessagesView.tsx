import React, { useState } from 'react';
import { User, Message } from '../types';
import { MessageSquare, Send, User as UserIcon } from 'lucide-react';

interface MessagesViewProps {
  users: User[];
  currentUser: User | null;
  messages: Message[];
  onSendMessage: (toUserId: string, text: string) => void;
  onRequireAuth: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  users,
  currentUser,
  messages,
  onSendMessage,
  onRequireAuth
}) => {
  const [recipientId, setRecipientId] = useState<string>(() => {
    const otherUser = users.find(u => u.id !== currentUser?.id);
    return otherUser ? otherUser.id : '';
  });
  const [draft, setDraft] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto glass-card rounded-2xl border border-slate-800 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Direct Messaging</h2>
        <p className="text-xs text-slate-400">Sign in to start conversations with creators, share feedback, and collaborate on visual projects.</p>
        <button 
          onClick={onRequireAuth} 
          className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
        >
          Sign in to Chat
        </button>
      </div>
    );
  }

  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const activeRecipient = users.find(u => u.id === recipientId) || otherUsers[0];

  const currentThread = messages.filter(m => 
    (m.from === currentUser.id && m.to === activeRecipient?.id) ||
    (m.to === currentUser.id && m.from === activeRecipient?.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeRecipient) return;
    onSendMessage(activeRecipient.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="max-w-4xl mx-auto glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <span>Messages & Creative Inquiries</span>
          </h2>
          <p className="text-xs text-amber-300 mt-0.5">
            Preview mode: messages are synchronized in your active browser session.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] min-h-[420px]">
        {/* Recipient User List */}
        <aside className="p-3 border-b md:border-b-0 md:border-r border-slate-800 space-y-1.5 bg-slate-900/40">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Conversations</p>
          {otherUsers.map(u => {
            const isSelected = activeRecipient?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setRecipientId(u.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-sky-900/60 border border-sky-700/80 shadow-sm' 
                    : 'hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <img 
                  src={u.avatar} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" 
                  alt={u.name} 
                />
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs text-white truncate">{u.name}</strong>
                  <span className="text-[11px] text-slate-400 truncate block">@{u.username}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Conversation Thread */}
        <section className="p-4 flex flex-col justify-between bg-slate-950/30">
          {activeRecipient ? (
            <>
              {/* Header inside thread */}
              <div className="pb-3 mb-3 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={activeRecipient.avatar} 
                    className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                    alt={activeRecipient.name} 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{activeRecipient.name}</h4>
                    <p className="text-[10px] text-sky-400">@{activeRecipient.username} • {activeRecipient.planType}</p>
                  </div>
                </div>
              </div>

              {/* Message bubbles */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-[360px] pr-1">
                {currentThread.length > 0 ? (
                  currentThread.map(m => {
                    const isMe = m.from === currentUser.id;
                    return (
                      <div 
                        key={m.id} 
                        className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                          isMe 
                            ? 'ml-auto bg-sky-600 text-white rounded-br-none shadow-sm' 
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50'
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <p className="text-[9px] opacity-70 mt-1 text-right">{m.time}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-14">
                    <UserIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-400">No messages yet. Say hello to @{activeRecipient.username}!</p>
                  </div>
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  value={draft} 
                  onChange={e => setDraft(e.target.value)} 
                  maxLength={1000} 
                  placeholder="Share an idea, ask a question…" 
                  className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-sky-500" 
                />
                <button 
                  type="submit" 
                  disabled={!draft.trim()}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              No recipient selected.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
