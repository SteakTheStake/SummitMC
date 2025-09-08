import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Package, Clock } from "lucide-react";

interface ModrinthStatsData {
  project: {
    downloads: number;
    followers: number;
    versions: number;
  } | null;
  versions: Array<{
    version: string;
    downloads: number;
    date: string;
  }> | null;
  latest: {
    version: string;
    downloads: number;
    changelog: string;
  } | null;
  lastUpdated: string;
}

export default function ModrinthStats() {
  const { data: modrinthData, isLoading, isError } = useQuery<ModrinthStatsData>({
    queryKey: ["/api/modrinth/stats"],
    refetchInterval: 0.1 * 60 * 1000, // Refetch every 6 seconds
    staleTime: 0.1 * 60 * 1000, // Consider data stale after 6 seconds
  });

  if (isLoading) {
    return (
      <div className="glassmorphism p-6 rounded-2xl animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-600 rounded-lg"></div>
          <div className="h-6 bg-slate-600 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-600 rounded w-full"></div>
          <div className="h-4 bg-slate-600 rounded w-3/4"></div>
          <div className="h-4 bg-slate-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isError || !modrinthData?.project) {
    return (
      <div className="glassmorphism p-6 rounded-2xl border border-red-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Clock className="text-red-400" size={16} />
          </div>
          <h3 className="font-pixelbasel font-semibold text-lg">Modrinth Status</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Unable to fetch live stats right now. Using cached data.
        </p>
      </div>
    );
  }

  const { project, latest, lastUpdated } = modrinthData;
  const timeSinceUpdate = new Date().getTime() - new Date(lastUpdated).getTime();
  const minutesAgo = Math.floor(timeSinceUpdate / (1000 * 60));

  return (
    <div className="glassmorphism p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="text-white" size={16} />
        </div>
        <h3 className="font-pixelbasel font-semibold text-lg minecraft-green">Live from Modrinth</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold minecraft-green">
            {(project.downloads / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Package size={12} />
            Total Downloads
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold minecraft-blue">
            {project.followers}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Users size={12} />
            Followers
          </div>
        </div>
      </div>

      {latest && (
        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Latest Version</span>
            <span className="font-semibold minecraft-gold">{latest.version}</span>
          </div>
          <div className="text-xs text-slate-400">
            {latest.downloads} downloads
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Updated {minutesAgo < 1 ? 'just now' : `${minutesAgo}m ago`}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}