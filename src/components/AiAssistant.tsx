'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  ShoppingBag,
  Star,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  matchedProductIds?: string[];
  isCustomCard?: boolean;
}

export default function AiAssistant() {
  const { products, addToCart, cart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to Aetheris Horizon. I am your concierge intelligence. How can I help you discover our artisan watch collections, high-end acoustics, or unique decor today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Suggestions for fast onboarding
  const suggestions = [
    { text: '🔍 Show me luxury watches', query: 'watch' },
    { text: '🎟️ Active coupon codes', query: 'coupon' },
    { text: '🚚 Shipping & returns', query: 'shipping' },
    { text: '🔊 Recommend acoustics', query: 'acoustics' }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Concierge responding mechanism
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let replyText = '';
      let matchedIds: string[] = [];

      // 1. Check for product query matches in the DB
      const matched = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        Object.values(p.specs).some(spec => spec.toLowerCase().includes(query))
      );

      if (query.includes('coupon') || query.includes('discount') || query.includes('promo')) {
        replyText = "We have 3 active designer discount codes for you: \n\n• **NEON50** — Save 50% on selected cyber art.\n• **STARTUP20** — Save 20% on living spaces.\n• **WELCOME10** — 10% off your initial purchase.\n\nYou can enter these codes at checkout or directly in your shopping bag view.";
      } else if (query.includes('shipping') || query.includes('delivery') || query.includes('return') || query.includes('refund')) {
        replyText = "Aetheris runs a custom hyper-freight logistics network. \n\n• **Shipping**: Domestic delivery is secured in 24 hours. International routes take 3-5 business days. Both are fully insured.\n• **Returns**: We offer a 30-day premium return log with free home courier pickup. Refunds clear within 48 hours.";
      } else if (query.includes('sell') || query.includes('seller') || query.includes('studio') || query.includes('merchant')) {
        replyText = "You can open your own digital workshop instantly! Switch to 'Seller Mode' in the sidebar account dropdown, or tap the 'Seller Studio' link to access your sales ledger and add custom artifacts.";
      } else if (matched.length > 0) {
        replyText = `I have analyzed our secure catalog ledger and found ${matched.length} artifact${matched.length > 1 ? 's' : ''} matching your inquiry:`;
        matchedIds = matched.slice(0, 3).map(p => p.id);
      } else {
        // Fallback response with search categories
        replyText = "I couldn't locate precise matches in our ledger. Try looking for 'watches', 'camera', 'table', or ask about 'delivery timescale'.";
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        matchedProductIds: matchedIds
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating launcher bubble */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-6 md:right-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 hover:bg-brand-hover transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Toggle AI Concierge"
        >
          <span className="absolute inset-0 rounded-full bg-brand/30 animate-pulse-glow" />
          <MessageSquare className="h-6 w-6 relative z-10" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 border-2 border-black">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          </span>
        </button>

        {/* Chat window overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed inset-0 z-50 flex flex-col bg-theme-bg-from/98 border-theme-border backdrop-blur-2xl shadow-2xl 
                sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:w-96 sm:rounded-3xl sm:border sm:shadow-brand/5
                transition-all duration-300 overflow-hidden
                ${isExpanded ? 'sm:w-[500px] sm:h-[650px]' : 'sm:h-[550px]'}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-theme-border bg-black/20 px-4 py-4 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-1.5">
                      Aetheris Concierge
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </h2>
                    <p className="text-[10px] text-theme-muted">Autonomous Intelligence</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* Minimize / Maximize Desktop Control */}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:flex rounded-lg p-1.5 text-theme-muted hover:text-theme-text hover:bg-white/5 transition-colors"
                    title={isExpanded ? "Collapse" : "Expand Window"}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1.5 text-theme-muted hover:text-theme-text hover:bg-white/5 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Logs Area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Speech bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-brand text-white rounded-tr-none'
                          : 'bg-theme-card border border-theme-border text-theme-text rounded-tl-none'
                      }`}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {msg.text}
                    </div>

                    {/* Inline product recommendations */}
                    {msg.matchedProductIds && msg.matchedProductIds.length > 0 && (
                      <div className="mt-3 w-full max-w-[90%] space-y-2">
                        {msg.matchedProductIds.map(prodId => {
                          const prod = products.find(p => p.id === prodId);
                          if (!prod) return null;
                          const isInBag = cart.some(item => item.product_id === prod.id);

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={prod.id}
                              className="flex gap-3 rounded-2xl border border-theme-border bg-theme-card/30 p-3 hover:border-brand/40 transition-colors duration-300"
                            >
                              <img
                                src={prod.images[0]}
                                alt={prod.title}
                                className="h-14 w-14 rounded-xl object-cover border border-theme-border/50 bg-black/10"
                              />
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xs font-bold text-theme-text truncate">{prod.title}</h4>
                                  <div className="flex items-center text-[10px] text-amber-500 mt-0.5">
                                    <Star className="h-3 w-3 fill-current mr-0.5" />
                                    <span>{prod.average_rating}</span>
                                    <span className="text-theme-muted ml-2">(${prod.price})</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => addToCart(prod.id, 1)}
                                  disabled={prod.inventory === 0}
                                  className={`w-full mt-1.5 flex items-center justify-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
                                    prod.inventory === 0
                                      ? 'bg-theme-card/10 text-theme-muted border border-theme-border cursor-not-allowed'
                                      : isInBag
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-brand hover:bg-brand-hover text-white'
                                  }`}
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  <span>{prod.inventory === 0 ? 'Out of stock' : isInBag ? 'Add More' : 'Add to Bag'}</span>
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Status */}
                {isTyping && (
                  <div className="flex items-center space-x-2 bg-theme-card border border-theme-border rounded-2xl rounded-tl-none px-4 py-3.5 w-16">
                    <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Panel */}
              {messages.length === 1 && (
                <div className="px-4 py-2 shrink-0 border-t border-theme-border bg-black/5">
                  <p className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold mb-2">Recommended Queries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s.query)}
                        className="text-[10px] font-medium text-theme-text bg-theme-card hover:bg-brand/10 border border-theme-border hover:border-brand/30 px-2.5 py-1.5 rounded-full transition-all duration-300 active:scale-95"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="border-t border-theme-border bg-black/10 px-4 py-3 flex items-center gap-2 shrink-0 pb-6 sm:pb-3"
              >
                <input
                  type="text"
                  placeholder="Ask Concierge Intelligence..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-grow rounded-xl border border-theme-border bg-theme-bg-from/50 px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-muted/50 outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
