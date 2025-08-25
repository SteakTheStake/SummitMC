import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScreenshotSchema } from "@shared/schema";
import { z } from "zod";
import { modrinthService } from "./modrinth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get download statistics (with real-time Modrinth data)
  app.get("/api/downloads/stats", async (req, res) => {
    try {
      // Get local database stats
      const localStats = await storage.getDownloadStats();
      const localTotalDownloads = localStats.reduce((sum, stat) => sum + stat.count, 0);
      
      // Get real-time Modrinth stats
      const modrinthStats = await modrinthService.getProjectStats();
      
      // Combine local and Modrinth data
      const response = {
        stats: localStats,
        totalDownloads: localTotalDownloads,
        modrinth: modrinthStats ? {
          downloads: modrinthStats.downloads,
          followers: modrinthStats.followers,
          versions: modrinthStats.versions
        } : null,
        // Use Modrinth total if available, otherwise fall back to local
        realTimeDownloads: modrinthStats?.downloads || localTotalDownloads
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching download statistics:', error);
      res.status(500).json({ message: "Failed to fetch download statistics" });
    }
  });

  // Increment download count
  app.post("/api/downloads/increment", async (req, res) => {
    try {
      const { resolution, platform } = req.body;
      if (!resolution || !platform) {
        return res.status(400).json({ message: "Resolution and platform are required" });
      }
      
      const download = await storage.incrementDownload(resolution, platform);
      res.json(download);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment download count" });
    }
  });

  // Get all versions (includes admin route)
  app.get("/api/versions", async (req, res) => {
    try {
      const versions = await storage.getVersions();
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });

  // Admin API Routes
  app.post("/api/versions", async (req, res) => {
    try {
      const version = await storage.createVersion(req.body);
      res.json(version);
    } catch (error) {
      console.error("Error creating version:", error);
      res.status(500).json({ error: "Failed to create version" });
    }
  });

  app.put("/api/versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const version = await storage.updateVersion(id, req.body);
      res.json(version);
    } catch (error) {
      console.error("Error updating version:", error);
      res.status(500).json({ error: "Failed to update version" });
    }
  });

  app.delete("/api/versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVersion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting version:", error);
      res.status(500).json({ error: "Failed to delete version" });
    }
  });

  app.delete("/api/screenshots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteScreenshot(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting screenshot:", error);
      res.status(500).json({ error: "Failed to delete screenshot" });
    }
  });

  // Get latest version (with real-time Modrinth data)
  app.get("/api/versions/latest", async (req, res) => {
    try {
      // Get local version data
      const localLatestVersion = await storage.getLatestVersion();
      
      // Get real-time Modrinth version data
      const modrinthLatestVersion = await modrinthService.getLatestVersion();
      
      // Prefer Modrinth data if available, fall back to local
      if (modrinthLatestVersion) {
        res.json({
          ...localLatestVersion,
          version: modrinthLatestVersion.version,
          downloads: modrinthLatestVersion.downloads,
          changelog: modrinthLatestVersion.changelog || localLatestVersion?.changelog,
          source: 'modrinth'
        });
      } else if (localLatestVersion) {
        res.json({
          ...localLatestVersion,
          source: 'local'
        });
      } else {
        return res.status(404).json({ message: "No latest version found" });
      }
    } catch (error) {
      console.error('Error fetching latest version:', error);
      res.status(500).json({ message: "Failed to fetch latest version" });
    }
  });

  // Get screenshots
  app.get("/api/screenshots", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const screenshots = await storage.getScreenshots(category);
      res.json(screenshots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch screenshots" });
    }
  });

  // Get real-time Modrinth stats
  app.get("/api/modrinth/stats", async (req, res) => {
    try {
      const projectStats = await modrinthService.getProjectStats();
      const versionStats = await modrinthService.getVersionStats();
      const latestVersion = await modrinthService.getLatestVersion();
      
      res.json({
        project: projectStats,
        versions: versionStats,
        latest: latestVersion,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching Modrinth stats:', error);
      res.status(500).json({ message: "Failed to fetch Modrinth statistics" });
    }
  });

  // Add screenshot
  app.post("/api/screenshots", async (req, res) => {
    try {
      const validatedData = insertScreenshotSchema.parse(req.body);
      const screenshot = await storage.addScreenshot(validatedData);
      res.status(201).json(screenshot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid screenshot data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add screenshot" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
