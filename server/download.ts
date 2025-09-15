import { NextResponse } from "next/server";

// Simple resolution matcher—adjust if your naming differs
const hasRes = (name: string, res: "32x" | "64x") =>
  new RegExp(`(^|[^0-9])(${res})([^0-9]|$)`, "i").test(name) ||
  /SummitMC[-_](32x|64x)/i.test(name);

type LinksResult = {
  modrinth: Record<"32x" | "64x", string | null>;
  curseforge: Record<"32x" | "64x", string | null>;
  updatedAt: string;
};

export async function GET() {
  try {
    const [modrinth, curseforge] = await Promise.all([
      getModrinthLatestByRes(),
      getCurseForgeLatestByRes(),
    ]);

    const body: LinksResult = {
      modrinth,
      curseforge,
      updatedAt: new Date().toISOString(),
    };

    // Cache for 10 minutes on the edge/CDN; allow stale-while-revalidate
    return new NextResponse(JSON.stringify(body), {
      headers: {
        "content-type": "application/json",
        "cache-control": "s-maxage=600, stale-while-revalidate=60",
      },
      status: 200,
    });
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ error: e?.message ?? "Failed to fetch links" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

async function getModrinthLatestByRes(): Promise<Record<"32x" | "64x", string | null>> {
  const projectId = process.env.MODRINTH_PROJECT_ID;
  if (!projectId) throw new Error("Missing MODRINTH_PROJECT_ID");

  // Modrinth: https://docs.modrinth.com/api-spec/
  // GET /v2/project/{id}/version returns newest first
  const res = await fetch(`https://api.modrinth.com/v2/project/${projectId}/version`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) throw new Error(`Modrinth API error: ${res.status}`);
  const versions: any[] = await res.json();

  const out: Record<"32x" | "64x", string | null> = { "32x": null, "64x": null };

  for (const v of versions) {
    const files: any[] = v.files ?? [];
    for (const f of files) {
      const name: string = f.filename ?? f.url ?? "";
      if (!out["64x"] && hasRes(name, "64x")) out["64x"] = f.url; // direct CDN
      if (!out["32x"] && hasRes(name, "32x")) out["32x"] = f.url;
      if (out["32x"] && out["64x"]) break;
    }
    if (out["32x"] && out["64x"]) break;
  }

  return out;
}

async function getCurseForgeLatestByRes(): Promise<Record<"32x" | "64x", string | null>> {
  const modId = process.env.CURSEFORGE_PROJECT_ID;
  const apiKey = process.env.CURSEFORGE_API_KEY;
  if (!modId) throw new Error("Missing CURSEFORGE_PROJECT_ID");
  if (!apiKey) throw new Error("Missing CURSEFORGE_API_KEY");

  // CurseForge Core API:
  // GET /v1/mods/{modId}/files?pageSize=50 (newest first is not guaranteed; we’ll sort)
  const res = await fetch(`https://api.curseforge.com/v1/mods/${modId}/files?pageSize=50`, {
    headers: { "x-api-key": apiKey },
    next: { revalidate: 600 },
  });

  if (!res.ok) throw new Error(`CurseForge API error: ${res.status}`);
  const data = await res.json();

  type CFFile = {
    id: number;
    fileName: string;
    fileDate: string;
    isAvailable: boolean;
    downloadUrl?: string | null; // sometimes present
  };

  const files: CFFile[] = (data?.data ?? []) as CFFile[];

  // Sort newest first by fileDate
  files.sort((a, b) => new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime());

  const pickLatest = (resLabel: "32x" | "64x") =>
    files.find((f) => f.isAvailable && hasRes(f.fileName, resLabel));

  const f64 = pickLatest("64x");
  const f32 = pickLatest("32x");

  // Prefer direct downloadUrl if present; otherwise use redirect endpoint
  const mkUrl = (f?: CFFile) =>
    f
      ? f.downloadUrl ??
        // Redirector works without API key for user clicking:
        // https://www.curseforge.com/minecraft/texture-packs/<slug>/download/<fileId>
        // If you prefer not to hardcode slug, use /v1/mods/{id} to fetch slug once and cache.
        `https://www.curseforge.com/minecraft/texture-packs/summitmcrp/download/${f.id}`
      : null;

  return { "64x": mkUrl(f64), "32x": mkUrl(f32) };
}
