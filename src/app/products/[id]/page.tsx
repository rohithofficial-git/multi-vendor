// @ts-nocheck
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useStore } from '../../../store/useStore';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  Info,
  Smartphone,
  Box
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetails({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrapping params Promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const { 
    products, 
    reviews, 
    cart, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    addReview,
    currentUser
  } = useStore();

  // Find active product
  const product = useMemo(() => {
    return products.find(p => p.id === id);
  }, [products, id]);

  const [activeImage, setActiveImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const [arToast, setArToast] = React.useState<string | null>(null);
  const [arLink, setArLink] = React.useState<string>('#');

  useEffect(() => {
    if (!product) return;
    const urls = getModelUrl(product.id);
    const glbUrl = urls.glb;
    const usdzUrl = urls.usdz;
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      setArLink(usdzUrl);
    } else {
      setArLink(`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_preferred&resizable=true#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`);
    }
  }, [product]);

  const handleViewInRoom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    
    if (!isIOS && !isAndroid) {
      e.preventDefault();
      setArToast('AR is only supported on mobile devices. Please open this page on your phone.');
      setTimeout(() => setArToast(null), 4000);
    }
  };

  // Review form states
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync state when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      
      // Default first variants
      const defaults: Record<string, string> = {};
      Object.entries(product.variants).forEach(([key, values]) => {
        defaults[key] = values[0];
      });
      setSelectedVariants(defaults);
    }
  }, [product]);



  // Calculations
  const productReviews = useMemo(() => {
    return reviews.filter(r => r.product_id === id);
  }, [reviews, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  const deliveryDateEstimate = useMemo(() => {
    const today = new Date();
    // 3 days shipping estimate
    const estimate = new Date(today.setDate(today.getDate() + 3));
    return estimate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  // Product-specific 3D Model Mapper
  const getModelUrl = (productId: string) => {
    if (!product) return 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

    // 1. If the vendor uploaded their own 3D model, ALWAYS use it!
    if ((product as any).model_url) {
      return {
        glb: (product as any).model_url,
        usdz: (product as any).usdz_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
      };
    }

    // 2. Otherwise, fall back to our semantic placeholders for demonstration
    const semanticString = `${product.title} ${product.category} ${product.description}`.toLowerCase();

    if (semanticString.includes('shoe') || semanticString.includes('sneaker') || semanticString.includes('footwear')) {
      return { 
        glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
        usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
      };
    }
    if (semanticString.includes('car') || semanticString.includes('vehicle') || semanticString.includes('auto')) {
      return {
        glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb',
        usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
      };
    }
    if (semanticString.includes('camera') || semanticString.includes('photo')) {
      return {
        glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
        usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
      };
    }
    if (semanticString.includes('audio') || semanticString.includes('speaker') || semanticString.includes('sound')) {
      return {
        glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/BoomBox/glTF-Binary/BoomBox.glb',
        usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
      };
    }

    // Default Fallback
    return {
      glb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz'
    };
  };

  // No Javascript intents needed - we will use a native overlay

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-xl font-bold text-theme-text">Artifact not found</h2>
          <p className="text-xs text-theme-muted mt-2">The requested ID does not match our digital ledger.</p>
          <Link href="/products" className="rounded-xl bg-brand text-white px-5 py-2.5 text-xs font-semibold mt-4">
            Return to Catalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const isOut = product.inventory === 0;

  const handleVariantSelect = (key: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [key]: value }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    addReview(product.id, userRating, userComment);
    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleAddToCart = () => {
    const variantString = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    
    addToCart(product.id, 1, variantString || undefined);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-xs font-semibold text-theme-muted hover:text-brand mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </button>

        {/* Product Spec Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Gallery Box */}
          <div className="space-y-4">
            <div className="relative h-[300px] sm:h-[450px] rounded-3xl overflow-hidden border border-theme-border bg-black/20 group">
              
              <img
                src={activeImage || product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute top-4 left-4 bg-brand text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full glow-effect">
                {product.category}
              </span>
              
              {/* AR toast */}
              {arToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-xs z-40 bg-gray-900/95 border border-cyan-500/50 text-white text-[10px] font-mono py-2 px-3 rounded-xl shadow-lg backdrop-blur-md text-center">
                  {arToast}
                </div>
              )}

              {/* Visual Button - Now a native AR link */}
              <a
                href={arLink}
                rel="ar"
                onClick={handleViewInRoom}
                className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md border border-white/20 text-white px-3 py-2 rounded-xl flex items-center gap-2 transition-all hover:bg-black/60 hover:scale-105 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] z-30 group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="p-1.5 bg-brand rounded-lg shadow shadow-brand/50 relative z-10">
                  <Smartphone className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase drop-shadow-md relative z-10">
                  View in Room
                </span>
              </a>

            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-1">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-20 shrink-0 rounded-2xl overflow-hidden border transition-all ${
                      activeImage === img ? 'border-brand glow-effect scale-95' : 'border-theme-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specs Box */}
          <div className="space-y-6">
            
            {/* Title / Studio details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-theme-muted">
                <span>Studio: <strong className="text-brand">{product.seller_name}</strong></span>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                  <span className="font-semibold">{product.average_rating}</span>
                  <span className="text-theme-muted ml-2">({productReviews.length} verified reviews)</span>
                </div>
              </div>

              <h1 className="font-display text-3xl font-extrabold text-theme-text sm:text-4xl">
                {product.title}
              </h1>

              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-2xl font-extrabold text-brand">${product.price}</span>
                {product.compare_at_price && (
                  <span className="text-sm text-theme-muted line-through">${product.compare_at_price}</span>
                )}
              </div>
            </div>

            <p className="text-sm text-theme-muted leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selectors */}
            {Object.keys(product.variants).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-theme-border/50">
                {Object.entries(product.variants).map(([vKey, vValues]) => (
                  <div key={vKey} className="space-y-2">
                    <label className="text-xs font-semibold text-theme-text uppercase tracking-wider">{vKey}</label>
                    <div className="flex items-center space-x-2">
                      {vValues.map((val) => {
                        const isSelected = selectedVariants[vKey] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleVariantSelect(vKey, val)}
                            className={`rounded-xl border text-xs px-4 py-2 font-medium transition-all ${
                              isSelected
                                ? 'border-brand bg-brand/10 text-brand font-semibold shadow-md'
                                : 'border-theme-border text-theme-muted hover:border-theme-muted'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Logistics & Inventory Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-theme-border/50 text-xs">
              <div className="flex items-start space-x-2.5 text-theme-muted">
                <Truck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-theme-text block">Insured Delivery</span>
                  <span>Estimated by <strong className="text-brand">{deliveryDateEstimate}</strong></span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 text-theme-muted">
                <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-theme-text block">Ledger Status</span>
                  <span>
                    {isOut 
                      ? <span className="text-red-400">Sold out</span> 
                      : <span>Only <strong className="text-brand">{product.inventory}</strong> items left</span>
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout & Action triggers */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOut}
                className={`flex-1 inline-flex items-center justify-center space-x-2 rounded-2xl py-3.5 text-sm font-bold transition-all ${
                  isOut
                    ? 'bg-theme-card/10 border border-theme-border text-theme-muted cursor-not-allowed'
                    : 'border border-brand text-brand hover:bg-brand/5 shadow-lg shadow-brand/5'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOut}
                className={`flex-1 inline-flex items-center justify-center space-x-2 rounded-2xl py-3.5 text-sm font-bold transition-all ${
                  isOut
                    ? 'bg-theme-card/10 text-theme-muted cursor-not-allowed'
                    : 'bg-brand hover:bg-brand-hover text-white shadow-xl shadow-brand/10'
                }`}
              >
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isWishlisted ? 'bg-brand/10 border-brand text-brand' : 'border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Technical Specification details */}
        <section className="mb-16 border-t border-theme-border/50 pt-12">
          <h2 className="font-display text-xl font-bold text-theme-text mb-6">Technical Specifications</h2>
          <div className="glass-panel rounded-3xl overflow-hidden border border-theme-border">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {Object.entries(product.specs).map(([specKey, specVal], index) => (
                  <tr key={index} className="border-b border-theme-border/40 hover:bg-white/5 transition-colors">
                    <td className="w-1/3 p-4 font-bold uppercase tracking-wider text-theme-muted border-r border-theme-border/30">{specKey}</td>
                    <td className="p-4 text-theme-text">{specVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User reviews list and review posting portal */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-theme-border/50 pt-12 mb-16">
          
          {/* Reviews Summary */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-theme-text">Concierge Feedback Ledger</h2>
            
            <div className="glass-panel rounded-3xl p-6 border border-theme-border text-center space-y-4">
              <div className="text-4xl font-extrabold text-brand">{product.average_rating}</div>
              <div className="flex justify-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`h-4 w-4 ${s <= Math.round(product.average_rating) ? 'fill-current' : 'text-theme-muted'}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-theme-muted">Based on {productReviews.length} designer audits</p>
            </div>

            {/* Post Review Form */}
            {currentUser && (
              <form onSubmit={handleReviewSubmit} className="glass-panel rounded-3xl p-6 border border-theme-border space-y-4">
                <h3 className="text-sm font-bold text-theme-text">Submit Concierge Audit</h3>
                
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Rating</span>
                  <div className="flex space-x-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-5 w-5 ${star <= userRating ? 'fill-current' : 'text-theme-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-theme-muted block">Comments</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Audit quality review details..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 p-3 text-xs outline-none focus:border-brand"
                  />
                </div>

                {reviewSubmitted && (
                  <div className="text-[10px] text-green-400 font-semibold">
                    Review logged and added to average score updates.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand text-white py-2 text-xs font-semibold hover:bg-brand-hover transition-colors"
                >
                  Submit Audit
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-theme-muted mb-4">Audit entries</h3>
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div key={rev.id} className="glass-panel rounded-3xl p-5 border border-theme-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-theme-text">{rev.user_name}</h4>
                      <span className="text-[9px] text-theme-muted">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= rev.rating ? 'fill-current' : 'text-theme-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-xs text-theme-muted py-6 text-center">
                No designer reviews logged yet. Be the first to audit!
              </div>
            )}
          </div>
        </section>

        {/* Related Artifacts Carousel */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-theme-border/50 pt-12">
            <h2 className="font-display text-xl font-bold text-theme-text mb-6">Similar Artifacts</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="glass-panel rounded-3xl p-4 border border-theme-border flex flex-col h-full hover:border-brand/20 transition-all cursor-pointer"
                  onClick={() => {
                    router.push(`/products/${prod.id}`);
                  }}
                >
                  <div className="h-40 rounded-xl overflow-hidden mb-3 bg-black/20">
                    <img src={prod.images[0]} alt={prod.title} className="h-full w-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-theme-text line-clamp-1">{prod.title}</h4>
                  <span className="text-xs font-bold text-brand block mt-1">${prod.price}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}
