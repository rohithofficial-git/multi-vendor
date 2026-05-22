import React from 'react';
import VRShowroom from '@/components/3d/VRShowroom';
import VirtualTryOn from '@/components/3d/VirtualTryOn';
import ProductViewer3D from '@/components/3d/ProductViewer3D';

export const metadata = {
  title: 'Next-Gen VR Showroom | Cyberpunk Marketplace',
  description: 'Experience immersive AR/VR shopping with realistic scaling, virtual try-ons, and a futuristic 3D showroom.',
};

export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30">
      {/* Hero Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-fuchsia-600/10 blur-[120px] -z-10 rounded-full"></div>
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 tracking-tight">
            IMMERSIVE COMMERCE
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Step into the future of shopping. Experience products in your real world with AR, try them on virtually, or explore our cyberpunk VR showroom.
          </p>
        </div>

        {/* VR Showroom Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
            <h2 className="text-2xl font-mono text-cyan-400 tracking-widest uppercase">VR Showroom Mode</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
          </div>
          <VRShowroom />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          {/* AR View Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                View In Your Space (AR)
              </h2>
              <p className="text-gray-400">
                Place our premium furniture and electronics in your room instantly. Accurate scaling, realistic shadows, and adaptive lighting.
              </p>
            </div>
            
            <ProductViewer3D 
              modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              posterUrl="https://modelviewer.dev/shared-assets/models/Astronaut.png"
              altText="A 3D model of an astronaut"
            />
          </div>

          {/* Virtual Try-On Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500">
                AI Virtual Try-On
              </h2>
              <p className="text-gray-400">
                Try on glasses, hats, and jewelry in real-time. Our advanced AI tracks your face and movements for a perfect digital fit.
              </p>
            </div>
            
            <VirtualTryOn />
          </div>
          
        </div>
      </section>
      
      {/* AI Recommendation Banner */}
      <section className="border-y border-gray-800 bg-gray-900/50 backdrop-blur-lg py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
              AI Room Intelligence Active
            </h3>
            <p className="text-gray-400 max-w-xl">
              While using AR View, our AI analyzes your room's style and lighting to suggest the perfect matching decor.
            </p>
          </div>
          <button className="px-8 py-4 border border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black transition-all font-mono tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            Explore AI Suggestions
          </button>
        </div>
      </section>
    </div>
  );
}
