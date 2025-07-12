import { db } from "./db";
import { downloads, versions, screenshots } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed download statistics
  const downloadStats = [
    { resolution: "16x", platform: "modrinth", count: 8900 },
    { resolution: "16x", platform: "planetminecraft", count: 3200 },
    { resolution: "32x", platform: "modrinth", count: 1200 },
    { resolution: "64x", platform: "planetminecraft", count: 600 },
    { resolution: "512x", platform: "planetminecraft", count: 300 }
  ];

  for (const stat of downloadStats) {
    await db.insert(downloads).values(stat).onConflictDoNothing();
  }

  // Seed versions
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

  for (const versionData of versionsData) {
    await db.insert(versions).values(versionData).onConflictDoNothing();
  }

  // Seed screenshots
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

  for (const screenshotData of screenshotsData) {
    await db.insert(screenshots).values(screenshotData).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

seedDatabase().catch(console.error);