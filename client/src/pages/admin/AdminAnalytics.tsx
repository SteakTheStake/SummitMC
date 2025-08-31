import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface DownloadStat {
  id: number;
  resolution: string;
  platform: string;
  downloads: number;
}

export default function AdminAnalytics() {
  const { data: downloadStats } = useQuery<{ stats: DownloadStat[]; totalDownloads: number }>({
    queryKey: ["/api/downloads/stats"],
  });

  const { data: modrinthStats } = useQuery({
    queryKey: ["/api/modrinth/stats"],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Download Analytics</h1>
        <Badge variant="outline" className="text-green-400">Real-time Data</Badge>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Downloads by Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloadStats?.stats.map((stat) => (
                <div key={stat.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{stat.resolution}</span>
                    <span className="text-slate-400 ml-2">({stat.platform})</span>
                  </div>
                  <Badge variant="outline">{stat.downloads}</Badge>
                </div>
              ))}
            </div>
            
            {(!downloadStats?.stats || downloadStats.stats.length === 0) && (
              <div className="text-center py-4">
                <p className="text-slate-400">No download data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Modrinth Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {(modrinthStats as any)?.project ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="text-green-400">{(modrinthStats as any).project.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span>Followers</span>
                  <span className="text-blue-400">{(modrinthStats as any).project.followers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge variant="secondary">{(modrinthStats as any).project.status || 'Active'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-slate-400">
                    {new Date((modrinthStats as any).project.published || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">Loading Modrinth data...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Download Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {downloadStats?.totalDownloads || 0}
                </div>
                <p className="text-xs text-slate-400">Total Downloads</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {downloadStats?.stats.length || 0}
                </div>
                <p className="text-xs text-slate-400">Active Platforms</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {downloadStats?.stats.filter(s => s.platform === 'website').reduce((acc, s) => acc + s.downloads, 0) || 0}
                </div>
                <p className="text-xs text-slate-400">Website Downloads</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {(modrinthStats as any)?.project?.downloads || 0}
                </div>
                <p className="text-xs text-slate-400">Modrinth Downloads</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Platform Breakdown</h3>
              <div className="space-y-2">
                {downloadStats?.stats.map((stat) => {
                  const percentage = downloadStats.totalDownloads > 0 
                    ? (stat.downloads / downloadStats.totalDownloads * 100).toFixed(1)
                    : '0';
                  return (
                    <div key={stat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stat.platform}</span>
                        <Badge variant="outline" className="text-xs">{stat.resolution}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stat.downloads}</span>
                        <span className="text-xs text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}