"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCcw, Maximize2, Zap, AlertCircle } from 'lucide-react';

export default function VirtualTryOn() {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startTryOn = async () => {
    setIsLoading(true);
    try {
      // Simulate loading AI models (MediaPipe/TensorFlow)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please enable camera access to use Virtual Try-On.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopTryOn = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      stopTryOn();
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-gray-900 border border-fuchsia-500/30 shadow-[0_0_40px_rgba(255,0,255,0.15)] aspect-[4/5] sm:aspect-video flex flex-col items-center justify-center">
      
      {!isActive && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full bg-fuchsia-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,255,0.3)]">
            <Zap size={40} className="text-fuchsia-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4 font-mono tracking-wide">AI Virtual Try-On</h3>
          <p className="text-gray-400 mb-8 max-w-md">
            Experience our next-gen real-time fitting using face and hand tracking. See how it looks on you instantly.
          </p>
          <button 
            onClick={startTryOn}
            className="group relative px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,0,255,0.5)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Camera size={20} />
              Enable Camera
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900/90 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4"></div>
          <p className="text-fuchsia-400 font-mono tracking-widest animate-pulse">INITIALIZING AI MODELS...</p>
        </div>
      )}

      {/* Video Stream Container */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: 'scaleX(-1)' }} // Mirror effect
      />

      {/* UI Overlay when active */}
      {isActive && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-white font-mono">LIVE TRACKING</span>
            </div>
            <button 
              onClick={stopTryOn}
              className="pointer-events-auto bg-black/50 hover:bg-red-500/50 backdrop-blur-md p-3 rounded-full border border-red-500/30 text-white transition-colors"
            >
              <AlertCircle size={20} />
            </button>
          </div>

          {/* AR Simulated Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-cyan-400/50 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
            <div className="w-full h-[1px] bg-cyan-400/30"></div>
            <div className="h-full w-[1px] bg-cyan-400/30 absolute"></div>
          </div>

          <div className="flex justify-center gap-4 pointer-events-auto">
            <button className="bg-black/60 hover:bg-black/80 backdrop-blur-md p-4 rounded-full border border-gray-600 text-white transition-all hover:scale-110">
              <RefreshCcw size={24} />
            </button>
            <button className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] backdrop-blur-md p-4 rounded-full text-white transition-all hover:scale-110">
              <Camera size={24} />
            </button>
            <button className="bg-black/60 hover:bg-black/80 backdrop-blur-md p-4 rounded-full border border-gray-600 text-white transition-all hover:scale-110">
              <Maximize2 size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
