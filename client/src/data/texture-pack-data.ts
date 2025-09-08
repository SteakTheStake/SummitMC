export const texturePackData = {
  name: "Summit",
  tagline: "Minecraft At Its Peak",
  creator: "SteakTheStake",
  description: "Experience realistic textures that enhance your world without losing Minecraft's charm.",
  
  resolutions: [
    { name: "64x", label: "Standard", description: "Recommended for most users", popular: true }
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
    minecraftVersions: "1.13.x - 1.21.x",
    mods: ["Continuity", "Optifine", "Fabric"],
    requirements: {
      "32x": "8GB+ RAM" + " 2GB+ VRAM",
      "64x": "8GB+ RAM" + " 2GB+ VRAM"
    }
  },
  
  downloadLinks: {
    modrinth: "https://modrinth.com/resourcepack/summit",
    curseforge: "https://www.curseforge.com/minecraft/texture-packs/summitmcrp"
  },
  
  recentUpdates: [
    {
      version: "v2.6",
      date: "August 2025",
      changes: [
        "Added pistons and sticky pistons",
        "Added sweet berry bush textures",
        "Added sugar cane textures",
        "Added flower pot textures",
        "Added totem of undying",
        "Added clay ball",
        "Added cake item",
        "Added nitwit villager",
        "Added shepherd villager",
        "Added campfire and soul campfire",
        "Added acacia, oak, and iron trapdoors",
        "Added dry grass and tall dry grass",
        "Added all boats",
        "Added poisonous potato",
        "Added repeater",
        "Added minecart",
        "Added xp orb",
        "Added pottery sherds and decorated pots",
        "Added custom font",
        "Added almost all UI textures (~541)",
        "Modified cobblestone to look more cake-like",
        "Modified raw chicken to be thinner",
        "Modified blaze rod and breeze rod to be thinner",
        "Fixed bamboo door normal map issue",
        "Modified coal to a bigger size",
        "Adjusted librarian villager glasses opacity",
        "New textures for stripped logs, oak log, birch log, and acacia log",
        "Manual touchups for grass",
        "Updated raw iron, raw gold, and raw copper with new _s + _n maps",
        "Improved lapis colors",
        "Reduced noise in knowledge book",
        "Made cake item more visible",
        "Fixed bug with redstone torch",
        "New texture for bamboo block + stripped",
        "Reduced intensity of player head eyes",
        "Added 3 json files",
        "Added 2 animated textures"
      ]
    }
  ]
};
