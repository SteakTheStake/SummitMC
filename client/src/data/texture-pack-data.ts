export const texturePackData = {
  name: "Summit",
  tagline: "Minecraft At Its Peak",
  creator: "SteakTheStake",
  description: "Experience realistic textures that enhance your world without losing Minecraft's charm.",
  
  resolutions: [
    { name: "16x", label: "Standard", description: "Recommended for most users", popular: true },
    { name: "32x", label: "Enhanced", description: "Enhanced detail for better hardware" },
    { name: "64x", label: "HD", description: "High definition for powerful systems" },
    { name: "512x", label: "Ultra HD", description: "Ultra high-resolution with PBR/POM support", premium: true }
  ],
  
  features: [
    {
      icon: "eye",
      title: "Balanced Realism",
      description: "Enhanced textures that maintain Minecraft's iconic aesthetic while adding realistic details that feel natural and immersive."
    },
    {
      icon: "tachometer-alt",
      title: "Optimized Performance",
      description: "Lightweight design ensures smooth gameplay across different systems without compromising visual quality."
    },
    {
      icon: "leaf",
      title: "Natural Beauty",
      description: "Focus on making the world more vivid yet familiar, with enhanced terrain and environmental textures."
    },
    {
      icon: "puzzle-piece",
      title: "Mod Support",
      description: "Works seamlessly with Continuity mod for enhanced features and connects with custom entity models."
    },
    {
      icon: "sync-alt",
      title: "Regular Updates",
      description: "Constantly evolving with new textures, improvements, and support for the latest Minecraft versions."
    },
    {
      icon: "layer-group",
      title: "Multiple Resolutions",
      description: "Choose from 16x, 32x, 64x, or 512x resolutions to match your system's capabilities and preferences."
    }
  ],
  
  textureCategories: [
    {
      name: "Terrain",
      description: "Dirt, grass, stone, and all basic terrain blocks with enhanced detail",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Wood Types",
      description: "All wood planks, logs, and tree-related blocks with natural grain",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Ores & Minerals",
      description: "All ore blocks retextured with realistic mineral patterns",
      imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Nether Blocks",
      description: "Crimson/warped forests, soul fire, blackstone, and nether content",
      imageUrl: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    }
  ],
  
  compatibility: {
    minecraftVersions: "1.19.x - 1.21.4",
    mods: ["Continuity", "Optifine", "Fabric"],
    requirements: {
      "16x": "2GB+ RAM",
      "32x": "4GB+ RAM",
      "64x": "4GB+ RAM",
      "512x": "8GB+ RAM"
    }
  },
  
  downloadLinks: {
    modrinth: "https://modrinth.com/resourcepack/summit",
    planetminecraft: "https://www.planetminecraft.com/texture-pack/summit-6177524/"
  },
  
  recentUpdates: [
    {
      version: "v2.3",
      date: "February 2025",
      changes: [
        "Modified packed mud and mud brick",
        "Enhanced oak log tops",
        "Updated cherry leaves and pink petals",
        "New chest CEM models"
      ]
    }
  ]
};
