import { Eye, Gauge, Leaf, Puzzle, RotateCcw, Layers } from "lucide-react";

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
}
