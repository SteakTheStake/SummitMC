import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScreenshotSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get download statistics
  app.get("/api/downloads/stats", async (req, res) => {
    try {
      const stats = await storage.getDownloadStats();
      const totalDownloads = stats.reduce((sum, stat) => sum + stat.count, 0);
      res.json({ stats, totalDownloads });
    } catch (error) {
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

  // Get all versions
  app.get("/api/versions", async (req, res) => {
    try {
      const versions = await storage.getVersions();
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });

  // Get latest version
  app.get("/api/versions/latest", async (req, res) => {
    try {
      const latestVersion = await storage.getLatestVersion();
      if (!latestVersion) {
        return res.status(404).json({ message: "No latest version found" });
      }
      res.json(latestVersion);
    } catch (error) {
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
