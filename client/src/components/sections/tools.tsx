import { CheckCircle, Book, Rocket, Camera, History, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const compatibilityVersions = [
  { version: "1.21.4", compatible: true },
  { version: "1.20.x", compatible: true },
  { version: "1.19.x", compatible: true }
];

const installationSteps = [
  "Download the resource pack file",
  "Open Minecraft and go to Options",
  "Click \"Resource Packs\"",
  "Drag the file into the resource pack folder"
];

const performanceTips = [
  "Start with 16x if you're not sure about performance",
  "Continuity mod makes Summit even more beautiful!",
  "Lower render distance = smoother gameplay"
];

export default function Tools() {
  const { data: latestVersion } = useQuery({
    queryKey: ["/api/versions/latest"],
  });

  const recentUpdates = [
    "Modified packed mud and mud brick",
    "Enhanced oak log tops",
    "Updated cherry leaves and pink petals",
    "New chest CEM models"
  ];

  return (
    <section id="tools" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            Setup <span className="minecraft-green">Help</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Need help getting Summit running? I've got you covered with these handy tools!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Version Compatibility Checker */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 minecraft-green">Version Checker</h3>
            <p className="text-slate-300 mb-6">Make sure Summit works with your Minecraft version!</p>
            
            <div className="space-y-3">
              {compatibilityVersions.map((version, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-sm">{version.version}</span>
                  <Badge variant={version.compatible ? "default" : "destructive"} className="text-xs">
                    {version.compatible ? "✓ Compatible" : "✗ Incompatible"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Installation Guide */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Book className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 minecraft-blue">Easy Install</h3>
            <p className="text-slate-300 mb-6">First time installing? Follow my simple steps!</p>
            
            <div className="space-y-2 text-sm text-slate-400">
              {installationSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="minecraft-blue font-semibold">{index + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Performance Tips */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <Rocket className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 minecraft-gold">Smooth Gameplay</h3>
            <p className="text-slate-300 mb-6">Pro tips to keep your FPS happy with Summit</p>
            
            <div className="space-y-2 text-sm text-slate-400">
              {performanceTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Screenshot Sharing */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <Camera className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 text-teal-400">Screenshot Sharing</h3>
            <p className="text-slate-300 mb-6">Share your Summit world with the community</p>
            
            <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300">
              Upload Screenshot
            </Button>
          </div>
          
          {/* Changelog */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <History className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 text-teal-400">Latest Updates</h3>
            <p className="text-slate-300 mb-6">v{latestVersion?.version || "2.3"} - February 2025</p>
            
            <div className="space-y-2 text-sm text-slate-400">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-teal-400">+</span>
                  <span>{update}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Support */}
          <div className="glassmorphism p-8 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <LifeBuoy className="text-white" size={24} />
            </div>
            <h3 className="font-pixelbasel font-semibold text-xl mb-4 text-teal-400">Need Help?</h3>
            <p className="text-slate-300 mb-6">Get support from the community</p>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-center border-slate-600 hover:bg-slate-700">
                Discord Server
              </Button>
              <Button variant="outline" className="w-full justify-center border-slate-600 hover:bg-slate-700">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
