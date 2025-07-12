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
      imageUrl: "/attached_assets/2025-02-13_02.00.29_1752292199050.webp",
      title: "Medieval Tower",
      description: "Enhanced stone and wood textures bring medieval builds to life",
      category: "builds",
      resolution: "16x"
    },
    {
      imageUrl: "/attached_assets/2025-03-10_14.21.53_1752292199050.webp",
      title: "Mountain Village",
      description: "Realistic terrain textures create stunning mountain landscapes",
      category: "terrain",
      resolution: "32x"
    },
    {
      imageUrl: "/attached_assets/2025-03-20_17.23.13_1752292199050.webp",
      title: "Modern House",
      description: "Perfect textures for contemporary architectural styles",
      category: "builds",
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-03-20_17.26.53_1752292199050.webp",
      title: "Wooden Bridge",
      description: "Natural wood grain textures with realistic lighting",
      category: "nature",
      resolution: "16x"
    },
    {
      imageUrl: "/attached_assets/2025-03-20_21.04.00_1752292199050.webp",
      title: "Underground Cave",
      description: "Enhanced ore and mineral textures in cave systems",
      category: "terrain",
      resolution: "32x"
    },
    {
      imageUrl: "/attached_assets/2025-03-28_23.03.19_1752292199050.webp",
      title: "Nether Scene",
      description: "Crimson forests and nether blocks with enhanced detail",
      category: "nether",
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-03-28_23.15.23_1752292199051.webp",
      title: "Turtle Beach",
      description: "Enhanced water and sand textures for coastal builds",
      category: "nature",
      resolution: "16x"
    },
    {
      imageUrl: "/attached_assets/2025-05-02_23.46.20_1752292199051.webp",
      title: "Cherry Grove",
      description: "Beautiful cherry tree textures with realistic foliage",
      category: "nature",
      resolution: "32x"
    },
    {
      imageUrl: "/attached_assets/2025-06-11_17.26.29_1752292199051.webp",
      title: "Snowy Mountain",
      description: "Enhanced snow and ice textures in mountain biomes",
      category: "terrain",
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-06-11_17.26.55_1752292199051.webp",
      title: "Interior Design",
      description: "Detailed textures perfect for interior decoration",
      category: "builds",
      resolution: "16x"
    },
    {
      imageUrl: "/attached_assets/2025-06-11_17.27.26_1752292199051.webp",
      title: "Mountain Vista",
      description: "Breathtaking mountain views with enhanced terrain",
      category: "terrain",
      resolution: "32x"
    }
  ];

  for (const screenshotData of screenshotsData) {
    await db.insert(screenshots).values(screenshotData).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

seedDatabase().catch(console.error);