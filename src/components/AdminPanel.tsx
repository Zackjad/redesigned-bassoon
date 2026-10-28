import React, { useState } from 'react';
import { User, Pin, Transaction, AdminCard, SiteSettings } from '../types';
import { 
  ShieldCheck, 
  CreditCard, 
  Receipt, 
  Users, 
  DollarSign, 
  Crown, 
  Image as ImageIcon, 
  AlertCircle, 
  Settings, 
  Trash2, 
  CheckCircle, 
  Lock, 
  Search, 
  UserCheck, 
  SlidersHorizontal,
  Bell,
  Eye,
  Plus
} from 'lucide-react';
import { Logo } from './Logo';

interface AdminPanelProps {
  users: User[];
  pins: Pin[];
  transactions: Transaction[];
  adminCard: AdminCard;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onUpdateAdminCard: (card: AdminCard) => void;
  onToggleUserPremium: (userId: string) => void;
  onToggleUserAdmin: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeletePin: (pinId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  pins,
  transactions,
  adminCard,
  siteSettings,
  onUpdateSiteSettings,
  onUpdateAdminCard,
  onToggleUserPremium,
  onToggleUserAdmin,
  onDeleteUser,
  onDeletePin
}) => {
  const [activeTab, setActiveTab] = useState<'site' | 'payment' | 'card' | 'users'>('site');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Credit Card Form state
  const [cardNumber, setCardNumber] = useState(adminCard.last4 ? `•••• •••• •••• ${adminCard.last4}` : '');
  const [cardHolder, setCardHolder] = useState(adminCard.cardHolder || 'Daemyn Zaccur');
  const [cardExpiry, setCardExpiry] = useState(adminCard.expiry || '12/28');
  const [cardCvc, setCardCvc] = useState('');
  const [payoutCurrency, setPayoutCurrency] = useState(adminCard.currency || 'KES');

  // Site Settings form state
  const [announcementText, setAnnouncementText] = useState(siteSettings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(siteSettings.announcementActive);

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [pinSearch, setPinSearch] = useState('');

  const totalRevenue = transactions.reduce((acc, t) => {
    const val = parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0;
    return acc + val;
  }, 0);

  const activePremiumCount = users.filter(u => u.isPremium).length;

  const handleLinkCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 12 && !cleanNum.includes('•')) {
      setAdminNotice('Please enter a valid 16-digit credit card number.');
      return;
    }

    const brand = cleanNum.startsWith('4') ? 'Visa Commercial' : cleanNum.startsWith('5') ? 'Mastercard Business' : 'Credit Card';
    const last4 = cleanNum.slice(-4) || '4242';

    onUpdateAdminCard({
      linked: true,
      provider: `${brand} (ending in ${last4}) - ${payoutCurrency}`,
      cardHolder: cardHolder.trim(),
      last4: last4,
      currency: payoutCurrency,
      expiry: cardExpiry
    });

    setAdminNotice(`Merchant card ending in ${last4} linked successfully for automated ${payoutCurrency} settlements.`);
    setCardNumber(`•••• •••• •••• ${last4}`);
    setCardCvc('');
  };

  const handleUnlinkCard = () => {
    onUpdateAdminCard({
      linked: false,
      provider: '',
      cardHolder: '',
      last4: '',
      currency: 'KES',
      expiry: ''
    });
    setCardNumber('');
    setAdminNotice('Merchant payout card has been removed.');
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({
      ...siteSettings,
      announcementText: announcementText.trim(),
      announcementActive
    });
    setAdminNotice('Platform site settings saved successfully!');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPins = pins.filter(p => 
    p.title.toLowerCase().includes(pinSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(pinSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Admin Notice */}
      {adminNotice && (
        <div className="p-4 rounded-xl bg-sky-950/90 border border-sky-800 text-sky-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{adminNotice}</span>
          </div>
          <button 
            onClick={() => setAdminNotice(null)} 
            className="text-xs text-slate-400 hover:text-white cursor-pointer ml-3 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner & Management Centre Tabs */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Logo size="lg" showText={false} />
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span>Zackjad Management Centre</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full administrative controls for site moderation, payment infrastructure, credit card linking, and user management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('site')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'site' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1.5" /> Site Management
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'payment' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 inline mr-1.5" /> Payments
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'card' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 inline mr-1.5" /> Link Credit Card
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 inline mr-1.5" /> User Management
            </button>
          </div>
        </div>

        {/* Global Key Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <Users className="w-5 h-5 text-sky-400 mx-auto mb-1 opacity-70" />
            <p className="text-2xl font-black text-sky-400">{users.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Users</p>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1 opacity-70" />
            <p className="text-2xl font-black text-emerald-400">
              Ksh {totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total Revenue</p>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <Crown className="w-5 h-5 text-amber-400 mx-auto mb-1 opacity-70" />
            <p className="text-2xl font-black text-amber-400">
              {activePremiumCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">Active Premium</p>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <ImageIcon className="w-5 h-5 text-sky-400 mx-auto mb-1 opacity-70" />
            <p className="text-2xl font-black text-sky-400">{pins.length}</p>
            <p className="text-xs text-slate-400 mt-1">Active Pins</p>
          </div>
        </div>
      </div>

      {/* 1. SITE MANAGEMENT TAB */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          {/* Site Announcement Configuration */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Platform Announcement Banner</span>
            </h3>

            <form onSubmit={handleSaveSiteSettings} className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="announcementActive"
                  checked={announcementActive}
                  onChange={e => setAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer" 
                />
                <label htmlFor="announcementActive" className="text-slate-200 font-semibold cursor-pointer">
                  Display announcement banner at the top of the feed
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Banner Announcement Text</label>
                <input 
                  type="text" 
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Welcome to Zackjad — Creative visual portfolios and 4K reels from Nairobi creators!"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500" 
                />
              </div>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl font-bold transition-all cursor-pointer"
              >
                Save Announcement
              </button>
            </form>
          </div>

          {/* Content Moderation */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                  <span>Content Moderation & Active Pins</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage published visual media, remove reported content, and monitor feed health.</p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pins by title or category..."
                  value={pinSearch}
                  onChange={e => setPinSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Pins Table / List for Moderation */}
            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto pr-1">
              {filteredPins.map(pin => {
                const author = users.find(u => u.id === pin.authorId);
                return (
                  <div key={pin.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={pin.image} alt={pin.title} className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{pin.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {pin.category} • by <span className="text-sky-300">@{author?.username || 'user'}</span> • {pin.likes.length} likes • {pin.comments?.length || 0} comments
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onDeletePin(pin.id);
                          setAdminNotice(`Pin "${pin.title}" has been deleted by Admin.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT MANAGEMENT TAB */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Subscription Price</span>
              <p className="text-xl font-bold text-white mt-1">Ksh 60 / Month</p>
              <p className="text-[11px] text-emerald-400 mt-1">Pro Creator & VIP Ultimate</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Monthly Recurring (MRR)</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                Ksh {(activePremiumCount * 60).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{activePremiumCount} active paying subscribers</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Payout Destination</span>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {adminCard.linked ? adminCard.provider : 'Not linked'}
              </p>
              <p className="text-[11px] text-amber-300 mt-1">
                {adminCard.linked ? 'Active & Ready for payouts' : 'Action needed: Link payout card'}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" /> Subscriber Transaction Records
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {transactions.map(tx => (
                <div 
                  key={tx.id} 
                  className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">
                      {tx.userName} <span className="text-amber-400 text-[11px]">({tx.plan})</span>
                    </p>
                    <p className="text-[10px] text-slate-400">{tx.paymentMethod} • {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-extrabold text-emerald-400">{tx.amount}</p>
                    <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 inline-block mt-0.5">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. LINK CREDIT CARD TAB */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Management Status */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Merchant Payout Card
              </h3>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                adminCard.linked 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {adminCard.linked ? 'Card Linked' : 'No Card Linked'}
              </span>
            </div>

            {adminCard.linked ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/80 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-sky-400 tracking-wider">ZACKJAD MERCHANT PAYOUT</span>
                    <span className="text-xs font-black text-white px-2 py-0.5 bg-slate-800/90 rounded border border-slate-700">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-lg font-mono font-bold text-white tracking-widest mb-4">
                    •••• •••• •••• {adminCard.last4 || '4242'}
                  </p>
                  <div className="flex justify-between text-[11px] text-slate-300 font-medium">
                    <span>HOLDER: {(adminCard.cardHolder || cardHolder).toUpperCase()}</span>
                    <span>EXP: {adminCard.expiry || cardExpiry}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Subscription revenues (Ksh 60 / transaction) from M-Pesa and credit cards will automatically settle to this linked merchant account in {adminCard.currency || 'KES'}.
                </p>

                <button
                  type="button"
                  onClick={handleUnlinkCard}
                  className="w-full bg-red-950/60 hover:bg-red-900 text-red-300 font-bold py-2.5 rounded-xl text-xs border border-red-800 transition-colors cursor-pointer"
                >
                  Unlink This Card
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Link a credit or debit card to receive payouts and settle subscription revenues from Zackjad members.
                </p>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                  <p className="text-sky-300 font-semibold">Supported Payout Channels:</p>
                  <p>• Visa / Mastercard Commercial & Business Cards</p>
                  <p>• Kenya Shillings (KES) or USD settlement currency</p>
                  <p>• Direct settlement via PCI-DSS compliant payout engine</p>
                </div>
              </div>
            )}
          </div>

          {/* Link / Update Credit Card Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>{adminCard.linked ? 'Update Linked Card' : 'Enter Card Details'}</span>
            </h3>

            <form onSubmit={handleLinkCard} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cardholder Full Name</label>
                <input 
                  type="text" 
                  required
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  placeholder="Daemyn Zaccur" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Number</label>
                <input 
                  type="text" 
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="4242 5555 6666 4242" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date (MM/YY)</label>
                  <input 
                    type="text" 
                    required
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    placeholder="12/28" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CVC Code</label>
                  <input 
                    type="password" 
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    placeholder="888" 
                    maxLength={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payout Settlement Currency</label>
                <select 
                  value={payoutCurrency}
                  onChange={e => setPayoutCurrency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="KES">KES - Kenyan Shillings (M-Pesa & Local Bank)</option>
                  <option value="USD">USD - United States Dollars (International)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{adminCard.linked ? 'Save & Update Payout Card' : 'Link Card for Merchant Payouts'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span>User Accounts & Privileges</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Control administrator permissions, premium subscriptions, and user accounts.</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto pr-1">
            {filteredUsers.map(u => (
              <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={u.avatar} alt={u.username} className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{u.name}</span>
                      <span className="text-sky-400 font-normal">@{u.username}</span>
                      {u.isAdmin && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold">
                          ADMIN
                        </span>
                      )}
                      {u.isPremium && <Crown className="w-3 h-3 text-amber-400 inline shrink-0" />}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {u.email} • {u.planType} • {u.followers.length} followers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {/* Grant / Revoke Premium */}
                  <button
                    onClick={() => {
                      onToggleUserPremium(u.id);
                      setAdminNotice(`Updated premium status for @${u.username}.`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      u.isPremium 
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900' 
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {u.isPremium ? 'Revoke Pro' : 'Grant Pro'}
                  </button>

                  {/* Toggle Admin role */}
                  <button
                    onClick={() => {
                      onToggleUserAdmin(u.id);
                      setAdminNotice(`Toggled Admin role for @${u.username}.`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      u.isAdmin 
                        ? 'bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900' 
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {u.isAdmin ? 'Admin' : 'Make Admin'}
                  </button>

                  {/* Delete user */}
                  {u.email !== 'zackjad34@gmail.com' && (
                    <button
                      onClick={() => {
                        onDeleteUser(u.id);
                        setAdminNotice(`User account @${u.username} removed.`);
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
