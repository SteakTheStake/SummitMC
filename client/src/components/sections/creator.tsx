import { Heart, Coffee, Gamepad2, Palette } from "lucide-react";

export default function Creator() {
  return (
    <section className="py-20 px-6 bg-slate-900 bg-opacity-30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">About Summit</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Created by Limitless Designs
          </p>
        </div>
        
        <div className="glassmorphism p-8 md:p-12 rounded-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-pixelbasel font-semibold text-2xl mb-4 minecraft-gold">
                Quality Design
              </h3>
              <p className="text-slate-300 mb-4">
                Summit enhances Minecraft's visuals. Premium textures. Authentic feel.
              </p>
              <p className="text-slate-300 mb-6">
                Tested extensively. Refined continuously.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Coffee className="minecraft-gold" size={16} />
                  <span>Fueled by caffeine</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Gamepad2 className="minecraft-blue" size={16} />
                  <span>Tested in survival</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Palette className="minecraft-green" size={16} />
                  <span>Pixel by pixel</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="glassmorphism p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="minecraft-red" size={20} />
                  <h4 className="font-pixelbasel font-semibold minecraft-red">Vision</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Enhanced Minecraft. Original feel.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Coffee className="minecraft-gold" size={20} />
                  <h4 className="font-pixelbasel font-semibold minecraft-gold">Updates</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Regular improvements. Community driven.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-400 italic">
            "Premium quality. Limitless possibilities." 
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">- Limitless Designs</span>
          </p>
        </div>
      </div>
    </section>
  );
}