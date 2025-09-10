import { db } from "./db";
import { downloads, versions, screenshots } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed download statistics
  const downloadStats = [
    { resolution: "64x", platform: "curseforge", count: 600 },
    { resolution: "64x", platform: "modrinth", count: 600 }
  ];

  for (const stat of downloadStats) {
    await db.insert(downloads).values(stat).onConflictDoNothing();
  }

  // Seed versions
  const versionsData = [
    {
      version: "2.6",
      resolution: "64x",
      releaseDate: new Date("2025-02-01"),
      changelog: "The 2.6 update includes 25 new features with 640 added textures, most notably almost all UI textures (~541), plus new textures for pistons, sticky pistons, sweet berry bush, sugar cane, flower pot, totem of undying, clay ball, cake item, nitwit and shepherd villagers, campfire, acacia and oak trapdoors, iron trapdoor, soul campfire, dry grass, tall dry grass, boats, poisonous potato, repeater, minecart, xp orb, pottery sherds (decorated), and a custom font. In total 3 json files and 2 animated textures were added. 23 existing textures were modified including cobblestone (more cake-like), raw chicken, blaze rod, and breeze rod (thinner), bamboo door (normal map fix), coal (bigger size), librarian villager (glasses opacity), all stripped logs, oak, birch, and acacia logs (new textures), grass (manual touchups), raw iron, raw gold, and raw copper (new _s + _n maps), lapis (overall better colors), knowledge book (less noise), cake item (more visible), redstone torch (bug fix), bamboo block + stripped (new texture), and player head (less intense eyes). Overall this update focused on major UI expansion, new block/item textures, and visual improvements to existing assets.",
      downloadUrl: "https://modrinth.com/resourcepack/summit/version/2.6",
      isLatest: true
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
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-03-10_14.21.53_1752292199050.webp",
      title: "Mountain Village",
      description: "Realistic terrain textures create stunning mountain landscapes",
      category: "terrain",
      resolution: "64x"
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
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-03-20_21.04.00_1752292199050.webp",
      title: "Underground Cave",
      description: "Enhanced ore and mineral textures in cave systems",
      category: "terrain",
      resolution: "64x"
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
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-05-02_23.46.20_1752292199051.webp",
      title: "Cherry Grove",
      description: "Beautiful cherry tree textures with realistic foliage",
      category: "nature",
      resolution: "64x"
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
      resolution: "64x"
    },
    {
      imageUrl: "/attached_assets/2025-06-11_17.27.26_1752292199051.webp",
      title: "Mountain Vista",
      description: "Breathtaking mountain views with enhanced terrain",
      category: "terrain",
      resolution: "64x"
    }
  ];

  for (const screenshotData of screenshotsData) {
    await db.insert(screenshots).values(screenshotData).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

seedDatabase().catch(console.error);