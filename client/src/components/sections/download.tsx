import { Download as DownloadIcon, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ModRequirementsModal from "@/components/ui/mod-requirements-modal";
import ModrinthStats from "./modrinth-stats";

const resolutionOptions = [
  {
    resolution: "16x",
    label: "16x",
    description: "Standard",
    popular: true,
    available: true,
    platforms: ["modrinth", "planetminecraft"]
  },
  {
    resolution: "32x",
    label: "32x",
    description: "Enhanced",
    popular: false,
    available: true,
    platforms: ["modrinth", "planetminecraft"]
  },
  {
    resolution: "64x",
    label: "64x",
    description: "High detail",
    popular: false,
    available: true,
    platforms: ["modrinth", "planetminecraft"]
  },
  {
    resolution: "512x",
    label: "512x",
    description: "Ultra HD",
    popular: false,
    available: true,
    platforms: ["planetminecraft"],
    premium: true
  }
];

const systemRequirements = [
  { label: "Minecraft Version", value: "1.19.x - 1.21.4" },
  { label: "RAM (16x)", value: "2GB+" },
  { label: "RAM (64x)", value: "4GB+" },
  { label: "RAM (512x)", value: "8GB+" },
  { label: "Optifine/Fabric", value: "Recommended" }
];

const quickInstallSteps = [
  { step: 1, title: "Download", description: "Choose your preferred resolution and platform" },
  { step: 2, title: "Install", description: "Place the file in your resource packs folder" },
  { step: 3, title: "Activate", description: "Enable Summit in your Minecraft settings" }
];

export default function Download() {
  const queryClient = useQueryClient();
  
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

  const incrementDownloadMutation = useMutation({
    mutationFn: async ({ resolution, platform }: { resolution: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/downloads/increment", { resolution, platform });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads/stats"] });
    }
  });

  const handleDownload = (resolution: string, platform: string, url: string) => {
    incrementDownloadMutation.mutate({ resolution, platform });
    window.open(url, "_blank");
  };

  const getDownloadUrl = (resolution: string, platform: string) => {
    if (platform === "modrinth") {
      return "https://modrinth.com/resourcepack/summit";
    }
    return "https://www.planetminecraft.com/texture-pack/summit-6177524/";
  };

  return (
    <section id="download" className="py-20 px-6 bg-slate-800 bg-opacity-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Download</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose resolution
          </p>
        </div>

        {/* Live Modrinth Stats */}
        <div className="mb-12 max-w-md mx-auto">
          <ModrinthStats />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Download Options */}
          <div className="space-y-6">
            <div className="glassmorphism p-8 rounded-2xl">
              <h3 className="font-pixelbasel font-semibold text-2xl mb-6 minecraft-green">Resolution Options</h3>
              
              <div className="space-y-4">
                {resolutionOptions.map((option, index) => (
                  <div key={index} className={`bg-slate-800 p-6 rounded-xl border-2 ${
                    option.popular ? "border-green-500" : "border-slate-600"
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{option.label}</h4>
                        <p className="text-slate-400 text-sm">{option.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {option.popular && (
                          <Badge className="version-badge">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}
                        {option.premium && (
                          <Badge variant="outline" className="text-amber-400 border-amber-400">
                            PBR/POM
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      {option.platforms.includes("modrinth") && (
                        <Button
                          onClick={() => handleDownload(option.resolution, "modrinth", getDownloadUrl(option.resolution, "modrinth"))}
                          className={`flex-1 ${option.popular 
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            : "bg-slate-700 hover:bg-slate-600"
                          } transition-all duration-300`}
                        >
                          <DownloadIcon className="mr-2" size={16} />
                          Modrinth
                        </Button>
                      )}
                      
                      {option.platforms.includes("planetminecraft") && (
                        <Button
                          onClick={() => handleDownload(option.resolution, "planetminecraft", getDownloadUrl(option.resolution, "planetminecraft"))}
                          variant={option.premium ? "default" : "outline"}
                          className={`flex-1 ${option.premium 
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                            : "border-slate-600 hover:bg-slate-700"
                          } transition-all duration-300`}
                        >
                          <ExternalLink className="mr-2" size={16} />
                          {option.premium ? "PlanetMinecraft" : "PMC"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats and Requirements */}
          <div className="space-y-6">
            {/* Download Stats */}
            <div className="download-stats p-8 rounded-2xl">
              <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-teal-400">Download Stats</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">
                    {stats?.totalDownloads ? `${(stats.totalDownloads / 1000).toFixed(1)}k+` : "13.9k+"}
                  </div>
                  <div className="text-slate-400 text-sm">Total Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">
                    {latestVersion?.version || "2.3"}
                  </div>
                  <div className="text-slate-400 text-sm">Latest Version</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">1.21.4</div>
                  <div className="text-slate-400 text-sm">Supported Version</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">Feb 2025</div>
                  <div className="text-slate-400 text-sm">Last Update</div>
                </div>
              </div>
            </div>
            
            {/* System Requirements */}
            <div className="glassmorphism p-8 rounded-2xl">
              <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-teal-400">System Requirements</h3>
              
              <div className="space-y-4">
                {systemRequirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <span className="text-slate-300">{req.label}</span>
                    <span className="text-teal-400 font-semibold">{req.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Install */}
            <div className="glassmorphism p-8 rounded-2xl">
              <h3 className="font-pixelbasel font-semibold text-2xl mb-6 text-teal-400">Quick Install</h3>
              
              <div className="space-y-4">
                {quickInstallSteps.map((step, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <span className="font-semibold">{step.title}</span>
                    </div>
                    <p className="text-slate-400 text-sm ml-11">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
