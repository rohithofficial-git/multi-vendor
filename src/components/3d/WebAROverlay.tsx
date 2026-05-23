'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebAROverlayProps {
  imageUrl: string;
  onClose: () => void;
}

export default function WebAROverlay({ imageUrl, onClose }: WebAROverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Drag state for the floating image
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Initialize camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
        setError("Camera access is required for Web AR. Please enable permissions.");
      }
    }
    
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden touch-none">
      
      {/* Video Background */}
      {error ? (
        <div className="text-white text-center p-6 z-10">
          <p className="text-red-400 font-bold mb-2">AR Initialization Failed</p>
          <p className="text-sm text-theme-muted">{error}</p>
        </div>
      ) : (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Floating Artifact (Image) */}
      {!error && (
        <motion.div
          drag
          dragMomentum={false}
          onDrag={(e, info) => setPosition({ x: position.x + info.delta.x, y: position.y + info.delta.y })}
          style={{ x: position.x, y: position.y, scale }}
          className="absolute z-20 cursor-move"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border-2 border-white/20 bg-black/40 backdrop-blur-sm">
            <img 
              src={imageUrl} 
              alt="AR View" 
              className={`object-contain transition-all duration-300 ${isExpanded ? 'w-[80vw] h-[60vh]' : 'w-[250px] h-[350px]'}`} 
            />
            {/* Holographic scanning effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-full h-[20%] animate-[scan_2s_linear_infinite]" />
          </div>
        </motion.div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <span className="bg-brand text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-brand/20">
            Web AR Mode
          </span>
          <p className="text-white/80 text-xs mt-2 font-mono drop-shadow-md">
            Drag to reposition • Pinch to scale
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/20 text-white p-2 rounded-full hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-30 pointer-events-auto">
        <button 
          onClick={() => setScale(Math.max(0.5, scale - 0.2))}
          className="bg-black/50 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-brand transition-all"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => { setPosition({ x: 0, y: 0 }); setScale(1); }}
          className="bg-black/50 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full hover:bg-brand transition-all flex items-center space-x-2 text-sm font-semibold"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button 
          onClick={() => setScale(Math.min(2.5, scale + 0.2))}
          className="bg-black/50 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-brand transition-all"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
