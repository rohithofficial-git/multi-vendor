'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useStore } from '../../store/useStore';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Star, 
  X, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const { products, cart, wishlist, toggleWishlist, addToCart } = useStore();

  // Search parameter reads
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSeller = searchParams.get('seller') || '';
  const initialFilter = searchParams.get('filter') || ''; // e.g. 'wishlist'

  // Component Filter States
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Categories list
  const categories = ['Acoustics & Time', 'Vanguard Living', 'Mobility & Gear', 'Apparel & Style'];

  // Handle resets
  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedCategory('');
    setMaxPrice(3000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('newest');
  };

  // Filtered & Sorted Products calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Seller filter
    if (initialSeller) {
      result = result.filter(p => p.seller_id === initialSeller);
    }

    // Wishlist filter mode (if ?filter=wishlist)
    if (initialFilter === 'wishlist') {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // Price cap
    result = result.filter(p => p.price <= maxPrice);

    // Rating cap
    result = result.filter(p => p.average_rating >= minRating);

    // Stock check
    if (inStockOnly) {
      result = result.filter(p => p.inventory > 0);
    }

    // Sorting operations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.average_rating - a.average_rating);
    } else {
      // default: newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, searchVal, selectedCategory, maxPrice, minRating, inStockOnly, sortBy, initialSeller, initialFilter, wishlist]);

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-theme-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-theme-text">
              {initialFilter === 'wishlist' ? 'Your Wishlist Log' : 'Design Curation Catalog'}
            </h1>
            <p className="text-sm text-theme-muted mt-1">
              {initialFilter === 'wishlist' 
                ? 'Your personal locker of curated aesthetic assets.' 
                : 'Browse high-performance mechanical artifacts and luxury hardware.'}
            </p>
          </div>

          {/* Sort & View Mode Tools */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center space-x-2 rounded-xl border border-theme-border bg-theme-card/30 px-4 py-2.5 text-xs text-theme-text font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-theme-border bg-theme-card/30 px-4 py-2.5 text-xs text-theme-text font-semibold outline-none focus:border-brand"
            >
              <option value="newest" className="bg-theme-bg-from">Sort: Newest</option>
              <option value="price-low" className="bg-theme-bg-from">Price: Low to High</option>
              <option value="price-high" className="bg-theme-bg-from">Price: High to Low</option>
              <option value="rating" className="bg-theme-bg-from">Rating: Highest</option>
            </select>

            <div className="hidden sm:flex border border-theme-border rounded-xl p-1 bg-theme-card/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-brand text-white' : 'text-theme-muted hover:text-theme-text'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-brand text-white' : 'text-theme-muted hover:text-theme-text'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel - Desktop only */}
          <aside className="hidden md:block space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-theme-border space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-theme-border pb-4">
                <span className="text-sm font-bold text-theme-text uppercase tracking-wider flex items-center space-x-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-brand" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-theme-muted hover:text-brand flex items-center space-x-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Live Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text">Search Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search query..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand"
                  />
                  <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-theme-muted/50" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text">Category</label>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-left text-xs py-2 px-3 rounded-lg transition-colors ${!selectedCategory ? 'bg-brand/10 text-brand font-semibold' : 'text-theme-muted hover:bg-white/5'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left text-xs py-2 px-3 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-brand/10 text-brand font-semibold' : 'text-theme-muted hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Cap Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-theme-text">Max Price</span>
                  <span className="text-brand">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand bg-theme-border h-1 rounded-full cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-theme-muted">
                  <span>$0</span>
                  <span>$3,000</span>
                </div>
              </div>

              {/* Ratings check */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text">Minimum Rating</label>
                <div className="flex items-center space-x-1.5">
                  {[0, 3, 4, 4.5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMinRating(val)}
                      className={`flex items-center justify-center border text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                        minRating === val
                          ? 'border-brand bg-brand/15 text-brand'
                          : 'border-theme-border hover:bg-white/5 text-theme-muted'
                      }`}
                    >
                      {val === 0 ? 'Any' : `${val}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Toggle check */}
              <div className="flex items-center justify-between border-t border-theme-border pt-4">
                <span className="text-xs font-semibold text-theme-text">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-theme-border accent-brand cursor-pointer"
                />
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <section className="md:col-span-3">
            
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  const isOut = prod.inventory === 0;

                  if (viewMode === 'grid') {
                    return (
                      <div 
                        key={prod.id} 
                        className="glass-panel rounded-3xl p-4 border border-theme-border flex flex-col h-full relative group hover:border-brand/30 hover:shadow-2xl transition-all duration-300"
                      >
                        {/* Image Box */}
                        <div className="relative h-52 rounded-2xl overflow-hidden mb-4 bg-black/25 hover:opacity-90 transition-opacity">
                          <Link href={`/products/${prod.id}`} className="block h-full w-full">
                            <img src={prod.images[0]} alt={prod.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border border-white/10 z-10 transition-all ${
                              isWishlisted ? 'bg-brand text-white border-brand/20 shadow-md' : 'bg-black/40 text-white/80 hover:bg-black/60'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md border border-white/10 text-[9px] text-white font-semibold uppercase px-2 py-0.5 rounded-full">
                            {prod.category}
                          </span>
                        </div>

                        {/* Text Details */}
                        <div className="flex-grow flex flex-col space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-theme-muted">
                            <span>Studio: <strong>{prod.seller_name}</strong></span>
                            <span className="flex items-center text-amber-500">
                              <Star className="h-3 w-3 fill-current mr-0.5" />
                              {prod.average_rating}
                            </span>
                          </div>
                          
                          <Link href={`/products/${prod.id}`} className="font-display text-sm font-bold text-theme-text hover:text-brand line-clamp-1 mt-1 truncate">
                            {prod.title}
                          </Link>
                          
                          <p className="text-xs text-theme-muted flex-grow line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>

                          <div className="flex items-center justify-between border-t border-theme-border/50 pt-4 mt-2">
                            <div className="flex flex-col">
                              {prod.compare_at_price && (
                                <span className="text-[10px] text-theme-muted line-through">${prod.compare_at_price}</span>
                              )}
                              <span className="text-sm font-extrabold text-brand">${prod.price}</span>
                            </div>
                            <button
                              onClick={() => addToCart(prod.id, 1)}
                              disabled={isOut}
                              className={`inline-flex items-center space-x-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                isOut 
                                  ? 'bg-theme-card/10 text-theme-muted border border-theme-border cursor-not-allowed'
                                  : 'bg-brand hover:bg-brand-hover text-white'
                              }`}
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{isOut ? 'Sold out' : 'Add to Bag'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // List View Model
                    return (
                      <div 
                        key={prod.id} 
                        className="glass-panel rounded-3xl p-4 border border-theme-border hover:border-brand/20 transition-all flex flex-col sm:flex-row items-center gap-6 relative group"
                      >
                        <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-black/25 hover:opacity-90 transition-opacity">
                          <Link href={`/products/${prod.id}`} className="block h-full w-full">
                            <img src={prod.images[0]} alt={prod.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                          </Link>
                        </div>

                        <div className="flex-1 w-full space-y-1.5 min-w-0">
                          <div className="flex items-center space-x-2 text-[10px] text-theme-muted">
                            <span className="bg-brand/10 border border-brand/20 px-2 py-0.5 rounded text-brand font-semibold">{prod.category}</span>
                            <span>Studio: <strong>{prod.seller_name}</strong></span>
                            <span className="flex items-center text-amber-500">
                              <Star className="h-3 w-3 fill-current mr-0.5" />
                              {prod.average_rating}
                            </span>
                          </div>

                          <Link href={`/products/${prod.id}`} className="font-display text-base font-bold text-theme-text hover:text-brand block truncate">
                            {prod.title}
                          </Link>

                          <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-theme-border/50 pt-4 sm:pt-0 sm:pl-6 shrink-0 space-y-0 sm:space-y-3">
                          <div className="flex flex-col sm:text-right">
                            {prod.compare_at_price && (
                              <span className="text-[10px] text-theme-muted line-through">${prod.compare_at_price}</span>
                            )}
                            <span className="text-lg font-bold text-brand">${prod.price}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className={`p-2.5 rounded-xl border transition-colors ${
                                isWishlisted ? 'bg-brand/10 border-brand text-brand' : 'border-theme-border text-theme-muted hover:text-theme-text'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => addToCart(prod.id, 1)}
                              disabled={isOut}
                              className={`inline-flex items-center space-x-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                isOut 
                                  ? 'bg-theme-card/10 text-theme-muted border border-theme-border cursor-not-allowed'
                                  : 'bg-brand hover:bg-brand-hover text-white'
                              }`}
                            >
                              <ShoppingBag className="h-4 w-4" />
                              <span>{isOut ? 'Sold out' : 'Add to Bag'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-12 text-center border border-theme-border flex flex-col items-center justify-center">
                <AlertCircle className="h-12 w-12 text-theme-muted/40 mb-4" />
                <h3 className="font-display text-lg font-bold text-theme-text">No luxury artifacts matched</h3>
                <p className="text-xs text-theme-muted mt-2 max-w-sm">
                  Try tweaking your category filters, price sliders, or keyword searches.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="rounded-xl bg-brand hover:bg-brand-hover px-5 py-2.5 text-xs font-semibold text-white mt-6 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </section>
        </div>

      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 top-0 left-0 w-full max-w-xs border-r border-theme-border bg-theme-bg-from/95 p-6 shadow-2xl backdrop-blur-xl z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between border-b border-theme-border pb-4">
                <span className="text-sm font-bold text-theme-text uppercase tracking-wider flex items-center space-x-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-brand" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-lg p-1 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-4 space-y-6">
                
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-theme-text">Search Keyword</label>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full rounded-xl border border-theme-border bg-theme-card/30 py-2 px-3 text-xs outline-none"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-theme-text">Category</label>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`text-left text-xs py-2 px-3 rounded-lg transition-colors ${!selectedCategory ? 'bg-brand/10 text-brand font-semibold' : 'text-theme-muted'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left text-xs py-2 px-3 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-brand/10 text-brand font-semibold' : 'text-theme-muted'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Cap Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Max Price</span>
                    <span className="text-brand">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                </div>

                {/* Ratings */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-theme-text">Minimum Rating</label>
                  <div className="flex items-center space-x-1">
                    {[0, 3, 4, 4.5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMinRating(val)}
                        className={`border text-[10px] font-bold px-2 py-1 rounded-lg ${minRating === val ? 'border-brand bg-brand/10 text-brand' : 'border-theme-border text-theme-muted'}`}
                      >
                        {val === 0 ? 'Any' : `${val}★+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock check */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-theme-text">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border accent-brand"
                  />
                </div>

              </div>

              <div className="border-t border-theme-border pt-4 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 rounded-xl border border-theme-border bg-theme-card/30 py-2.5 text-xs text-theme-text hover:bg-white/5"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 rounded-xl bg-brand text-white py-2.5 text-xs font-semibold hover:bg-brand-hover"
                >
                  Apply
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
