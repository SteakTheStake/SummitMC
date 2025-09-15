import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import crypto from "crypto";
import { storage } from "./storage";
import { insertScreenshotSchema } from "@shared/schema";
import { z } from "zod";
import { modrinthService } from "./modrinth";
import { curseforgeService } from "./curseforge";
import { setupAuth, isAuthenticated, isAdmin } from "./localAuth";
import { ObjectStorageService } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
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

  // Provide latest download links by resolution
  app.get("/api/downloads/links", async (req, res) => {
    try {
      const [modrinthLinks, curseforgeLinks] = await Promise.all([
        modrinthService.getResolutionDownloadLinks(),
        curseforgeService.getResolutionDownloadLinks(),
      ]);

      const modrinth = modrinthLinks?.modrinth ?? { '32x': null, '64x': null };
      const curseforge = curseforgeLinks?.curseforge ?? { '32x': null, '64x': null };
      const updatedAt = new Date().toISOString();

      res.json({ modrinth, curseforge, updatedAt });
    } catch (error) {
      console.error('Error fetching download links:', error);
      res.status(500).json({ message: 'Failed to fetch download links' });
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

  // Admin API Routes (protected)
  app.post("/api/versions", isAdmin, async (req, res) => {
    try {
      const version = await storage.createVersion(req.body);
      res.json(version);
    } catch (error) {
      console.error("Error creating version:", error);
      res.status(500).json({ error: "Failed to create version" });
    }
  });

  app.put("/api/versions/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const version = await storage.updateVersion(id, req.body);
      res.json(version);
    } catch (error) {
      console.error("Error updating version:", error);
      res.status(500).json({ error: "Failed to update version" });
    }
  });

  app.delete("/api/versions/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVersion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting version:", error);
      res.status(500).json({ error: "Failed to delete version" });
    }
  });

  app.delete("/api/screenshots/:id", isAdmin, async (req, res) => {
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

  // Get screenshots with enhanced filtering and search
  app.get("/api/screenshots", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const screenshots = await storage.getScreenshots(category, search);
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

  // Add screenshot with enhanced validation and duplicate detection
  app.post("/api/screenshots", isAdmin, async (req, res) => {
    try {
      const validatedData = insertScreenshotSchema.parse(req.body);
      
      // Check for duplicates
      const duplicates = await storage.findDuplicateScreenshots(
        validatedData.imageUrl ?? undefined,
        validatedData.fileHash ?? undefined,
      );
      if (duplicates.length > 0) {
        return res.status(409).json({ 
          message: "Duplicate image found",
          duplicates: duplicates
        });
      }
      
      const screenshot = await storage.addScreenshot(validatedData);
      res.status(201).json(screenshot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid screenshot data", errors: error.errors });
      } else {
        console.error("Error adding screenshot:", error);
        res.status(500).json({ message: "Failed to add screenshot" });
      }
    }
  });

  // Update screenshot (edit-in-place)
  app.put("/api/screenshots/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const screenshot = await storage.updateScreenshot(id, updates);
      res.json(screenshot);
    } catch (error) {
      console.error("Error updating screenshot:", error);
      res.status(500).json({ error: "Failed to update screenshot" });
    }
  });

  // Get upload URL for screenshot files
  app.post("/api/screenshots/upload", isAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Check for duplicate screenshots
  app.post("/api/screenshots/check-duplicates", isAdmin, async (req, res) => {
    try {
      const { imageUrl, fileHash } = req.body;
      const duplicates = await storage.findDuplicateScreenshots(imageUrl, fileHash);
      res.json({ duplicates });
    } catch (error) {
      console.error("Error checking duplicates:", error);
      res.status(500).json({ error: "Failed to check for duplicates" });
    }
  });

  // Get screenshot categories
  app.get("/api/screenshots/categories", async (req, res) => {
    try {
      const categories = await storage.getScreenshotCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  // Serve private objects (screenshot files)
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectPath = req.params.objectPath as string;
      const objectFile = await objectStorageService.searchPublicObject(objectPath);
      if (!objectFile) {
        return res.status(404).json({ error: "File not found" });
      }
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
