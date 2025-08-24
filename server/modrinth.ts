interface ModrinthProject {
  id: string;
  slug: string;
  project_type: string;
  team: string;
  title: string;
  description: string;
  body: string;
  published: string;
  updated: string;
  approved: string;
  queued: string;
  status: string;
  requested_status: string;
  moderator_message: string;
  license: {
    id: string;
    name: string;
    url: string;
  };
  client_side: string;
  server_side: string;
  downloads: number;
  followers: number;
  categories: string[];
  additional_categories: string[];
  game_versions: string[];
  loaders: string[];
  versions: string[];
  icon_url: string;
  issues_url: string;
  source_url: string;
  wiki_url: string;
  discord_url: string;
  donation_urls: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  gallery: Array<{
    url: string;
    featured: boolean;
    title: string;
    description: string;
    created: string;
    ordering: number;
  }>;
  color: number;
  thread_id: string;
  monetization_status: string;
}

interface ModrinthVersion {
  name: string;
  version_number: string;
  changelog: string;
  dependencies: Array<{
    version_id: string;
    project_id: string;
    file_name: string;
    dependency_type: string;
  }>;
  game_versions: string[];
  version_type: string;
  loaders: string[];
  featured: boolean;
  status: string;
  requested_status: string;
  id: string;
  project_id: string;
  author_id: string;
  date_published: string;
  downloads: number;
  changelog_url: string;
  files: Array<{
    hashes: {
      sha512: string;
      sha1: string;
    };
    url: string;
    filename: string;
    primary: boolean;
    size: number;
    file_type: string;
  }>;
}

export class ModrinthService {
  private readonly baseUrl = 'https://api.modrinth.com/v2';
  private readonly projectSlug = 'faithful'; // Using Faithful as example - replace with actual Summit project slug when available
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getProjectStats(): Promise<{ downloads: number; followers: number; versions: number } | null> {
    try {
      const cacheKey = 'project-stats';
      const cachedData = this.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}`);
      
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const project: ModrinthProject = await response.json();
      
      const result = {
        downloads: project.downloads,
        followers: project.followers,
        versions: project.versions.length
      };
      
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching Modrinth project stats:', error);
      return null;
    }
  }
  
  async getVersionStats(): Promise<Array<{ version: string; downloads: number; date: string }> | null> {
    try {
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}/version`);
      
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const versions: ModrinthVersion[] = await response.json();
      
      return versions.map(version => ({
        version: version.version_number,
        downloads: version.downloads,
        date: version.date_published
      }));
    } catch (error) {
      console.error('Error fetching Modrinth version stats:', error);
      return null;
    }
  }
  
  async getLatestVersion(): Promise<{ version: string; downloads: number; changelog: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/project/${this.projectSlug}/version`);
      
      if (!response.ok) {
        console.error(`Modrinth API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const versions: ModrinthVersion[] = await response.json();
      
      if (versions.length === 0) {
        return null;
      }
      
      // Sort by date published to get the latest
      const latestVersion = versions.sort((a, b) => 
        new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
      )[0];
      
      return {
        version: latestVersion.version_number,
        downloads: latestVersion.downloads,
        changelog: latestVersion.changelog
      };
    } catch (error) {
      console.error('Error fetching latest Modrinth version:', error);
      return null;
    }
  }
}

export const modrinthService = new ModrinthService();