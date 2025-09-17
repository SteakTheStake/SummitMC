import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Gallery from "./pages/Gallery";
import Download from "./pages/Download";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminVersions from "./pages/admin/AdminVersions";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={Features} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/download" component={Download} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/dash">
        {() => (
          <AdminLayout>
            <AdminOverview />
          </AdminLayout>
        )}
      </Route>
      <Route path="/dash/versions">
        {() => (
          <AdminLayout>
            <AdminVersions />
          </AdminLayout>
        )}
      </Route>
      <Route path="/dash/gallery">
        {() => (
          <AdminLayout>
            <AdminGallery />
          </AdminLayout>
        )}
      </Route>
      <Route path="/dash/analytics">
        {() => (
          <AdminLayout>
            <AdminAnalytics />
          </AdminLayout>
        )}
      </Route>
      <Route path="/dash/settings">
        {() => (
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
