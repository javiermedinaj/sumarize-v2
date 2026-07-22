import { YoutubeTranscript } from "youtube-transcript";
import { extractVideoId } from "./video-id";

export type VideoMeta = {
  videoId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  author?: string;
  lengthSeconds?: number;
  viewCount?: number;
};

const DEFAULT_INSTANCES = [
  "https://yewtu.be",
  "https://invidious.fdn.fr",
  "https://invidious.protokolla.fi",
  "https://invidious.lunivers.trade",
  "https://invidious.privacyredirect.com",
];

function getInstances(): string[] {
  const env = process.env.INVIDIOUS_INSTANCES;
  if (env && env.trim().length > 0) {
    return env
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return DEFAULT_INSTANCES;
}

type YtAiSubtitle = {
  langCode?: string;
  langName?: string;
  isAsr?: boolean;
  vttUrl?: string;
};

type YtAiResponse = {
  videoTitle?: string;
  subtitles?: YtAiSubtitle[];
  author?: string;
  viewCount?: string;
  description?: string;
};

// youtube-transcript.ai: gives us metadata + direct VTT URLs without auth.
// The VTT URLs point to YouTube's public timedtext endpoint (no bot check).
async function fetchFromYtAi(videoId: string): Promise<{
  meta: VideoMeta | null;
  vttUrl: string | null;
}> {
  try {
    const res = await fetch(
      `https://youtube-transcript.ai/api/subtitles?v=${videoId}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" },
    );
    if (!res.ok) return { meta: null, vttUrl: null };
    const data = (await res.json()) as YtAiResponse;
    if (!data?.videoTitle) return { meta: null, vttUrl: null };

    const meta: VideoMeta = {
      videoId,
      title: data.videoTitle,
      description: data.description,
      author: data.author,
      viewCount: data.viewCount ? Number(data.viewCount) : undefined,
    };
    // Prefer non-ASR (manual) subs; fall back to auto-generated.
    const subs = data.subtitles ?? [];
    const manual = subs.find((s) => !s.isAsr && s.vttUrl);
    const auto = subs.find((s) => s.isAsr && s.vttUrl);
    const vttUrl = manual?.vttUrl ?? auto?.vttUrl ?? null;

    return { meta, vttUrl };
  } catch {
    return { meta: null, vttUrl: null };
  }
}

async function fetchFromInstance(
  base: string,
  videoId: string,
): Promise<VideoMeta | null> {
  const url = `${base.replace(/\/$/, "")}/api/v1/videos/${videoId}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data?.title) return null;
    return {
      videoId,
      title: data.title as string,
      description: (data.description as string | undefined) ?? undefined,
      thumbnail:
        (data.videoThumbnails as any[] | undefined)?.find(
          (t: any) => t.quality === "high" || t.quality === "medium",
        )?.url ?? undefined,
      author: (data.author as string | undefined) ?? undefined,
      lengthSeconds:
        typeof data.lengthSeconds === "number" ? data.lengthSeconds : undefined,
    };
  } catch {
    return null;
  }
}

export async function getVideoMeta(videoId: string): Promise<VideoMeta> {
  // 1) youtube-transcript.ai (fast, stable, includes viewCount)
  const { meta } = await fetchFromYtAi(videoId);
  if (meta) return meta;

  // 2) Invidious fallback
  for (const base of getInstances()) {
    const m = await fetchFromInstance(base, videoId);
    if (m) return m;
  }

  // 3) Last resort
  return { videoId, title: `Video ${videoId}` };
}

export async function getTranscript(videoUrl: string): Promise<string> {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error("Invalid YouTube URL");

  // 1) youtube-transcript (handles the innerTube path)
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    if (items && items.length > 0) {
      return items.map((i: { text: string }) => i.text).join(" ");
    }
  } catch {
    // fall through
  }

  // 2) youtube-transcript.ai: get a direct VTT URL from YouTube
  const { vttUrl } = await fetchFromYtAi(videoId);
  if (vttUrl) {
    try {
      const r = await fetch(vttUrl, { cache: "no-store" });
      if (r.ok) {
        const vtt = await r.text();
        const plain = vttToPlainText(vtt);
        if (plain) return plain;
      }
    } catch {
      // fall through
    }
  }

  // 3) Invidious captions list (last resort, often blocked)
  for (const base of getInstances()) {
    try {
      const res = await fetch(
        `${base.replace(/\/$/, "")}/api/v1/captions/${videoId}`,
        { cache: "no-store" },
      );
      if (!res.ok) continue;
      const caps: any[] = await res.json();
      const manual = caps.find((c) => c.label?.startsWith("English")) ?? caps[0];
      if (!manual) continue;
      const captionRes = await fetch(manual.url, { cache: "no-store" });
      if (!captionRes.ok) continue;
      const vtt = await captionRes.text();
      const plain = vttToPlainText(vtt);
      if (plain) return plain;
    } catch {
      continue;
    }
  }

  throw new Error("No transcript available for this video");
}

function vttToPlainText(vtt: string): string {
  return vtt
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (trimmed === "WEBVTT") return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (trimmed.includes("-->")) return false;
      if (trimmed.startsWith("NOTE")) return false;
      if (trimmed.startsWith("STYLE")) return false;
      return true;
    })
    .map((line) =>
      line
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"'),
    )
    .join(" ");
}
