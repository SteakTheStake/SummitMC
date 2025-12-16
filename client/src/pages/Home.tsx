import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Download, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";

// Import gallery images
import oresVisible from "@/assets/screenshots/ore-emerald-diamond-pick.png";
import farmBanner from "@/assets/screenshots/farm-banner-dead-grass.png";
import livingNether from "@/assets/screenshots/nether-lava.png";
import turtleRealism from "@/assets/screenshots/turtle-huddle.png";
import endChorus from "@/assets/screenshots/end-chorus.png";
import buildsBeauty from "@/assets/screenshots/small-medieval-vilage-home.png";

// Import Sonder 1024x images
import sonderTreeWide from "@/assets/Sonder/sonder-tree-wide.png";
import sonderTreeLookingUp from "@/assets/Sonder/sonder-tree-looking-up.png";
import sonderTreeYellowFlowers1 from "@/assets/Sonder/sonder-tree-yellow-flowers-1.png";
import sonderTreeYellowFlowers2 from "@/assets/Sonder/sonder-tree-yellow-flowers-2.png";
import sonderTextureSamples from "@/assets/Sonder/sonder-texture-samples.png";

const galleryImages = [
  { src: livingNether, alt: "Nether ventures feel more alive and real", category: "nether" },
  { src: oresVisible, alt: "No more worrying about not seeing ores with a realistic texture pack", category: "nature" },
  { src: farmBanner, alt: "Life on the farm has never been better", category: "builds" },
  { src: turtleRealism, alt: "Turtles all over the place", category: "nature" },
  { src: endChorus, alt: "Chorus plants look stunning in the dark of the end", category: "end" },
  { src: buildsBeauty, alt: "This beautiful home looks great in vanilla, but this is new and refreshed", category: "builds" },
  { src: sonderTreeWide, alt: "Sonder 1024x - Ultra realistic tree textures with stunning detail", category: "sonder" },
  { src: sonderTreeLookingUp, alt: "Sonder 1024x - Photorealistic bark textures looking up at the canopy", category: "sonder" },
  { src: sonderTreeYellowFlowers1, alt: "Sonder 1024x - Beautiful tree trunk with vibrant yellow flowers", category: "sonder" },
  { src: sonderTreeYellowFlowers2, alt: "Sonder 1024x - Realistic nature scene with detailed foliage", category: "sonder" },
  { src: sonderTextureSamples, alt: "Sonder 1024x - Texture showcase featuring realistic leaves and grass", category: "sonder" }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery<{
    realTimeDownloads: number;
    modrinth: {
      downloads: number;
      followers: number;
      versions: number;
    } | null;
  }>({
    queryKey: ["/api/downloads/stats"],
  });

  const { data: latestVersion } = useQuery<{
    version: string;
  }>({
    queryKey: ["/api/versions/latest"],
  });

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      changeImage('next');
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, currentImageIndex]);

  const changeImage = (direction: 'next' | 'prev') => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
      } else {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
      setIsTransitioning(false);
    }, 300);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setAutoRotate(false);
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      changeImage('next');
    } else if (isRightSwipe) {
      changeImage('prev');
    }
    
    // Resume auto-rotate after 10 seconds
    setTimeout(() => setAutoRotate(true), 10000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setAutoRotate(false);
        changeImage('prev');
        setTimeout(() => setAutoRotate(true), 10000);
      } else if (e.key === 'ArrowRight') {
        setAutoRotate(false);
        changeImage('next');
        setTimeout(() => setAutoRotate(true), 10000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen">
      {/* Hero Section with Dynamic Gallery */}
      <section 
        ref={heroRef}
        className="relative h-screen overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Gallery */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <img 
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block">
          <Button
            onClick={() => {
              setAutoRotate(false);
              changeImage('prev');
              setTimeout(() => setAutoRotate(true), 10000);
            }}
            variant="ghost"
            size="icon"
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border border-white/20"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            onClick={() => {
              setAutoRotate(false);
              changeImage('next');
              setTimeout(() => setAutoRotate(true), 10000);
            }}
            variant="ghost"
            size="icon"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border border-white/20"
          >
            <ChevronRight size={24} />
          </Button>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0">
              v{latestVersion?.version || "2.6"} Latest
            </Badge>
            
            <h1 className="font-pixelbasel text-7xl md:text-9xl font-black">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Summit 64x
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 font-light">
              Premium Minecraft Texture Pack
            </p>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {stats?.realTimeDownloads ? `${(stats.realTimeDownloads / 1000).toFixed(1)}k` : "226k+"} downloads
              </span>
              {stats?.modrinth && (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {stats.modrinth.followers} followers
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/download">
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white px-8 py-6 text-lg">
                  Download Now
                  <ChevronRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Category Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoRotate(false);
                    setCurrentImageIndex(index);
                    setTimeout(() => setAutoRotate(true), 10000);
                  }}
                  className={`h-2 transition-all duration-300 hover:scale-110 ${
                    index === currentImageIndex 
                      ? 'w-8 bg-gradient-to-r from-pink-400 to-blue-400' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Mobile swipe hint */}
            <div className="md:hidden text-center mt-4">
              <p className="text-white/60 text-sm">← Swipe to navigate →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/features">
              <div className="glassmorphism p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="font-pixelbasel text-xl mb-2">Features</h3>
                <p className="text-slate-400">Enhanced visuals. Optimized performance.</p>
              </div>
            </Link>

            <Link href="/gallery">
              <div className="glassmorphism p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <img src="/limitless-logo.png" alt="Logo" className="w-6 h-6" />
                </div>
                <h3 className="font-pixelbasel text-xl mb-2">Gallery</h3>
                <p className="text-slate-400">Before & after comparisons.</p>
              </div>
            </Link>

            <Link href="/download">
              <div className="glassmorphism p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Download className="text-white" size={24} />
                </div>
                <h3 className="font-pixelbasel text-xl mb-2">Download</h3>
                <p className="text-slate-400">16x to 64x resolutions.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Fluid Gallery Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-pixelbasel text-4xl text-center mb-12">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={{
                  animation: `float ${10 + index * 2}s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white font-pixelbasel">{image.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}