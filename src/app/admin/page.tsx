'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  Check, 
  XCircle, 
  TrendingUp, 
  Activity,
  Heart,
  Package,
  LayoutDashboard,
  Paintbrush
} from 'lucide-react';

export default function AdminControlCenter() {
  const router = useRouter();
  const { 
    sellers, 
    products, 
    orders, 
    isAuthenticated,
    isInitialized,
    currentRole,
    approveSeller, 
    suspendSeller,
    logout,
    activeTheme,
    setTheme
  } = useStore();

  const cycleTheme = () => {
    const themes: ('dark-luxury' | 'light-minimal' | 'cyberpunk')[] = [
      'dark-luxury',
      'light-minimal',
      'cyberpunk'
    ];
    const currentIndex = themes.indexOf(activeTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'merchants' | 'products' | 'orders'>('dashboard');

  useEffect(() => { setMounted(true); }, []);

  // Auth guard - admin only
  useEffect(() => {
    if (mounted && isInitialized && (!isAuthenticated || currentRole !== 'admin')) {
      window.location.href = '/admin/login';
    }
  }, [mounted, isInitialized, isAuthenticated, currentRole]);

  // Metrics
  const activeSellersCount = useMemo(() => {
    return sellers.filter(s => s.status === 'approved').length;
  }, [sellers]);

  const pendingSellers = useMemo(() => {
    return sellers.filter(s => s.status === 'pending');
  }, [sellers]);

  const totalSalesVolume = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.total_amount, 0);
  }, [orders]);

  // Fraud alerts logic
  const fraudAlerts = useMemo(() => {
    const alerts: Array<{ id: string; type: 'stock' | 'rating' | 'price'; message: string; severity: 'high' | 'medium' }> = [];
    
    products.forEach(p => {
      if (p.inventory === 0) {
        alerts.push({
          id: `frd-stock-${p.id}`,
          type: 'stock',
          message: `Artifact '${p.title}' inventory depleted (0 left). Potential delivery block.`,
          severity: 'medium'
        });
      }
      if (p.reviews_count > 0 && p.average_rating < 3) {
        alerts.push({
          id: `frd-rating-${p.id}`,
          type: 'rating',
          message: `Artifact '${p.title}' rating alert: average score fell to ${p.average_rating}★.`,
          severity: 'high'
        });
      }
    });

    sellers.forEach(s => {
      if (s.status === 'suspended') {
        alerts.push({
          id: `frd-seller-${s.id}`,
          type: 'price',
          message: `Studio '${s.studio_name}' compliance status: Suspended.`,
          severity: 'high'
        });
      }
    });

    return alerts;
  }, [products, sellers]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-theme-bg-from text-theme-text transition-colors duration-500">
      {/* Admin Top Bar */}
      <header className="border-b border-theme-border bg-theme-card/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-7 w-7 text-brand" />
          <span className="font-display font-extrabold tracking-widest text-theme-text text-xl">SYSTEM ADMIN</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={cycleTheme}
            className="group relative rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text hover:border-brand hover:bg-brand/10 transition-all duration-300"
            title="Cycle Accent Palette"
          >
            <Paintbrush className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </button>

          <button 
            onClick={() => { logout(); router.push('/admin/login'); }}
            className="text-xs font-semibold text-brand hover:text-brand-hover border border-brand/30 px-3 py-1.5 rounded bg-brand/10 hover:bg-brand/20 transition-colors uppercase tracking-widest"
          >
            Terminate Session
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {!isInitialized ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-xs font-semibold text-theme-muted uppercase tracking-widest">Initializing Control Center...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header Block */}
            <div className="border-b border-theme-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full inline-block">
              Moderator Command Center
            </span>
            <h1 className="font-display text-3xl font-extrabold text-theme-text mt-2">Admin Control Panel</h1>
            <p className="text-xs text-theme-muted mt-1">Manage the platform, verify merchants, and monitor system health.</p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex w-full md:w-auto overflow-x-auto bg-theme-card/50 p-1 rounded-xl border border-theme-border/50 backdrop-blur-md self-start md:self-auto no-scrollbar space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard' ? 'bg-brand/20 text-brand' : 'text-theme-muted hover:text-theme-text hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'merchants' ? 'bg-brand/20 text-brand' : 'text-theme-muted hover:text-theme-text hover:bg-white/5'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Merchants</span>
              {pendingSellers.length > 0 && (
                <span className="ml-1 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingSellers.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'products' ? 'bg-brand/20 text-brand' : 'text-theme-muted hover:text-theme-text hover:bg-white/5'
              }`}
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-brand/20 text-brand' : 'text-theme-muted hover:text-theme-text hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </button>
          </div>
        </div>

        {/* --- TAB: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Global stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel rounded-3xl p-5 border border-theme-border hover:border-brand/30 transition-colors">
                <span className="text-xs font-semibold text-theme-muted block">Transaction Volume</span>
                <span className="text-xl font-extrabold text-brand font-mono block mt-1">${Math.round(totalSalesVolume * 100) / 100}</span>
                <span className="text-[10px] text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+18.4% monthly velocity</span>
                </span>
              </div>

              <div className="glass-panel rounded-3xl p-5 border border-theme-border hover:border-brand/30 transition-colors">
                <span className="text-xs font-semibold text-theme-muted block">Active Studios</span>
                <span className="text-xl font-extrabold text-theme-text font-mono block mt-1">{activeSellersCount} verified</span>
                <span className="text-[10px] text-theme-muted mt-1 block">{pendingSellers.length} applications pending</span>
              </div>

              <div className="glass-panel rounded-3xl p-5 border border-theme-border hover:border-brand/30 transition-colors">
                <span className="text-xs font-semibold text-theme-muted block">Catalog Registry</span>
                <span className="text-xl font-extrabold text-theme-text font-mono block mt-1">{products.length} artifacts</span>
                <span className="text-[10px] text-theme-muted mt-1 block">Platform wide inventory</span>
              </div>

              <div className="glass-panel rounded-3xl p-5 border border-theme-border hover:border-brand/30 transition-colors">
                <span className="text-xs font-semibold text-theme-muted block">Ledger Status</span>
                <span className="text-xl font-extrabold text-theme-text font-mono block mt-1">Synchronized</span>
                <span className="text-[10px] text-green-400 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  <span>Latencies: 4ms online</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Compliance warnings */}
              <div className="space-y-6">
                <h2 className="font-display text-base font-bold text-theme-text flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-brand" />
                  <span>System & Compliance Alerts ({fraudAlerts.length})</span>
                </h2>

                <div className="space-y-3">
                  {fraudAlerts.length > 0 ? (
                    fraudAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`glass-panel rounded-3xl p-4 border flex items-start space-x-3 ${
                          alert.severity === 'high' 
                            ? 'border-red-500/30 bg-red-500/5' 
                            : 'border-amber-500/30 bg-amber-500/5'
                        }`}
                      >
                        <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-400 animate-pulse' : 'text-amber-400'
                        }`} />
                        <div className="flex-1">
                          <span className={`text-[9px] uppercase font-bold tracking-wider block ${
                            alert.severity === 'high' ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {alert.severity} Priority Alert
                          </span>
                          <p className="text-[11px] text-theme-muted mt-1 leading-normal">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-panel rounded-3xl p-6 border border-theme-border text-center">
                      <p className="text-xs text-theme-muted">100% compliance verified. No anomalies detected.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Actions / Info */}
              <div className="space-y-6">
                <h2 className="font-display text-base font-bold text-theme-text flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-brand" />
                  <span>Platform Health</span>
                </h2>
                <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-theme-border/50">
                    <span className="text-sm font-semibold text-theme-text">Database Connection</span>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Online</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-theme-border/50">
                    <span className="text-sm font-semibold text-theme-text">Payment Gateway</span>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-theme-text">Unresolved Tickets</span>
                    <span className="text-sm font-mono text-theme-muted">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: MERCHANTS --- */}
        {activeTab === 'merchants' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Seller Moderation Queue */}
            <div className="space-y-6">
              <h2 className="font-display text-base font-bold text-theme-text flex items-center space-x-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span>Verification Queue ({pendingSellers.length})</span>
              </h2>

              {pendingSellers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pendingSellers.map((seller) => (
                    <div 
                      key={seller.id} 
                      className="glass-panel rounded-3xl p-5 border border-theme-border flex flex-col h-full relative bg-amber-500/5 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <img src={seller.logo_url} alt={seller.studio_name} className="h-10 w-10 rounded-lg object-cover bg-black/20" />
                        <div>
                          <h4 className="font-display text-sm font-bold text-theme-text">{seller.studio_name}</h4>
                          <span className="text-[9px] text-theme-muted block font-mono">ID: {seller.id.substring(0,8)}...</span>
                        </div>
                      </div>

                      <p className="text-xs text-theme-muted leading-relaxed flex-1">
                        {seller.description}
                      </p>

                      <div className="border-t border-theme-border/50 pt-4 mt-4 flex items-center justify-between gap-2">
                        <button
                          onClick={() => suspendSeller(seller.id)}
                          className="flex-1 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 py-2 text-xs font-semibold text-red-400 transition-colors flex justify-center items-center"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => approveSeller(seller.id)}
                          className="flex-1 rounded-xl bg-brand text-white py-2 text-xs font-semibold hover:bg-brand-hover flex items-center justify-center space-x-1.5 shadow-md shadow-brand/10 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel rounded-3xl p-8 border border-theme-border text-center">
                  <p className="text-sm text-theme-muted">No pending creator registrations.</p>
                </div>
              )}
            </div>
            
            {/* Approved Sellers list */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text pt-6 border-t border-theme-border/40">Registered Studios</h3>
              <div className="glass-panel rounded-3xl overflow-hidden border border-theme-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-theme-border bg-black/20 text-[10px] uppercase font-bold tracking-wider text-theme-muted">
                        <th className="p-4">Studio details</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Commission</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((s) => (
                        <tr key={s.id} className="border-b border-theme-border/40 hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img src={s.logo_url} alt={s.studio_name} className="h-8 w-8 rounded-lg object-cover bg-black/20" />
                            <div>
                              <h4 className="font-bold text-theme-text">{s.studio_name}</h4>
                              <span className="text-[9px] text-theme-muted font-mono">{s.id.substring(0, 12)}...</span>
                            </div>
                          </td>
                          <td className="p-4 text-theme-text font-bold font-mono">{s.rating}★</td>
                          <td className="p-4 text-theme-muted font-mono">{s.commission_rate}%</td>
                          <td className="p-4 text-theme-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                              s.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                              s.status === 'suspended' ? 'bg-red-500/10 text-red-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {s.status === 'approved' ? (
                              <button
                                onClick={() => suspendSeller(s.id)}
                                className="text-[10px] font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Suspend
                              </button>
                            ) : s.status === 'suspended' ? (
                              <button
                                onClick={() => approveSeller(s.id)}
                                className="text-[10px] font-bold text-green-400 hover:bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Restore
                              </button>
                            ) : (
                              <span className="text-[10px] text-theme-muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: PRODUCTS --- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-base font-bold text-theme-text flex items-center space-x-2">
              <Package className="h-5 w-5 text-brand" />
              <span>Platform Catalog ({products.length} Items)</span>
            </h2>
            
            <div className="glass-panel rounded-3xl overflow-hidden border border-theme-border">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-theme-border bg-black/20 text-[10px] uppercase font-bold tracking-wider text-theme-muted">
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Studio</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <tr key={p.id} className="border-b border-theme-border/40 hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img src={p.images[0] || 'https://via.placeholder.com/150'} alt={p.title} className="h-10 w-10 rounded-lg object-cover bg-black/20" />
                            <div className="max-w-[200px]">
                              <h4 className="font-bold text-theme-text truncate" title={p.title}>{p.title}</h4>
                              <span className="text-[9px] text-theme-muted font-mono">ID: {p.id.substring(0, 8)}...</span>
                            </div>
                          </td>
                          <td className="p-4 text-theme-muted">{p.seller_name}</td>
                          <td className="p-4 font-mono font-bold text-brand">${p.price}</td>
                          <td className="p-4 font-mono">
                            <span className={p.inventory === 0 ? 'text-red-400 font-bold' : p.inventory < 5 ? 'text-amber-400' : 'text-theme-muted'}>
                              {p.inventory}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-theme-muted">{p.average_rating}★</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                              p.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-theme-muted">No products found in the catalog.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: ORDERS --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-base font-bold text-theme-text flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-brand" />
              <span>Platform Orders ({orders.length})</span>
            </h2>
            
            <div className="glass-panel rounded-3xl overflow-hidden border border-theme-border">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-theme-border bg-black/20 text-[10px] uppercase font-bold tracking-wider text-theme-muted">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Buyer ID</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o.id} className="border-b border-theme-border/40 hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-theme-text">{o.id.substring(0,10)}...</td>
                          <td className="p-4 text-theme-muted">{new Date(o.created_at).toLocaleString()}</td>
                          <td className="p-4 text-theme-muted font-mono">{o.buyer_id.substring(0, 8)}...</td>
                          <td className="p-4 font-mono font-bold text-brand">${o.total_amount.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                o.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                                o.payment_status === 'failed' ? 'bg-red-500/20 text-red-400' : 
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {o.payment_status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                o.shipping_status === 'out_for_delivery' ? 'bg-green-500/20 text-green-400' : 
                                o.shipping_status === 'packed' || o.shipping_status === 'shipped' ? 'bg-blue-500/20 text-blue-400' : 
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {o.shipping_status}
                              </span>
                            </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-theme-muted">No orders placed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
