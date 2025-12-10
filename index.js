var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSessions: () => adminSessions,
  downloads: () => downloads,
  insertAdminSessionSchema: () => insertAdminSessionSchema,
  insertDownloadSchema: () => insertDownloadSchema,
  insertScreenshotSchema: () => insertScreenshotSchema,
  insertSiteContentSchema: () => insertSiteContentSchema,
  insertUserSchema: () => insertUserSchema,
  insertVersionSchema: () => insertVersionSchema,
  screenshots: () => screenshots,
  sessions: () => sessions,
  siteContent: () => siteContent,
  users: () => users,
  versions: () => versions
});
import { pgTable, text, serial, integer, boolean, timestamp, varchar, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("firstname"),
  lastName: varchar("lastname"),
  profileImageUrl: varchar("profileimageurl"),
  isAdmin: boolean("isadmin").default(false),
  username: text("username").unique(),
  password: text("password").default(""),
  createdAt: timestamp("createdat").defaultNow(),
  updatedAt: timestamp("updatedat").defaultNow()
});
var downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  resolution: text("resolution").notNull(),
  platform: text("platform").notNull(),
  count: integer("count").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow()
});
var versions = pgTable("versions", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  resolution: text("resolution").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  changelog: text("changelog").notNull(),
  downloadUrl: text("download_url").notNull(),
  isLatest: boolean("is_latest").default(false)
});
var screenshots = pgTable("screenshots", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  resolution: text("resolution").notNull(),
  featured: boolean("featured").default(false),
  fileHash: text("file_hash"),
  // For duplicate detection
  fileName: text("file_name"),
  // Original filename
  fileSize: integer("file_size"),
  // File size in bytes
  mimeType: text("mime_type"),
  // File MIME type
  uploadedAt: timestamp("uploaded_at").defaultNow()
});
var siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(),
  // e.g., 'hero', 'features', 'creator'
  content: text("content").notNull(),
  // JSON string containing the content
  lastUpdated: timestamp("last_updated").defaultNow()
});
var adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users);
var insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  lastUpdated: true
});
var insertVersionSchema = createInsertSchema(versions).omit({
  id: true
});
var insertScreenshotSchema = createInsertSchema(screenshots).omit({
  id: true,
  uploadedAt: true
});
var insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  lastUpdated: true
});
var insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PgPool } from "pg";
var url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
var isNeon = process.env.DB_PROVIDER === "neon" || /neon\.tech|neondb\.net/.test(url);
var db;
if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  const client = neon(url);
  db = drizzleNeon({ client, schema: schema_exports });
} else {
  const pool = new PgPool({ connectionString: url });
  db = drizzlePg(pool, { schema: schema_exports });
}

