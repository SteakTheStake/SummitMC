import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Version {
  id: number;
  version: string;
  resolution: string;
  changelog: string;
  source: string;
}

export default function AdminVersions() {
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const { toast } = useToast();

  const { data: versions } = useQuery<Version[]>({
    queryKey: ["/api/versions"],
  });

  const createVersionMutation = useMutation({
    mutationFn: async (data: Omit<Version, "id">) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Version Management</h1>
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
                    placeholder="1.0.0" 
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

      {versions?.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Versions Found</h3>
            <p className="text-slate-400 mb-4">Start by creating your first texture pack version.</p>
            <Button onClick={() => setEditingVersion({} as Version)}>
              <Plus className="mr-2" size={16} />
              Add First Version
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}