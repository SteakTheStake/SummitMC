import { useState } from "react";
import { Button } from "@/components/ui/button";
import ComparisonSlider from "@/components/ui/comparison-slider";
import { useQuery } from "@tanstack/react-query";

const resolutions = [
  { name: "16x", active: true },
  { name: "32x", active: false },
  { name: "64x", active: false },
  { name: "512x", active: false }
];

const textureCategories = [
  {
    name: "Terrain",
    description: "Dirt, grass, stone, and all basic terrain blocks with enhanced detail",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Wood Types",
    description: "All wood planks, logs, and tree-related blocks with natural grain",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Ores & Minerals",
    description: "All ore blocks retextured with realistic mineral patterns",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    name: "Nether Blocks",
    description: "Crimson/warped forests, soul fire, blackstone, and nether content",
    imageUrl: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  }
];

export default function Gallery() {
  const [selectedResolution, setSelectedResolution] = useState("16x");
  
  const { data: screenshots } = useQuery({
    queryKey: ["/api/screenshots"],
  });

  return (
    <section id="gallery" className="py-20 px-6 bg-slate-800 bg-opacity-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4">
            See The <span className="text-teal-400">Difference</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience the transformation with our before/after comparisons
          </p>
        </div>
        
        {/* Resolution Selector */}
        <div className="flex justify-center mb-12">
          <div className="glassmorphism p-2 rounded-lg">
            <div className="flex space-x-2">
              {resolutions.map((resolution) => (
                <Button
                  key={resolution.name}
                  variant={selectedResolution === resolution.name ? "default" : "ghost"}
                  onClick={() => setSelectedResolution(resolution.name)}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                    selectedResolution === resolution.name
                      ? "bg-teal-600 text-white"
                      : "hover:bg-slate-700"
                  }`}
                >
                  {resolution.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Before/After Comparison */}
        <div className="mb-16">
          <div className="glassmorphism p-8 rounded-2xl">
            <h3 className="font-orbitron font-semibold text-2xl mb-6 text-center">Stone & Terrain Comparison</h3>
            <ComparisonSlider
              beforeImage="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              afterImage="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              beforeLabel="Vanilla"
              afterLabel="Summit"
            />
          </div>
        </div>
        
        {/* Texture Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {textureCategories.map((category, index) => (
            <div key={index} className="glassmorphism p-6 rounded-xl texture-hover">
              <img 
                src={category.imageUrl} 
                alt={`Enhanced ${category.name.toLowerCase()} textures`}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-orbitron font-semibold text-lg mb-2 text-teal-400">{category.name}</h4>
              <p className="text-slate-300 text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
