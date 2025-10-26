import { Eye, Gauge, Leaf, Puzzle, RotateCcw, Layers } from "lucide-react";

import oresVisible from "@/assets/screenshots/ore-emerald-diamond-pick.png";
import villageViews from "@/assets/screenshots/village-plains-big-render-dist.png";
import buildUntouched from "@/assets/screenshots/small-medieval-vilage-home.png";

const features = [
  {
    icon: Eye,
    title: "Realistic",
    description: "Enhanced detail. Minecraft feel preserved."
  },
  {
    icon: Gauge,
    title: "Optimized",
    description: "Runs smooth. All systems."
  },
  {
    icon: Leaf,
    title: "Nature",
    description: "Vivid environments. Beautiful landscapes."
  },
  {
    icon: Puzzle,
    title: "Mod Support",
    description: "Textures for Puzzle Mod, Stellaris, Waystones, and more."
  },
  {
    icon: RotateCcw,
    title: "Updated",
    description: "Regular improvements. Latest versions."
  },
  {
    icon: Layers,
    title: "Multiple Resolutions",
    description: "32x to 64x available."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            What Summit offers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const iconColors = [
              'minecraft-green',
              'minecraft-blue',
              'minecraft-gold',
              'minecraft-green',
              'minecraft-red',
              'minecraft-blue'
            ];
            const bgColors = [
              'bg-green-600',
              'bg-blue-600',
              'bg-yellow-600',
              'bg-green-600',
              'bg-red-600',
              'bg-blue-600'
            ];
            return (
              <div key={index} className="glassmorphism p-8 rounded-2xl texture-hover">
                <div className={`w-16 h-16 ${bgColors[index]} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className={`font-pixelbasel font-semibold text-xl mb-4 ${iconColors[index]}`}>{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Showcase Examples */}
        <div className="text-center mb-12">
          <h3 className="font-pixelbasel font-bold text-3xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Examples</span>
          </h3>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Summit in action
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={oresVisible} 
                alt="No more worrying about not seeing ores with a realistic texture pack"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Emerald Ore</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 minecraft-green">Ore's are easy to spot!</h4>
            <p className="text-slate-300">No need to double check, You already know what it is.</p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={villageViews} 
                alt="Modern house with realistic textures"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Plains Village</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 minecraft-blue">Grand Views</h4>
            <p className="text-slate-300">The scale of the landscape doesnt change the quality thanks to CTM.</p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src={buildUntouched} 
                alt="Cherry grove with enhanced foliage"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">Patrix's Map</span>
              </div>
            </div>
            <h4 className="font-pixelbasel font-semibold text-xl mb-2 minecraft-gold">Your Builds are safe here!</h4>
            <p className="text-slate-300">I strive to use the most vanilla-accurate palette possible.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
