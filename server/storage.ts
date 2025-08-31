import { users, downloads, versions, screenshots, type User, type InsertUser, type Download, type Version, type Screenshot, type InsertDownload, type InsertVersion, type InsertScreenshot } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDownloadStats(): Promise<Download[]>;
  incrementDownload(resolution: string, platform: string): Promise<Download>;
  
  getVersions(): Promise<Version[]>;
  getLatestVersion(): Promise<Version | undefined>;
  createVersion(version: InsertVersion): Promise<Version>;
  updateVersion(id: number, updates: Partial<Version>): Promise<Version>;
  deleteVersion(id: number): Promise<void>;
  
  getScreenshots(category?: string, search?: string): Promise<Screenshot[]>;
  addScreenshot(screenshot: InsertScreenshot): Promise<Screenshot>;
  updateScreenshot(id: number, updates: Partial<Screenshot>): Promise<Screenshot>;
  deleteScreenshot(id: number): Promise<void>;
  findDuplicateScreenshots(imageUrl?: string, fileHash?: string): Promise<Screenshot[]>;
  getScreenshotCategories(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private downloads: Map<string, Download>;
  private versions: Map<number, Version>;
  private screenshots: Map<number, Screenshot>;
  private currentUserId: number;
  private currentDownloadId: number;
  private currentVersionId: number;
  private currentScreenshotId: number;

  constructor() {
    this.users = new Map();
    this.downloads = new Map();
    this.versions = new Map();
    this.screenshots = new Map();
    this.currentUserId = 1;
    this.currentDownloadId = 1;
    this.currentVersionId = 1;
    this.currentScreenshotId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize download statistics
    const downloadStats = [
      { resolution: "16x", platform: "modrinth", count: 8900 },
      { resolution: "16x", platform: "planetminecraft", count: 3200 },
      { resolution: "32x", platform: "modrinth", count: 1200 },
      { resolution: "64x", platform: "planetminecraft", count: 600 },
      { resolution: "512x", platform: "planetminecraft", count: 300 }
    ];

    downloadStats.forEach(stat => {
      const download: Download = {
        id: this.currentDownloadId++,
        resolution: stat.resolution,
        platform: stat.platform,
        count: stat.count,
        lastUpdated: new Date()
      };
      this.downloads.set(`${stat.resolution}-${stat.platform}`, download);
    });

    // Initialize versions
    const versionsData = [
      {
        version: "2.3",
        resolution: "16x",
        releaseDate: new Date("2025-02-01"),
        changelog: "Modified packed mud and mud brick, Enhanced oak log tops, Updated cherry leaves and pink petals, Fixed Polytone compatibility issues, Added wheat crops, bread, bow, arrow textures, New chest CEM, Armor stand models, Enhanced coral textures",
        downloadUrl: "https://modrinth.com/resourcepack/summit/version/2.3",
        isLatest: true
      },
      {
        version: "2.1",
        resolution: "16x",
        releaseDate: new Date("2025-01-15"),
        changelog: "Updated cherry tree blocks, bamboo, azalea leaves, Enhanced nether content, Improved blast furnace and composter textures",
        downloadUrl: "https://modrinth.com/resourcepack/summit/version/2.1",
        isLatest: false
      },
      {
        version: "0.8",
        resolution: "64x",
        releaseDate: new Date("2024-12-20"),
        changelog: "High definition textures for terrain blocks, Enhanced stone variants, Improved wood grain patterns",
        downloadUrl: "https://modrinth.com/resourcepack/summit/version/0.8",
        isLatest: false
      }
    ];

    versionsData.forEach(versionData => {
      const version: Version = {
        id: this.currentVersionId++,
        ...versionData
      };
      this.versions.set(version.id, version);
    });

    // Initialize screenshots
    const screenshotsData = [
      {
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Mountain Landscape",
        description: "Beautiful mountain vista with Summit textures",
        category: "terrain",
        resolution: "16x"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Stone Formations",
        description: "Enhanced stone textures in action",
        category: "terrain",
        resolution: "32x"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Forest Scene",
        description: "Wood and foliage textures",
        category: "nature",
        resolution: "64x"
      }
    ];

    screenshotsData.forEach(screenshotData => {
      const screenshot: Screenshot = {
        id: this.currentScreenshotId++,
        ...screenshotData,
        uploadedAt: new Date(),
        featured: false,
        fileHash: null,
        fileName: null,
        fileSize: null,
        mimeType: null
      };
      this.screenshots.set(screenshot.id, screenshot);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id, 
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      isAdmin: insertUser.isAdmin ?? null,
      username: insertUser.username ?? null,
      password: insertUser.password ?? null,
      createdAt: insertUser.createdAt ?? null,
      updatedAt: insertUser.updatedAt ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async getDownloadStats(): Promise<Download[]> {
    return Array.from(this.downloads.values());
  }

  async incrementDownload(resolution: string, platform: string): Promise<Download> {
    const key = `${resolution}-${platform}`;
    const existing = this.downloads.get(key);
    
    if (existing) {
      existing.count++;
      existing.lastUpdated = new Date();
      return existing;
    }
    
    const newDownload: Download = {
      id: this.currentDownloadId++,
      resolution,
      platform,
      count: 1,
      lastUpdated: new Date()
    };
    
    this.downloads.set(key, newDownload);
    return newDownload;
  }

  async getVersions(): Promise<Version[]> {
    return Array.from(this.versions.values()).sort((a, b) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }

  async getLatestVersion(): Promise<Version | undefined> {
    return Array.from(this.versions.values()).find(v => v.isLatest);
  }

  async getScreenshots(category?: string, search?: string): Promise<Screenshot[]> {
    let allScreenshots = Array.from(this.screenshots.values());
    
    if (category) {
      allScreenshots = allScreenshots.filter(s => s.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      allScreenshots = allScreenshots.filter(s => 
        s.title.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort featured items first
    return allScreenshots.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
    });
  }

  async addScreenshot(screenshot: InsertScreenshot): Promise<Screenshot> {
    const newScreenshot: Screenshot = {
      id: this.currentScreenshotId++,
      ...screenshot,
      description: screenshot.description || null,
      uploadedAt: new Date(),
      featured: screenshot.featured ?? false,
      fileHash: screenshot.fileHash ?? null,
      fileName: screenshot.fileName ?? null,
      fileSize: screenshot.fileSize ?? null,
      mimeType: screenshot.mimeType ?? null
    };
    this.screenshots.set(newScreenshot.id, newScreenshot);
    return newScreenshot;
  }

  async updateScreenshot(id: number, updates: Partial<Screenshot>): Promise<Screenshot> {
    const existing = this.screenshots.get(id);
    if (!existing) throw new Error('Screenshot not found');
    
    const updated = { ...existing, ...updates };
    this.screenshots.set(id, updated);
    return updated;
  }

  async findDuplicateScreenshots(imageUrl?: string, fileHash?: string): Promise<Screenshot[]> {
    const allScreenshots = Array.from(this.screenshots.values());
    return allScreenshots.filter(s => 
      (imageUrl && s.imageUrl === imageUrl) ||
      (fileHash && s.fileHash === fileHash)
    );
  }

  async getScreenshotCategories(): Promise<string[]> {
    const allScreenshots = Array.from(this.screenshots.values());
    const categories = new Set(allScreenshots.map(s => s.category));
    return Array.from(categories).sort();
  }

  // Admin methods for versions
  async createVersion(versionData: Omit<Version, 'id'>): Promise<Version> {
    const newVersion: Version = {
      ...versionData,
      id: this.currentVersionId++
    };
    this.versions.set(newVersion.id, newVersion);
    return newVersion;
  }

  async updateVersion(id: number, versionData: Partial<Version>): Promise<Version> {
    const existingVersion = this.versions.get(id);
    if (!existingVersion) throw new Error('Version not found');
    
    const updatedVersion = { ...existingVersion, ...versionData };
    this.versions.set(id, updatedVersion);
    return updatedVersion;
  }

  async deleteVersion(id: number): Promise<void> {
    if (!this.versions.has(id)) throw new Error('Version not found');
    this.versions.delete(id);
  }

  async deleteScreenshot(id: number): Promise<void> {
    if (!this.screenshots.has(id)) throw new Error('Screenshot not found');
    this.screenshots.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUserByExternalId(userData: {
    externalId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }): Promise<User> {
    // First try to find existing user by external ID (stored in username field for now)
    const [existingUser] = await db.select().from(users).where(eq(users.username, userData.externalId));
    
    if (existingUser) {
      // Update existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          username: userData.externalId, // Store external ID in username for now
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          isAdmin: false,
          password: "", // Set empty password for OAuth users
        })
        .returning();
      return newUser;
    }
  }

  async getUserByExternalId(externalId: string): Promise<User | undefined> {
    console.log("Looking for user with external ID:", externalId);
    const [user] = await db.select().from(users).where(eq(users.username, externalId));
    console.log("Found user:", user);
    return user || undefined;
  }


  async getDownloadStats(): Promise<Download[]> {
    return await db.select().from(downloads);
  }

  async incrementDownload(resolution: string, platform: string): Promise<Download> {
    const [existing] = await db
      .select()
      .from(downloads)
      .where(and(eq(downloads.resolution, resolution), eq(downloads.platform, platform)));

    if (existing) {
      const [updated] = await db
        .update(downloads)
        .set({ 
          count: existing.count + 1,
          lastUpdated: new Date()
        })
        .where(eq(downloads.id, existing.id))
        .returning();
      return updated;
    }

    const [newDownload] = await db
      .insert(downloads)
      .values({
        resolution,
        platform,
        count: 1
      })
      .returning();
    return newDownload;
  }

  async getVersions(): Promise<Version[]> {
    return await db.select().from(versions).orderBy(desc(versions.releaseDate));
  }

  async getLatestVersion(): Promise<Version | undefined> {
    const [version] = await db.select().from(versions).where(eq(versions.isLatest, true));
    return version || undefined;
  }

  async getScreenshots(category?: string, search?: string): Promise<Screenshot[]> {
    let results: Screenshot[];
    
    if (category) {
      results = await db.select().from(screenshots)
        .where(eq(screenshots.category, category))
        .orderBy(desc(screenshots.featured), desc(screenshots.uploadedAt));
    } else {
      results = await db.select().from(screenshots)
        .orderBy(desc(screenshots.featured), desc(screenshots.uploadedAt));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      return results.filter(s => 
        s.title.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower))
      );
    }
    
    return results;
  }

  async addScreenshot(screenshot: InsertScreenshot): Promise<Screenshot> {
    const [newScreenshot] = await db
      .insert(screenshots)
      .values({
        ...screenshot,
        description: screenshot.description || null
      })
      .returning();
    return newScreenshot;
  }

  async updateScreenshot(id: number, updates: Partial<Screenshot>): Promise<Screenshot> {
    const [updated] = await db
      .update(screenshots)
      .set(updates)
      .where(eq(screenshots.id, id))
      .returning();
    
    if (!updated) throw new Error('Screenshot not found');
    return updated;
  }

  async findDuplicateScreenshots(imageUrl?: string, fileHash?: string): Promise<Screenshot[]> {
    if (imageUrl && fileHash) {
      return await db.select().from(screenshots).where(
        or(eq(screenshots.imageUrl, imageUrl), eq(screenshots.fileHash, fileHash))
      );
    } else if (imageUrl) {
      return await db.select().from(screenshots).where(eq(screenshots.imageUrl, imageUrl));
    } else if (fileHash) {
      return await db.select().from(screenshots).where(eq(screenshots.fileHash, fileHash));
    }
    
    return [];
  }

  async getScreenshotCategories(): Promise<string[]> {
    const results = await db.selectDistinct({ category: screenshots.category }).from(screenshots);
    return results.map(r => r.category).sort();
  }

  // Admin methods for versions
  async createVersion(versionData: Omit<Version, 'id'>): Promise<Version> {
    const [newVersion] = await db
      .insert(versions)
      .values(versionData)
      .returning();
    return newVersion;
  }

  async updateVersion(id: number, versionData: Partial<Version>): Promise<Version> {
    const [updatedVersion] = await db
      .update(versions)
      .set(versionData)
      .where(eq(versions.id, id))
      .returning();
    
    if (!updatedVersion) throw new Error('Version not found');
    return updatedVersion;
  }

  async deleteVersion(id: number): Promise<void> {
    const result = await db
      .delete(versions)
      .where(eq(versions.id, id));
    
    if (result.rowCount === 0) throw new Error('Version not found');
  }

  async deleteScreenshot(id: number): Promise<void> {
    const result = await db
      .delete(screenshots)
      .where(eq(screenshots.id, id));
    
    if (result.rowCount === 0) throw new Error('Screenshot not found');
  }
}

export const storage = new DatabaseStorage();
