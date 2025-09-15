import { useState } from "react";
import { Button } from "@/components/ui/button";
import ComparisonSlider from "@/components/ui/comparison-slider";
import { useQuery } from "@tanstack/react-query";

import mountainDistant from "@/assets/screenshots/moutain-close-near-features.png";
import farmBanner from "@/assets/screenshots/farm-banner-dead-grass.png";
import livingNether from "@/assets/screenshots/nether-lava.png";
import turtleRealism from "@/assets/screenshots/turtle-huddle.png";
import endChorus from "@/assets/screenshots/end-chorus.png";
import buildsBeauty from "@/assets/screenshots/small-medieval-vilage-home.png";

const resolutions = [
  { name: "32x", active: false },
  { name: "64x", active: false }
];

const textureCategories = [
  {
    name: "Landscape",
    description: "Dirt, grass, stone, and all basic terrain blocks with enhanced detail",
    imageUrl: mountainDistant
  },
  {
    name: "Builds",
    description: "This beautiful home looks great in vanilla, but this is new and refreshed",
    imageUrl: farmBanner
  },
  {
    name: "Nature",
    description: "All ore blocks retextured with realistic mineral patterns",
    imageUrl: livingNether
  },
  {
    name: "Nether",
    description: "Crimson/warped forests, soul fire, blackstone, and nether content",
    imageUrl: turtleRealism
  },
  {
    name: "Dimensions",
    description: "Chorus plants look stunning in the dark of the end",
    imageUrl: endChorus
  },
  {
    name: "Landscape",
    description: "This beautiful home looks great in vanilla, but this is new and refreshed",
    imageUrl: buildsBeauty
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
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Before and after comparison
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
            <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-center">32x to 64x</h3>
            <ComparisonSlider
              beforeImage={mountainDistant}
              afterImage={mountainDistant}
              beforeLabel="Standard View"
              afterLabel="Summit Enhanced"
            />
          </div>
        </div>

        {/* Featured Screenshots Grid */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glassmorphism p-4 rounded-xl texture-hover glow-effect">
              <img 
                src={farmBanner} 
                alt="Medieval tower with enhanced textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-stone-400 mb-1">Medieval Architecture</h4>
              <p className="text-slate-300 text-sm">Enhanced stone and wood textures bring medieval builds to life</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={farmBanner} 
                alt="Mountain village with realistic textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Mountain Villages</h4>
              <p className="text-slate-300 text-sm">Realistic terrain textures create stunning mountain landscapes</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={farmBanner} 
                alt="Modern house with enhanced materials"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Modern Builds</h4>
              <p className="text-slate-300 text-sm">Perfect textures for contemporary architectural styles</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={livingNether} 
                alt="Cherry trees with enhanced foliage"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Cherry Groves</h4>
              <p className="text-slate-300 text-sm">Beautiful cherry tree textures with realistic foliage</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={turtleRealism} 
                alt="Beach scene with realistic water and sand"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Ocean Biomes</h4>
              <p className="text-slate-300 text-sm">Enhanced coral and sand textures for coastal builds</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={endChorus} 
                alt="Interior design with detailed textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">End Chorus</h4>
              <p className="text-slate-300 text-sm">Detailed textures perfect for interior decoration</p>
            </div>
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
              <h4 className="font-pixelbasel font-semibold text-lg mb-2 text-teal-400">{category.name}</h4>
              <p className="text-slate-300 text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
