import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Save, Eye, Settings, BarChart3, Users, Download, Image, LogOut, Search, Filter, Star, StarOff, Check, X, Upload } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import MainLayout from "@/layouts/MainLayout";
import { ObjectUploader } from "@/components/ObjectUploader";

interface Version {
  id: number;
  version: string;
  resolution: string;
  changelog: string;
  source?: string;
}

interface Screenshot {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  category: string;
  resolution: string;
  featured: boolean;
  fileHash?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: Date;
}

interface DownloadStat {
  id: number;
  resolution: string;
  platform: string;
  downloads: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [editingScreenshot, setEditingScreenshot] = useState<Screenshot | null>(null);
  
  // Gallery management state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [editingInlineScreenshot, setEditingInlineScreenshot] = useState<number | null>(null);
  const [inlineEditData, setInlineEditData] = useState<Partial<Screenshot>>({});
  
  const { toast } = useToast();
  const { isAuthenticated, isAdmin: userIsAdmin, isLoading, user } = useAuth();
  
  // Debug logging
  console.log("Admin component render:", { isAuthenticated, userIsAdmin, isLoading });

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NO EARLY RETURNS BEFORE THIS
  // Fetch data
  const { data: versions } = useQuery<Version[]>({
    queryKey: ["/api/versions"],
    enabled: isAuthenticated && userIsAdmin, // Only fetch when authenticated
  });

  const { data: screenshots } = useQuery<Screenshot[]>({
    queryKey: ["/api/screenshots", selectedCategory, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      return fetch(`/api/screenshots?${params.toString()}`).then(r => r.json());
    },
    enabled: isAuthenticated && userIsAdmin, // Only fetch when authenticated
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/screenshots/categories"],
    enabled: isAuthenticated && userIsAdmin,
  });

  const { data: downloadStats } = useQuery<{ stats: DownloadStat[]; totalDownloads: number }>({
    queryKey: ["/api/downloads/stats"],
    enabled: isAuthenticated && userIsAdmin, // Only fetch when authenticated
  });

