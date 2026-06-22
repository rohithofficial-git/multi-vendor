'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  ShoppingBag,
  Package,
  X,
} from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  icon?: React.ReactNode;
  progress: number; // 100 → 0
}

const TOAST_DURATION = 4000; // ms

// Map notification type to icon override for cart/order context
function resolveIcon(title: string, type: Toast['type']) {
  const lower = title.toLowerCase();
  if (lower.includes('bag') || lower.includes('cart') || lower.includes('removed')) {
    return <ShoppingBag className="h-4 w-4" />;
  }
  if (lower.includes('order') || lower.includes('artifact') || lower.includes('shipped')) {
    return <Package className="h-4 w-4" />;
  }
  switch (type) {
    case 'success':  return <CheckCircle className="h-4 w-4" />;
    case 'error':    return <AlertCircle className="h-4 w-4" />;
    case 'warning':  return <AlertTriangle className="h-4 w-4" />;
    default:         return <Info className="h-4 w-4" />;
  }
}

const TYPE_STYLES: Record<Toast['type'], { border: string; icon: string; progress: string; bg: string }> = {
  success: {
    border: 'border-emerald-500/40',
    icon:   'text-emerald-400 bg-emerald-500/15',
    progress: 'bg-emerald-500',
    bg: 'bg-emerald-500/5',
  },
  error: {
    border: 'border-red-500/40',
    icon:   'text-red-400 bg-red-500/15',
    progress: 'bg-red-500',
    bg: 'bg-red-500/5',
  },
  warning: {
    border: 'border-amber-500/40',
    icon:   'text-amber-400 bg-amber-500/15',
    progress: 'bg-amber-500',
    bg: 'bg-amber-500/5',
  },
  info: {
    border: 'border-blue-500/40',
    icon:   'text-blue-400 bg-blue-500/15',
    progress: 'bg-blue-500',
    bg: 'bg-blue-500/5',
  },
};

export default function ToastNotifications() {
  const notifications = useStore(state => state.notifications);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  const timers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearInterval(timer);
    timers.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Watch notifications and spawn toasts for new ones
  useEffect(() => {
    const latest = notifications[0];
    if (!latest || seenIds.current.has(latest.id)) return;
    seenIds.current.add(latest.id);

    const newToast: Toast = {
      id: latest.id,
      title: latest.title,
      message: latest.message,
      type: latest.type as Toast['type'],
      icon: resolveIcon(latest.title, latest.type as Toast['type']),
      progress: 100,
    };

    setToasts(prev => {
      // Keep max 5 toasts
      const next = [newToast, ...prev].slice(0, 5);
      return next;
    });

    // Countdown progress bar
    const step = (100 / TOAST_DURATION) * 50; // update every 50ms
    const timer = setInterval(() => {
      setToasts(prev => {
        const updated = prev.map(t => {
          if (t.id !== newToast.id) return t;
          const next = t.progress - step;
          if (next <= 0) return { ...t, progress: 0 };
          return { ...t, progress: next };
        });
        return updated;
      });
    }, 50);

    timers.current.set(newToast.id, timer);

    // Auto-dismiss
    setTimeout(() => removeToast(newToast.id), TOAST_DURATION);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-4 z-[9999] flex flex-col-reverse gap-3 w-full max-w-sm pointer-events-none"
      style={{ paddingBottom: '60px' }} // clear mobile bottom nav
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const styles = TYPE_STYLES[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className={`
                relative pointer-events-auto overflow-hidden rounded-2xl border
                backdrop-blur-xl shadow-2xl
                ${styles.border} ${styles.bg}
              `}
              style={{
                background: 'rgba(10, 10, 20, 0.88)',
              }}
            >
              {/* Content */}
              <div className="flex items-start gap-3 px-4 py-3.5">
                {/* Icon */}
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
                  {toast.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-semibold text-white leading-tight truncate">{toast.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{toast.message}</p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors rounded-lg p-0.5 hover:bg-white/10"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                <motion.div
                  className={`h-full ${styles.progress} rounded-full`}
                  style={{ width: `${toast.progress}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
