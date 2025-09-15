import { Download as DownloadIcon, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ModRequirementsModal from "@/components/ui/mod-requirements-modal";
import ModrinthStats from "./modrinth-stats";

type PlatformKey = "modrinth" | "curseforge";
type ResolutionKey = "32x" | "64x";

const resolutionOptions = [
  {
    resolution: "64x",
    label: "64x",
    description: "Better Detail",
    popular: true,
    available: true,
    platforms: ["modrinth", "curseforge"],
  },
  {
    resolution: "32x",
    label: "32x",
    description: "Better Performance",
    popular: false,
    available: true,
    platforms: ["modrinth", "curseforge"],
  },
];

type SystemRequirement = {
  label: string;
  value: string;
  url?: string | null;
};

const systemRequirements = [
  { label: "Minecraft Version", value: "1.13.x or higher"  },
  { label: "EMF (Entity Model Features)", value: "Required or alternative", url: "https://modrinth.com/mod/entity-model-features"  },
  { label: "ETF (Entity Texture Features)", value: "Required or alternative", url: "https://modrinth.com/mod/entitytexturefeatures"  },
  { label: "Continuity", value: "Required or alternative", url: "https://modrinth.com/mod/continuity"  },
  { label: "Polytone", value: "Required or alternative", url: "https://modrinth.com/mod/polytone"  },
  { label: "Fabric", value: "Recommended", url: "https://fabricmc.net/" },
  { label: "LabPBR Compatible Shader", value: "Recommended", url: "https://shaderlabs.org/wiki/Shaderpacks/"  },
  { label: "Optifine", value: "Good Alternative, Worse Performance", url: "https://optifine.net/" },
];

export default function Download() {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<{
    stats: any[];
    totalDownloads: number;
    realTimeDownloads: number;
    modrinth: { downloads: number; followers: number; versions: number } | null;
  }>({ queryKey: ["/api/downloads/stats"] });

  const { data: latestVersion } = useQuery<{
    id: number;
    version: string;
    resolution: string;
    changelog: string;
    source?: string;
  }>({ queryKey: ["/api/versions/latest"] });

  // NEW: dynamic links for both platforms & resolutions
  const { data: links, isLoading: linksLoading } = useQuery<{
    modrinth: Record<ResolutionKey, string | null>;
    curseforge: Record<ResolutionKey, string | null>;
    updatedAt: string;
  }>({
    queryKey: ["/api/downloads/links"],
  });

  const incrementDownloadMutation = useMutation({
    mutationFn: async ({ resolution, platform }: { resolution: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/downloads/increment", { resolution, platform });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads/stats"] });
    },
  });

  const handleDownload = (resolution: ResolutionKey, platform: PlatformKey, url?: string | null) => {
    if (!url) return; // optionally toast: no link available
    incrementDownloadMutation.mutate({ resolution, platform });
    window.open(url, "_blank");
  };

  const getDownloadUrl = (resolution: ResolutionKey, platform: PlatformKey): string | null => {
    if (!links) return null;
    return links[platform]?.[resolution] ?? null;
  };

  return (
    <section id="download" className="py-20 px-6 bg-slate-800 bg-opacity-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-pixelbasel font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Download
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Choose resolution</p>
          {linksLoading && (
            <p className="mt-3 text-sm text-slate-400">Checking for latest files…</p>
          )}
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
                {resolutionOptions.map((option) => {
                  const res = option.resolution as ResolutionKey;
                  const modrinthUrl = getDownloadUrl(res, "modrinth");
                  const curseforgeUrl = getDownloadUrl(res, "curseforge");

                  return (
                    <div
                      key={option.resolution}
                      className={`bg-slate-800 p-6 rounded-xl border-2 ${
                        option.popular ? "border-green-500" : "border-slate-600"
                      }`}
                    >
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
                        </div>
                      </div>

                      <div className="flex gap-4">
                        {option.platforms.includes("modrinth") && (
                          <Button
                            onClick={() => handleDownload(res, "modrinth", modrinthUrl)}
                            disabled={linksLoading || !modrinthUrl}
                            className={`flex-1 ${
                              option.popular
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                : "bg-slate-700 hover:bg-slate-600"
                            } transition-all duration-300`}
                          >
                            <DownloadIcon className="mr-2" size={16} />
                            Modrinth
                          </Button>
                        )}

                        {option.platforms.includes("curseforge") && (
                          <Button
                            onClick={() => handleDownload(res, "curseforge", curseforgeUrl)}
                            disabled={linksLoading || !curseforgeUrl}
                            variant="outline"
                            className={`flex-1 ${
                              option.popular
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                : "bg-slate-700 hover:bg-slate-600"
                            } transition-all duration-300`}
                          >
                            <ExternalLink className="mr-2" size={16} />
                            CurseForge
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                  <span className="flex items-center gap-2">
                    <span className="text-teal-400 font-semibold">{req.value}</span>
                    {req.url && (
                      <a href={req.url} target="_blank" rel="noreferrer" aria-label={`${req.label} link`}>
                        <ExternalLink size={14} className="text-teal-400" />
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
