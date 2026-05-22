'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { 
  Store, 
  DollarSign, 
  ShoppingBag, 
  BarChart3, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Sliders, 
  X, 
  Edit,
  Save,
  Paintbrush
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerSaaSStudio() {
  const router = useRouter();
  const { 
    currentUser, 
    currentSeller, 
    isAuthenticated,
    isInitialized,
    products, 
    sellers,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    registerAsSeller,
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      window.location.href = '/seller/login';
    }
  }, [mounted, isInitialized, isAuthenticated]);

  // Registry application state (if not registered or pending)
  const [registerForm, setRegisterForm] = useState({
    studioName: '',
    description: ''
  });

  // Product addition state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: 'Acoustics & Time',
    price: 150,
    compare_at_price: 200,
    inventory: 15,
    images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80'],
    variants: 'Color: Carbon Gray, Gold Edition',
    specs: 'Movement: Quartz, Case size: 42mm',
    model_url: ''
  });

  // Load seller specific items
  const sellerProducts = useMemo(() => {
    if (!currentSeller) return [];
    return products.filter(p => p.seller_id === currentSeller.id);
  }, [products, currentSeller]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    if (!currentSeller) return 0;
    // Mock sales analytics
    return currentSeller.sales_count * 850; 
  }, [currentSeller]);

  const lowStockCount = useMemo(() => {
    return sellerProducts.filter(p => p.inventory <= 5).length;
  }, [sellerProducts]);

  // Chart data
  const chartData = [
    { name: 'Mon', Revenue: 400 },
    { name: 'Tue', Revenue: 1300 },
    { name: 'Wed', Revenue: 900 },
    { name: 'Thu', Revenue: 2400 },
    { name: 'Fri', Revenue: 1800 },
    { name: 'Sat', Revenue: 2900 },
    { name: 'Sun', Revenue: 3400 }
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.studioName && registerForm.description) {
      registerAsSeller(registerForm.studioName, registerForm.description);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse variants (Key: val1, val2)
    const variantsObj: Record<string, string[]> = {};
    if (productForm.variants.trim()) {
      const parts = productForm.variants.split(';');
      parts.forEach(part => {
        const [k, v] = part.split(':');
        if (k && v) {
          variantsObj[k.trim()] = v.split(',').map(s => s.trim());
        }
      });
    }

    // Parse specs (k: v)
    const specsObj: Record<string, string> = {};
    if (productForm.specs.trim()) {
      const parts = productForm.specs.split(',');
      parts.forEach(part => {
        const [k, v] = part.split(':');
        if (k && v) {
          specsObj[k.trim()] = v.trim();
        }
      });
    }

    const payload = {
      title: productForm.title,
      description: productForm.description,
      category: productForm.category,
      price: Number(productForm.price),
      compare_at_price: productForm.compare_at_price ? Number(productForm.compare_at_price) : undefined,
      inventory: Number(productForm.inventory),
      images: productForm.images,
      variants: variantsObj,
      specs: specsObj,
      is_ai_recommended: false,
      status: 'active' as const,
      model_url: (productForm as any).model_url || undefined
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    // Reset Form
    setProductForm({
      title: '',
      description: '',
      category: 'Acoustics & Time',
      price: 150,
      compare_at_price: 200,
      inventory: 15,
      images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80'],
      variants: 'Color: Carbon Gray, Gold Edition',
      specs: 'Movement: Quartz, Case size: 42mm',
      model_url: ''
    });
    setEditingProductId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (p: any) => {
    // Unpack variants and specs
    const variantStr = Object.entries(p.variants)
      .map(([k, v]: any) => `${k}: ${v.join(', ')}`)
      .join('; ');

    const specsStr = Object.entries(p.specs)
      .map(([k, v]: any) => `${k}: ${v}`)
      .join(', ');

    setProductForm({
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      compare_at_price: p.compare_at_price || 0,
      inventory: p.inventory,
      images: p.images,
      variants: variantStr,
      specs: specsStr,
      model_url: p.model_url || ''
    });
    setEditingProductId(p.id);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-theme-bg-from text-theme-text transition-colors duration-500">
      {/* Seller Top Bar */}
      <header className="border-b border-theme-border bg-theme-card/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-brand" />
          <span className="font-semibold tracking-wider text-theme-text">STUDIO DASHBOARD</span>
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
            onClick={() => { logout(); router.push('/seller/login'); }}
            className="text-xs font-semibold text-brand hover:text-brand-hover border border-brand/30 px-3 py-1.5 rounded bg-brand/10 hover:bg-brand/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {!isInitialized ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-xs font-semibold text-theme-muted uppercase tracking-widest">Initializing Workspace...</p>
            </div>
          </div>
        ) : !currentSeller || currentSeller.status !== 'approved' ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand">
              <Store className="h-6 w-6" />
            </div>

            {currentSeller && currentSeller.status === 'pending' ? (
              <div className="space-y-3">
                <h1 className="font-display text-2xl font-bold text-theme-text">Verification Audits Pending</h1>
                <p className="text-sm text-theme-muted">
                  Your registration application for <strong className="text-brand">'{currentSeller.studio_name}'</strong> is queued. Go to the Admin Control Panel using the role switcher to approve it instantly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="glass-panel rounded-3xl p-8 border border-theme-border text-left space-y-4">
                <h2 className="font-display text-xl font-bold text-theme-text text-center mb-6">Initialize Designer Studio</h2>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-theme-muted">Studio Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Optics Studio"
                    value={registerForm.studioName}
                    onChange={(e) => setRegisterForm({...registerForm, studioName: e.target.value})}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs outline-none focus:border-brand text-theme-text placeholder-theme-muted"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-theme-muted">Studio Mandate Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your design aesthetics..."
                    value={registerForm.description}
                    onChange={(e) => setRegisterForm({...registerForm, description: e.target.value})}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 p-3.5 text-xs outline-none focus:border-brand text-theme-text placeholder-theme-muted"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand text-white py-2.5 text-xs font-semibold hover:bg-brand-hover transition-colors mt-4"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        ) : (
          
          // Approved Seller SaaS Studio Workspace
          <div className="space-y-8">
            
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full inline-block">
                  Approved Studio
                </span>
                <h1 className="font-display text-3xl font-extrabold text-theme-text mt-1">{currentSeller.studio_name} Workspace</h1>
                <p className="text-xs text-theme-muted mt-1">Manage catalog listings and live sales analytics.</p>
              </div>

              <button
                onClick={() => { setEditingProductId(null); setShowAddForm(true); }}
                className="rounded-xl bg-brand hover:bg-brand-hover text-white px-5 py-2.5 text-xs font-semibold inline-flex items-center space-x-1.5 shadow-lg shadow-brand/10"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Product</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex w-full overflow-x-auto bg-theme-card/50 p-1 rounded-xl border border-theme-border/50 backdrop-blur-md mb-6">
              {[
                { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: ShoppingBag },
                { id: 'orders', label: 'Fulfillment', icon: Store }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-brand text-white shadow-md' 
                      : 'text-theme-muted hover:text-theme-text hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content: Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel rounded-3xl p-6 border border-theme-border flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-theme-muted block font-semibold">Total Studio Income</span>
                  <span className="text-xl font-extrabold text-theme-text font-mono">${totalRevenue}</span>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 border border-theme-border flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-theme-muted block font-semibold">Listings Catalog</span>
                  <span className="text-xl font-extrabold text-theme-text font-mono">{sellerProducts.length} products</span>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 border border-theme-border flex items-center space-x-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                  lowStockCount > 0 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse' 
                    : 'bg-theme-border/30 border-theme-border text-theme-muted'
                }`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-theme-muted block font-semibold">Low Stock Warnings</span>
                  <span className="text-xl font-extrabold text-theme-text font-mono">{lowStockCount} items</span>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Line Graph */}
            {mounted && (
              <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text">Weekly Revenue Metrics ($)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: 11, borderRadius: 12 }} />
                      <Line type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

              </div>
            )}

            {/* Tab Content: Products */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text">Inventory Catalog ledger</h3>
              
              {sellerProducts.length > 0 ? (
                <div className="glass-panel rounded-3xl overflow-hidden border border-theme-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-theme-border bg-black/20 text-[10px] uppercase font-bold tracking-wider text-theme-muted">
                          <th className="p-4">Item Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock Ledger</th>
                          <th className="p-4 text-right">Workspace actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerProducts.map((p) => {
                          const isLow = p.inventory <= 5;
                          
                          return (
                            <tr key={p.id} className="border-b border-theme-border/40 hover:bg-white/5 transition-colors">
                              <td className="p-4 flex items-center space-x-3">
                                <img src={p.images[0]} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                                <div>
                                  <h4 className="font-bold text-theme-text">{p.title}</h4>
                                  <span className="text-[10px] text-theme-muted font-mono">{p.id}</span>
                                </div>
                              </td>
                              <td className="p-4 text-theme-muted font-medium">{p.category}</td>
                              <td className="p-4 font-bold text-brand">${p.price}</td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isLow ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`} />
                                  <span className={`font-mono font-bold ${isLow ? 'text-amber-400' : 'text-theme-text'}`}>
                                    {p.inventory} left
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditClick(p)}
                                    className="p-2 text-theme-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="p-2 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-3xl p-12 text-center border border-theme-border">
                  <p className="text-xs text-theme-muted">You have uploaded no designer items yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Orders */}
            {activeTab === 'orders' && (
              <div className="glass-panel rounded-3xl p-12 text-center border border-theme-border">
                <Store className="h-12 w-12 text-theme-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-theme-text mb-2">Order Fulfillment Hub</h3>
                <p className="text-xs text-theme-muted max-w-sm mx-auto">Customer orders will appear here for processing and fulfillment. You currently have no pending orders.</p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Add / Edit product dialog overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel rounded-3xl w-full max-w-2xl border border-theme-border p-6 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-display text-lg font-bold text-theme-text mb-6">
              {editingProductId ? 'Edit Studio Product' : 'Upload Bespoke Design'}
            </h2>

            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronos Watch"
                  value={productForm.title}
                  onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand text-theme-text placeholder-theme-muted"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                >
                  <option value="Acoustics & Time">Acoustics & Time</option>
                  <option value="Vanguard Living">Vanguard Living</option>
                  <option value="Mobility & Gear">Mobility & Gear</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Product description..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 p-2.5 text-xs outline-none focus:border-brand text-theme-text placeholder-theme-muted"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Price ($)</label>
                <input
                  type="number"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Compare-At Price ($)</label>
                <input
                  type="number"
                  value={productForm.compare_at_price}
                  onChange={(e) => setProductForm({...productForm, compare_at_price: Number(e.target.value)})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Initial Stock Ledger Count</label>
                <input
                  type="number"
                  required
                  value={productForm.inventory}
                  onChange={(e) => setProductForm({...productForm, inventory: Number(e.target.value)})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">AR 3D Model URL (.glb file) - Optional</label>
                <input
                  type="url"
                  placeholder="https://example.com/model.glb"
                  value={productForm.model_url}
                  onChange={(e) => setProductForm({...productForm, model_url: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand text-emerald-400 placeholder:text-theme-muted/50"
                />
                <p className="text-[9px] text-theme-muted ml-1">Leave blank to use semantic AI placeholders. To display a 1:1 perfect model in AR, paste a direct link to your designer's .glb file.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Mockup Image URL</label>
                <input
                  type="text"
                  required
                  value={productForm.images[0]}
                  onChange={(e) => setProductForm({...productForm, images: [e.target.value]})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Variants (Use ';' to separate types, ',' for options)</label>
                <input
                  type="text"
                  placeholder="e.g. Strap: Titanium, Carbon Mesh; Size: 40mm, 42mm"
                  value={productForm.variants}
                  onChange={(e) => setProductForm({...productForm, variants: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[9px] uppercase font-bold text-theme-muted">Technical Specs (Use ',' to separate fields, ':' for values)</label>
                <input
                  type="text"
                  placeholder="e.g. Driver size: 40mm beryllium, Acoustic impedance: 32 ohms"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({...productForm, specs: e.target.value})}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs outline-none focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 pt-4 flex justify-end space-x-2 border-t border-theme-border">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-theme-border px-5 py-2.5 text-xs font-semibold text-theme-text hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand text-white px-6 py-2.5 text-xs font-semibold hover:bg-brand-hover inline-flex items-center space-x-1 shadow-md shadow-brand/10"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingProductId ? 'Save changes' : 'Publish catalog item'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
