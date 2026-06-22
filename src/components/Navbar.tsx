'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import {
  ShoppingBag,
  Heart,
  Bell,
  Paintbrush,
  Search,
  Layers,
  Menu,
  X,
  ChevronDown,
  User,
  Home,
  Store,
  ShieldCheck,
  Check,
  Glasses
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentUser,
    currentRole,
    isAuthenticated,
    activeTheme,
    cart,
    wishlist,
    notifications,
    products,
    setRole,
    setTheme,
    logout,
    markNotificationRead,
    clearNotifications,
    dbConnected
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Filtered live suggestions
  const suggestions = searchQuery.trim()
    ? products
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)
    : [];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-theme-border bg-theme-bg-from/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent-color glow-effect"
            >
              <Layers className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold tracking-wider text-theme-text sm:text-2xl">
              ELITEhub<span className="text-brand">.</span>
            </span>
          </Link>

          {/* Search bar - Desktop */}
          <div ref={searchRef} className="relative hidden max-w-md flex-1 px-8 md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Ask AI or search artifacts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-full border border-theme-border bg-theme-card/30 py-2.5 pl-11 pr-4 text-sm text-theme-text placeholder-theme-muted/50 outline-none transition-all focus:border-brand focus:bg-theme-card/60 focus:ring-1 focus:ring-brand"
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-theme-muted/60" />
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-8 right-8 mt-2 overflow-hidden rounded-2xl border border-theme-border bg-theme-bg-from/95 p-2 shadow-2xl backdrop-blur-lg"
                >
                  {suggestions.length > 0 ? (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-theme-muted/60">
                        Suggested Artifacts
                      </div>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            router.push(`/products/${product.id}`);
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                          className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-left text-sm text-theme-text hover:bg-brand/10 transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                          <div className="flex-1 truncate">
                            <div className="font-medium truncate">{product.title}</div>
                            <div className="text-xs text-theme-muted truncate">{product.category}</div>
                          </div>
                          <div className="text-sm font-semibold text-brand">${product.price}</div>
                        </button>
                      ))}
                      <div className="border-t border-theme-border mt-1 pt-1.5">
                        <Link
                          href={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setShowSuggestions(false)}
                          className="block text-center text-xs font-medium text-brand hover:text-brand-hover py-1"
                        >
                          View all matches
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-theme-muted">
                      No matching luxury artifacts found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons - Desktop */}
          <div className="hidden items-center space-x-4 md:flex">

            {/* Theme Cycle brush */}
            <button
              onClick={cycleTheme}
              className="group relative rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text hover:border-brand hover:bg-brand/10 transition-all duration-300"
              title="Cycle Accent Palette"
            >
              <Paintbrush className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </button>



            {/* Wishlist Link */}
            <Link
              href="/products?filter=wishlist"
              className="group relative rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text hover:border-brand hover:bg-brand/10 transition-all duration-300"
            >
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-lg shadow-brand/40">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="group relative rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text hover:border-brand hover:bg-brand/10 transition-all duration-300"
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-color text-xs font-bold text-black shadow-lg shadow-accent-color/40">
                  {cartCount}
                </span>
              )}
            </Link>



            {/* User / Auth Section */}
            {mounted ? (
              isAuthenticated && currentUser ? (
                <div ref={roleRef} className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center space-x-2 rounded-xl border border-theme-border bg-theme-card/40 px-4 py-2.5 text-sm font-semibold hover:border-brand hover:bg-brand/5 transition-all"
                  >
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showRoleDropdown ? 'rotate-180' : ''}`} />
                  </button>

                <AnimatePresence>
                  {showRoleDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-theme-border bg-theme-bg-from/95 p-1 shadow-2xl backdrop-blur-lg z-50"
                    >
                      <div className="px-3 py-2 border-b border-theme-border mb-1">
                        <p className="text-xs font-bold text-theme-text truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-theme-muted truncate">{currentUser.email}</p>
                        <span className="text-[9px] mt-1 inline-block px-2 py-0.5 rounded-full bg-brand/10 text-brand font-bold uppercase">{currentRole}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleDropdown(false);
                          router.push('/login');
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-brand to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              )
            ) : (
              <div className="h-10 w-24 rounded-xl bg-theme-card/30 animate-pulse"></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={cycleTheme}
              className="rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text"
            >
              <Paintbrush className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-theme-border bg-theme-bg-from/95 backdrop-blur-lg md:hidden z-30 relative overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-theme-border bg-theme-card/45 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-theme-muted/50" />
              </form>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-theme-border bg-theme-card/20 py-3 text-sm text-theme-text"
                >
                  <Store className="h-4 w-4 text-brand" />
                  <span>Browse Shop</span>
                </Link>
                <div className="border-t border-theme-border pt-4">
                <Link
                  href="/cart"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 rounded-xl p-3 text-theme-text hover:bg-brand/10"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart ({mounted ? cartCount : 0})</span>
                </Link>
              </div>
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-theme-border pt-4 mt-2">
                {mounted && isAuthenticated && currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rounded-xl border border-theme-border bg-theme-card/30 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-theme-text">{currentUser.name}</p>
                        <p className="truncate text-xs text-theme-muted">{currentUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                        router.push('/login');
                      }}
                      className="w-full rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-500 hover:bg-red-500/20"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20"
                  >
                    Sign In to ELITEhub
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer Component */}
      <AnimatePresence>
        {showNotifDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifDrawer(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 w-full sm:max-w-md border-l border-theme-border bg-theme-bg-from/95 p-6 shadow-2xl backdrop-blur-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-theme-border pb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-brand" />
                  <h2 className="font-display text-lg font-bold text-theme-text">Notifications</h2>
                </div>
                <button
                  onClick={() => setShowNotifDrawer(false)}
                  className="rounded-lg p-1 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all ${notif.read
                        ? 'border-theme-border bg-theme-card/10 opacity-70'
                        : 'border-brand/30 bg-brand/5 glow-effect'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-green-500' :
                          notif.type === 'warning' ? 'bg-amber-500' :
                            notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-semibold text-theme-text">{notif.title}</h4>
                          <p className="text-xs text-theme-muted mt-1">{notif.message}</p>
                          <span className="text-[10px] text-theme-muted/50 mt-2 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Bell className="h-10 w-10 text-theme-muted/30 mb-3" />
                    <p className="text-sm text-theme-muted">You have no notification logs.</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-theme-border pt-4">
                  <button
                    onClick={clearNotifications}
                    className="w-full rounded-xl border border-theme-border bg-theme-card/30 py-2.5 text-xs font-semibold hover:bg-white/5 transition-all"
                  >
                    Clear All Logs
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Nav - Mobile Feel (Visible only on small devices) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-theme-border bg-theme-bg-from/80 backdrop-blur-lg px-4 py-2 flex items-center justify-around md:hidden shadow-lg">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 rounded-xl ${pathname === '/' ? 'text-brand font-semibold' : 'text-theme-muted'
            }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link
          href="/products"
          className={`flex flex-col items-center p-2 rounded-xl ${pathname === '/products' ? 'text-brand font-semibold' : 'text-theme-muted'
            }`}
        >
          <Store className="h-5 w-5" />
          <span className="text-[10px] mt-1">Shop</span>
        </Link>
        <Link
          href="/cart"
          className={`flex flex-col items-center p-2 rounded-xl relative ${pathname === '/cart' ? 'text-brand font-semibold' : 'text-theme-muted'
            }`}
        >
          <ShoppingBag className="h-5 w-5" />
          {mounted && cartCount > 0 && (
            <span className="absolute top-1.5 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent-color text-[9px] font-bold text-black">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-1">Bag</span>
        </Link>
      </nav>
    </>
  );
}
