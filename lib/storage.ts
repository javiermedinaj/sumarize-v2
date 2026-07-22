import { promises as fs, mkdirSync, accessSync, constants } from "node:fs";
import path from "node:path";

// Resolve a writable directory. Priority:
//   1. DATA_DIR env var (if set, use it directly — useful for Render Disks)
//   2. cwd/data (local dev — keeps files inside the repo)
//   3. /tmp/data (serverless / read-only filesystems like Render)
//
// We probe writability at module load and fall back gracefully.
function resolveDataDir(): string {
  if (process.env.DATA_DIR && process.env.DATA_DIR.trim().length > 0) {
    return process.env.DATA_DIR;
  }
  const local = path.join(process.cwd(), "data");
  try {
    mkdirSync(local, { recursive: true });
    accessSync(local, constants.W_OK);
    return local;
  } catch {
    return "/tmp/data";
  }
}

const DATA_DIR = resolveDataDir();

export type StoredAnalysis = {
  videoId: string;
  videoUrl: string;
  title: string;
  description?: string;
  thumbnail?: string;
  author?: string;
  lengthSeconds?: number;
  subtitles: string;
  summary: string;
  deepDivePrompts: { number: number; title: string; content: string }[];
  flashcards: { question: string; answer: string }[];
  createdAt: string;
};

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function fileFor(videoId: string) {
  return path.join(DATA_DIR, `${videoId}.json`);
}

export async function getStored(videoId: string): Promise<StoredAnalysis | null> {
  try {
    const raw = await fs.readFile(fileFor(videoId), "utf-8");
    return JSON.parse(raw) as StoredAnalysis;
  } catch {
    return null;
  }
}

export async function saveStored(data: StoredAnalysis): Promise<void> {
  await ensureDir();
  await fs.writeFile(fileFor(data.videoId), JSON.stringify(data, null, 2), "utf-8");
}

export async function listStored(): Promise<
  { videoId: string; title: string; createdAt: string }[]
> {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  const out: { videoId: string; title: string; createdAt: string }[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, f), "utf-8");
      const data = JSON.parse(raw) as StoredAnalysis;
      out.push({
        videoId: data.videoId,
        title: data.title,
        createdAt: data.createdAt,
      });
    } catch {
      // skip corrupted
    }
  }
  return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function isComplete(data: StoredAnalysis | null): Promise<boolean> {
  if (!data) return false;
  return Boolean(
    data.summary?.length > 0 &&
      data.deepDivePrompts?.length >= 5 &&
      data.flashcards?.length > 0,
  );
}
