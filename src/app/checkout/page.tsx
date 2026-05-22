'use client';

import React, { useState, useMemo } from 'react';
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
  Lock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, products, getBillingSummary, createOrder } = useStore();
  const billing = getBillingSummary();

  // Redirect if cart empty
  if (cart.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
  }

  // Steps: 1 = Shipping, 2 = Payment Options, 3 = Gateway Simulation
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'upi'>('stripe');
  
  // Shipping Form
  const [shippingForm, setShippingForm] = useState({
    fullName: 'Vanguard Alpha',
    addressLine1: '402 Cyber Dome, Outer Ring Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560103',
    country: 'India',
    phone: '+91 98765 43210'
  });

  // Gateway Simulation Mock Credentials
  const [stripeCard, setStripeCard] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '424'
  });
  const [upiId, setUpiId] = useState('alpha@ybl');

  // Simulation loading / status states
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayCompleted, setGatewayCompleted] = useState(false);

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const prod = products.find(p => p.id === item.product_id);
      return { ...item, prod };
    }).filter(item => item.prod !== undefined);
  }, [cart, products]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, animate a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleProcessPayment = async () => {
    setGatewayProcessing(true);
    
    // Simulate transaction handshake lag
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGatewayProcessing(false);
    setGatewayCompleted(true);
    triggerConfetti();

    // Secure database record creation
    const order = await createOrder(shippingForm, paymentMethod);

    // Short wait to read checkmark before redirect
    setTimeout(() => {
      router.push(`/order/${order.id}`);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Progress Tracker Bar */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
          {[
            { s: 1, title: 'Shipping Logistics', icon: MapPin },
            { s: 2, title: 'Secure Payment', icon: CreditCard },
            { s: 3, title: 'Authorized Gateway', icon: ShieldCheck }
          ].map((item) => {
            const isCurrent = step === item.s;
            const isCompleted = step > item.s || gatewayCompleted;
            const Icon = item.icon;

            return (
              <div key={item.s} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-brand border-brand text-white glow-effect' : 'border-theme-border text-theme-muted bg-theme-card/10'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold mt-2 text-theme-muted hidden sm:block">
                    {item.title}
                  </span>
                </div>
                {item.s < 3 && (
                  <div className={`h-0.5 flex-1 mx-4 border-t border-dashed transition-all ${
                    isCompleted ? 'border-green-500' : 'border-theme-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Main forms box */}
          <div className="lg:col-span-8">
            
            {/* Step 1: Shipping Form */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
                <h2 className="font-display text-lg font-bold text-theme-text flex items-center space-x-2 border-b border-theme-border pb-3">
                  <MapPin className="h-5 w-5 text-brand" />
                  <span>Shipping Logistics Ledger</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({...shippingForm, fullName: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Address Line</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.addressLine1}
                      onChange={(e) => setShippingForm({...shippingForm, addressLine1: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">City</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">State / Region</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-theme-muted">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm({...shippingForm, country: e.target.value})}
                      className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between border-t border-theme-border/50">
                  <button
                    type="button"
                    onClick={() => router.push('/cart')}
                    className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5"
                  >
                    Return to Bag
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-1"
                  >
                    <span>Configure Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment Selector Form */}
            {step === 2 && (
              <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
                <h2 className="font-display text-lg font-bold text-theme-text flex items-center space-x-2 border-b border-theme-border pb-3">
                  <CreditCard className="h-5 w-5 text-brand" />
                  <span>Secure Payment Gateways</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'stripe' as const, title: 'Stripe Gateway', desc: 'Secure card transaction portal' },
                      { id: 'razorpay' as const, title: 'Razorpay UPI', desc: 'Instant UPI/Card checkout node' },
                      { id: 'upi' as const, title: 'Direct VPA Node', desc: 'Simulate instant UPI callbacks' }
                    ].map((gate) => (
                      <button
                        key={gate.id}
                        onClick={() => setPaymentMethod(gate.id)}
                        className={`rounded-2xl border p-4 text-left transition-all relative overflow-hidden ${
                          paymentMethod === gate.id
                            ? 'border-brand bg-brand/10 shadow-md'
                            : 'border-theme-border bg-theme-card/10 hover:border-theme-muted'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-theme-text">{gate.title}</h4>
                        <p className="text-[10px] text-theme-muted mt-1 leading-normal">{gate.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Payment option details block */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-theme-border space-y-4">
                    {paymentMethod === 'stripe' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] uppercase font-bold text-theme-muted">Card Number</label>
                          <input
                            type="text"
                            value={stripeCard.number}
                            onChange={(e) => setStripeCard({...stripeCard, number: e.target.value})}
                            className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-theme-muted">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={stripeCard.expiry}
                            onChange={(e) => setStripeCard({...stripeCard, expiry: e.target.value})}
                            className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs text-center outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'razorpay' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 flex items-center space-x-1.5">
                          <AlertCircle className="h-4 w-4" />
                          <span>Razorpay API overlay triggered. Ready to parse callbacks.</span>
                        </span>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="space-y-1 max-w-sm">
                        <label className="text-[9px] uppercase font-bold text-theme-muted">UPI Virtual Private Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-between border-t border-theme-border/50">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="rounded-xl bg-brand text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-1"
                  >
                    <span>Audit Order & Pay</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Gateway Sim Overlay / Confirm */}
            {step === 3 && (
              <div className="glass-panel rounded-3xl p-6 border border-theme-border text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 border border-brand/20 text-brand">
                  <Lock className="h-6 w-6" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-display text-lg font-bold text-theme-text">Authorize Digital Handoff</h3>
                  <p className="text-xs text-theme-muted">
                    Your shipment will dispatch to {shippingForm.fullName} at {shippingForm.city}, {shippingForm.state}. Payment method configured: <strong className="uppercase">{paymentMethod}</strong>.
                  </p>
                </div>

                <div className="flex justify-center gap-3 border-t border-theme-border/50 pt-6">
                  <button
                    disabled={gatewayProcessing || gatewayCompleted}
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5 disabled:opacity-40"
                  >
                    Change options
                  </button>
                  <button
                    disabled={gatewayProcessing || gatewayCompleted}
                    onClick={handleProcessPayment}
                    className="rounded-xl bg-brand text-white px-8 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-2 shadow-lg shadow-brand/20"
                  >
                    {gatewayProcessing ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />
                        <span>Verifying...</span>
                      </>
                    ) : gatewayCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Success!</span>
                      </>
                    ) : (
                      <span>Secure Payment Handoff (${billing.total})</span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border pb-3 flex items-center space-x-1.5">
              <ShoppingBag className="h-4.5 w-4.5 text-brand" />
              <span>Cart items ({cart.length})</span>
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-theme-border/40 pr-1">
              {cartItems.map((item: any, index) => (
                <div key={index} className="flex items-center space-x-3 pt-3 first:pt-0">
                  <img src={item.prod.images[0]} alt={item.prod.title} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-theme-text truncate">{item.prod.title}</h4>
                    <span className="text-[10px] text-theme-muted block">{item.variant || 'Default'} × {item.quantity}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand">${Math.round(item.prod.price * item.quantity * 100) / 100}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-theme-border/50 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-theme-muted">
                <span>Subtotal</span>
                <span>${billing.subtotal}</span>
              </div>
              {billing.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${billing.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-theme-muted">
                <span>GST (18%)</span>
                <span>${billing.gst}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Secure Freight</span>
                <span>{billing.shipping === 0 ? 'FREE' : `$${billing.shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-theme-text pt-2 border-t border-theme-border/20">
                <span>Amount Due</span>
                <span className="text-brand text-base">${billing.total}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[9px] text-theme-muted border-t border-theme-border/40 pt-3">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Insured by decentralized logistics ledger rules.</span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
