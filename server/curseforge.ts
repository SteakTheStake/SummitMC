export class CurseForgeService {
  private readonly baseUrl = "https://api.curseforge.com/v1";
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000;

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Always return a single latest download URL without using the CurseForge API.
  // Configure via CURSEFORGE_LATEST_URL; otherwise fall back to a safe default.
  async getResolutionDownloadLinks(): Promise<{
    curseforge: Record<"32x" | "64x", string | null>;
    updatedAt: string;
  } | null> {
    const latest32Url = process.env.CURSEFORGE_LATEST_32_URL ??
      "https://mediafilez.forgecdn.net/files/7000/971/SummitMC-32x.zip";
    const latest64Url = process.env.CURSEFORGE_LATEST_64_URL ??
      "https://mediafilez.forgecdn.net/files/6982/574/SummitMC-64x.zip";

    const result = {
      curseforge: { "32x": latest32Url, "64x": latest64Url },
      updatedAt: new Date().toISOString(),
    } as const;

    return result;
  }
}

export const curseforgeService = new CurseForgeService();
