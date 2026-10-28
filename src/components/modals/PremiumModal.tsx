import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../../types';
import { 
  X, 
  Crown, 
  Check, 
  Smartphone, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw,
  Download,
  Zap,
  Star
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpgradeSuccess: (newPlan: string, tx: Transaction) => void;
  onRequireAuth: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeSuccess,
  onRequireAuth
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'Pro Creator' | 'VIP Ultimate'>('Pro Creator');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  
  // M-Pesa form
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  
  // Card form
  const [cardNumber, setCardNumber] = useState('4242 8888 9999 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Daemyn Zaccur');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Checkout flow states: 'form' | 'processing' | 'stk_waiting' | 'success'
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'stk_waiting' | 'success'>('form');
  const [mpesaCountdown, setMpesaCountdown] = useState(15);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep('form');
      setMpesaCountdown(15);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkoutStep === 'stk_waiting' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown(prev => prev - 1);
      }, 1000);
    } else if (checkoutStep === 'stk_waiting' && mpesaCountdown === 0) {
      // Auto-confirm M-Pesa STK push
      handleCompletePayment();
    }
    return () => clearTimeout(timer);
  }, [checkoutStep, mpesaCountdown]);

  if (!isOpen) return null;

  const handleStartCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      onRequireAuth();
      return;
    }

    if (paymentMethod === 'mpesa') {
      // Initiate M-Pesa STK push simulation
      setCheckoutStep('stk_waiting');
      setMpesaCountdown(8);
    } else {
      // Card payment
      setCheckoutStep('processing');
      setTimeout(() => {
        handleCompletePayment();
      }, 1500);
    }
  };

  const handleCompletePayment = () => {
    if (!currentUser) return;

    const receiptNo = 'MP' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTransaction: Transaction = {
      id: 'tx-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      plan: selectedPlan,
      amount: 'Ksh 60',
      currency: 'KES',
      paymentMethod: paymentMethod === 'mpesa' 
        ? `M-Pesa STK (${mpesaPhone.slice(-9)}) - Ref: ${receiptNo}` 
        : `Card (${cardNumber.replace(/\s/g, '').slice(-4)})`,
      status: 'Completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setCompletedTx(newTransaction);
    setCheckoutStep('success');
    onUpgradeSuccess(selectedPlan, newTransaction);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card max-w-xl w-full p-6 sm:p-7 rounded-3xl border border-amber-500/40 relative shadow-2xl my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Plan Selection & Payment Form */}
        {checkoutStep === 'form' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
                <Crown className="w-6 h-6 text-slate-950" />
              </div>
              <h3 className="font-black text-2xl text-white">Upgrade to Zackjad Premium</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Elevate your visual portfolio with 4K media reels, verified creator badge, priority feed placement, and custom moodboards.
              </p>
            </div>

            {/* Plans Switcher */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div 
                onClick={() => setSelectedPlan('Pro Creator')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedPlan === 'Pro Creator' 
                    ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> Pro Creator
                  </p>
                  {selectedPlan === 'Pro Creator' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </div>
                <p className="text-xl font-black text-amber-400 mt-1">
                  Ksh 60<span className="text-xs text-slate-400 font-normal">/month</span>
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1.5 mt-3">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Verified Creator Badge</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 1080p Video Reels Upload</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Priority Feed Algorithm</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Moodboard Collections</li>
                </ul>
              </div>

              <div 
                onClick={() => setSelectedPlan('VIP Ultimate')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedPlan === 'VIP Ultimate' 
                    ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" /> VIP Ultimate
                  </p>
                  {selectedPlan === 'VIP Ultimate' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </div>
                <p className="text-xl font-black text-amber-400 mt-1">
                  Ksh 60<span className="text-xs text-slate-400 font-normal">/month</span>
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1.5 mt-3">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> All Pro Creator Benefits</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 4K Ultra-HD Video Uploads</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Gold VIP Crown Aura</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Unlimited High-Res Downloads</li>
                </ul>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handleStartCheckout} className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'mpesa' 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Safaricom M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'card' 
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit Card</span>
                </button>
              </div>

              {/* M-PESA FORM */}
              {paymentMethod === 'mpesa' ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">Lipa na M-Pesa Online (STK Push)</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                      Paybill: 522522
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      M-Pesa Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      required 
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full bg-slate-900 border border-emerald-700/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono tracking-wide"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      You will receive an instant STK PIN prompt on your phone to authorize Ksh 60.
                    </p>
                  </div>
                </div>
              ) : (
                /* CREDIT CARD FORM */
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-sky-400">Card Payment Gateway</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      required 
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Daemyn Zaccur"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500 tracking-wider"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVC / CVV</label>
                      <input 
                        type="text" 
                        required 
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 py-3 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay Ksh 60 & Activate {selectedPlan}</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: M-PESA STK PUSH WAITING DIALOG */}
        {checkoutStep === 'stk_waiting' && (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-8 h-8 animate-bounce text-emerald-400" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">M-Pesa STK Push Sent!</h4>
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Check your phone <span className="font-mono text-emerald-400 font-bold">{mpesaPhone}</span>. A prompt from <strong className="text-white">Zackjad Media</strong> has been sent requesting your M-Pesa PIN for <strong className="text-emerald-400">Ksh 60</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 max-w-sm mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Waiting for PIN authorization</span>
                <span className="font-mono text-emerald-400 font-bold">{mpesaCountdown}s</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(mpesaCountdown / 8) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleCompletePayment}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I have entered my PIN</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep('form')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CARD PROCESSING SPINNER */}
        {checkoutStep === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <RotateCw className="w-10 h-10 text-sky-400 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-white">Authorizing Payment...</h4>
            <p className="text-xs text-slate-400">Securely charging Ksh 60 via 3D Secure protocol</p>
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {checkoutStep === 'success' && completedTx && (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
                MEMBERSHIP ACTIVATED
              </span>
              <h3 className="text-2xl font-black text-white mt-2">Welcome to {selectedPlan}!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your account now has creator badge verification, HD reels, and priority discovery.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-200">{completedTx.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-semibold text-emerald-400">{completedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Amount Settled:</span>
                <span className="font-black text-white">{completedTx.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">Paid & Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Start Creating with {selectedPlan}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
