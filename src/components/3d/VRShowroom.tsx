"use client";

import React, { useRef, useState, useEffect, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, MeshDistortMaterial, ContactShadows, Environment, DeviceOrientationControls } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Error boundary – catches WebGL / R3F crashes and shows a fallback instead
// ---------------------------------------------------------------------------
class CanvasErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}



// ---------------------------------------------------------------------------
// 3-D scene sub-components
// ---------------------------------------------------------------------------
function NeonPedestal() {
  return (
    <group position={[0, -1, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[2, 2.5, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial color="#00f3ff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function HolographicProduct({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
        <octahedronGeometry args={[1, 0]} />
        {isMobile ? (
          <meshStandardMaterial color="#ff00ff" metalness={0.9} roughness={0.1} />
        ) : (
          <MeshDistortMaterial
            color="#ff00ff"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2}
          />
        )}
      </mesh>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Fallback shown when WebGL is unavailable or the Canvas throws
// ---------------------------------------------------------------------------
function WebGLFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 z-20 rounded-3xl px-6 text-center">
      <div className="w-16 h-16 rounded-full border-2 border-fuchsia-500 flex items-center justify-center text-3xl">
        🥽
      </div>
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-mono uppercase tracking-widest">
        3D Preview Unavailable
      </h3>
      <p className="text-gray-400 text-sm max-w-xs font-mono">
        Your browser or device doesn&apos;t support WebGL. Try opening this page in Chrome or Safari on a
        modern device.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function VRShowroom() {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [vrToast, setVrToast] = useState<string | null>(null);
  const [gyroActive, setGyroActive] = useState(false);

  // ── Detect mobile & WebGL support on mount ────────────────────────────────
  useEffect(() => {
    const checkMobile = () => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };
    setIsMobile(checkMobile() || window.matchMedia('(max-width: 768px)').matches);
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(checkMobile() || e.matches);
    mobileQuery.addEventListener('change', handler);

    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    return () => mobileQuery.removeEventListener('change', handler);
  }, []);

  // ── Request iOS gyroscope permission ─────────────────────────────────────
  const requestGyroPermission = async (): Promise<boolean> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DevOrEvent = typeof window !== 'undefined' ? (window as any).DeviceOrientationEvent : undefined;
    if (DevOrEvent && typeof DevOrEvent.requestPermission === 'function') {
      try {
        const result: string = await DevOrEvent.requestPermission();
        return result === 'granted';
      } catch {
        return false;
      }
    }
    // Android / non-iOS: assume granted as it doesn't require explicit permission API
    return true;
  };

  // ── "Enter VR Mode" handler ───────────────────────────────────────────────
  const handleEnterVR = async () => {
    // ── Mobile: gyroscope 360° look-around ───────────────────────────────
    if (isMobile) {
      if (gyroActive) {
        setGyroActive(false);
        setVrToast('Gyro look-around disabled.');
        setTimeout(() => setVrToast(null), 2500);
        return;
      }

      // Try immersive-vr first (Cardboard / standalone headset)
      if (navigator.xr) {
        const vrSupported = await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
        if (vrSupported) {
          try {
            const session = await navigator.xr.requestSession('immersive-vr');
            session.addEventListener('end', () => console.log('VR session ended'));
            return;
          } catch {
            // fall through to gyro
          }
        }
      }

      // Fallback: device-orientation gyro
      const granted = await requestGyroPermission();
      if (!granted) {
        setVrToast('Gyroscope not detected on this device.');
        setTimeout(() => setVrToast(null), 4000);
        return;
      }

      setGyroActive(true);
      setVrToast('📱 Tilt your phone to look around!');
      setTimeout(() => setVrToast(null), 3500);
      return;
    }

    // ── Desktop: full immersive-vr ────────────────────────────────────────
    if (!navigator.xr) {
      setVrToast('WebXR is not supported on this browser. Try Chrome on an Android device with a VR headset.');
      setTimeout(() => setVrToast(null), 4000);
      return;
    }
    const supported = await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
    if (!supported) {
      setVrToast('No VR headset detected. Connect a WebXR-compatible headset and try again.');
      setTimeout(() => setVrToast(null), 4000);
      return;
    }
    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      session.addEventListener('end', () => console.log('VR session ended'));
    } catch (err) {
      console.error('VR session error:', err);
      setVrToast('Failed to start VR session. Please try again.');
      setTimeout(() => setVrToast(null), 4000);
    }
  };

  const canvasHeight = isMobile ? 'h-[55vw] min-h-[280px] max-h-[400px]' : 'h-[80vh] min-h-[500px]';

  const vrButtonLabel = isMobile
    ? gyroActive ? '⏹ Exit 360° View' : '📱 360° VR View'
    : 'Enter VR Mode';

  return (
    <div
      className={`w-full ${canvasHeight} bg-black relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.2)] border border-fuchsia-500/20`}
    >
      {/* Header overlay */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-col gap-1">
        <h2 className="text-lg sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase tracking-widest font-mono">
          Virtual Showroom
        </h2>
        <p className="text-cyan-400/70 font-mono text-xs sm:text-sm">
          {gyroActive ? '🌀 Gyro Active — tilt to look around' : 'Interactive 3D Environment // WebXR Ready'}
        </p>
      </div>

      {/* WebGL not supported — static fallback */}
      {!webglSupported && <WebGLFallback />}

      {/* 3-D Canvas */}
      {webglSupported && (
        <CanvasErrorBoundary onError={() => setWebglSupported(false)}>
          <Canvas
            shadows={!isMobile}
            camera={{ position: [0, 2, 8], fov: isMobile ? 55 : 45 }}
            gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
            dpr={[1, isMobile ? 1.5 : 2]}
          >
            <color attach="background" args={['#050510']} />

            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow={!isMobile} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />
            <pointLight position={[10, -10, 10]} intensity={1} color="#ff00ff" />

            <Stars
              radius={100}
              depth={50}
              count={isMobile ? 1500 : 5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />

            <group position={[0, -1, 0]}>
              <NeonPedestal />
              <HolographicProduct isMobile={isMobile} />
              {!isMobile && (
                <ContactShadows
                  position={[0, -0.9, 0]}
                  opacity={0.7}
                  scale={10}
                  blur={2}
                  far={4}
                  color="#ff00ff"
                />
              )}
            </group>

            {/* Gyro controls on mobile when active, otherwise orbit */}
            {gyroActive && <DeviceOrientationControls />}
            {!gyroActive && (
              <OrbitControls
                enablePan={false}
                maxPolarAngle={Math.PI / 2 + 0.1}
                minDistance={isMobile ? 4 : 3}
                maxDistance={15}
                autoRotate
                autoRotateSpeed={0.5}
              />
            )}

            {!isMobile && <Environment preset="night" />}
          </Canvas>
        </CanvasErrorBoundary>
      )}

      {/* CTA buttons */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 whitespace-nowrap">
        <button
          onClick={handleEnterVR}
          className={`${gyroActive
            ? 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
            : 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(255,0,255,0.4)]'
          } active:scale-95 text-white font-mono uppercase tracking-wider py-2 px-5 sm:py-3 sm:px-8 text-xs sm:text-sm rounded-full transition-all duration-300`}
        >
          {vrButtonLabel}
        </button>
        <button className="bg-black/50 border border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 active:scale-95 font-mono uppercase tracking-wider py-2 px-5 sm:py-3 sm:px-8 text-xs sm:text-sm rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 backdrop-blur-md">
          View Details
        </button>
      </div>

      {/* VR toast notification */}
      {vrToast && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30 bg-gray-900/95 border border-fuchsia-500/50 text-white text-xs sm:text-sm font-mono py-3 px-4 rounded-2xl shadow-[0_0_20px_rgba(255,0,255,0.3)] backdrop-blur-md text-center">
          {vrToast}
        </div>
      )}

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
    </div>
  );
}
