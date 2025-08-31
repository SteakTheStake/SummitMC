import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, LogOut, Shield, Database, Bell, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Summit Texture Pack",
    siteDescription: "A modern Minecraft texture pack by Limitless Designs",
    maintenanceMode: false,
    enableAnalytics: true,
    enableNotifications: true,
    theme: "dark",
    maxUploadSize: "10",
    allowedFileTypes: "jpg,jpeg,png,webp",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast({ title: "Settings saved successfully" });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <div className="flex gap-2">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2" size={16} />
            Save Changes
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea 
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-xs text-slate-400">Temporarily disable public access</p>
              </div>
              <Switch 
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Admin Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h3 className="font-semibold">{user?.username || 'Admin'}</h3>
                <p className="text-slate-400 text-sm">{user?.email || 'admin@summit.com'}</p>
                <Badge variant="outline" className="mt-1">Administrator</Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="adminEmail">Email</Label>
              <Input 
                id="adminEmail"
                value={user?.email || ''}
                disabled
                className="opacity-60"
              />
            </div>
            <div>
              <Label htmlFor="adminRole">Role</Label>
              <Input 
                id="adminRole"
                value="Administrator"
                disabled
                className="opacity-60"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
              <Input 
                id="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxUploadSize: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input 
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                placeholder="jpg,png,webp"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                <p className="text-xs text-slate-400">Track download statistics</p>
              </div>
              <Switch 
                id="enableAnalytics"
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAnalytics: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Admin Theme</Label>
              <select 
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Desktop Notifications</Label>
                <p className="text-xs text-slate-400">Get notified of admin events</p>
              </div>
              <Switch 
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
              />
            </div>
            <div className="pt-4 border-t border-slate-700">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="mr-2" size={14} />
                  Test Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Database className="mr-2" size={14} />
                  Clear Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-600 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Reset Analytics Data</h4>
              <p className="text-sm text-slate-400 mb-3">
                This will permanently delete all download statistics and analytics data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Reset Analytics
              </Button>
            </div>
            <div className="p-4 border border-red-600 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Reset Gallery</h4>
              <p className="text-sm text-slate-400 mb-3">
                This will permanently delete all uploaded screenshots and gallery data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Reset Gallery
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}