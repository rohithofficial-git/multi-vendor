'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useStore } from '../../store/useStore';
import { 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck,
  Truck,
  Smartphone,
  QrCode,
  Banknote,
  Copy,
  Check,
  AlertTriangle,
  IndianRupee
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PaymentMethod = 'cod' | 'upi' | 'qr';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, products, getBillingSummary, createOrder } = useStore();
  const billing = getBillingSummary();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Fix: use useEffect to avoid SSR/hydration issues with router.push
  useEffect(() => {
    if (cart.length === 0 && !completed) {
      router.push('/cart');
    }
  }, [cart.length, completed, router]);

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const prod = products.find(p => p.id === item.product_id);
      return { ...item, prod };
    }).filter(item => item.prod !== undefined);
  }, [cart, products]);

  const validateShipping = () => {
    const errors: Record<string, string> = {};
    if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingForm.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.state.trim()) errors.state = 'State is required';
    if (!shippingForm.zipCode.trim()) errors.zipCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(shippingForm.zipCode.trim())) errors.zipCode = 'Enter a valid 6-digit PIN code';
    if (!shippingForm.phone.trim()) errors.phone = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(shippingForm.phone.replace(/\s+/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) setStep(2);
  };

  const validatePayment = () => {
    if (paymentMethod === 'upi') {
      const id = upiId.trim();
      if (!id) { setUpiError('Please enter your UPI ID'); return false; }
      if (!/^[\w.\-]+@[\w]+$/.test(id)) { setUpiError('Enter a valid UPI ID (e.g., name@upi)'); return false; }
    }
    setUpiError('');
    return true;
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    function randomInRange(min: number, max: number) { return Math.random() * (max - min) + min; }
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  // Fix: wrapped in try/catch to handle errors, single processing delay
  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setOrderError('');
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const order = await createOrder(shippingForm, paymentMethod);
      setCompleted(true);
      triggerConfetti();
      setTimeout(() => { router.push(`/order/${order.id}`); }, 1800);
    } catch (err) {
      console.error('Order creation failed:', err);
      setOrderError('Something went wrong while placing your order. Please try again.');
      setProcessing(false);
    }
  };

  const handleCopyUpi = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const STORE_UPI_ID = 'multivendor@paytm';
  const codTotal = billing.total + 40;

  const paymentOptions: { id: PaymentMethod; title: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'upi', title: 'UPI Payment', subtitle: 'PhonePe, GPay, Paytm, BHIM & more', icon: <Smartphone className="h-5 w-5" />, badge: 'Instant' },
    { id: 'qr', title: 'Scan & Pay (QR)', subtitle: 'Scan QR code from any UPI app', icon: <QrCode className="h-5 w-5" /> },
    { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay with cash when your order arrives (+\u20B940)', icon: <Banknote className="h-5 w-5" /> }
  ];

  const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Progress Tracker Bar */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
          {[
            { s: 1, title: 'Delivery Address', icon: MapPin },
            { s: 2, title: 'Payment', icon: CreditCard },
            { s: 3, title: 'Review & Pay', icon: ShieldCheck }
          ].map((item) => {
            const isCurrent = step === item.s;
            const isCompleted = step > item.s || completed;
            const Icon = item.icon;
            return (
              <div key={item.s} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-brand border-brand text-white glow-effect' : 'border-theme-border text-theme-muted bg-theme-card/10'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold mt-2 text-theme-muted hidden sm:block">
                    {item.title}
                  </span>
                </div>
                {item.s < 3 && (
                  <div className={`h-0.5 flex-1 mx-4 border-t-2 border-dashed transition-all ${
                    isCompleted ? 'border-green-500' : 'border-theme-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          <div className="lg:col-span-8">
            
            {/* Step 1: Shipping / Delivery Address */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
                <h2 className="font-display text-lg font-bold text-theme-text flex items-center space-x-2 border-b border-theme-border pb-4">
                  <MapPin className="h-5 w-5 text-brand" />
                  <span>Delivery Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({...shippingForm, fullName: e.target.value})}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors ${shippingErrors.fullName ? 'border-red-500' : 'border-theme-border'}`}
                    />
                    {shippingErrors.fullName && <p className="text-[10px] text-red-400">{shippingErrors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-theme-muted font-bold select-none">+91</span>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                        className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors ${shippingErrors.phone ? 'border-red-500' : 'border-theme-border'}`}
                      />
                    </div>
                    {shippingErrors.phone && <p className="text-[10px] text-red-400">{shippingErrors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">House / Flat No., Building, Street, Area *</label>
                    <textarea
                      placeholder="e.g. 402, Cyber Dome, Outer Ring Road, Whitefield"
                      value={shippingForm.addressLine1}
                      onChange={(e) => setShippingForm({...shippingForm, addressLine1: e.target.value})}
                      rows={2}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors resize-none ${shippingErrors.addressLine1 ? 'border-red-500' : 'border-theme-border'}`}
                    />
                    {shippingErrors.addressLine1 && <p className="text-[10px] text-red-400">{shippingErrors.addressLine1}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">City / Town *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors ${shippingErrors.city ? 'border-red-500' : 'border-theme-border'}`}
                    />
                    {shippingErrors.city && <p className="text-[10px] text-red-400">{shippingErrors.city}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">State *</label>
                    <select
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors ${shippingErrors.state ? 'border-red-500' : 'border-theme-border'}`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {shippingErrors.state && <p className="text-[10px] text-red-400">{shippingErrors.state}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">PIN Code *</label>
                    <input
                      type="text"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value.replace(/\D/g, '')})}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors ${shippingErrors.zipCode ? 'border-red-500' : 'border-theme-border'}`}
                    />
                    {shippingErrors.zipCode && <p className="text-[10px] text-red-400">{shippingErrors.zipCode}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Country</label>
                    <input
                      type="text"
                      value="India"
                      readOnly
                      className="w-full rounded-xl border border-theme-border px-3.5 py-2.5 text-xs bg-theme-bg-from/20 outline-none text-theme-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between border-t border-theme-border/50">
                  <button
                    type="button"
                    onClick={() => router.push('/cart')}
                    className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5 inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-1 transition-all"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === 2 && (
              <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
                <h2 className="font-display text-lg font-bold text-theme-text flex items-center space-x-2 border-b border-theme-border pb-4">
                  <CreditCard className="h-5 w-5 text-brand" />
                  <span>Choose Payment Method</span>
                </h2>

                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setPaymentMethod(option.id); setUpiError(''); }}
                      className={`w-full rounded-2xl border-2 p-4 text-left transition-all group ${
                        paymentMethod === option.id
                          ? 'border-brand bg-brand/5 shadow-sm shadow-brand/10'
                          : 'border-theme-border bg-theme-card/5 hover:border-theme-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          paymentMethod === option.id ? 'bg-brand text-white' : 'bg-theme-card/30 text-theme-muted group-hover:bg-brand/10 group-hover:text-brand'
                        }`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-theme-text">{option.title}</h4>
                            {option.badge && (
                              <span className="text-[9px] uppercase font-bold bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-theme-muted mt-0.5">{option.subtitle}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          paymentMethod === option.id ? 'border-brand' : 'border-theme-border'
                        }`}>
                          {paymentMethod === option.id && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Detail Panels */}
                <div className={`rounded-2xl border p-5 space-y-4 transition-all ${
                  paymentMethod === 'cod' ? 'border-amber-500/20 bg-amber-500/5' :
                  paymentMethod === 'upi' ? 'border-brand/20 bg-brand/5' :
                  'border-violet-500/20 bg-violet-500/5'
                }`}>
                  
                  {/* UPI Panel */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs text-theme-muted">
                        <Smartphone className="h-4 w-4 text-brand" />
                        <span>Pay using your UPI ID from PhonePe, GPay, Paytm, BHIM, and more</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-theme-muted">Your UPI ID</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. name@ybl or 9876543210@paytm"
                            value={upiId}
                            onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                            className={`w-full rounded-xl border px-3.5 py-3 text-xs bg-theme-bg-from/50 outline-none focus:border-brand transition-colors pr-10 ${upiError ? 'border-red-500' : 'border-theme-border'}`}
                          />
                          <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                        </div>
                        {upiError && (
                          <p className="text-[10px] text-red-400 flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{upiError}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['@ybl', '@upi', '@paytm', '@okaxis', '@ibl'].map(suffix => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => { const base = upiId.split('@')[0] || ''; setUpiId(base + suffix); setUpiError(''); }}
                            className="text-[10px] font-semibold text-brand border border-brand/30 bg-brand/5 hover:bg-brand/15 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-theme-muted">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>Your UPI ID is encrypted. We never store payment credentials.</span>
                      </div>
                    </div>
                  )}

                  {/* QR Scanner Panel */}
                  {paymentMethod === 'qr' && (
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-theme-muted">Scan this QR code with any UPI app to pay</p>
                      <div className="inline-flex flex-col items-center">
                        <div className="p-3 bg-white rounded-2xl shadow-xl">
                          <div className="w-40 h-40">
                            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100" height="100" fill="white"/>
                              <rect x="5" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="3"/>
                              <rect x="10" y="10" width="18" height="18" fill="black"/>
                              <rect x="67" y="5" width="28" height="28" fill="none" stroke="black" strokeWidth="3"/>
                              <rect x="72" y="10" width="18" height="18" fill="black"/>
                              <rect x="5" y="67" width="28" height="28" fill="none" stroke="black" strokeWidth="3"/>
                              <rect x="10" y="72" width="18" height="18" fill="black"/>
                              <rect x="40" y="5" width="5" height="5" fill="black"/>
                              <rect x="50" y="5" width="5" height="5" fill="black"/>
                              <rect x="60" y="10" width="5" height="5" fill="black"/>
                              <rect x="40" y="15" width="5" height="5" fill="black"/>
                              <rect x="55" y="15" width="5" height="5" fill="black"/>
                              <rect x="40" y="25" width="5" height="5" fill="black"/>
                              <rect x="50" y="20" width="5" height="5" fill="black"/>
                              <rect x="60" y="25" width="5" height="5" fill="black"/>
                              <rect x="5" y="40" width="5" height="5" fill="black"/>
                              <rect x="15" y="40" width="5" height="5" fill="black"/>
                              <rect x="25" y="40" width="5" height="5" fill="black"/>
                              <rect x="5" y="50" width="5" height="5" fill="black"/>
                              <rect x="20" y="50" width="5" height="5" fill="black"/>
                              <rect x="30" y="50" width="5" height="5" fill="black"/>
                              <rect x="5" y="60" width="5" height="5" fill="black"/>
                              <rect x="15" y="55" width="5" height="5" fill="black"/>
                              <rect x="25" y="60" width="5" height="5" fill="black"/>
                              <rect x="40" y="40" width="5" height="5" fill="black"/>
                              <rect x="50" y="40" width="5" height="5" fill="black"/>
                              <rect x="60" y="40" width="5" height="5" fill="black"/>
                              <rect x="40" y="50" width="5" height="5" fill="black"/>
                              <rect x="55" y="50" width="5" height="5" fill="black"/>
                              <rect x="65" y="50" width="5" height="5" fill="black"/>
                              <rect x="45" y="60" width="5" height="5" fill="black"/>
                              <rect x="60" y="60" width="5" height="5" fill="black"/>
                              <rect x="75" y="40" width="5" height="5" fill="black"/>
                              <rect x="85" y="40" width="5" height="5" fill="black"/>
                              <rect x="75" y="55" width="5" height="5" fill="black"/>
                              <rect x="90" y="55" width="5" height="5" fill="black"/>
                              <rect x="80" y="60" width="5" height="5" fill="black"/>
                              <rect x="40" y="70" width="5" height="5" fill="black"/>
                              <rect x="50" y="75" width="5" height="5" fill="black"/>
                              <rect x="60" y="70" width="5" height="5" fill="black"/>
                              <rect x="75" y="70" width="5" height="5" fill="black"/>
                              <rect x="85" y="75" width="5" height="5" fill="black"/>
                              <rect x="90" y="80" width="5" height="5" fill="black"/>
                              <rect x="75" y="85" width="5" height="5" fill="black"/>
                              <rect x="43" y="43" width="14" height="14" rx="2" fill="white" stroke="black" strokeWidth="1"/>
                              <text x="50" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#6366f1">{"\u20B9"}</text>
                            </svg>
                          </div>
                          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-1">UPI QR Â· Scan & Pay</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="text-theme-muted">Pay to:</span>
                        <code className="font-mono font-bold text-theme-text bg-theme-card/20 border border-theme-border px-2 py-0.5 rounded-lg">{STORE_UPI_ID}</code>
                        <button
                          onClick={() => handleCopyUpi(STORE_UPI_ID)}
                          className="p-1.5 rounded-lg border border-theme-border hover:bg-brand/10 hover:border-brand/30 text-theme-muted hover:text-brand transition-all"
                        >
                          {copiedUpi ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-center space-x-1 text-sm font-bold text-theme-text">
                        <IndianRupee className="h-4 w-4" />
                        <span>{"\u20B9"}{billing.total}</span>
                      </div>
                      <p className="text-[10px] text-theme-muted max-w-xs mx-auto">After completing payment in your UPI app, click "Review Order" below.</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-theme-muted justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>Secured by NPCI. Payments encrypted end-to-end.</span>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Panel */}
                  {paymentMethod === 'cod' && (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                          <Truck className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-theme-text">Pay on Delivery</h4>
                          <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                            Pay with cash or card when your order arrives at your doorstep. A {"\u20B9"}40 handling fee applies for COD orders.
                          </p>
                        </div>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 space-y-2">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Important Notes</p>
                        <ul className="space-y-1.5">
                          {[
                            'Keep exact change ready for a smooth handover',
                            'COD handling charge: \u20B940 added to your total',
                            'Orders above \u20B910,000 may not be eligible for COD',
                            'Available at 18,000+ PIN codes across India'
                          ].map((note, i) => (
                            <li key={i} className="text-[10px] text-theme-muted flex items-start space-x-1.5">
                              <span className="h-1 w-1 rounded-full bg-amber-400/60 mt-1.5 shrink-0" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between border-t border-theme-border/50">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5 inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="rounded-xl bg-brand text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-1 transition-all"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Place Order */}
            {step === 3 && (
              <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
                <h2 className="font-display text-lg font-bold text-theme-text flex items-center space-x-2 border-b border-theme-border pb-4">
                  <ShieldCheck className="h-5 w-5 text-brand" />
                  <span>Review & Place Order</span>
                </h2>

                {/* Delivery Summary */}
                <div className="rounded-2xl border border-theme-border bg-theme-card/5 p-4 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Delivering To</span>
                    </span>
                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-brand hover:underline">Change</button>
                  </div>
                  <p className="text-sm font-bold text-theme-text">{shippingForm.fullName}</p>
                  <p className="text-xs text-theme-muted">{shippingForm.addressLine1}, {shippingForm.city}, {shippingForm.state} â€” {shippingForm.zipCode}</p>
                  <p className="text-xs text-theme-muted">+91 {shippingForm.phone}</p>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl border border-theme-border bg-theme-card/5 p-4 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider flex items-center space-x-1">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Payment Method</span>
                    </span>
                    <button onClick={() => setStep(2)} className="text-[10px] font-bold text-brand hover:underline">Change</button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      {paymentMethod === 'cod' ? <Banknote className="h-4 w-4" /> : paymentMethod === 'upi' ? <Smartphone className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-theme-text">
                        {paymentMethod === 'cod' ? 'Cash on Delivery (+\u20B940)' : paymentMethod === 'upi' ? 'UPI Payment' : 'Scan & Pay (QR)'}
                      </p>
                      {paymentMethod === 'upi' && upiId && <p className="text-[10px] text-theme-muted">{upiId}</p>}
                    </div>
                  </div>
                </div>

                {/* Error */}
                {orderError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{orderError}</p>
                  </div>
                )}

                {/* Place Order Button */}
                <div className="pt-2 space-y-4">
                  <button
                    disabled={processing || completed}
                    onClick={handlePlaceOrder}
                    className="w-full rounded-2xl bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 text-sm font-bold inline-flex items-center justify-center space-x-2 shadow-xl shadow-brand/20 transition-all duration-300"
                  >
                    {processing ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : completed ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Order Placed! Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <IndianRupee className="h-4 w-4" />
                        <span>Place Order · {"\u20B9"}{paymentMethod === 'cod' ? codTotal.toFixed(2) : billing.total}</span>
                      </>
                    )}
                  </button>
                  <div className="flex justify-center">
                    <button
                      disabled={processing || completed}
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-theme-muted hover:text-theme-text disabled:opacity-40 inline-flex items-center space-x-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Change Payment Method</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-[9px] text-theme-muted border-t border-theme-border/40 pt-3">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>Your payment & personal data is 100% secure. Easy 30-day returns.</span>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border pb-3 flex items-center space-x-1.5">
              <ShoppingBag className="h-4 w-4 text-brand" />
              <span>Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-theme-border/40 pr-1">
              {cartItems.map((item: any, index) => (
                <div key={index} className="flex items-center space-x-3 pt-3 first:pt-0">
                  <img src={item.prod.images[0]} alt={item.prod.title} className="h-12 w-12 rounded-xl object-cover border border-theme-border/50" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-theme-text truncate">{item.prod.title}</h4>
                    <span className="text-[10px] text-theme-muted block">{item.variant || 'Default'} Ã— {item.quantity}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand shrink-0">{"\u20B9"}{Math.round(item.prod.price * item.quantity * 100) / 100}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-theme-border/50 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-theme-muted">
                <span>Price ({cartItems.length} items)</span>
                <span>{"\u20B9"}{billing.subtotal}</span>
              </div>
              {billing.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-{"\u20B9"}{billing.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-theme-muted">
                <span>GST (18%)</span>
                <span>{"\u20B9"}{billing.gst}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Delivery</span>
                <span className={billing.shipping === 0 ? 'text-green-400 font-semibold' : ''}>{billing.shipping === 0 ? 'FREE' : `\u20B9${billing.shipping}`}</span>
              </div>
              {paymentMethod === 'cod' && step >= 2 && (
                <div className="flex justify-between text-amber-400">
                  <span>COD Charges</span>
                  <span>{"\u20B9"}40</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-theme-text pt-2.5 border-t border-theme-border/30">
                <span>Total Amount</span>
                <span className="text-brand text-base">{"\u20B9"}{paymentMethod === 'cod' && step >= 2 ? codTotal.toFixed(2) : billing.total}</span>
              </div>
              {billing.discount > 0 && (
                <p className="text-[10px] text-green-400 font-semibold text-center bg-green-500/5 border border-green-500/10 rounded-lg py-1.5">
                  🎉 You save {"\u20B9"}{billing.discount} on this order!
                </p>
              )}
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[9px] text-theme-muted border-t border-theme-border/40 pt-3">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Safe &amp; Secure Payments. Easy 30-day returns.</span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