// server/storage.ts
import { eq, and, desc, or } from "drizzle-orm";
var DatabaseStorage = class {
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async upsertUserByExternalId(userData) {
    const [existingUser] = await db.select().from(users).where(eq(users.username, userData.externalId));
    if (existingUser) {
      const [updatedUser] = await db.update(users).set({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, existingUser.id)).returning();
      return updatedUser;
    } else {
      const [newUser] = await db.insert(users).values({
        username: userData.externalId,
        // Store external ID in username for now
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        isAdmin: false,
        password: ""
        // Set empty password for OAuth users
      }).returning();
      return newUser;
    }
  }
  async getUserByExternalId(externalId) {
    console.log("Looking for user with external ID:", externalId);
    const [user] = await db.select().from(users).where(eq(users.username, externalId));
    console.log("Found user:", user);
    return user || void 0;
  }
  async getDownloadStats() {
    return await db.select().from(downloads);
  }
  async incrementDownload(resolution, platform) {
    const [existing] = await db.select().from(downloads).where(and(eq(downloads.resolution, resolution), eq(downloads.platform, platform)));
    if (existing) {
      const [updated] = await db.update(downloads).set({
        count: existing.count + 1,
        lastUpdated: /* @__PURE__ */ new Date()
      }).where(eq(downloads.id, existing.id)).returning();
      return updated;
    }
    const [newDownload] = await db.insert(downloads).values({
      resolution,
      platform,
      count: 1
    }).returning();
    return newDownload;
  }
  async getVersions() {
    return await db.select().from(versions).orderBy(desc(versions.releaseDate));
  }
  async getLatestVersion() {
    const [version] = await db.select().from(versions).where(eq(versions.isLatest, true));
    return version || void 0;
  }
  async getScreenshots(category, search) {
    let results;
    if (category) {
      results = await db.select().from(screenshots).where(eq(screenshots.category, category)).orderBy(desc(screenshots.featured), desc(screenshots.uploadedAt));
    } else {
      results = await db.select().from(screenshots).orderBy(desc(screenshots.featured), desc(screenshots.uploadedAt));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      return results.filter(
        (s) => s.title.toLowerCase().includes(searchLower) || s.description && s.description.toLowerCase().includes(searchLower)
      );
    }
    return results;
  }
  async addScreenshot(screenshot) {
    const [newScreenshot] = await db.insert(screenshots).values({
      ...screenshot,
      description: screenshot.description || null
    }).returning();
    return newScreenshot;
  }
  async updateScreenshot(id, updates) {
    const [updated] = await db.update(screenshots).set(updates).where(eq(screenshots.id, id)).returning();
    if (!updated) throw new Error("Screenshot not found");
    return updated;
  }
  async findDuplicateScreenshots(imageUrl, fileHash) {
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
  async getScreenshotCategories() {
    const results = await db.selectDistinct({ category: screenshots.category }).from(screenshots);
    return results.map((r) => r.category).sort();
  }
  // Admin methods for versions
  async createVersion(versionData) {
    const [newVersion] = await db.insert(versions).values(versionData).returning();
    return newVersion;
  }
  async updateVersion(id, versionData) {
    const [updatedVersion] = await db.update(versions).set(versionData).where(eq(versions.id, id)).returning();
    if (!updatedVersion) throw new Error("Version not found");
    return updatedVersion;
  }
  async deleteVersion(id) {
    const result = await db.delete(versions).where(eq(versions.id, id));
    if (result.rowCount === 0) throw new Error("Version not found");
  }
  async deleteScreenshot(id) {
    const result = await db.delete(screenshots).where(eq(screenshots.id, id));
    if (result.rowCount === 0) throw new Error("Screenshot not found");
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/modrinth.ts
var ModrinthService = class {
  baseUrl = "https://api.modrinth.com/v2";
  projectSlug = "summit";
  cache = /* @__PURE__ */ new Map();
  cacheTimeout = 5 * 60 * 1e3;
  // 5 minutes cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }
  setCachedData(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  async getProjectStats() {
    try {
      const cacheKey = "project-stats";
      const cachedData = this.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}`);
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      const project = await response.json();
      const result = {
        downloads: project.downloads,
        followers: project.followers,
        versions: project.versions.length
      };
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error fetching Modrinth project stats:", error);
      return null;
    }
  }
  async getVersionStats() {
    try {
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}/version`);
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      const versions2 = await response.json();
      return versions2.map((version) => ({
        version: version.version_number,
        downloads: version.downloads,
        date: version.date_published
      }));
    } catch (error) {
      console.error("Error fetching Modrinth version stats:", error);
      return null;
    }
  }
  async getLatestVersion() {
    try {
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}/version`);
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      const versions2 = await response.json();
      if (versions2.length === 0) {
        return null;
      }
      const latestVersion = versions2.sort(
        (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
      )[0];
      return {
        version: latestVersion.version_number,
        downloads: latestVersion.downloads,
        changelog: latestVersion.changelog
      };
    } catch (error) {
      console.error("Error fetching latest Modrinth version:", error);
      return null;
    }
  }
  /**
   * Build direct download links for each resolution by inspecting recent versions and their files.
   * We heuristically match files whose filename includes "64x" or "32x".
   * Falls back to primary files if an exact match is not found.
   */
  async getResolutionDownloadLinks() {
    try {
      const cacheKey = "resolution-download-links";
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}/version`);
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      const versions2 = await response.json();
      const latestFirst = versions2.sort(
        (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
      );
      let url64 = null;
      let url32 = null;
      for (const v of latestFirst) {
        for (const f of v.files) {
          const filename = f.filename.toLowerCase();
          if (!url64 && (filename.includes("64x") || filename.includes("x64"))) {
            url64 = f.url;
          }
          if (!url32 && (filename.includes("32x") || filename.includes("x32"))) {
            url32 = f.url;
          }
        }
        if (!url64) {
          const primary = v.files.find((f) => f.primary);
          if (primary && primary.url && (v.name.includes("64x") || v.version_number.includes("64"))) {
            url64 = primary.url;
          }
        }
        if (!url32) {
          const primary = v.files.find((f) => f.primary);
          if (primary && primary.url && (v.name.includes("32x") || v.version_number.includes("32"))) {
            url32 = primary.url;
          }
        }
        if (url64 && url32) break;
      }
      const result = {
        modrinth: { "32x": url32 ?? null, "64x": url64 ?? null },
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error building resolution download links from Modrinth:", error);
      return null;
    }
  }
};
var modrinthService = new ModrinthService();

// server/curseforge.ts
var CurseForgeService = class {
  baseUrl = "https://api.curseforge.com/v1";
  cache = /* @__PURE__ */ new Map();
  cacheTimeout = 5 * 60 * 1e3;
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }
  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  // Always return a single latest download URL without using the CurseForge API.
  // Configure via CURSEFORGE_LATEST_URL; otherwise fall back to a safe default.
  async getResolutionDownloadLinks() {
    const latest32Url = process.env.CURSEFORGE_LATEST_32_URL ?? "https://mediafilez.forgecdn.net/files/7000/971/SummitMC-32x.zip";
    const latest64Url = process.env.CURSEFORGE_LATEST_64_URL ?? "https://mediafilez.forgecdn.net/files/6982/574/SummitMC-64x.zip";
    const result = {
      curseforge: { "32x": latest32Url, "64x": latest64Url },
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return result;
  }
};
var curseforgeService = new CurseForgeService();

// server/localAuth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";
import connectPg from "connect-pg-simple";
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-key-change-in-production";
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app2) {
  try {
    app2.set("trust proxy", 1);
    app2.use(getSession());
    app2.use(passport.initialize());
    app2.use(passport.session());
    passport.use(new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        if (!user.isAdmin) {
          return done(null, false, { message: "Admin access required" });
        }
        if (user.password && user.password !== "") {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid username or password" });
          }
        } else {
          console.log("User has no password set, allowing access");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));
    passport.serializeUser((user, cb) => cb(null, user.id));
    passport.deserializeUser(async (id, cb) => {
      try {
        const user = await storage.getUser(id);
        cb(null, user);
      } catch (error) {
        cb(error);
      }
    });
    app2.post("/api/login", (req, res, next) => {
      passport.authenticate("local", (error, user, info) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({
            message: info?.message || "Invalid username or password"
          });
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: "Login failed" });
          }
          return res.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin
            }
          });
        });
      })(req, res, next);
    });
    app2.post("/api/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true });
      });
    });
    console.log("Local authentication setup complete");
  } catch (error) {
    console.error("Error setting up auth:", error);
    throw error;
  }
}
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
var isAdmin = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = req.user;
  if (!user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// server/objectStorage.ts
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
});
var ObjectStorageService = class {
  constructor() {
  }
  // Gets the public object search paths.
  getPublicObjectSearchPaths() {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr.split(",").map((path4) => path4.trim()).filter((path4) => path4.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }
  // Gets the private object directory.
  getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }
  // Search for a public object from the search paths.
  async searchPublicObject(filePath) {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }
  // Downloads an object to the response.
  async downloadObject(file, res, cacheTtlSec = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `public, max-age=${cacheTtlSec}`
      });
      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL() {
    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900
    });
  }
  normalizeObjectEntityPath(rawPath) {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url2 = new URL(rawPath);
    const rawObjectPath = url2.pathname;
    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }
    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }
};
function parseObjectPath(path4) {
  if (!path4.startsWith("/")) {
    path4 = `/${path4}`;
  }
  const pathParts = path4.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
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
  app2.get("/api/downloads/stats", async (req, res) => {
    try {
      const localStats = await storage.getDownloadStats();
      const localTotalDownloads = localStats.reduce((sum, stat) => sum + stat.count, 0);
      const modrinthStats = await modrinthService.getProjectStats();
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
      console.error("Error fetching download statistics:", error);
      res.status(500).json({ message: "Failed to fetch download statistics" });
    }
  });
  app2.get("/api/downloads/links", async (req, res) => {
    try {
      const [modrinthLinks, curseforgeLinks] = await Promise.all([
        modrinthService.getResolutionDownloadLinks(),
        curseforgeService.getResolutionDownloadLinks()
      ]);
      const modrinth = modrinthLinks?.modrinth ?? { "32x": null, "64x": null };
      const curseforge = curseforgeLinks?.curseforge ?? { "32x": null, "64x": null };
      const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      res.json({ modrinth, curseforge, updatedAt });
    } catch (error) {
      console.error("Error fetching download links:", error);
      res.status(500).json({ message: "Failed to fetch download links" });
    }
  });
  app2.post("/api/downloads/increment", async (req, res) => {
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
  app2.get("/api/versions", async (req, res) => {
    try {
      const versions2 = await storage.getVersions();
      res.json(versions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });
  app2.post("/api/versions", isAdmin, async (req, res) => {
    try {
      const version = await storage.createVersion(req.body);
      res.json(version);
    } catch (error) {
      console.error("Error creating version:", error);
      res.status(500).json({ error: "Failed to create version" });
    }
  });
  app2.put("/api/versions/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const version = await storage.updateVersion(id, req.body);
      res.json(version);
    } catch (error) {
      console.error("Error updating version:", error);
      res.status(500).json({ error: "Failed to update version" });
    }
  });
  app2.delete("/api/versions/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVersion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting version:", error);
      res.status(500).json({ error: "Failed to delete version" });
    }
  });
  app2.delete("/api/screenshots/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteScreenshot(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting screenshot:", error);
      res.status(500).json({ error: "Failed to delete screenshot" });
    }
  });
  app2.get("/api/versions/latest", async (req, res) => {
    try {
      const localLatestVersion = await storage.getLatestVersion();
      const modrinthLatestVersion = await modrinthService.getLatestVersion();
      if (modrinthLatestVersion) {
        res.json({
          ...localLatestVersion,
          version: modrinthLatestVersion.version,
          downloads: modrinthLatestVersion.downloads,
          changelog: modrinthLatestVersion.changelog || localLatestVersion?.changelog,
          source: "modrinth"
        });
      } else if (localLatestVersion) {
        res.json({
          ...localLatestVersion,
          source: "local"
        });
      } else {
        return res.status(404).json({ message: "No latest version found" });
      }
    } catch (error) {
      console.error("Error fetching latest version:", error);
      res.status(500).json({ message: "Failed to fetch latest version" });
    }
  });
  app2.get("/api/screenshots", async (req, res) => {
    try {
      const category = req.query.category;
      const search = req.query.search;
      const screenshots2 = await storage.getScreenshots(category, search);
      res.json(screenshots2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch screenshots" });
    }
  });
  app2.get("/api/modrinth/stats", async (req, res) => {
    try {
      const projectStats = await modrinthService.getProjectStats();
      const versionStats = await modrinthService.getVersionStats();
      const latestVersion = await modrinthService.getLatestVersion();
      res.json({
        project: projectStats,
        versions: versionStats,
        latest: latestVersion,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error fetching Modrinth stats:", error);
      res.status(500).json({ message: "Failed to fetch Modrinth statistics" });
    }
  });
  app2.post("/api/screenshots", isAdmin, async (req, res) => {
    try {
      const validatedData = insertScreenshotSchema.parse(req.body);
      const duplicates = await storage.findDuplicateScreenshots(
        validatedData.imageUrl ?? void 0,
        validatedData.fileHash ?? void 0
      );
      if (duplicates.length > 0) {
        return res.status(409).json({
          message: "Duplicate image found",
          duplicates
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
  app2.put("/api/screenshots/:id", isAdmin, async (req, res) => {
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
  app2.post("/api/screenshots/upload", isAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });
  app2.post("/api/screenshots/check-duplicates", isAdmin, async (req, res) => {
    try {
      const { imageUrl, fileHash } = req.body;
      const duplicates = await storage.findDuplicateScreenshots(imageUrl, fileHash);
      res.json({ duplicates });
    } catch (error) {
      console.error("Error checking duplicates:", error);
      res.status(500).json({ error: "Failed to check for duplicates" });
    }
  });
  app2.get("/api/screenshots/categories", async (req, res) => {
    try {
      const categories = await storage.getScreenshotCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  });
  app2.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectPath = req.params.objectPath;
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function resolvePath(p) {
  return path.resolve(__dirname, p).replace(/\\/g, "/");
}
var vite_config_default = defineConfig(async () => {
  const cartographerPlugin = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? (await import("@replit/vite-plugin-cartographer")).cartographer() : null;
  return {
    root: resolvePath("client"),
    // 👈 set frontend root to client/
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...cartographerPlugin ? [cartographerPlugin] : []
    ],
    resolve: {
      alias: {
        "@": resolvePath("client/src"),
        "@shared": resolvePath("shared"),
        "@assets": resolvePath("attached_assets")
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
    },
    build: {
      outDir: resolvePath("dist/public"),
      // 👈 frontend assets go here
      emptyOutDir: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "UNRESOLVED_IMPORT" && warning.source?.startsWith("@/")) {
            throw new Error(`Unresolved alias: ${warning.source}`);
          }
          warn(warning);
        }
      }
    },
    server: {
      host: "0.0.0.0",
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url2 = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url2, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const pathName = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathName.startsWith("/api")) {
      let logLine = `${req.method} ${pathName} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const staticPath = path3.resolve(__dirname2, "public");
    app.use(express2.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path3.join(staticPath, "index.html"));
    });
  }
  const port = Number(process.env.PORT ?? 5e3);
  const host = process.env.HOST ?? "0.0.0.0";
  server.listen(port, host, () => {
    log(`\u{1F680} serving on http://${host}:${port}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
    } else if (err.code === "EACCES") {
      console.error(`No permission to bind ${host}:${port}.`);
    } else {
      console.error(err);
    }
  });
})();
