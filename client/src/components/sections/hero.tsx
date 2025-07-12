import { Download as DownloadIcon, Images, Zap, Layers, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

import _2025_03_10_14_21_53 from "@assets/2025-03-10_14.21.53.webp";

export default function Hero() {
  const { data: stats } = useQuery({
    queryKey: ["/api/downloads/stats"],
  });

  const { data: latestVersion } = useQuery({
    queryKey: ["/api/versions/latest"],
  });

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg"></div>
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={_2025_03_10_14_21_53} 
          alt="Minecraft landscape" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <div className="mb-6">
          <Badge className="version-badge">
            v{latestVersion?.version || "2.3"} Latest
          </Badge>
        </div>
        
        <h1 className="font-pixelbasel font-black text-5xl md:text-7xl mb-4">
          <span className="text-white">Minecraft At Its</span>
          <span className="text-teal-400 block">Peak</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Experience realistic textures that enhance your world without losing Minecraft's charm. 
          <span className="text-teal-400 font-semibold">
            {stats?.totalDownloads ? `${(stats.totalDownloads / 1000).toFixed(1)}k+` : "13.9k+"} downloads
          </span> and counting.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => scrollToSection("#download")}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <DownloadIcon className="mr-2" size={20} />
            Download Now
          </Button>
          
          <Button
            variant="outline"
            onClick={() => scrollToSection("#gallery")}
            className="glassmorphism border-slate-600 px-8 py-6 text-lg font-semibold hover:bg-slate-800 transition-all duration-300"
          >
            <Images className="mr-2" size={20} />
            View Gallery
          </Button>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Box className="text-teal-400" size={16} />
            <span>1.19.x - 1.21.4</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="text-teal-400" size={16} />
            <span>16x - 512x</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-teal-400" size={16} />
            <span>Optimized</span>
          </div>
        </div>
      </div>
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-teal-500 bg-opacity-20 rounded-lg animate-float"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-teal-400 bg-opacity-20 rounded-lg animate-float" style={{ animationDelay: "1s" }}></div>
    </section>
  );
}