  const { data: modrinthStats } = useQuery({
    queryKey: ["/api/modrinth/stats"],
    enabled: isAuthenticated && userIsAdmin, // Only fetch when authenticated
  });

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !userIsAdmin)) {
      toast({
        title: "Access Denied",
        description: "Admin access required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, userIsAdmin, isLoading]);

  // Mutations
  const createVersionMutation = useMutation({
    mutationFn: async (data: Omit<Version, 'id'>) => {
      return apiRequest('POST', '/api/versions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/versions"] });
      toast({ title: "Version created successfully" });
      setEditingVersion(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({ 
        title: "Error", 
        description: "Failed to create version",
        variant: "destructive" 
      });
    },
  });

  const updateVersionMutation = useMutation({
    mutationFn: async (data: Version) => {
      return apiRequest('PUT', `/api/versions/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/versions"] });
      toast({ title: "Version updated successfully" });
      setEditingVersion(null);
    },
  });

  const deleteVersionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/versions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/versions"] });
      toast({ title: "Version deleted successfully" });
    },
  });

  const createScreenshotMutation = useMutation({
    mutationFn: async (data: Omit<Screenshot, 'id'>) => {
      return apiRequest('POST', '/api/screenshots', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenshots"] });
      toast({ title: "Screenshot added successfully" });
      setEditingScreenshot(null);
    },
  });

  const deleteScreenshotMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/screenshots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenshots"] });
      toast({ title: "Screenshot deleted successfully" });
    },
  });

  const updateScreenshotMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Screenshot> }) => {
      return apiRequest('PUT', `/api/screenshots/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenshots"] });
      toast({ title: "Screenshot updated successfully" });
      setEditingInlineScreenshot(null);
      setInlineEditData({});
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({ 
        title: "Error", 
        description: "Failed to update screenshot",
        variant: "destructive" 
      });
    },
  });

  const handleVersionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      version: formData.get('version') as string,
      resolution: formData.get('resolution') as string,
      changelog: formData.get('changelog') as string,
      source: formData.get('source') as string,
    };

    if (editingVersion) {
      updateVersionMutation.mutate({ ...data, id: editingVersion.id });
    } else {
      createVersionMutation.mutate(data);
    }
  };

  const handleScreenshotSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      imageUrl: formData.get('imageUrl') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      category: formData.get('category') as string,
      resolution: formData.get('resolution') as string || "16x",
      featured: false,
    };

    createScreenshotMutation.mutate(data);
  };

  // File upload handlers
  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/screenshots/upload');
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const generateTitleFromFilename = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
  };

  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUploadComplete = async (result: { successful: Array<{ uploadURL: string; name: string; size: number; type: string }> }) => {
    for (const file of result.successful) {
      const autoTitle = generateTitleFromFilename(file.name);
      
      // Extract category from filename or use default
      const category = file.name.toLowerCase().includes('terrain') ? 'terrain' :
                     file.name.toLowerCase().includes('nature') ? 'nature' :
                     file.name.toLowerCase().includes('medieval') ? 'medieval' :
                     file.name.toLowerCase().includes('modern') ? 'modern' :
                     file.name.toLowerCase().includes('night') ? 'night' :
                     file.name.toLowerCase().includes('town') ? 'town' : 'nature';

      const screenshotData = {
        imageUrl: file.uploadURL,
        title: autoTitle,
        description: `Automatically uploaded screenshot: ${autoTitle}`,
        category: category,
        resolution: "16x", // Default resolution
        featured: false,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      try {
        await createScreenshotMutation.mutateAsync(screenshotData);
      } catch (error) {
        console.error('Error creating screenshot:', error);
        toast({
          title: "Upload Error",
          description: `Failed to add screenshot: ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    setShowUploader(false);
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${result.successful.length} screenshot(s)`,
    });
  };

  // Inline editing handlers
  const startInlineEdit = (screenshot: Screenshot) => {
    setEditingInlineScreenshot(screenshot.id);
    setInlineEditData({
      title: screenshot.title,
      description: screenshot.description,
      category: screenshot.category,
      featured: screenshot.featured,
    });
  };

  const saveInlineEdit = () => {
    if (editingInlineScreenshot && Object.keys(inlineEditData).length > 0) {
      updateScreenshotMutation.mutate({
        id: editingInlineScreenshot,
        updates: inlineEditData,
      });
    }
  };

  const cancelInlineEdit = () => {
    setEditingInlineScreenshot(null);
    setInlineEditData({});
  };

  const toggleFeatured = (screenshot: Screenshot) => {
    updateScreenshotMutation.mutate({
      id: screenshot.id,
      updates: { featured: !screenshot.featured },
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Checking admin access...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Don't render admin content if not authenticated/admin
  if (!isAuthenticated || !userIsAdmin) {
    return (
      <MainLayout>
        <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-slate-400 mb-4">Admin privileges required to access this page.</p>
            <Button onClick={() => window.location.href = "/login"}>
              Login as Admin
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen pt-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-pixelbasel text-4xl mb-2">
                  <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Admin Dashboard</span>
                </h1>
                <p className="text-slate-400">Manage Summit texture pack content</p>
              </div>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    await apiRequest("POST", "/api/logout");
                    window.location.href = "/login";
                  } catch (error) {
                    toast({
                      title: "Logout failed",
                      description: "Please try again",
                      variant: "destructive"
                    });
                  }
                }}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex items-center gap-2">
                <Settings size={16} />
                Versions
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Image size={16} />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Download size={16} />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Users size={16} />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      {downloadStats?.totalDownloads ? `${(downloadStats.totalDownloads / 1000).toFixed(1)}k` : "13.9k"}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Versions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">
                      {versions?.length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">
                      {screenshots?.length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Modrinth Followers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-400">
                      {(modrinthStats as any)?.project?.followers || "N/A"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Latest version uploaded</span>
                        <Badge variant="outline">{versions?.[0]?.version || "2.6"}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Screenshot gallery updated</span>
                        <span className="text-green-400">2 days ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Site content updated</span>
                        <span className="text-blue-400">1 week ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => setActiveTab("versions")} className="w-full justify-start">
                      <Plus className="mr-2" size={16} />
                      Add New Version
                    </Button>
                    <Button onClick={() => setActiveTab("gallery")} variant="outline" className="w-full justify-start">
                      <Image className="mr-2" size={16} />
                      Upload Screenshot
                    </Button>
                    <Button onClick={() => setActiveTab("analytics")} variant="outline" className="w-full justify-start">
                      <Eye className="mr-2" size={16} />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Versions Tab */}
            <TabsContent value="versions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Version Management</h2>
                <Button onClick={() => setEditingVersion({} as Version)}>
                  <Plus className="mr-2" size={16} />
                  Add Version
                </Button>
              </div>

              {editingVersion && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>{editingVersion.id ? 'Edit Version' : 'Add New Version'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleVersionSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="version">Version</Label>
                          <Input 
                            id="version" 
                            name="version" 
                            defaultValue={editingVersion.version} 
                            placeholder="e.g., 2.6" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="resolution">Resolution</Label>
                          <Select name="resolution" defaultValue={editingVersion.resolution}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select resolution" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16x">16x</SelectItem>
                              <SelectItem value="32x">32x</SelectItem>
                              <SelectItem value="64x">64x</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="changelog">Changelog</Label>
                        <Textarea 
                          id="changelog" 
                          name="changelog" 
                          defaultValue={editingVersion.changelog} 
                          placeholder="What's new in this version..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="source">Download URL</Label>
                        <Input 
                          id="source" 
                          name="source" 
                          defaultValue={editingVersion.source} 
                          placeholder="https://..." 
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={createVersionMutation.isPending || updateVersionMutation.isPending}>
                          <Save className="mr-2" size={16} />
                          {editingVersion.id ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingVersion(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {versions?.map((version) => (
                  <Card key={version.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">v{version.version}</h3>
                            <Badge variant="outline">{version.resolution}</Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{version.changelog}</p>
                          {version.source && (
                            <a href={version.source} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
                              Download Link
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingVersion(version)}>
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteVersionMutation.mutate(version.id)}
                            disabled={deleteVersionMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              {/* Header with actions */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <h2 className="text-2xl font-bold">Gallery Management</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowUploader(!showUploader)} variant="outline">
                    <Upload className="mr-2" size={16} />
                    Upload Files
                  </Button>
                  <Button onClick={() => setEditingScreenshot({} as Screenshot)}>
                    <Plus className="mr-2" size={16} />
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search screenshots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Filter size={16} />
                  {screenshots?.length || 0} screenshots
                </div>
              </div>

              {/* File Upload Section */}
              {showUploader && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Upload Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ObjectUploader
                      maxNumberOfFiles={10}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleFileUploadComplete}
                      accept="image/*"
                    >
                      Select Images
                    </ObjectUploader>
                  </CardContent>
                </Card>
              )}

              {/* Manual Add Form */}
              {editingScreenshot && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Add Screenshot via URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleScreenshotSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input 
                          id="imageUrl" 
                          name="imageUrl" 
                          placeholder="https://..." 
                          required 
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            placeholder="Screenshot title" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="resolution">Resolution</Label>
                          <Select name="resolution" defaultValue="16x">
                            <SelectTrigger>
                              <SelectValue placeholder="Select resolution" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16x">16x</SelectItem>
                              <SelectItem value="32x">32x</SelectItem>
                              <SelectItem value="64x">64x</SelectItem>
                              <SelectItem value="128x">128x</SelectItem>
                              <SelectItem value="256x">256x</SelectItem>
                              <SelectItem value="512x">512x</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select name="category">
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medieval">Medieval</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="nature">Nature</SelectItem>
                              <SelectItem value="terrain">Terrain</SelectItem>
                              <SelectItem value="night">Night</SelectItem>
                              <SelectItem value="town">Town</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input 
                            id="description" 
                            name="description" 
                            placeholder="Optional description..." 
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={createScreenshotMutation.isPending}>
                          <Save className="mr-2" size={16} />
                          Add Screenshot
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingScreenshot(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Screenshot Grid with Enhanced Features */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {screenshots?.map((screenshot) => (
                  <Card key={screenshot.id} className="bg-slate-800 border-slate-700 overflow-hidden">
                    <div className="aspect-video relative group">
                      <img 
                        src={screenshot.imageUrl} 
                        alt={screenshot.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Featured indicator */}
                      {screenshot.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-500 text-black">
                            <Star size={12} className="mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Action buttons - show on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFeatured(screenshot)}
                          disabled={updateScreenshotMutation.isPending}
                        >
                          {screenshot.featured ? <StarOff size={14} /> : <Star size={14} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startInlineEdit(screenshot)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteScreenshotMutation.mutate(screenshot.id)}
                          disabled={deleteScreenshotMutation.isPending}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      {/* Inline editing */}
                      {editingInlineScreenshot === screenshot.id ? (
                        <div className="space-y-2">
                          <Input
                            value={inlineEditData.title || ''}
                            onChange={(e) => setInlineEditData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Title"
                            className="text-sm"
                          />
                          <Input
                            value={inlineEditData.description || ''}
                            onChange={(e) => setInlineEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description"
                            className="text-sm"
                          />
                          <Select
                            value={inlineEditData.category || ''}
                            onValueChange={(value) => setInlineEditData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medieval">Medieval</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="nature">Nature</SelectItem>
                              <SelectItem value="terrain">Terrain</SelectItem>
                              <SelectItem value="night">Night</SelectItem>
                              <SelectItem value="town">Town</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={saveInlineEdit}
                              disabled={updateScreenshotMutation.isPending}
                            >
                              <Check size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelInlineEdit}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold truncate">{screenshot.title}</h3>
                          {screenshot.description && (
                            <p className="text-xs text-slate-400 line-clamp-2">{screenshot.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">{screenshot.category}</Badge>
                            <Badge variant="secondary" className="text-xs">{screenshot.resolution}</Badge>
                          </div>
                          {screenshot.fileSize && (
                            <p className="text-xs text-slate-400 mt-1">
                              {(screenshot.fileSize / 1024 / 1024).toFixed(1)}MB
                            </p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty state */}
              {screenshots?.length === 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Image className="mx-auto mb-4 text-slate-400" size={48} />
                    <h3 className="text-lg font-semibold mb-2">No Screenshots Found</h3>
                    <p className="text-slate-400 mb-4">
                      {searchTerm || selectedCategory 
                        ? "No screenshots match your current filters." 
                        : "Start building your gallery by uploading some screenshots."}
                    </p>
                    {(searchTerm || selectedCategory) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold">Download Analytics</h2>
              
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
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Modrinth Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(modrinthStats as any)?.project && (
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
                          <span>Versions</span>
                          <span className="text-purple-400">{(modrinthStats as any).project.versions}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold">Site Settings</h2>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="Summit Texture Pack" />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Description</Label>
                    <Textarea id="siteDescription" defaultValue="Premium Minecraft textures by Limitless Designs" rows={2} />
                  </div>
                  <div>
                    <Label htmlFor="modrinthUrl">Modrinth URL</Label>
                    <Input id="modrinthUrl" placeholder="https://modrinth.com/resourcepack/..." />
                  </div>
                  <Button>
                    <Save className="mr-2" size={16} />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}