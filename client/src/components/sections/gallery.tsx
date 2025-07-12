import { useState } from "react";
import { Button } from "@/components/ui/button";
import ComparisonSlider from "@/components/ui/comparison-slider";
import { useQuery } from "@tanstack/react-query";

import medievalTower from "@assets/2025-02-13_02.00.29_1752292199050.webp";
import mountainVillage from "@assets/2025-03-10_14.21.53_1752292199050.webp";
import modernHouse from "@assets/2025-03-20_17.23.13_1752292199050.webp";
import woodenBridge from "@assets/2025-03-20_17.26.53_1752292199050.webp";
import undergroundCave from "@assets/2025-03-20_21.04.00_1752292199050.webp";
import netherScene from "@assets/2025-03-28_23.03.19_1752292199050.webp";
import turtleBeach from "@assets/2025-03-28_23.15.23_1752292199051.webp";
import cherryTrees from "@assets/2025-05-02_23.46.20_1752292199051.webp";
import snowyMountain from "@assets/2025-06-11_17.26.29_1752292199051.webp";
import interiorDesign from "@assets/2025-06-11_17.26.55_1752292199051.webp";
import mountainView from "@assets/2025-06-11_17.27.26_1752292199051.webp";

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
    imageUrl: snowyMountain
  },
  {
    name: "Wood Types",
    description: "All wood planks, logs, and tree-related blocks with natural grain",
    imageUrl: woodenBridge
  },
  {
    name: "Ores & Minerals",
    description: "All ore blocks retextured with realistic mineral patterns",
    imageUrl: undergroundCave
  },
  {
    name: "Nether Blocks",
    description: "Crimson/warped forests, soul fire, blackstone, and nether content",
    imageUrl: netherScene
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
            See The <span className="water-gradient bg-clip-text text-transparent">Difference</span>
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
            <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-center">Mountain Terrain Enhancement</h3>
            <ComparisonSlider
              beforeImage={mountainVillage}
              afterImage={snowyMountain}
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
                src={medievalTower} 
                alt="Medieval tower with enhanced textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-stone-400 mb-1">Medieval Architecture</h4>
              <p className="text-slate-300 text-sm">Enhanced stone and wood textures bring medieval builds to life</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={mountainVillage} 
                alt="Mountain village with realistic textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Mountain Villages</h4>
              <p className="text-slate-300 text-sm">Realistic terrain textures create stunning mountain landscapes</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={modernHouse} 
                alt="Modern house with enhanced materials"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Modern Builds</h4>
              <p className="text-slate-300 text-sm">Perfect textures for contemporary architectural styles</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={cherryTrees} 
                alt="Cherry trees with enhanced foliage"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Cherry Groves</h4>
              <p className="text-slate-300 text-sm">Beautiful cherry tree textures with realistic foliage</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={turtleBeach} 
                alt="Beach scene with realistic water and sand"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Ocean Biomes</h4>
              <p className="text-slate-300 text-sm">Enhanced coral and sand textures for coastal builds</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-xl">
              <img 
                src={interiorDesign} 
                alt="Interior design with detailed textures"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">Interior Design</h4>
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
