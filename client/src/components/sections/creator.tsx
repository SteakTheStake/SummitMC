import { Heart, Coffee, Gamepad2, Palette } from "lucide-react";

export default function Creator() {
  return (
    <section className="py-20 px-6 bg-slate-900 bg-opacity-30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            Hey, I'm <span className="minecraft-green">SteakTheStake!</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Just a Minecraft lover who got obsessed with making textures look amazing
          </p>
        </div>
        
        <div className="glassmorphism p-8 md:p-12 rounded-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-pixelbasel font-semibold text-2xl mb-4 minecraft-gold">
                My Story
              </h3>
              <p className="text-slate-300 mb-4">
                I started Summit because I was tired of texture packs that either looked too realistic 
                or completely changed Minecraft's vibe. I wanted something that felt like "Minecraft, 
                but better" - keeping that blocky charm while adding the details that make you go "wow."
              </p>
              <p className="text-slate-300 mb-6">
                Every texture is hand-crafted during late-night gaming sessions, tested in my own worlds, 
                and refined based on what actually looks good when you're building your dream castle or 
                exploring deep caves.
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
                  <h4 className="font-pixelbasel font-semibold minecraft-red">Why I Do This</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Because I believe Minecraft deserves textures that enhance the experience without 
                  losing what makes it special. It's not about making it look like real life - 
                  it's about making it look like the best version of Minecraft.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Coffee className="minecraft-gold" size={20} />
                  <h4 className="font-pixelbasel font-semibold minecraft-gold">Always Improving</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Summit isn't finished - it's a living project. I'm constantly tweaking textures, 
                  adding new ones, and listening to the community. If you have ideas or feedback, 
                  I'd love to hear from you!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-400 italic">
            "Every block tells a story, every texture has a purpose. Thanks for being part of the journey!" 
            <span className="minecraft-green">- SteakTheStake</span>
          </p>
        </div>
      </div>
    </section>
  );
}