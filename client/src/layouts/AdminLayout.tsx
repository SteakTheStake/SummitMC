import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  BarChart3, 
  Settings, 
  LogOut,
  Home
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dash", label: "Overview", icon: LayoutDashboard },
  { href: "/dash/versions", label: "Versions", icon: Package },
  { href: "/dash/gallery", label: "Gallery", icon: Image },
  { href: "/dash/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dash/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-4">Admin privileges required to access this page.</p>
          <div className="space-x-2">
            <Button onClick={() => window.location.href = "/login"}>
              Login as Admin
            </Button>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-slate-800 border-r border-slate-700">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-slate-400">Summit Texture Pack</p>
              </div>
            </div>

            {/* User Info */}
            <Card className="bg-slate-700 border-slate-600 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-slate-400">{user?.email || 'admin@summit.com'}</p>
                </div>
              </div>
              <Badge variant="outline" className="mt-2 text-xs">Administrator</Badge>
            </Card>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}>
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="space-y-2">
                <Link href="/">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                    <Home size={18} />
                    <span className="font-medium">Back to Site</span>
                  </div>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start gap-3 border-slate-600 hover:bg-slate-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}