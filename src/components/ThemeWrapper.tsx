'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import ToastNotifications from './ToastNotifications';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const activeTheme = useStore(state => state.activeTheme);
  const initialize = useStore(state => state.initialize);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Fetch data from Supabase on app mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!mounted) return;
    
    // Remove existing themes
    document.documentElement.classList.remove(
      'theme-dark-luxury',
      'theme-light-minimal',
      'theme-cyberpunk'
    );
    
    // Add current theme
    document.documentElement.classList.add(`theme-${activeTheme}`);
  }, [activeTheme, mounted]);

  // Prevent flash by forcing default background color matching during hydration
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500`}>
      {children}
      <ToastNotifications />
    </div>
  );
}
