// pages or app route file where Gallery lives (your provided code)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ComparisonSlider from "@/components/ui/comparison-slider";
import ImageViewer, { type ViewerImage } from "@/components/ui/image-viewer";
import { useQuery } from "@tanstack/react-query";

import mountainDistant from "@/assets/screenshots/castle-ruins-close.png";
import spiderFright from "@/assets/screenshots/spider-close.png";
import livingNether from "@/assets/screenshots/nether-lava.png";
import turtleRealism from "@/assets/screenshots/turtle-huddle.png";
import endChorus from "@/assets/screenshots/end-chorus.png";
import buildsBeauty from "@/assets/screenshots/small-medieval-vilage-home.png";
import craft64xUtility from "@/assets/screenshots/64.png";
import craft32xUtility from "@/assets/screenshots/32.png";
import ironGollem from "@/assets/screenshots/iron_gollem.png";
import natGeo from "@/assets/screenshots/national-geographic-worthy-areal-views.png";
import netherRuins from "@/assets/screenshots/nether-ruins.png";
import ironBlock from "@/assets/screenshots/iron-like-youve-never-seen-before.png";
import castleRuins from "@/assets/screenshots/castle-ruins-close.png";

// Import Sonder 1024x images
import sonderTreeWide from "@/assets/Sonder/sonder-tree-wide.png";
import sonderTreeLookingUp from "@/assets/Sonder/sonder-tree-looking-up.png";
import sonderTreeYellowFlowers1 from "@/assets/Sonder/sonder-tree-yellow-flowers-1.png";
import sonderTreeYellowFlowers2 from "@/assets/Sonder/sonder-tree-yellow-flowers-2.png";
import sonderTextureSamples from "@/assets/Sonder/sonder-texture-samples.png";

const galleryImages: ViewerImage[] = [
  { src: spiderFright, alt: "Spider and cave spider" },
  { src: ironGollem, alt: "Iron Golem holding down the fort" },
  { src: natGeo, alt: "Aerial view of mangrove swamp" },
  { src: livingNether, alt: "Living Nether with lava flows" },
  { src: turtleRealism, alt: "Beach scene with realistic turtles and sand" },
  { src: castleRuins, alt: "Castle ruins" },
  { src: ironBlock, alt: "Iron block close-up" },
  { src: endChorus, alt: "End Chorus plants" },
  { src: netherRuins, alt: "Nether portal ruins" },
  { src: sonderTreeWide, alt: "Sonder 1024x - Ultra realistic tree textures with stunning detail" },
  { src: sonderTreeLookingUp, alt: "Sonder 1024x - Photorealistic bark textures looking up at the canopy" },
  { src: sonderTreeYellowFlowers1, alt: "Sonder 1024x - Beautiful tree trunk with vibrant yellow flowers" },
  { src: sonderTreeYellowFlowers2, alt: "Sonder 1024x - Realistic nature scene with detailed foliage" },
  { src: sonderTextureSamples, alt: "Sonder 1024x - Texture showcase featuring realistic leaves and grass" },
];

export default function Gallery() {
  const [selectedResolution, setSelectedResolution] = useState("16x");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data: screenshots } = useQuery({
    queryKey: ["/api/screenshots"],
  });

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  return (
    <section id="gallery" className="py-20 px-6 bg-slate-800 bg-opacity-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Before and after comparison
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="mb-16">
          <div className="glassmorphism p-8 rounded-2xl">
            <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-center">
              32x to 64x
            </h3>
            <ComparisonSlider
              beforeImage={craft32xUtility}
              afterImage={craft64xUtility}
              beforeLabel="32×"
              afterLabel="64×"
              aspectRatio={16 / 9}
              initial={60}
              className="max-w-3xl mx-auto"
            />
          </div>
        </div>

        {/* Featured Screenshots Grid */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => openViewer(idx)}
                className="text-left glassmorphism p-4 rounded-xl texture-hover glow-effect group"
              >
                <img
                  src={img.src}
                  alt={img.alt ?? "Screenshot"}
                  className="w-full h-48 object-cover rounded-lg mb-3 transition-transform group-hover:scale-[1.02]"
                />
                <h4 className="font-pixelbasel font-semibold text-lg text-teal-400 mb-1">
                  {(img.alt ?? "Screenshot").split(".")[0]}
                </h4>
                <p className="text-slate-300 text-sm">
                  Click to view larger • Swipe to navigate
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewerOpen && (
        <ImageViewer
          images={galleryImages}
          index={viewerIndex}
          onClose={() => setViewerOpen(false)}
          onIndexChange={setViewerIndex}
        />
      )}
    </section>
  );
}
