// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, RefreshCw, Box, Smartphone, Check } from 'lucide-react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ProductViewer3DProps {
  modelUrl: string;
  iosModelUrl?: string;
  posterUrl?: string;
  altText?: string;
  dimensions?: { width: string; height: string; depth: string };
  onClose?: () => void;
}

export default function ProductViewer3D({ modelUrl, iosModelUrl, posterUrl, altText, dimensions, onClose }: ProductViewer3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScreenshotToast, setShowScreenshotToast] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const resetCamera = () => {
    if (viewerRef.current) {
      // @ts-expect-error Resetting camera requires DOM method on custom element
      viewerRef.current.cameraOrbit = "0deg 75deg 105%";
    }
  };

  const handleARClick = () => {
    if (viewerRef.current) {
      try {
        // @ts-expect-error Activate AR is a method on model-viewer
        viewerRef.current.activateAR();
      } catch (err) {
        console.warn("AR not supported on this device natively.", err);
        alert("To view in your physical space, please open this URL on your smartphone!");
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-gradient-to-tr from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-brand/20 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'h-screen rounded-none z-[9999]' : 'h-[500px]'
      }`}
    >
      
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-white font-semibold uppercase tracking-wider">360° Studio View</span>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={resetCamera}
            className="p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all tooltip-trigger relative group"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="absolute -bottom-8 right-0 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Reset Angle</span>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all tooltip-trigger relative group"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="absolute -bottom-8 right-0 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
            </span>
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-brand text-white rounded-full font-semibold text-xs hover:bg-brand-hover transition-all shadow-lg"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Viewer */}
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        ios-src={iosModelUrl}
        poster={posterUrl}
        alt={altText || "Interactive 3D model preview"}
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
        style={{ width: '100%', height: '100%', outline: 'none', backgroundColor: 'transparent' }}
      >
        {/* Manual AR Button to bypass auto-hiding */}
        <button 
          onClick={handleARClick}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3.5 px-8 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 z-50"
        >
          <Smartphone className="h-5 w-5 text-brand" />
          <span className="uppercase tracking-wide text-xs">View in Your Space</span>
        </button>
        
        {/* Loading Indicator */}
        <div slot="progress-bar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
           <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-3"></div>
           <span className="text-white text-xs font-semibold tracking-widest uppercase">Loading Asset...</span>
        </div>
      </model-viewer>
      
      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex justify-between items-end">
        <div className="pointer-events-auto">
          {dimensions && (
            <div className="text-[10px] text-gray-300 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              <span className="font-bold text-white">Dims:</span> {dimensions.width}w × {dimensions.height}h × {dimensions.depth}d
            </div>
          )}
        </div>
        <div className="flex flex-col items-end pointer-events-none">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold drop-shadow-md">Scroll to Zoom • Drag to Rotate</p>
        </div>
      </div>
      
    </div>
  );
}
