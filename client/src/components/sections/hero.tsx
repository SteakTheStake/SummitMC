import { Download as DownloadIcon, Images, Zap, Layers, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

import heroBackground from "@assets/2025-06-11_17.27.26_1752292199051.webp";

export default function Hero() {
  const { data: stats } = useQuery<{
    stats: any[];
    totalDownloads: number;
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
    id: number;
    version: string;
    resolution: string;
    changelog: string;
    source?: string;
  }>({
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
          src={heroBackground} 
          alt="Summit texture pack showcase" 
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
          <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Summit 64x</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Premium textures by Limitless Designs. 
          <span className="minecraft-green font-semibold">
            {stats?.realTimeDownloads ? `${(stats.realTimeDownloads / 1000).toFixed(1)}k` : "13.9k"} downloads
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => scrollToSection("#download")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <DownloadIcon className="mr-2" size={20} />
            Download Now
          </Button>
          
          <Button
            variant="outline"
            onClick={() => scrollToSection("#gallery")}
            className="glassmorphism border-slate-600 px-8 py-6 text-lg font-semibold hover:bg-slate-700 transition-all duration-300"
          >
            <Images className="mr-2" size={20} />
            View Gallery
          </Button>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Box className="minecraft-green" size={16} />
            <span>1.12.x - 1.21.x</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="minecraft-blue" size={16} />
            <span>16x - 64x</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="minecraft-gold" size={16} />
            <span>Optimized</span>
          </div>
        </div>
      </div>
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 grass-gradient opacity-30 rounded-lg animate-float particle-effect"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 diamond-gradient opacity-25 rounded-lg animate-float particle-effect" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 right-20 w-8 h-8 gold-gradient opacity-20 rounded-full animate-bounce-subtle" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-1/3 left-20 w-10 h-10 nether-gradient opacity-15 rounded-lg animate-float" style={{ animationDelay: "3s" }}></div>
    </section>
  );
}
