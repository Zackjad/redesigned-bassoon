import React, { useState, useEffect } from 'react';
import { User, Pin, Reel, Transaction, Message, AdminCard, SiteSettings } from './types';
import { 
  ADMIN_CREDENTIALS, 
  INITIAL_USERS, 
  INITIAL_PINS, 
  INITIAL_REELS, 
  INITIAL_TRANSACTIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { DiscoverFeed } from './components/DiscoverFeed';
import { ReelsFeed } from './components/ReelsFeed';
import { MessagesView } from './components/MessagesView';
import { DeveloperView } from './components/DeveloperView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/modals/AuthModal';
import { PremiumModal } from './components/modals/PremiumModal';
import { CreatePinModal } from './components/modals/CreatePinModal';
import { CreateReelModal } from './components/modals/CreateReelModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { PinDetailModal } from './components/modals/PinDetailModal';
import { Sparkles, ShieldAlert, Lock } from 'lucide-react';

export function App() {
  // 1. Current user session (null when logged out, or User object)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('zackjad_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Admin Daemyn Zaccur as default session
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // 2. Users directory
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('zackjad_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // 3. Pins
  const [pins, setPins] = useState<Pin[]>(() => {
    try {
      const saved = localStorage.getItem('zackjad_pins');
      return saved ? JSON.parse(saved) : INITIAL_PINS;
    } catch {
      return INITIAL_PINS;
    }
  });

  // 4. Reels
  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem('zackjad_reels');
      return saved ? JSON.parse(saved) : INITIAL_REELS;
    } catch {
      return INITIAL_REELS;
    }
  });

  // 5. Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('zackjad_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // 6. Admin Card (Linking credit card)
  const [adminCard, setAdminCard] = useState<AdminCard>(() => {
    try {
      const saved = localStorage.getItem('zackjad_admin_card');
      return saved ? JSON.parse(saved) : { 
        linked: true, 
        provider: 'Visa Commercial (ending in 4242) - KES',
        cardHolder: 'Daemyn Zaccur',
        last4: '4242',
        currency: 'KES',
        expiry: '12/28'
      };
    } catch {
      return { 
        linked: true, 
        provider: 'Visa Commercial (ending in 4242) - KES',
        cardHolder: 'Daemyn Zaccur',
        last4: '4242',
        currency: 'KES',
        expiry: '12/28'
      };
    }
  });

  // 7. Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('zackjad_site_settings');
      return saved ? JSON.parse(saved) : {
        siteName: 'Zackjad',
        tagline: 'Visual Inspiration & Reels',
        announcementText: 'Welcome to Zackjad — Creative visual portfolios and 4K reels from Nairobi creators!',
        announcementActive: true,
        allowPublicSignups: true,
        allowPinUploads: true,
        proPriceKes: 60
      };
    } catch {
      return {
        siteName: 'Zackjad',
        tagline: 'Visual Inspiration & Reels',
        announcementText: 'Welcome to Zackjad — Creative visual portfolios and 4K reels from Nairobi creators!',
        announcementActive: true,
        allowPublicSignups: true,
        allowPinUploads: true,
        proPriceKes: 60
      };
    }
  });

  // 8. Messages
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('zackjad_messages');
      return saved ? JSON.parse(saved) : [
        {
          id: 'msg-1',
          from: 'user-2',
          to: 'user-admin',
          text: 'Hi Daemyn! Love the minimalist architecture pin you published.',
          time: 'Yesterday 14:15'
        },
        {
          id: 'msg-2',
          from: 'user-admin',
          to: 'user-2',
          text: 'Thanks Aura! Working on more modern aesthetic collections.',
          time: 'Yesterday 14:22'
        }
      ];
    } catch {
      return [];
    }
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [createPinOpen, setCreatePinOpen] = useState(false);
  const [createReelOpen, setCreateReelOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activePinDetail, setActivePinDetail] = useState<Pin | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zackjad_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zackjad_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('zackjad_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zackjad_pins', JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem('zackjad_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('zackjad_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('zackjad_admin_card', JSON.stringify(adminCard));
  }, [adminCard]);

  useEffect(() => {
    localStorage.setItem('zackjad_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('zackjad_messages', JSON.stringify(messages));
  }, [messages]);

  // Unified Tab Navigation Handler (guarantees tabs work smoothly when clicked)
  const handleNavigate = (tab: string) => {
    setViewingProfileId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View specific user profile
  const handleSelectProfile = (userId: string | null) => {
    setViewingProfileId(userId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Explicit User Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setViewingProfileId(null);
    setActiveTab('feed');
  };

  // Live Admin calculation (prioritizes currentUser if admin so profile pic updates in real-time)
  const liveAdmin = (currentUser?.isAdmin ? currentUser : null) || users.find(u => 
    u.email?.toLowerCase() === 'zackjad34@gmail.com' || u.isAdmin || u.id === 'user-admin'
  ) || INITIAL_USERS[0];

  // Follow / Unfollow user
  const handleToggleFollow = (targetUserId: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (currentUser.id === targetUserId) return;

    const isFollowing = currentUser.following.includes(targetUserId);

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === currentUser.id) {
        const updatedFollowing = isFollowing
          ? user.following.filter(id => id !== targetUserId)
          : [...user.following, targetUserId];
        const updatedUser = { ...user, following: updatedFollowing };
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      if (user.id === targetUserId) {
        const updatedFollowers = isFollowing
          ? user.followers.filter(id => id !== currentUser.id)
          : [...user.followers, currentUser.id];
        return { ...user, followers: updatedFollowers };
      }
      return user;
    }));
  };

  // Like Pin
  const handleLikePin = (pinId: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setPins(prev => prev.map(pin => {
      if (pin.id === pinId) {
        const hasLiked = pin.likes.includes(currentUser.id);
        const newLikes = hasLiked
          ? pin.likes.filter(id => id !== currentUser.id)
          : [...pin.likes, currentUser.id];
        const updated = { ...pin, likes: newLikes };
        if (activePinDetail?.id === pinId) {
          setActivePinDetail(updated);
        }
        return updated;
      }
      return pin;
    }));
  };

  // Save Pin
  const handleSavePin = (pinId: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setPins(prev => prev.map(pin => {
      if (pin.id === pinId) {
        const hasSaved = pin.saves.includes(currentUser.id);
        const newSaves = hasSaved
          ? pin.saves.filter(id => id !== currentUser.id)
          : [...pin.saves, currentUser.id];
        const updated = { ...pin, saves: newSaves };
        if (activePinDetail?.id === pinId) {
          setActivePinDetail(updated);
        }
        return updated;
      }
      return pin;
    }));
  };

  // Add Comment to Pin
  const handleAddComment = (pinId: string, commentText: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    const newComment = {
      id: 'c-' + Date.now(),
      author: currentUser.username,
      text: commentText
    };
    setPins(prev => prev.map(pin => {
      if (pin.id === pinId) {
        const updated = {
          ...pin,
          comments: [...(pin.comments || []), newComment]
        };
        if (activePinDetail?.id === pinId) {
          setActivePinDetail(updated);
        }
        return updated;
      }
      return pin;
    }));
  };

  // Delete Pin (Admin action)
  const handleDeletePin = (pinId: string) => {
    setPins(prev => prev.filter(p => p.id !== pinId));
    if (activePinDetail?.id === pinId) {
      setActivePinDetail(null);
    }
  };

  // Like Reel
  const handleLikeReel = (reelId: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setReels(prev => prev.map(reel => {
      if (reel.id === reelId) {
        const hasLiked = reel.likes.includes(currentUser.id);
        return {
          ...reel,
          likes: hasLiked ? reel.likes.filter(id => id !== currentUser.id) : [...reel.likes, currentUser.id]
        };
      }
      return reel;
    }));
  };

  // Repost Reel
  const handleRepostReel = (reelId: string) => {
    setReels(prev => prev.map(reel => {
      if (reel.id === reelId) {
        return { ...reel, reposts: reel.reposts + 1 };
      }
      return reel;
    }));
  };

  // Send Message
  const handleSendMessage = (toUserId: string, text: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      from: currentUser.id,
      to: toUserId,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Save profile changes (Admin profile changes update liveAdmin & Developer view immediately)
  const handleSaveProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  // Add new pin
  const handlePinCreated = (newPin: Pin) => {
    setPins(prev => [newPin, ...prev]);
  };

  // Add new reel
  const handleReelCreated = (newReel: Reel) => {
    setReels(prev => [newReel, ...prev]);
    handleNavigate('reels');
  };

  // Upgrade success
  const handleUpgradeSuccess = (newPlan: string, tx: Transaction) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      isPremium: true,
      planType: newPlan
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    setTransactions(prev => [tx, ...prev]);
  };

  // Toggle user premium from admin
  const handleToggleUserPremium = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextPremium = !u.isPremium;
        const updated = {
          ...u,
          isPremium: nextPremium,
          planType: nextPremium ? 'VIP Ultimate' : 'Free Member'
        };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  // Toggle user admin from admin
  const handleToggleUserAdmin = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextAdmin = !u.isAdmin;
        const updated = {
          ...u,
          isAdmin: nextAdmin
        };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  // Delete user from admin
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setPins(prev => prev.filter(p => p.authorId !== userId));
  };

  // Active profile user calculation
  const activeProfileUser = viewingProfileId
    ? users.find(u => u.id === viewingProfileId) || currentUser
    : currentUser;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0f172a] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Announcement Banner */}
      {siteSettings.announcementActive && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-300" />
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreatePin={() => {
          if (!currentUser) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setCreatePinOpen(true);
          }
        }}
        onOpenCreateReel={() => {
          if (!currentUser) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setCreateReelOpen(true);
          }
        }}
        onOpenPremium={() => setPremiumModalOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSelectProfile={handleSelectProfile}
      />

      {/* Main Content Area - Clean Tab Routing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* 1. Discover / Feed Tab */}
        {activeTab === 'feed' && (
          <DiscoverFeed
            pins={pins}
            users={users}
            currentUser={currentUser}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onOpenPinDetail={(pin) => setActivePinDetail(pin)}
            onLikePin={handleLikePin}
            onSavePin={handleSavePin}
            onDeletePin={handleDeletePin}
            onOpenPremium={() => setPremiumModalOpen(true)}
            onSelectProfile={handleSelectProfile}
          />
        )}

        {/* 2. Reels Tab */}
        {activeTab === 'reels' && (
          <ReelsFeed
            reels={reels}
            users={users}
            currentUser={currentUser}
            onLikeReel={handleLikeReel}
            onRepostReel={handleRepostReel}
            onSelectProfile={handleSelectProfile}
            onRequireAuth={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            onOpenCreateReel={() => {
              if (!currentUser) {
                setAuthMode('login');
                setAuthModalOpen(true);
              } else {
                setCreateReelOpen(true);
              }
            }}
          />
        )}

        {/* 3. Messages Tab */}
        {activeTab === 'messages' && (
          <MessagesView
            users={users}
            currentUser={currentUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            onRequireAuth={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {/* 4. Developer Tab (Dynamic real-time admin sync) */}
        {activeTab === 'developer' && (
          <DeveloperView 
            liveAdmin={liveAdmin} 
            currentUser={currentUser}
            onOpenEditProfile={() => setEditProfileOpen(true)}
          />
        )}

        {/* 5. Profile Tab */}
        {activeTab === 'profile' && activeProfileUser && (
          <ProfileView
            user={activeProfileUser}
            currentUser={currentUser}
            pins={pins}
            onToggleFollow={handleToggleFollow}
            onEditProfile={() => setEditProfileOpen(true)}
            onOpenPremium={() => setPremiumModalOpen(true)}
            onOpenPinDetail={(pin) => setActivePinDetail(pin)}
          />
        )}

        {/* 6. Admin Management Centre (Protected: Only Admin can access) */}
        {activeTab === 'admin' && (
          currentUser?.isAdmin ? (
            <AdminPanel
              users={users}
              pins={pins}
              transactions={transactions}
              adminCard={adminCard}
              siteSettings={siteSettings}
              onUpdateSiteSettings={setSiteSettings}
              onUpdateAdminCard={setAdminCard}
              onToggleUserPremium={handleToggleUserPremium}
              onToggleUserAdmin={handleToggleUserAdmin}
              onDeleteUser={handleDeleteUser}
              onDeletePin={handleDeletePin}
            />
          ) : (
            <div className="max-w-md mx-auto glass-card rounded-2xl border border-slate-800 p-8 text-center space-y-4 shadow-2xl my-12">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Administrator Restricted</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Zackjad Management Centre is restricted to the platform administrator. Please log in with administrator credentials to manage site settings, transactions, and user privileges.
              </p>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In as Administrator</span>
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer - Real-time dynamic sync with Admin profile */}
      <footer className="border-t border-slate-800 bg-slate-900/80 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            onClick={() => handleSelectProfile(liveAdmin.id)}
            className="flex items-center gap-3 cursor-pointer group"
            title="View Developer Profile"
          >
            <img 
              src={liveAdmin.avatar} 
              alt={liveAdmin.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-sky-400 transition-colors shrink-0" 
            />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-sky-300 transition-colors">
                <span>Developed & Maintained by {liveAdmin.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" title="Platform Lead Online"></span>
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">
                {liveAdmin.bio || 'Nairobi, Kenya • Lead Full Stack Developer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="https://instagram.com/itzz._jad" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <span>Instagram:</span>
              <strong className="text-slate-200">@itzz._jad</strong>
            </a>
            <span className="text-slate-700">•</span>
            <a 
              href="https://tiktok.com/@itzz._jad" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <span>TikTok:</span>
              <strong className="text-slate-200">@itzz._jad</strong>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        users={users}
        onLoginUser={(u) => {
          setCurrentUser(u);
          if (u.isAdmin) {
            handleNavigate('admin');
          }
        }}
        onRegisterUser={(newUser) => {
          setUsers(prev => [newUser, ...prev]);
          setCurrentUser(newUser);
        }}
        initialMode={authMode}
      />

      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        currentUser={currentUser}
        onUpgradeSuccess={handleUpgradeSuccess}
        onRequireAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
      />

      {currentUser && (
        <CreatePinModal
          isOpen={createPinOpen}
          onClose={() => setCreatePinOpen(false)}
          currentUser={currentUser}
          onPinCreated={handlePinCreated}
        />
      )}

      {currentUser && (
        <CreateReelModal
          isOpen={createReelOpen}
          onClose={() => setCreateReelOpen(false)}
          currentUser={currentUser}
          onReelCreated={handleReelCreated}
        />
      )}

      {currentUser && (
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleSaveProfile}
        />
      )}

      <PinDetailModal
        pin={activePinDetail}
        onClose={() => setActivePinDetail(null)}
        users={users}
        currentUser={currentUser}
        onLikePin={handleLikePin}
        onSavePin={handleSavePin}
        onAddComment={handleAddComment}
        onSelectProfile={handleSelectProfile}
        onRequireAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
      />
    </div>
  );
}
export default App;
