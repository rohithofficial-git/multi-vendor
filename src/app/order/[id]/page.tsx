'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useStore } from '../../../store/useStore';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Download, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTracking({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrapping params Promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { orders, products, updateOrderStatus } = useStore();

  const order = useMemo(() => {
    return orders.find(o => o.id === id);
  }, [orders, id]);

  const orderItems = useMemo(() => {
    if (!order) return [];
    return order.items.map(item => {
      const prod = products.find(p => p.id === item.product_id);
      return { ...item, prod };
    });
  }, [order, products]);

  // Handle Dynamic Courier advancing for previewing
  const advanceStatus = () => {
    if (!order) return;
    const stages: Array<typeof order.shipping_status> = [
      'placed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered'
    ];
    const currentIndex = stages.indexOf(order.shipping_status);
    if (currentIndex < stages.length - 1) {
      updateOrderStatus(order.id, stages[currentIndex + 1]);
    }
  };

  const resetStatus = () => {
    if (!order) return;
    // Set back to placed
    updateOrderStatus(order.id, 'placed');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-xl font-bold text-theme-text">Order log not found</h2>
          <p className="text-xs text-theme-muted mt-2">The requested order ID could not be loaded from local DB.</p>
          <Link href="/" className="rounded-xl bg-brand text-white px-5 py-2.5 text-xs font-semibold mt-4">
            Return Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const stages = [
    { key: 'placed', label: 'Order Placed', desc: 'Secure blockchain receipt confirmed.' },
    { key: 'packed', label: 'Artisan Packaged', desc: 'Technical audits and quality signs completed.' },
    { key: 'shipped', label: 'Cargo In Transit', desc: 'Freight systems dispatched from local docks.' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier runner carrying cargo locally.' },
    { key: 'delivered', label: 'Drop Secured', desc: 'Successful biometric sign-off reported.' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === order.shipping_status);

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
        
        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            header, footer, nav, button, .no-print {
              display: none !important;
            }
            main {
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .glass-panel {
              background: none !important;
              border: none !important;
              box-shadow: none !important;
              color: black !important;
            }
            .text-brand {
              color: black !important;
            }
          }
        `}} />

        {/* Dynamic Courier Advancer Admin Panel - Hidden during print */}
        <div className="no-print glass-panel rounded-3xl p-5 border border-brand/20 bg-brand/5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <Sparkles className="h-5 w-5 text-brand animate-pulse" />
            <div>
              <h3 className="text-sm font-semibold text-theme-text">Courier Logistics Simulator</h3>
              <p className="text-xs text-theme-muted">Cycle courier stages to inspect progress animations.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={resetStatus}
              className="flex-1 sm:flex-initial rounded-xl border border-theme-border bg-theme-card/30 hover:bg-theme-card/60 px-4 py-2 text-xs font-semibold text-theme-text transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 inline mr-1" />
              <span>Reset</span>
            </button>
            <button
              onClick={advanceStatus}
              disabled={order.shipping_status === 'delivered'}
              className="flex-grow sm:flex-initial rounded-xl bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 text-xs font-semibold inline-flex items-center justify-center space-x-1.5 shadow-lg shadow-brand/15"
            >
              <span>Advance Status</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Order Details Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-theme-border pb-6 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Logistics Ledger ID</span>
            <h1 className="font-display text-3xl font-extrabold text-theme-text mt-1">Order #{order.id}</h1>
            <p className="text-xs text-theme-muted mt-1">Processed on {new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="no-print flex items-center space-x-3">
            <button
              onClick={handlePrintInvoice}
              className="rounded-xl border border-theme-border bg-theme-card/30 hover:bg-theme-card/60 px-4 py-2.5 text-xs text-theme-text font-bold inline-flex items-center space-x-1.5 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tracking progress Timeline Column */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-theme-border space-y-8">
            <h2 className="font-display text-base font-bold text-theme-text border-b border-theme-border pb-3">
              Freighter Progress Timeline
            </h2>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-theme-border/60 ml-3 space-y-8">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;
                
                // Find custom log timing
                const historyEntry = order.tracking_history.find(h => h.status === stage.key);
                const timeStr = historyEntry 
                  ? new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div key={stage.key} className="relative">
                    
                    {/* Circle Node */}
                    <div className={`absolute -left-[35px] sm:-left-[43px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isPassed ? 'bg-green-500 border-green-500 text-white' :
                      isCurrent ? 'bg-brand border-brand text-white glow-effect animate-pulse' : 'border-theme-border bg-theme-bg-from text-theme-muted'
                    }`}>
                      {isPassed ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h4 className={`text-sm font-bold transition-colors ${isPassed ? 'text-theme-text' : 'text-theme-muted'}`}>
                          {stage.label}
                        </h4>
                        <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">
                          {isPassed ? (historyEntry?.description || stage.desc) : 'Pending shipment node audit.'}
                        </p>
                      </div>
                      {timeStr && (
                        <span className="text-[10px] bg-theme-card/25 border border-theme-border px-2 py-0.5 rounded text-theme-muted font-mono shrink-0">
                          {timeStr}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics Address & Details Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery address */}
            <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text border-b border-theme-border pb-3 flex items-center space-x-1.5">
                <MapPin className="h-4.5 w-4.5 text-brand" />
                <span>Shipping Address</span>
              </h3>

              <div className="text-xs text-theme-muted space-y-1">
                <strong className="text-theme-text block text-sm">{order.shipping_address.fullName}</strong>
                <span>{order.shipping_address.addressLine1}</span>
                <span className="block">{order.shipping_address.city}, {order.shipping_address.state}</span>
                <span className="block">{order.shipping_address.zipCode}, {order.shipping_address.country}</span>
                <span className="block pt-2">Phone: {order.shipping_address.phone}</span>
              </div>
            </div>

            {/* Items review list */}
            <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text border-b border-theme-border pb-3 flex items-center space-x-1.5">
                <ShoppingBag className="h-4.5 w-4.5 text-brand" />
                <span>Artifact Audit</span>
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {orderItems.map((item: any, idx) => (
                  <div key={idx} className="flex items-center space-x-3 border-b border-theme-border/20 last:border-0 pb-3 last:pb-0">
                    {item.prod && (
                      <img src={item.prod.images[0]} alt={item.title} className="h-9 w-9 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-theme-text truncate">{item.title}</h4>
                      <span className="text-[10px] text-theme-muted block">{item.variant || 'Default'} × {item.quantity}</span>
                    </div>
                    <span className="text-xs font-bold text-brand">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total calculations list */}
              <div className="border-t border-theme-border/40 pt-4 space-y-2 text-[11px] text-theme-muted">
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${order.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Luxury GST (18%)</span>
                  <span>${order.gst_amount}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-theme-text border-t border-theme-border/25 pt-2">
                  <span>Grand Total Paid</span>
                  <span className="text-brand text-base">${order.total_amount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
