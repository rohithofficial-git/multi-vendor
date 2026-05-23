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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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

  // Canvas background removal
  useEffect(() => {
    if (!imageUrl || !canvasRef.current || !imgRef.current) return;
    
    const img = imgRef.current;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample top-left pixel as background color
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate distance from background color
          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + 
            Math.pow(g - bgG, 2) + 
            Math.pow(b - bgB, 2)
          );
          
          // If the pixel is very close to the background color, make it transparent
          if (dist < 35) {
            data[i + 3] = 0; // Fully transparent
          } else if (dist < 60) {
            // Smooth edge transition
            data[i + 3] = Math.floor(((dist - 35) / 25) * 255);
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      } catch (e) {
        console.error("Canvas CORS error, cannot remove background", e);
      }
    };
    
    // Trigger load
    img.src = imageUrl;
  }, [imageUrl]);

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
          <div className="relative pointer-events-none group">
            {/* Hidden image source for canvas drawing */}
            <img ref={imgRef} src="" alt="" className="hidden" />
            
            <canvas 
              ref={canvasRef}
              className={`object-contain transition-all duration-300 pointer-events-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] ${isExpanded ? 'w-[80vw] h-[60vh]' : 'w-[350px] h-[450px]'}`}
            />
            {/* Holographic scanning effect overlaid strictly on the image area */}
            <div className="absolute inset-0 mix-blend-screen opacity-50 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent w-full h-[20%] animate-[scan_2s_linear_infinite] pointer-events-none rounded-xl" />
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
