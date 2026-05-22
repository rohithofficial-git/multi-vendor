'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useStore } from '../../store/useStore';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Percent, 
  Tag, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function ShoppingCart() {
  const router = useRouter();
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    getBillingSummary
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);

  // Populate actual product items inside the cart
  const cartItems = useMemo(() => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product
      };
    }).filter(item => item.product !== undefined);
  }, [cart, products]);

  const billing = getBillingSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    } else {
      setCouponError(true);
    }
  };

  const hasItems = cartItems.length > 0;

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <h1 className="font-display text-3xl font-extrabold text-theme-text mb-8">Shopping Bag</h1>

        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item: any, idx) => {
                const prod = item.product;
                const isLimit = prod.inventory <= item.quantity;
                
                return (
                  <div 
                    key={`${item.product_id}-${item.variant || idx}`}
                    className="glass-panel rounded-3xl p-5 border border-theme-border flex flex-col sm:flex-row items-center gap-6 relative group"
                  >
                    {/* Thumbnail */}
                    <img 
                      src={prod.images[0]} 
                      alt={prod.title} 
                      className="h-24 w-24 rounded-2xl object-cover border border-theme-border/50 shrink-0" 
                    />

                    {/* Meta info */}
                    <div className="flex-grow w-full space-y-1">
                      <span className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">{prod.category}</span>
                      <Link href={`/products/${prod.id}`} className="font-display text-base font-bold text-theme-text hover:text-brand block">
                        {prod.title}
                      </Link>
                      
                      {item.variant && (
                        <span className="inline-block text-[10px] bg-brand/10 border border-brand/20 text-brand px-2.5 py-0.5 rounded-full font-semibold">
                          {item.variant}
                        </span>
                      )}

                      {/* Stock warnings */}
                      {isLimit && (
                        <div className="flex items-center space-x-1 text-[10px] text-amber-400 mt-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>Maximum available catalog stock reached.</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3 bg-black/20 border border-theme-border rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity - 1, item.variant)}
                        className="p-1 hover:bg-white/5 rounded-lg text-theme-muted hover:text-theme-text"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity + 1, item.variant)}
                        disabled={isLimit}
                        className={`p-1 rounded-lg text-theme-muted hover:text-theme-text ${isLimit ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-theme-border/50 pt-4 sm:pt-0 sm:pl-6 shrink-0 space-y-0 sm:space-y-3">
                      <div className="text-right">
                        <span className="text-xs text-theme-muted block">Total</span>
                        <span className="text-base font-bold text-brand">${Math.round(prod.price * item.quantity * 100) / 100}</span>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.product_id, item.variant)}
                        className="p-2 text-theme-muted hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Billing Summary Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Coupon box */}
              <div className="glass-panel rounded-3xl p-5 border border-theme-border space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-theme-text">
                  <Tag className="h-4 w-4 text-brand" />
                  <span>Promo Codes</span>
                </div>

                {activeCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-green-500/10 border border-green-500/20 px-3.5 py-2.5 text-xs text-green-400 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Percent className="h-3.5 w-3.5" />
                      <span>{activeCoupon.code} applied ({activeCoupon.discountPercent}% Off)</span>
                    </span>
                    <button 
                      onClick={removeCoupon}
                      className="text-xs hover:underline uppercase font-bold text-green-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NEON50"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                      className="flex-grow rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2 text-xs text-theme-text outline-none focus:border-brand"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-brand text-white px-4 py-2 text-xs font-semibold hover:bg-brand-hover transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <div className="text-[10px] text-red-400 font-semibold">
                    Invalid coupon. Active keys: NEON50, STARTUP20, WELCOME10.
                  </div>
                )}
              </div>

              {/* Financial calculations */}
              <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border pb-4">
                  Bag Summary
                </h3>

                <div className="space-y-3 text-xs">
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
                    <span>Luxury GST (18%)</span>
                    <span>${billing.gst}</span>
                  </div>

                  <div className="flex justify-between text-theme-muted">
                    <span>Secure Freight Shipping</span>
                    <span>{billing.shipping === 0 ? <strong className="text-green-400">FREE</strong> : `$${billing.shipping}`}</span>
                  </div>

                  <div className="border-t border-theme-border/50 pt-4 flex justify-between text-sm font-extrabold text-theme-text">
                    <span>Grand Total</span>
                    <span className="text-brand text-lg">${billing.total}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-brand hover:bg-brand-hover py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/10 hover:shadow-brand/20 transition-all duration-300"
                  >
                    <span>Secure Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-theme-muted">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Authorized checkout ledger secured by cryptograph.</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center border border-theme-border flex flex-col items-center justify-center max-w-lg mx-auto">
            <ShoppingBag className="h-12 w-12 text-theme-muted/30 mb-4" />
            <h3 className="font-display text-lg font-bold text-theme-text">Shopping bag empty</h3>
            <p className="text-xs text-theme-muted mt-2">
              Browse our dynamic curation catalog to add high-performance artifacts.
            </p>
            <Link
              href="/products"
              className="rounded-xl bg-brand hover:bg-brand-hover text-white px-6 py-2.5 text-xs font-semibold mt-6 transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
