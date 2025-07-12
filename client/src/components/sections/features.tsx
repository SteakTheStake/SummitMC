import { Eye, Gauge, Leaf, Puzzle, RotateCcw, Layers } from "lucide-react";

import medievalTower from "@assets/2025-02-13_02.00.29_1752292199050.webp";
import modernHouse from "@assets/2025-03-20_17.23.13_1752292199050.webp";
import cherryTrees from "@assets/2025-05-02_23.46.20_1752292199051.webp";

const features = [
  {
    icon: Eye,
    title: "Balanced Realism",
    description: "Enhanced textures that maintain Minecraft's iconic aesthetic while adding realistic details that feel natural and immersive."
  },
  {
    icon: Gauge,
    title: "Optimized Performance",
    description: "Lightweight design ensures smooth gameplay across different systems without compromising visual quality."
  },
  {
    icon: Leaf,
    title: "Natural Beauty",
    description: "Focus on making the world more vivid yet familiar, with enhanced terrain and environmental textures."
  },
  {
    icon: Puzzle,
    title: "Mod Support",
    description: "Works seamlessly with Continuity mod for enhanced features and connects with custom entity models."
  },
  {
    icon: RotateCcw,
    title: "Regular Updates",
    description: "Constantly evolving with new textures, improvements, and support for the latest Minecraft versions."
  },
  {
    icon: Layers,
    title: "Multiple Resolutions",
    description: "Choose from 16x, 32x, 64x, or 512x resolutions to match your system's capabilities and preferences."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            Why Choose <span className="text-teal-400">Summit?</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Carefully crafted textures that bring new life to your Minecraft world
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="glassmorphism p-8 rounded-2xl texture-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="font-pixelbasel font-semibold text-xl mb-4 text-teal-400">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Showcase Examples */}
        <div className="text-center mb-12">
          <h3 className="font-pixelbasel font-bold text-3xl mb-4">
            See It In <span className="text-teal-400">Action</span>
          </h3>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real builds showcasing the Summit texture pack's capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={medievalTower} 
                alt="Medieval architecture with Summit textures"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Medieval Style</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 text-teal-400">Castle & Towers</h4>
            <p className="text-slate-300">Enhanced stone textures make medieval builds look more authentic and detailed</p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={modernHouse} 
                alt="Modern house with realistic textures"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Modern Style</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 text-teal-400">Contemporary Homes</h4>
            <p className="text-slate-300">Clean lines and modern materials enhanced with realistic lighting and shadows</p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={cherryTrees} 
                alt="Cherry grove with enhanced foliage"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Nature</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 text-teal-400">Natural Landscapes</h4>
            <p className="text-slate-300">Vibrant foliage and natural textures that bring the outdoors to life</p>
          </div>
        </div>
      </div>
    </section>
  );
}
