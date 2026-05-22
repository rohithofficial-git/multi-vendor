'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../store/useStore';
import {
  ShoppingBag,
  Heart,
  ArrowRight,
  Sparkles,
  Cpu,
  Activity,
  ShieldCheck,
  Star,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Layers,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const {
    products,
    sellers,
    addToCart,
    wishlist,
    toggleWishlist,
    currentRole,
    setRole
  } = useStore();

  // AI search helper state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<any[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);

  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Welcome to Aetheris Horizon. I am your concierge intelligence. Looking for artisan timepieces or acoustics?' }
  ]);
  const [userChatText, setUserChatText] = useState('');

  // Auto-get top rated / AI recommended products
  const aiRecommendedProducts = useMemo(() => {
    return products.filter(p => p.is_ai_recommended).slice(0, 3);
  }, [products]);

  const trendingProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // AI Semantic search simulation
  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) {
      setAiResult(null);
      return;
    }

    setIsAiSearching(true);
    setTimeout(() => {
      const queryLower = aiQuery.toLowerCase();
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        Object.values(p.specs).some(specVal => specVal.toLowerCase().includes(queryLower))
      );
      setAiResult(filtered);
      setIsAiSearching(false);
    }, 600);
  };

  //concierge chatbot logic
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatText.trim()) return;

    const userText = userChatText;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setUserChatText('');

    setTimeout(() => {
      let aiResponse = "I can locate any luxury technical spec for you. Try asking about 'watches', 'delivery timescales', or 'selling on Aetheris'.";
      const q = userText.toLowerCase();

      if (q.includes('watch') || q.includes('time')) {
        aiResponse = "We host the Aetheris Chrono VII ($1,850) with automatic tourbillon movement. It features a titanium carbon composite casing. Shall I add it to your bag?";
      } else if (q.includes('delivery') || q.includes('shipping')) {
        aiResponse = "Aetheris uses secure hyper-freight logistics. Domestic shipping is complete in 24 hours. Global courier deliveries resolve in 3-5 days, fully tracked.";
      } else if (q.includes('sell') || q.includes('studio') || q.includes('become')) {
        aiResponse = "Creating your designer profile is instant! Cycle to 'Seller Mode' in the navbar or click the 'Open Studio' link in the footer to initialize your dashboard.";
      } else if (q.includes('coupon') || q.includes('discount')) {
        aiResponse = "Active discount codes include 'NEON50' (50% off), 'STARTUP20' (20% off), and 'WELCOME10' (10% off). Enter them in your shopping bag page.";
      } else if (q.includes('refund') || q.includes('return')) {
        aiResponse = "Aetheris offers a 30-day premium refund policy with insured pickup routes. All refunds update your original balance within 48 hours.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:py-32">

          {/* Ambient Background Mesh */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20">
            <div className="h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-brand to-accent-color blur-[80px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 max-w-4xl mx-auto">



              {/* Title & Tagline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl font-extrabold tracking-tight text-theme-text sm:text-6xl"
              >
                Luxury Marketplace for <span className="bg-gradient-to-r from-brand to-accent-color bg-clip-text text-transparent glow-text">Artisan Artifacts</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-theme-muted sm:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                Curating the frontier of mechanical chronography, soundstage acoustics, and smart home levitation. Built for collectors of modern intelligence.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-full bg-brand hover:bg-brand-hover px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/20 hover:shadow-brand/40 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Buy Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </motion.div>

              {/* Real-time System Metrics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 border-t border-theme-border"
              >
                {[
                  { value: '$1.4M+', label: 'Transaction Vol' },
                  { value: '52', label: 'Bespoke Studios' },
                  { value: '24hr', label: 'Cargo Handoff' },
                  { value: '4.8★', label: 'Studio Avg Rating' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-theme-card/10 border border-theme-border/50 backdrop-blur-sm">
                    <div className="text-xl font-extrabold text-brand sm:text-2xl">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* AI Concierge Search Assistant Bar */}
        <section className="py-8 border-y border-theme-border bg-black/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-3xl p-6 glow-effect">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-theme-text">Aetheris AI Concierge</h3>
                    <p className="text-xs text-theme-muted">Semantic natural language catalog queries</p>
                  </div>
                </div>
                <form onSubmit={handleAiSearch} className="flex-1 w-full relative flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'tourbillon carbon watch' or 'water resistant audio'..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-4 py-2.5 text-xs text-theme-text outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-brand hover:bg-brand-hover px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    {isAiSearching ? 'Searching...' : 'Ask AI'}
                  </button>
                </form>
              </div>

              {/* AI Search Results Overlay */}
              <AnimatePresence>
                {aiResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 border-t border-theme-border pt-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-brand">AI Query matches: {aiResult.length} items</span>
                      <button
                        onClick={() => { setAiResult(null); setAiQuery(''); }}
                        className="text-xs text-theme-muted hover:text-theme-text"
                      >
                        Reset search
                      </button>
                    </div>
                    {aiResult.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {aiResult.map((prod) => (
                          <div
                            key={prod.id}
                            className="glass-panel rounded-2xl p-3 border border-theme-border flex space-x-3 items-center hover:border-brand/35 transition-colors cursor-pointer"
                            onClick={() => router.push(`/products/${prod.id}`)}
                          >
                            <img src={prod.images[0]} alt={prod.title} className="h-14 w-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-theme-text truncate">{prod.title}</h4>
                              <p className="text-[10px] text-theme-muted truncate mt-0.5">{prod.category}</p>
                              <span className="text-xs font-bold text-brand block mt-1">${prod.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-theme-muted py-2">
                        Concierge could not match exact semantic items. Try looking for 'watch', 'headphone' or ' desk'.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Curated Collections / Categories */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Curated Spaces</span>
              <h2 className="font-display text-2xl font-bold text-theme-text mt-1 sm:text-3xl">Explore Categories</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center space-x-1">
              <span>View catalog</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Acoustics & Time',
                desc: 'Tourbillon mechanical chronographs & beryllium driver auditory stages.',
                image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80',
                count: '24 items',
                link: '/products?category=Acoustics%20%26%20Time'
              },
              {
                title: 'Vanguard Living',
                desc: 'Mag-lev ambient installations & modular wooden smart desk configurations.',
                image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=600&auto=format&fit=crop&q=80',
                count: '16 items',
                link: '/products?category=Vanguard%20Living'
              },
              {
                title: 'Mobility & Gear',
                desc: 'Urban commuter carbon protective helmets & dual hub hub motor electric transports.',
                image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
                count: '12 items',
                link: '/products?category=Mobility%20%26%20Gear'
              }
            ].map((cat, idx) => (
              <Link href={cat.link} key={idx} className="group relative h-80 rounded-3xl overflow-hidden border border-theme-border flex flex-col justify-end p-6 bg-black">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent -z-0" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold text-accent-color uppercase tracking-wider bg-accent-color/10 border border-accent-color/20 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-zinc-300 line-clamp-2">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Recommended Carousel Banner */}
        <section className="py-12 bg-gradient-to-r from-brand/5 via-accent-color/5 to-brand/5 border-y border-theme-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-xs font-semibold text-brand uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>Concierge AI Personalized Curations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiRecommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="glass-panel rounded-3xl p-5 border border-theme-border hover:border-brand/40 transition-all flex flex-col h-full relative group"
                >
                  <span className="absolute top-4 right-4 bg-brand text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full glow-effect">
                    AI Highlight
                  </span>

                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-black/20 hover:opacity-90 transition-opacity">
                    <Link href={`/products/${prod.id}`} className="block h-full w-full">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <h4 className="text-sm font-bold text-theme-text line-clamp-1">{prod.title}</h4>
                  <p className="text-xs text-theme-muted mt-1 flex-1 line-clamp-2">{prod.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-theme-border/50">
                    <span className="text-base font-bold text-brand">${prod.price}</span>
                    <Link
                      href={`/products/${prod.id}`}
                      className="text-xs font-semibold text-theme-text hover:text-brand flex items-center space-x-1"
                    >
                      <span>Examine spec</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Artifacts Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Hot Releases</span>
              <h2 className="font-display text-2xl font-bold text-theme-text mt-1 sm:text-3xl">Trending Products</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center space-x-1">
              <span>View catalog</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((prod) => {
              const isWishlisted = mounted && wishlist.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="glass-panel rounded-3xl p-4 border border-theme-border flex flex-col h-full relative group hover:shadow-2xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300"
                >
                  {/* Image gallery box */}
                  <div className="relative h-56 rounded-2xl overflow-hidden mb-4 bg-black/20">
                    <Link href={`/products/${prod.id}`} className="block h-full w-full">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Hover variant gallery overlay preview */}
                    {prod.images.length > 1 && (
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center space-x-1.5 z-10">
                        {prod.images.slice(0, 3).map((img, index) => (
                          <div key={index} className="h-8 w-8 rounded-lg overflow-hidden border border-white/20">
                            <img src={img} alt="preview" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-colors z-10 ${isWishlisted
                        ? 'bg-brand/90 text-white border-brand/20 shadow-lg shadow-brand/35'
                        : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Category Label */}
                    <span className="absolute top-3 left-3 bg-black/55 backdrop-blur-md text-white/90 border border-white/10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {prod.category}
                    </span>
                  </div>

                  {/* Info Box */}
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-theme-muted">
                      <span>Studio: <strong>{prod.seller_name}</strong></span>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3 w-3 fill-current mr-0.5" />
                        <span>{prod.average_rating}</span>
                      </div>
                    </div>

                    <Link href={`/products/${prod.id}`} className="font-display text-sm font-bold text-theme-text hover:text-brand line-clamp-1 mt-1 transition-colors">
                      {prod.title}
                    </Link>

                    <p className="text-xs text-theme-muted line-clamp-2 mt-0.5 flex-1 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-theme-border/50">
                      <div className="flex flex-col">
                        {prod.compare_at_price && (
                          <span className="text-[10px] text-theme-muted line-through">${prod.compare_at_price}</span>
                        )}
                        <span className="text-base font-bold text-brand">${prod.price}</span>
                      </div>

                      <button
                        onClick={() => addToCart(prod.id, 1)}
                        disabled={prod.inventory === 0}
                        className={`inline-flex items-center space-x-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${prod.inventory === 0
                          ? 'bg-theme-card/10 text-theme-muted border border-theme-border cursor-not-allowed'
                          : 'bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/10 hover:shadow-brand/25'
                          }`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{prod.inventory === 0 ? 'Out of stock' : 'Add to Bag'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Artisan Studios */}
        <section className="py-20 border-t border-theme-border bg-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Authorized Handcrafters</span>
              <h2 className="font-display text-2xl font-bold text-theme-text mt-1 sm:text-3xl">Artisan Studios</h2>
              <p className="text-sm text-theme-muted mt-2">
                All merchants undergo rigorous design capability verification before joining our decentralized logistics ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sellers.slice(0, 3).map((seller) => (
                <div
                  key={seller.id}
                  className="glass-panel rounded-3xl p-6 border border-theme-border flex flex-col h-full relative"
                >
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Approved Creator</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={seller.logo_url}
                      alt={seller.studio_name}
                      className="h-12 w-12 rounded-xl object-cover border border-theme-border"
                    />
                    <div>
                      <h3 className="font-display text-base font-bold text-theme-text">{seller.studio_name}</h3>
                      <div className="flex items-center text-amber-500 text-xs mt-0.5">
                        <Star className="h-3 w-3 fill-current mr-0.5" />
                        <span className="font-semibold">{seller.rating}</span>
                        <span className="text-theme-muted ml-2">({seller.sales_count} sales)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-theme-muted leading-relaxed flex-1">
                    {seller.description}
                  </p>

                  <div className="border-t border-theme-border/50 pt-4 mt-4 flex items-center justify-between text-[11px] text-theme-muted">
                    <span>Commission rate: <strong>{seller.commission_rate}%</strong></span>
                    <Link
                      href={`/products?seller=${encodeURIComponent(seller.id)}`}
                      className="font-semibold text-brand hover:text-brand-hover flex items-center space-x-0.5"
                    >
                      <span>Browse artifacts</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Floating Chatbot conciergie toggle */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-6">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 hover:bg-brand-hover transition-all transform hover:-translate-y-0.5"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Chatbot window overlay */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-3xl border border-theme-border bg-theme-bg-from/95 p-4 shadow-2xl backdrop-blur-xl flex flex-col h-[400px] z-50"
            >
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="font-display text-sm font-bold text-theme-text">Aetheris Concierge Intelligence</span>
                </div>
                <button onClick={() => setShowChatbot(false)} className="text-xs text-theme-muted hover:text-theme-text">
                  Hide
                </button>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.sender === 'user'
                        ? 'bg-brand text-white'
                        : 'bg-theme-card/30 border border-theme-border text-theme-text'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="border-t border-theme-border pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask concierge..."
                  value={userChatText}
                  onChange={(e) => setUserChatText(e.target.value)}
                  className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-3 py-2 text-xs text-theme-text outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand text-white p-2 hover:bg-brand-hover transition-colors shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </>
  );
}
