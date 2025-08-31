import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Users, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DownloadStat {
  id: number;
  resolution: string;
  platform: string;
  downloads: number;
}

export default function AdminOverview() {
  const { data: downloadStats } = useQuery<{ stats: DownloadStat[]; totalDownloads: number }>({
    queryKey: ["/api/downloads/stats"],
  });

  const { data: versions } = useQuery({
    queryKey: ["/api/versions"],
  });

  const { data: screenshots } = useQuery({
    queryKey: ["/api/screenshots"],
  });

  const { data: modrinthStats } = useQuery({
    queryKey: ["/api/modrinth/stats"],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Badge variant="outline" className="text-green-400">Admin Panel</Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {downloadStats?.totalDownloads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Versions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {Array.isArray(versions) ? versions.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for download
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {Array.isArray(screenshots) ? screenshots.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Screenshots uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modrinth Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {(modrinthStats as any)?.project?.followers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Project followers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gallery updated</span>
                <span className="text-xs text-slate-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New version released</span>
                <span className="text-xs text-slate-400">1 day ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Download milestone reached</span>
                <span className="text-xs text-slate-400">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/dash/gallery"
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg text-center transition-colors"
              >
                <Eye className="mx-auto mb-2" size={20} />
                <span className="text-sm">Manage Gallery</span>
              </a>
              <a
                href="/dash/versions"
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg text-center transition-colors"
              >
                <BarChart3 className="mx-auto mb-2" size={20} />
                <span className="text-sm">Add Version</span>
              </a>
              <a
                href="/dash/analytics"
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg text-center transition-colors"
              >
                <Download className="mx-auto mb-2" size={20} />
                <span className="text-sm">View Analytics</span>
              </a>
              <a
                href="/dash/settings"
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg text-center transition-colors"
              >
                <Users className="mx-auto mb-2" size={20} />
                <span className="text-sm">Settings</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}