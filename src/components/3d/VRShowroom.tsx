"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Float, Text, ContactShadows, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

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

function HolographicProduct() {
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
      </mesh>
    </Float>
  );
}

export default function VRShowroom() {
  return (
    <div className="w-full h-[80vh] min-h-[600px] bg-black relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.2)] border border-fuchsia-500/20">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase tracking-widest font-mono">
          Virtual Showroom
        </h2>
        <p className="text-cyan-400/70 font-mono text-sm">Interactive 3D Environment // WebXR Ready</p>
      </div>

      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        <color attach="background" args={['#050510']} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />
        <pointLight position={[10, -10, 10]} intensity={1} color="#ff00ff" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group position={[0, -1, 0]}>
          <NeonPedestal />
          <HolographicProduct />
          
          <Text 
            position={[0, 2.5, 0]} 
            fontSize={0.4} 
            color="#00f3ff" 
            anchorX="center" 
            anchorY="middle"
            font="https://fonts.gstatic.com/s/syncopate/v12/pe0sMIuPIYBCpEV5eFdCBfe_.woff"
          >
            PREMIUM ITEM
          </Text>
          
          <ContactShadows position={[0, -0.9, 0]} opacity={0.7} scale={10} blur={2} far={4} color="#ff00ff" />
        </group>
        
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 + 0.1} 
          minDistance={3} 
          maxDistance={15} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
        <Environment preset="night" />
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono uppercase tracking-wider py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300">
          Enter VR Mode
        </button>
        <button className="bg-black/50 border border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 font-mono uppercase tracking-wider py-3 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 backdrop-blur-md">
          View Details
        </button>
      </div>
      
      {/* UI Overlay scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
    </div>
  );
}
