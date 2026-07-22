import { NextRequest, NextResponse } from "next/server";
import { extractVideoId } from "@/lib/video-id";
import { getTranscript, getVideoMeta } from "@/lib/youtube";
import {
  summarizeText,
  generateFlashcards,
  generateDeepDivePrompts,
} from "@/lib/groq";
import { getStored, isComplete, saveStored, type StoredAnalysis } from "@/lib/storage";
import { getClientIp, limitProcessRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > 10_000) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }

    const rateLimit = await limitProcessRequest(getClientIp(req.headers));
    if (!rateLimit.configured) {
      return NextResponse.json(
        { error: "Rate limiting is not configured" },
        { status: 503 },
      );
    }
    if (!rateLimit.success) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Límite de análisis alcanzado. Probá nuevamente más tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    const body = await req.json();
    const videoUrl: string = body?.videoUrl;
    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // 1) Cache hit
    const existing = await getStored(videoId);
    if (await isComplete(existing)) {
      return NextResponse.json({
        success: true,
        fromCache: true,
        videoId,
        videoUrl,
        title: existing!.title,
        description: existing!.description,
        thumbnail: existing!.thumbnail,
        author: existing!.author,
        lengthSeconds: existing!.lengthSeconds,

        summary: existing!.summary,
        deepDivePrompts: existing!.deepDivePrompts,
        flashcards: existing!.flashcards,
      });
    }

    // 2) Metadata via Invidious (with fallback)
    const meta = await getVideoMeta(videoId);

    // 3) Transcript (free, no Google API)
    const subtitles = await getTranscript(videoUrl);
    if (!subtitles || subtitles.length < 100) {
      return NextResponse.json(
        { error: "Transcript too short or unavailable" },
        { status: 400 },
      );
    }

    // 4) Groq pipeline (sequential to stay under free-tier rate limits)
    const summary = await summarizeText(subtitles);
    const deepDivePrompts = await generateDeepDivePrompts(subtitles);
    const flashcards = await generateFlashcards(subtitles, 6);

    const stored: StoredAnalysis = {
      videoId,
      videoUrl,
      title: meta.title,
      description: meta.description,
      thumbnail: meta.thumbnail,
      author: meta.author,
      lengthSeconds: meta.lengthSeconds,
      subtitles,
      summary,
      deepDivePrompts,
      flashcards,
      createdAt: new Date().toISOString(),
    };

    await saveStored(stored);

    const { subtitles: _subtitles, ...response } = stored;
    return NextResponse.json({
      success: true,
      fromCache: false,
      ...response,
    });
  } catch (err: any) {
    console.error("[/api/process]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 },
    );
  }
}
