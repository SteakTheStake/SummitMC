import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  resolution: text("resolution").notNull(),
  platform: text("platform").notNull(),
  count: integer("count").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const versions = pgTable("versions", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  resolution: text("resolution").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  changelog: text("changelog").notNull(),
  downloadUrl: text("download_url").notNull(),
  isLatest: boolean("is_latest").default(false),
});

export const screenshots = pgTable("screenshots", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  resolution: text("resolution").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Site content management table
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(), // e.g., 'hero', 'features', 'creator'
  content: text("content").notNull(), // JSON string containing the content
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Admin sessions table for simple password-based authentication
export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  lastUpdated: true,
});

export const insertVersionSchema = createInsertSchema(versions).omit({
  id: true,
});

export const insertScreenshotSchema = createInsertSchema(screenshots).omit({
  id: true,
  uploadedAt: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  lastUpdated: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Download = typeof downloads.$inferSelect;
export type Version = typeof versions.$inferSelect;
export type Screenshot = typeof screenshots.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type InsertVersion = z.infer<typeof insertVersionSchema>;
export type InsertScreenshot = z.infer<typeof insertScreenshotSchema>;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
